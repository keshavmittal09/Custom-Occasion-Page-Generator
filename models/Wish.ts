import mongoose, { Schema, model, models } from "mongoose";

const WishSchema = new Schema({
  pageId: { type: Schema.Types.ObjectId, ref: "Page", required: true, index: true },
  name: { type: String, required: true, trim: true },
  message: { type: String, required: true, maxlength: 280 },
  emoji: { type: String, default: "❤️" },
  ipHash: String,
  isHidden: { type: Boolean, default: false },
}, { timestamps: true });

export const Wish = models.Wish || model("Wish", WishSchema);
