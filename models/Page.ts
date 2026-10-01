import { Schema, model, models } from "mongoose";
import { PAGE_STATUSES } from "@/lib/schema";

const MediaItemSchema = new Schema(
  {
    id: String,
    type: { type: String, enum: ["image", "video"] },
    url: String,
    publicId: String,
    provider: String,
    w: Number,
    h: Number,
    duration: Number,
    caption: String,
    memeTop: String,
    memeBottom: String,
    order: Number,
  },
  { _id: false }
);

const MemorySchema = new Schema({ title: String, date: String, description: String, mediaId: String }, { _id: false });

const PageSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    slug: { type: String, unique: true, sparse: true },
    status: { type: String, enum: PAGE_STATUSES, default: "DRAFT", index: true },
    occasion: { type: String, default: "BIRTHDAY" },
    customOccasionLabel: String,
    occasionDate: String,
    revealAt: { type: Date, default: null },
    recipient: { name: String, nickname: String, relation: String, age: Number },
    from: String,
    language: { type: String, enum: ["ENGLISH", "HINGLISH", "HINDI"], default: "ENGLISH" },
    messages: [String],
    memories: [MemorySchema],
    media: { images: [MediaItemSchema], videos: [MediaItemSchema] },
    theme: { templateId: { type: String, default: "neon-night" }, accent: String, font: String, music: String, decorations: [String] },
    settings: {
      passwordHash: String,
      wishesWall: { type: Boolean, default: true },
      showViews: { type: Boolean, default: true },
    },
    ogImageUrl: String,
    thumbnailUrl: String,
    publishedAt: Date,
    stats: {
      views: { type: Number, default: 0 },
      uniqueViews: { type: Number, default: 0 },
      wishes: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export const Page = models.Page || model("Page", PageSchema);
