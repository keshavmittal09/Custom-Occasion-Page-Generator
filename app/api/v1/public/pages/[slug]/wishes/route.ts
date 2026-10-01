import { NextRequest } from "next/server";
import { z } from "zod";
import { addWish, getPage, listWishes } from "@/lib/store";
import { successResponse, errorResponse, withErrorHandler, rateLimit, getClientIp } from "@/lib/api";

type Ctx = { params: Promise<{ slug: string }> };

const WishSchema = z.object({
  name: z.string().trim().min(1).max(50),
  message: z.string().trim().min(1).max(280),
  emoji: z.string().max(8).optional(),
});

async function pageExists(slug: string) {
  if (slug === "demo") return true;
  const page = (await getPage(slug)) as any;
  return !!page && page.settings?.wishesWall !== false;
}

// GET /api/v1/public/pages/:slug/wishes
export const GET = withErrorHandler(async (_req: NextRequest, ctx: Ctx) => {
  const { slug } = await ctx.params;
  if (!(await pageExists(slug))) return errorResponse("NOT_FOUND", "Page not found", 404);
  return successResponse(await listWishes(slug));
});

// POST /api/v1/public/pages/:slug/wishes
export const POST = withErrorHandler(async (req: NextRequest, ctx: Ctx) => {
  const { slug } = await ctx.params;
  const { ok } = rateLimit(getClientIp(req) + ":wish:" + slug, 5, 60_000);
  if (!ok) return errorResponse("RATE_LIMITED", "Too many wishes. Try again later.", 429);
  if (!(await pageExists(slug))) return errorResponse("NOT_FOUND", "Page not found", 404);

  const body = WishSchema.parse(await req.json());
  const wish = await addWish(slug, body);
  return successResponse(wish, "Wish sent!", 201);
});
