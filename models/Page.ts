import mongoose, { Schema, model, models } from "mongoose";

const MediaItemSchema = new Schema({
  id: String, type: String, url: String, publicId: String,
  w: Number, h: Number, duration: Number, caption: String, order: Number,
}, { _id: false });

const MemorySchema = new Schema({
  title: String, date: String, description: String, mediaId: String,
}, { _id: false });

const PageSchema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: false, index: true },
  slug: { type: String, unique: true, sparse: true },
  status: { type: String, enum: ["DRAFT","SCHEDULED","PUBLISHED","UNPUBLISHED","DISABLED"], default: "DRAFT" },
  occasion: String,
  customOccasionLabel: String,
  occasionDate: String,
  revealAt: String,
  recipient: {
    name: String, nickname: String, relation: String, age: Number,
  },
  from: String,
  language: { type: String, enum: ["ENGLISH","HINGLISH","HINDI"], default: "ENGLISH" },
  messages: [String],
  memories: [MemorySchema],
  media: {
    images: [MediaItemSchema],
    videos: [MediaItemSchema],
  },
  theme: {
    templateId: String, accent: String, font: String, music: String,
    decorations: [String],
  },
  settings: {
    passwordHash: String,
    wishesWall: { type: Boolean, default: true },
    showViews: { type: Boolean, default: true },
  },
  ogImageUrl: String,
  thumbnailUrl: String,
  stats: {
    views: { type: Number, default: 0 },
    uniqueViews: { type: Number, default: 0 },
    wishes: { type: Number, default: 0 },
  },
}, { timestamps: true });

export const Page = models.Page || model("Page", PageSchema);
