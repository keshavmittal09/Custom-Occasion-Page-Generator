import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import { successResponse, errorResponse, withErrorHandler, rateLimit } from "@/lib/api";
import { cloudinaryClient, cloudinaryEnabled } from "@/lib/media";

const SignSchema = z.object({ resource_type: z.enum(["image", "video"]).default("image") });

// POST /api/v1/uploads/sign — signed params for a direct browser → Cloudinary upload.
// The API secret never leaves the server. 501 tells the client to use the built-in store instead.
export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await requireAuth(req);
  if (!cloudinaryEnabled()) return errorResponse("CLOUDINARY_NOT_CONFIGURED", "Cloudinary isn't configured", 501);
  if (!rateLimit(`${user.userId}:sign`, 120, 60_000).ok) return errorResponse("RATE_LIMITED", "Too many uploads", 429);

  const { resource_type } = SignSchema.parse(await req.json().catch(() => ({})));
  const timestamp = Math.round(Date.now() / 1000);
  const folder = `wishly/${user.userId}`;
  const signature = cloudinaryClient().utils.api_sign_request({ timestamp, folder }, process.env.CLOUDINARY_API_SECRET!);

  return successResponse({
    signature,
    timestamp,
    folder,
    resourceType: resource_type,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    uploadUrl: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/${resource_type}/upload`,
  });
});
