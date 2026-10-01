import fs from "fs";
import os from "os";
import path from "path";
import { nanoid } from "nanoid";
import slugify from "slugify";
import { PageData } from "@/lib/schema";

// Page store: uses MongoDB when MONGO_URI is set, otherwise a local JSON file
// (so the app works out of the box for demos without any env setup).

export type StoredWish = { _id: string; name: string; message: string; emoji: string; createdAt: string };
export type StoredPage = PageData & {
  slug: string;
  status: "PUBLISHED" | "SCHEDULED" | "DISABLED";
  createdAt: string;
  stats: { views: number; uniqueViews: number; wishes: number };
};

type LocalDB = { pages: Record<string, StoredPage>; wishes: Record<string, StoredWish[]> };

const FILE = path.join(os.tmpdir(), "occasion-pages-store.json");
const useMongo = () => !!process.env.MONGO_URI;

function load(): LocalDB {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    const g = globalThis as any;
    return (g.__occasionStore ??= { pages: {}, wishes: {} });
  }
}

function save(db: LocalDB) {
  (globalThis as any).__occasionStore = db;
  try {
    fs.writeFileSync(FILE, JSON.stringify(db));
  } catch {
    // read-only FS (e.g. serverless) — memory copy still works for this instance
  }
}

async function mongo() {
  const { connectDB } = await import("@/lib/db");
  const { Page } = await import("@/models/Page");
  const { Wish } = await import("@/models/Wish");
  await connectDB();
  return { Page, Wish };
}

const plain = <T,>(doc: unknown): T => JSON.parse(JSON.stringify(doc));

export function makeSlug(name?: string) {
  const base = slugify(name || "occasion", { lower: true, strict: true }) || "occasion";
  return `${base}-${nanoid(6)}`.toLowerCase();
}

export async function createPage(data: PageData): Promise<StoredPage> {
  const page: StoredPage = {
    ...data,
    slug: makeSlug(data.recipient?.name),
    status: data.revealAt && new Date(data.revealAt) > new Date() ? "SCHEDULED" : "PUBLISHED",
    createdAt: new Date().toISOString(),
    stats: { views: 0, uniqueViews: 0, wishes: 0 },
  };
  if (useMongo()) {
    const { Page } = await mongo();
    await Page.create(page);
  } else {
    const db = load();
    db.pages[page.slug] = page;
    save(db);
  }
  return page;
}

export async function getPage(slug: string): Promise<StoredPage | null> {
  if (useMongo()) {
    const { Page } = await mongo();
    const doc = await Page.findOne({ slug }).lean();
    return doc ? plain<StoredPage>(doc) : null;
  }
  return load().pages[slug] ?? null;
}

export async function incrementViews(slug: string) {
  if (useMongo()) {
    const { Page } = await mongo();
    await Page.updateOne({ slug }, { $inc: { "stats.views": 1 } });
    return;
  }
  const db = load();
  const page = db.pages[slug];
  if (!page) return;
  page.stats.views += 1;
  save(db);
}

export async function listWishes(slug: string): Promise<StoredWish[]> {
  if (useMongo()) {
    const { Page, Wish } = await mongo();
    const page = (await Page.findOne({ slug }).lean()) as any;
    if (!page) return [];
    const wishes = await Wish.find({ pageId: page._id, isHidden: false }).sort({ createdAt: -1 }).limit(100).lean();
    return plain<any[]>(wishes).map(({ _id, name, message, emoji, createdAt }) => ({ _id, name, message, emoji, createdAt }));
  }
  return load().wishes[slug] ?? [];
}

export async function addWish(slug: string, input: { name: string; message: string; emoji?: string }): Promise<StoredWish> {
  if (useMongo()) {
    const { Page, Wish } = await mongo();
    const page = (await Page.findOne({ slug }).lean()) as any;
    if (!page) throw Object.assign(new Error("Page not found"), { code: "NOT_FOUND", status: 404 });
    const wish = await Wish.create({ pageId: page._id, name: input.name, message: input.message, emoji: input.emoji || "❤️" });
    await Page.updateOne({ slug }, { $inc: { "stats.wishes": 1 } });
    const { _id, name, message, emoji, createdAt } = plain<any>(wish);
    return { _id, name, message, emoji, createdAt };
  }
  const db = load();
  const wish: StoredWish = {
    _id: nanoid(10),
    name: input.name,
    message: input.message,
    emoji: input.emoji || "❤️",
    createdAt: new Date().toISOString(),
  };
  db.wishes[slug] = [wish, ...(db.wishes[slug] ?? [])].slice(0, 100);
  if (db.pages[slug]) db.pages[slug].stats.wishes += 1;
  save(db);
  return wish;
}
