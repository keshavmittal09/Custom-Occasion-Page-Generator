import { z } from "zod";

// ─── Enums ────────────────────────────────────────────────────────────────────
export const OccasionEnum = z.enum(["BIRTHDAY", "ANNIVERSARY", "WEDDING", "FAREWELL", "CONGRATS", "FRIENDSHIP", "CUSTOM"]);
export type Occasion = z.infer<typeof OccasionEnum>;

export const LanguageEnum = z.enum(["ENGLISH", "HINGLISH", "HINDI"]);
export type Language = z.infer<typeof LanguageEnum>;

export const TEMPLATE_IDS = [
  "neon-night",
  "pastel-dream",
  "royal-gold",
  "y2k-chrome",
  "brat",
  "scrapbook",
  "film-reel",
  "pixel-quest",
  "group-chat",
  "retro-desktop",
  "coquette",
] as const;
export const TemplateIdEnum = z.enum(TEMPLATE_IDS);
export type TemplateId = z.infer<typeof TemplateIdEnum>;

export const PAGE_STATUSES = ["DRAFT", "SCHEDULED", "PUBLISHED", "UNPUBLISHED", "DISABLED"] as const;
export type PageStatus = (typeof PAGE_STATUSES)[number];

// Media/music may come from Cloudinary/https, our own asset route, or the built-in synth tracks
const isMediaUrl = (u: string) => /^https:\/\//.test(u) || /^\/api\/v1\/assets\/[A-Za-z0-9_-]+\.[a-z0-9]+$/.test(u);
const isMusicUrl = (u: string) => isMediaUrl(u) || /^synth:[a-z0-9-]+$/.test(u);

// ─── Sub-schemas ──────────────────────────────────────────────────────────────
export const MediaItemSchema = z.object({
  id: z.string().max(64),
  type: z.enum(["image", "video"]),
  url: z.string().max(2048).refine(isMediaUrl, "Unsupported media URL"),
  publicId: z.string().max(256).default(""),
  provider: z.enum(["cloudinary", "local", "remote"]).optional(),
  w: z.number().int().positive(),
  h: z.number().int().positive(),
  duration: z.number().max(60, "Videos can be at most 60 seconds").optional(),
  caption: z.string().max(120).optional(),
  memeTop: z.string().max(80).optional(),
  memeBottom: z.string().max(80).optional(),
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
  name: z.string().trim().min(1, "Recipient name is required").max(40),
  nickname: z.string().max(40).optional(),
  relation: z.string().max(40),
  age: z.number().int().min(0).max(150).optional(),
});
export type Recipient = z.infer<typeof RecipientSchema>;

export const ThemeSchema = z.object({
  templateId: TemplateIdEnum,
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  font: z.string().max(80).optional(),
  music: z.string().max(2048).refine(isMusicUrl, "Unsupported music source").optional(),
  decorations: z.array(z.string().max(16)).max(12).default([]),
});
export type Theme = z.infer<typeof ThemeSchema>;

export const SettingsSchema = z.object({
  passwordHash: z.string().optional(),
  wishesWall: z.boolean().default(true),
  showViews: z.boolean().default(true),
});
export type Settings = z.infer<typeof SettingsSchema>;

const MediaSchema = z.object({
  images: z.array(MediaItemSchema).max(15, "Up to 15 photos"),
  videos: z.array(MediaItemSchema).max(2, "Up to 2 videos").optional(),
});

// ─── Draft schema (everything optional — autosaved as the creator goes) ──────
export const DraftPageSchema = z.object({
  occasion: OccasionEnum.optional(),
  customOccasionLabel: z.string().max(60).optional(),
  occasionDate: z.string().optional(),
  revealAt: z.string().nullable().optional(),
  recipient: z
    .object({ name: z.string().max(40), nickname: z.string().max(40), relation: z.string().max(40), age: z.number().int().min(0).max(150) })
    .partial()
    .optional(),
  from: z.string().max(80).optional(),
  language: LanguageEnum.optional(),
  messages: z.array(z.string().max(600)).max(5).optional(),
  memories: z.array(MemorySchema).max(8).optional(),
  media: MediaSchema.partial().optional(),
  theme: ThemeSchema.partial().optional(),
  settings: SettingsSchema.omit({ passwordHash: true }).partial().optional(),
  // Plain password from the wizard: hashed with bcrypt on the server, never stored as-is ("" removes it)
  password: z.string().max(60).optional(),
});
export type DraftPage = z.infer<typeof DraftPageSchema>;

// ─── Publish schema (what must be true before a page goes live) ──────────────
export const PublishPageSchema = z.object({
  occasion: OccasionEnum,
  customOccasionLabel: z.string().max(60).optional(),
  occasionDate: z.string().optional(),
  revealAt: z.string().nullable().optional(),
  recipient: RecipientSchema,
  from: z.string().trim().min(1, "Add who it's from").max(80),
  language: LanguageEnum.default("ENGLISH"),
  messages: z.array(z.string().trim().min(1).max(600)).min(1, "Write at least 1 message").max(5),
  memories: z.array(MemorySchema).max(8).optional(),
  media: z.object({
    images: z.array(MediaItemSchema).min(1, "Add at least 1 photo").max(15, "Up to 15 photos"),
    videos: z.array(MediaItemSchema).max(2, "Up to 2 videos").optional(),
  }),
  theme: ThemeSchema,
  settings: SettingsSchema.optional(),
});
export type PublishPage = z.infer<typeof PublishPageSchema>;

// ─── Full PageData type (what templates render) ──────────────────────────────
export type PageData = PublishPage & {
  _id?: string;
  slug?: string;
  status?: PageStatus;
  ownerId?: string;
  ogImageUrl?: string;
  thumbnailUrl?: string;
  stats?: { views: number; uniqueViews: number; wishes: number };
  createdAt?: string;
  updatedAt?: string;
};
