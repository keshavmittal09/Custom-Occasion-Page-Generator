import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Page } from "@/models/Page";
import { requireAuth } from "@/lib/auth";
import { successResponse, errorResponse, withErrorHandler } from "@/lib/api";
import { MediaItemSchema } from "@/lib/schema";
import { z } from "zod";

const MediaRegisterSchema = z.object({
  pageId: z.string(),
  mediaItem: MediaItemSchema,
});

// POST /api/v1/media — register uploaded media to a page
export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await requireAuth(req);
  await connectDB();
  const body = MediaRegisterSchema.parse(await req.json());

  const page = await Page.findOne({ _id: body.pageId, ownerId: user.userId });
  if (!page) return errorResponse("NOT_FOUND", "Page not found", 404);

  if (body.mediaItem.type === "image") {
    const images = page.media?.images || [];
    if (images.length >= 15) return errorResponse("LIMIT_EXCEEDED", "Max 15 images allowed", 400);
    page.media = { ...page.media, images: [...images, body.mediaItem] };
  } else {
    const videos = page.media?.videos || [];
    if (videos.length >= 2) return errorResponse("LIMIT_EXCEEDED", "Max 2 videos allowed", 400);
    page.media = { ...page.media, videos: [...videos, body.mediaItem] };
  }

  await page.save();
  return successResponse(body.mediaItem, "Media registered", 201);
});

// DELETE /api/v1/media/:publicId
export const DELETE = withErrorHandler(async (req: NextRequest) => {
  const user = await requireAuth(req);
  const { pageId, publicId } = await req.json();
  await connectDB();

  const page = await Page.findOne({ _id: pageId, ownerId: user.userId });
  if (!page) return errorResponse("NOT_FOUND", "Page not found", 404);

  page.media.images = (page.media?.images || []).filter((m: any) => m.publicId !== publicId);
  page.media.videos = (page.media?.videos || []).filter((m: any) => m.publicId !== publicId);
  await page.save();

  return successResponse(null, "Media removed");
});
