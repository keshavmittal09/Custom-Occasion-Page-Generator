import { NextRequest } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Page } from "@/models/Page";
import { Wish } from "@/models/Wish";
import { verifyViewToken } from "@/lib/auth";
import { successResponse, errorResponse, withErrorHandler, rateLimit, getClientIp } from "@/lib/api";
import { maskProfanity, sanitize } from "@/lib/sanitize";
import { demoPages } from "@/lib/fixtures/demos";
import { isLocked } from "@/lib/pages";

type Ctx = { params: Promise<{ slug: string }> };

const WishSchema = z.object({
  name: z.string().trim().min(1, "Add your name").max(50),
  message: z.string().trim().min(1, "Write a little something").max(280, "Keep it under 280 characters"),
  emoji: z.string().max(8).optional(),
});

// Template-gallery demo pages keep wishes in memory so they stay interactive without touching the DB
const g = globalThis as any;
const demoWishes: Map<string, any[]> = (g.__demoWishes ??= new Map());

async function openPage(req: NextRequest, slug: string) {
  await connectDB();
  const page = (await Page.findOne({ slug, status: "PUBLISHED" }).lean()) as any;
  if (!page || isLocked(page)) return null;
  if (page.settings?.passwordHash && !verifyViewToken(req.headers.get("x-view-token"), slug)) return null;
  return page;
}

const shape = (w: any) => ({ _id: String(w._id), name: w.name, message: w.message, emoji: w.emoji, createdAt: w.createdAt });

// GET /api/v1/public/pages/:slug/wishes
export const GET = withErrorHandler(async (req: NextRequest, ctx: Ctx) => {
  const { slug } = await ctx.params;
  if (slug in demoPages) return successResponse(demoWishes.get(slug) ?? []);
  const page = await openPage(req, slug);
  if (!page) return errorResponse("NOT_FOUND", "Page not found", 404);
  const wishes = await Wish.find({ pageId: page._id, isHidden: false }).sort({ createdAt: -1 }).limit(100).lean();
  return successResponse(wishes.map(shape));
});

// POST /api/v1/public/pages/:slug/wishes — max 3 per visitor per page per hour, profanity masked
export const POST = withErrorHandler(async (req: NextRequest, ctx: Ctx) => {
  const { slug } = await ctx.params;
  const ip = getClientIp(req);
  if (!rateLimit(`${ip}:wish:${slug}`, 3, 60 * 60_000).ok) return errorResponse("RATE_LIMITED", "You've sent 3 wishes this hour. Come back later 💛", 429);

  const body = WishSchema.parse(await req.json());
  const clean = { name: maskProfanity(sanitize(body.name)), message: maskProfanity(sanitize(body.message)), emoji: body.emoji || "❤️" };
  if (!clean.name || !clean.message) return errorResponse("VALIDATION_ERROR", "Wish can't be empty", 400);

  if (slug in demoPages) {
    const wish = { _id: crypto.randomUUID(), ...clean, createdAt: new Date().toISOString() };
    demoWishes.set(slug, [wish, ...(demoWishes.get(slug) ?? [])].slice(0, 50));
    return successResponse(wish, "Wish sent!", 201);
  }

  const page = await openPage(req, slug);
  if (!page) return errorResponse("NOT_FOUND", "Page not found", 404);
  if (page.settings?.wishesWall === false) return errorResponse("DISABLED", "The wishes wall is turned off", 403);

  const wish = await Wish.create({ pageId: page._id, ...clean, ipHash: crypto.createHash("sha256").update(ip).digest("hex") });
  await Page.updateOne({ _id: page._id }, { $inc: { "stats.wishes": 1 } });
  return successResponse(shape(wish), "Wish sent!", 201);
});
