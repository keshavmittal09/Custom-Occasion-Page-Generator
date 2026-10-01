import { Schema, model, models } from "mongoose";

// One row per counted view (a visitor is counted at most once per 30 minutes per page)
const PageViewSchema = new Schema(
  {
    pageId: { type: Schema.Types.ObjectId, ref: "Page", required: true },
    visitorId: { type: String, required: true },
    day: { type: String, required: true }, // YYYY-MM-DD, for the views-over-time chart
    userAgent: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

PageViewSchema.index({ pageId: 1, visitorId: 1, createdAt: -1 });
PageViewSchema.index({ pageId: 1, day: 1 });

export const PageView = models.PageView || model("PageView", PageViewSchema);
