import { Schema, model, models } from "mongoose";

// Uploaded photos, GIFs, videos and songs when Cloudinary isn't configured.
// _id is "<random>.<ext>" so the public URL also carries the file type.
const AssetSchema = new Schema(
  {
    _id: { type: String, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    contentType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);

export const Asset = models.Asset || model("Asset", AssetSchema);
