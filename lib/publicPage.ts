import { connectDB } from "@/lib/db";
import { Page } from "@/models/Page";
import { demoPages } from "@/lib/fixtures/demos";
import { isLocked } from "@/lib/pages";
import type { PageData } from "@/lib/schema";
import en from "@/locales/en.json";
import hi from "@/locales/hi.json";
import hinglish from "@/locales/hinglish.json";

const dicts: Record<string, Record<string, string>> = { ENGLISH: en, HINDI: hi, HINGLISH: hinglish };

// Minimal, leak-safe summary of a public page for metadata + OG images
export type PageSummary = { firstName: string; title: string; from: string; photo?: string; locked: boolean; template: string };

export async function getPageSummary(slug: string): Promise<PageSummary | null> {
  let p: (PageData & { revealAt?: unknown; settings?: any }) | null = demoPages[slug] ?? null;
  if (!p) {
    try {
      await connectDB();
      p = (await Page.findOne({ slug, status: { $in: ["PUBLISHED", "SCHEDULED"] } }).lean()) as any;
    } catch {
      return null;
    }
  }
  if (!p) return null;
  const dict = dicts[p.language] ?? en;
  const occasionTitle = p.occasion === "CUSTOM" ? p.customOccasionLabel || dict["hero.custom"] : dict[`hero.${p.occasion.toLowerCase()}`];
  const locked = isLocked(p) || !!p.settings?.passwordHash;
  return {
    firstName: (p.recipient?.name || "").split(" ")[0] || "you",
    title: occasionTitle,
    from: p.from,
    photo: locked ? undefined : p.media?.images?.[0]?.url,
    locked,
    template: p.theme?.templateId ?? "neon-night",
  };
}
