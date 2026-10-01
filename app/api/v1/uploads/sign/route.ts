import { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { requireAuth } from "@/lib/auth";
import { successResponse, errorResponse, withErrorHandler } from "@/lib/api";
import { z } from "zod";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const SignSchema = z.object({
  folder: z.string().optional(),
  public_id: z.string().optional(),
  resource_type: z.enum(["image", "video"]).default("image"),
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await requireAuth(req);
  const body = SignSchema.parse(await req.json());

  const timestamp = Math.round(Date.now() / 1000);
  const folder = `occasions/${user.userId}`;
  const paramsToSign = {
    timestamp,
    folder,
    ...(body.public_id && { public_id: body.public_id }),
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );

  return successResponse({
    signature,
    timestamp,
    folder,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  });
});
