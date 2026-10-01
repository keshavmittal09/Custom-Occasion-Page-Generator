import { NextRequest } from "next/server";
import { ASSET_TYPES, MAX_ASSET_BYTES, saveAsset } from "@/lib/assets";
import { requireAuth } from "@/lib/auth";
import { successResponse, errorResponse, withErrorHandler, rateLimit } from "@/lib/api";

// POST /api/v1/assets — creator uploads a file as the raw body (Content-Type = file type).
// Used when Cloudinary isn't configured; files are stored in MongoDB.
export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await requireAuth(req);
  if (!rateLimit(`${user.userId}:upload`, 80, 60_000).ok) return errorResponse("RATE_LIMITED", "Too many uploads. Wait a minute and try again.", 429);

  const type = (req.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
  if (!ASSET_TYPES[type]) return errorResponse("UNSUPPORTED_TYPE", "Only JPG, PNG, WEBP, GIF, MP4/WEBM and common audio files are allowed.", 415);

  const declared = Number(req.headers.get("content-length") || 0);
  if (declared > MAX_ASSET_BYTES) return errorResponse("TOO_LARGE", "File is larger than 4 MB. Configure Cloudinary for bigger uploads.", 413);

  const data = Buffer.from(await req.arrayBuffer());
  if (!data.length) return errorResponse("EMPTY", "Empty file.", 400);
  if (data.length > MAX_ASSET_BYTES) return errorResponse("TOO_LARGE", "File is larger than 4 MB. Configure Cloudinary for bigger uploads.", 413);

  const id = await saveAsset(data, type, user.userId);
  return successResponse({ id, url: `/api/v1/assets/${id}`, publicId: id, provider: "local" }, undefined, 201);
});
