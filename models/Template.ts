import mongoose, { Schema, model, models } from "mongoose";

const TemplateSchema = new Schema({
  id: { type: String, unique: true, required: true },
  name: String,
  description: String,
  previewImage: String,
  supportedOccasions: [String],
  defaultPalette: [String],
  fonts: [String],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Template = models.Template || model("Template", TemplateSchema);
