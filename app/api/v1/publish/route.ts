import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { MediaItemSchema, PublishPageSchema } from "@/lib/schema";
import { createPage } from "@/lib/store";
import { successResponse, errorResponse, withErrorHandler, rateLimit, getClientIp } from "@/lib/api";

// Anonymous one-shot publish used by the /create wizard (no login needed for MVP)
const QuickPublishSchema = PublishPageSchema.extend({
  media: z
    .object({
      images: z.array(MediaItemSchema).max(15).default([]),
      videos: z.array(MediaItemSchema).max(2).optional(),
    })
    .default({ images: [] }),
  password: z.string().max(60).optional(),
});

// POST /api/v1/publish
export const POST = withErrorHandler(async (req: NextRequest) => {
  const { ok } = rateLimit(getClientIp(req) + ":publish", 20, 60_000);
  if (!ok) return errorResponse("RATE_LIMITED", "Too many requests. Try again in a minute.", 429);

  const { password, ...data } = QuickPublishSchema.parse(await req.json());
  const settings = {
    wishesWall: data.settings?.wishesWall ?? true,
    showViews: data.settings?.showViews ?? true,
    ...(password ? { passwordHash: await bcrypt.hash(password, 10) } : {}),
  };

  const page = await createPage({ ...data, settings });
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
  return successResponse({ slug: page.slug, url: `${appUrl}/w/${page.slug}` }, "Page published!", 201);
});
