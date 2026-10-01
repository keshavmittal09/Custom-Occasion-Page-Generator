import { nanoid } from "nanoid";
import { connectDB } from "@/lib/db";
import { Asset } from "@/models/Asset";

// Fallback media store (used when Cloudinary keys are not configured): files live in MongoDB,
// so it works the same locally and on serverless hosts. Cloudinary is preferred when available.

export const MAX_ASSET_BYTES = 4 * 1024 * 1024; // stays under Vercel's 4.5 MB request body limit

const EXT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  mp3: "audio/mpeg",
  m4a: "audio/mp4",
  aac: "audio/aac",
  ogg: "audio/ogg",
  wav: "audio/wav",
  weba: "audio/webm",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
};

export const ASSET_TYPES: Record<string, string> = {
  ...Object.fromEntries(Object.entries(EXT_TYPES).map(([ext, type]) => [type, ext])),
  "audio/mp3": "mp3",
  "audio/x-m4a": "m4a",
  "audio/x-wav": "wav",
};

export const ASSET_ID = /^[A-Za-z0-9_-]{12,32}\.(jpg|png|webp|gif|mp3|m4a|aac|ogg|wav|weba|mp4|webm|mov)$/;

export const contentTypeFor = (id: string) => EXT_TYPES[id.split(".").pop() ?? ""] ?? "application/octet-stream";

export async function saveAsset(data: Buffer, contentType: string, ownerId: string): Promise<string> {
  const ext = ASSET_TYPES[contentType];
  if (!ext) throw Object.assign(new Error("Unsupported file type"), { code: "UNSUPPORTED_TYPE", status: 415 });
  const id = `${nanoid(16)}.${ext}`;
  await connectDB();
  await Asset.create({ _id: id, contentType: EXT_TYPES[ext], size: data.length, data, ownerId });
  return id;
}

export async function getAsset(id: string): Promise<Buffer | null> {
  if (!ASSET_ID.test(id)) return null;
  await connectDB();
  const doc = await Asset.findById(id);
  return doc ? Buffer.from(doc.data) : null;
}

export const assetIdFromUrl = (url?: string) => url?.match(/^\/api\/v1\/assets\/([^/?#]+)$/)?.[1];
