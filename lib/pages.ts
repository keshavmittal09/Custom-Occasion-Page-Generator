import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { customAlphabet } from "nanoid";
import slugify from "slugify";
import { Page } from "@/models/Page";
import { httpError } from "@/lib/api";
import type { JWTPayload } from "@/lib/auth";
import type { DraftPage, PageData } from "@/lib/schema";
import { sanitizeDeep } from "@/lib/sanitize";

const suffix = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 4);

// slugify(name + '-' + occasion) + '-' + 4 random chars, regenerated on collision
export async function uniqueSlug(name: string, occasion: string) {
  const base = slugify(`${name}-${occasion}`, { lower: true, strict: true }).slice(0, 48) || slugify(occasion, { lower: true }) || "wish";
  for (let i = 0; i < 12; i++) {
    const slug = `${base}-${suffix()}`;
    if (!(await Page.exists({ slug }))) return slug;
  }
  throw httpError("CONFLICT", "Couldn't create a unique link, please try again", 409);
}

export function appUrl(req: NextRequest) {
  const env = process.env.NEXT_PUBLIC_APP_URL;
  return env && !/localhost|127\.0\.0\.1/.test(env) ? env.replace(/\/$/, "") : req.nextUrl.origin;
}

// Load a page the current user may manage (owner, or admin when allowed)
export async function loadManagedPage(id: string, user: JWTPayload, { allowAdmin = false } = {}) {
  const page = await Page.findById(id);
  if (!page) throw httpError("NOT_FOUND", "Page not found", 404);
  const isOwner = String(page.ownerId) === user.userId;
  if (!isOwner && !(allowAdmin && user.role === "ADMIN")) throw httpError("FORBIDDEN", "You can't manage this page", 403);
  return page;
}

const iso = (d: unknown) => (d ? new Date(d as string).toISOString() : null);

// Shape stored page → what templates render. Never includes passwordHash, owner or internal ids.
export function toPageData(doc: any): PageData {
  const p = typeof doc.toObject === "function" ? doc.toObject() : doc;
  return {
    slug: p.slug,
    status: p.status,
    occasion: p.occasion,
    customOccasionLabel: p.customOccasionLabel || undefined,
    occasionDate: p.occasionDate || undefined,
    revealAt: iso(p.revealAt),
    recipient: { name: p.recipient?.name ?? "", nickname: p.recipient?.nickname || undefined, relation: p.recipient?.relation ?? "", age: p.recipient?.age ?? undefined },
    from: p.from ?? "",
    language: p.language ?? "ENGLISH",
    messages: p.messages ?? [],
    memories: (p.memories ?? []).map(({ title, date, description, mediaId }: any) => ({ title, date, description, mediaId })),
    media: { images: p.media?.images ?? [], videos: p.media?.videos ?? [] },
    theme: { templateId: p.theme?.templateId ?? "neon-night", accent: p.theme?.accent || undefined, font: p.theme?.font || undefined, music: p.theme?.music || undefined, decorations: p.theme?.decorations ?? [] },
    settings: { wishesWall: p.settings?.wishesWall ?? true, showViews: p.settings?.showViews ?? true },
    ...(p.settings?.showViews !== false && { stats: { views: p.stats?.views ?? 0, uniqueViews: p.stats?.uniqueViews ?? 0, wishes: p.stats?.wishes ?? 0 } }),
    ogImageUrl: p.ogImageUrl,
  };
}

// Owner-side view (dashboard/editor): page data + management fields
export function toOwnerPage(doc: any) {
  const p = typeof doc.toObject === "function" ? doc.toObject() : doc;
  return {
    ...toPageData(p),
    id: String(p._id),
    status: p.status,
    hasPassword: !!p.settings?.passwordHash,
    stats: { views: p.stats?.views ?? 0, uniqueViews: p.stats?.uniqueViews ?? 0, wishes: p.stats?.wishes ?? 0 },
    thumbnailUrl: p.media?.images?.[0]?.url,
    createdAt: iso(p.createdAt),
    updatedAt: iso(p.updatedAt),
    publishedAt: iso(p.publishedAt),
  };
}

export function isLocked(p: { revealAt?: unknown }) {
  return !!p.revealAt && new Date(p.revealAt as string).getTime() > Date.now();
}

// Validated draft body → Mongo update (password → bcrypt hash, flattened settings, sanitised strings)
export async function draftToUpdate(body: DraftPage) {
  const { password, settings, ...rest } = sanitizeDeep(body);
  const set: Record<string, unknown> = { ...rest };
  if (rest.revealAt !== undefined) set.revealAt = rest.revealAt ? new Date(rest.revealAt) : null;
  if (settings?.wishesWall !== undefined) set["settings.wishesWall"] = settings.wishesWall;
  if (settings?.showViews !== undefined) set["settings.showViews"] = settings.showViews;
  let clearPassword = false;
  if (password !== undefined) {
    if (password) set["settings.passwordHash"] = await bcrypt.hash(password, 10);
    else clearPassword = true;
  }
  return { set, clearPassword };
}
