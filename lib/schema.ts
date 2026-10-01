import { z } from "zod";

// ─── Enums ────────────────────────────────────────────────────────────────────
export const OccasionEnum = z.enum([
  "BIRTHDAY","ANNIVERSARY","WEDDING","FAREWELL","CONGRATS","FRIENDSHIP","CUSTOM",
]);
export type Occasion = z.infer<typeof OccasionEnum>;

export const LanguageEnum = z.enum(["ENGLISH", "HINGLISH", "HINDI"]);
export type Language = z.infer<typeof LanguageEnum>;

export const TemplateIdEnum = z.enum(["neon-night", "pastel-dream", "royal-gold"]);
export type TemplateId = z.infer<typeof TemplateIdEnum>;

// ─── Sub-schemas ──────────────────────────────────────────────────────────────
export const MediaItemSchema = z.object({
  id: z.string(),
  type: z.enum(["image", "video"]),
  url: z.string().url(),
  publicId: z.string(),
  w: z.number().int().positive(),
  h: z.number().int().positive(),
  duration: z.number().optional(),
  caption: z.string().max(120).optional(),
  order: z.number().int().min(0),
});
export type MediaItem = z.infer<typeof MediaItemSchema>;

export const MemorySchema = z.object({
  title: z.string().max(80),
  date: z.string().optional(),
  description: z.string().max(300).optional(),
  mediaId: z.string().optional(),
});
export type Memory = z.infer<typeof MemorySchema>;

export const RecipientSchema = z.object({
  name: z.string().max(40),
  nickname: z.string().max(40).optional(),
  relation: z.string().max(40),
  age: z.number().int().min(0).max(150).optional(),
});
export type Recipient = z.infer<typeof RecipientSchema>;

export const ThemeSchema = z.object({
  templateId: TemplateIdEnum,
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  font: z.string().optional(),
  music: z.string().url().optional(),
  decorations: z.array(z.string()).default([]),
});
export type Theme = z.infer<typeof ThemeSchema>;

export const SettingsSchema = z.object({
  passwordHash: z.string().optional(),
  wishesWall: z.boolean().default(true),
  showViews: z.boolean().default(true),
});
export type Settings = z.infer<typeof SettingsSchema>;

// ─── Draft schema (all optional — saves as user goes) ─────────────────────────
export const DraftPageSchema = z.object({
  occasion: OccasionEnum.optional(),
  customOccasionLabel: z.string().max(60).optional(),
  occasionDate: z.string().optional(),
  revealAt: z.string().nullable().optional(),
  recipient: RecipientSchema.partial().optional(),
  from: z.string().max(80).optional(),
  language: LanguageEnum.optional(),
  messages: z.array(z.string().max(600)).max(5).optional(),
  memories: z.array(MemorySchema).max(8).optional(),
  media: z.object({
    images: z.array(MediaItemSchema).max(15).optional(),
    videos: z.array(MediaItemSchema).max(2).optional(),
  }).optional(),
  theme: ThemeSchema.partial().optional(),
  settings: SettingsSchema.partial().optional(),
});
export type DraftPage = z.infer<typeof DraftPageSchema>;

// ─── Publish schema (minimum required to go live) ─────────────────────────────
export const PublishPageSchema = z.object({
  occasion: OccasionEnum,
  customOccasionLabel: z.string().max(60).optional(),
  occasionDate: z.string().optional(),
  revealAt: z.string().nullable().optional(),
  recipient: RecipientSchema,
  from: z.string().max(80),
  language: LanguageEnum.default("ENGLISH"),
  messages: z.array(z.string().max(600)).min(1).max(5),
  memories: z.array(MemorySchema).max(8).optional(),
  media: z.object({
    images: z.array(MediaItemSchema).min(1).max(15),
    videos: z.array(MediaItemSchema).max(2).optional(),
  }),
  theme: ThemeSchema,
  settings: SettingsSchema.optional(),
});
export type PublishPage = z.infer<typeof PublishPageSchema>;

// ─── Full PageData type ────────────────────────────────────────────────────────
export type PageData = PublishPage & {
  _id?: string;
  slug?: string;
  status?: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "UNPUBLISHED" | "DISABLED";
  ownerId?: string;
  ogImageUrl?: string;
  thumbnailUrl?: string;
  stats?: { views: number; uniqueViews: number; wishes: number };
  createdAt?: string;
  updatedAt?: string;
};
