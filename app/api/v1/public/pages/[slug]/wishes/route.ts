import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Page } from "@/models/Page";
import { Wish } from "@/models/Wish";
import { successResponse, errorResponse, withErrorHandler, rateLimit, getClientIp } from "@/lib/api";
import { sanitize } from "@/lib/sanitize";
import { z } from "zod";

type Ctx = { params: Promise<{ slug: string }> };

const WishSchema = z.object({
  name: z.string().min(1).max(50),
  message: z.string().min(1).max(280),
  emoji: z.string().max(8).optional(),
});

// GET wishes
export const GET = withErrorHandler(async (req: NextRequest, ctx: Ctx) => {
  const { slug } = await ctx.params;
  await connectDB();
  const page = await Page.findOne({ slug }).lean() as any;
  if (!page) return errorResponse("NOT_FOUND", "Page not found", 404);
  const wishes = await Wish.find({ pageId: page._id, isHidden: false }).sort({ createdAt: -1 }).lean();
  return successResponse(wishes);
});

// POST wish
export const POST = withErrorHandler(async (req: NextRequest, ctx: Ctx) => {
  const { slug } = await ctx.params;
  const ip = getClientIp(req);
  const { ok } = rateLimit(ip + ":wish:" + slug, 5, 60_000);
  if (!ok) return errorResponse("RATE_LIMITED", "Too many wishes. Try again later.", 429);

  await connectDB();
  const page = await Page.findOne({ slug }).lean() as any;
  if (!page) return errorResponse("NOT_FOUND", "Page not found", 404);
  if (!page.settings?.wishesWall) return errorResponse("DISABLED", "Wishes wall is disabled", 403);

  const body = WishSchema.parse(await req.json());
  const wish = await Wish.create({
    pageId: page._id,
    name: sanitize(body.name),
    message: sanitize(body.message),
    emoji: body.emoji || "❤️",
    ipHash: require("crypto").createHash("sha256").update(ip).digest("hex"),
  });

  // Increment wishes count
  await Page.findByIdAndUpdate(page._id, { $inc: { "stats.wishes": 1 } });

  return successResponse(wish, "Wish sent!", 201);
});
