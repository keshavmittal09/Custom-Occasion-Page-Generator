import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Page } from "@/models/Page";
import { signViewToken } from "@/lib/auth";
import { errorResponse, getClientIp, rateLimit, successResponse, withErrorHandler } from "@/lib/api";

type Ctx = { params: Promise<{ slug: string }> };

const UnlockSchema = z.object({ password: z.string().min(1, "Enter the password").max(60) });

// POST /api/v1/public/pages/:slug/unlock — { password } → short-lived view token
export const POST = withErrorHandler(async (req: NextRequest, ctx: Ctx) => {
  const { slug } = await ctx.params;
  const { ok } = rateLimit(`${getClientIp(req)}:unlock:${slug}`, 8, 15 * 60_000);
  if (!ok) return errorResponse("RATE_LIMITED", "Too many attempts. Try again in 15 minutes.", 429);

  const { password } = UnlockSchema.parse(await req.json());
  await connectDB();
  const page = (await Page.findOne({ slug, status: { $in: ["PUBLISHED", "SCHEDULED"] } }).lean()) as any;
  if (!page) return errorResponse("NOT_FOUND", "Page not found", 404);
  if (!page.settings?.passwordHash) return successResponse({ token: signViewToken(slug) });

  const valid = await bcrypt.compare(password, page.settings.passwordHash);
  if (!valid) return errorResponse("WRONG_PASSWORD", "That's not it. Try again?", 401);
  return successResponse({ token: signViewToken(slug) });
});
