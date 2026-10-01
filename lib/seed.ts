import bcrypt from "bcryptjs";
import { User } from "@/models/User";
import { Page } from "@/models/Page";
import { Wish } from "@/models/Wish";
import { PageView } from "@/models/PageView";
import { Template } from "@/models/Template";
import { CATALOG } from "@/templates/catalog";
import { demoFor } from "@/lib/fixtures/demos";
import type { PageData, TemplateId } from "@/lib/schema";

// Realistic demo data so evaluators can test immediately:
//   admin@demo.com / Admin@123 (ADMIN) · demo@demo.com / Demo@1234 (creator with sample pages)

const DAY = 86_400_000;

type SamplePage = { slug: string; template: TemplateId; status?: "PUBLISHED" | "SCHEDULED" | "DRAFT"; revealInDays?: number; password?: string; views: number };

const SAMPLES: SamplePage[] = [
  { slug: "riya-birthday-demo", template: "neon-night", views: 47 },
  { slug: "mom-dad-anniversary-demo", template: "royal-gold", views: 31 },
  { slug: "kabir-ishita-wedding-demo", template: "film-reel", views: 22 },
  { slug: "rohan-birthday-demo", template: "pixel-quest", views: 18 },
  { slug: "annie-anniversary-demo", template: "coquette", views: 12 },
  { slug: "zoya-birthday-soon", template: "y2k-chrome", status: "SCHEDULED", revealInDays: 3, views: 0 },
  { slug: "aanya-birthday-secret", template: "pastel-dream", password: "surprise", views: 9 },
  { slug: "", template: "brat", status: "DRAFT", views: 0 },
];

const WISHES = [
  { name: "Neha", message: "Happiest birthday!! Stay this crazy forever 🎉", emoji: "🎉" },
  { name: "Kabir", message: "Treat pending hai, yaad rakhna 😂", emoji: "😂" },
  { name: "Sana", message: "Love you to the moon and back ✨", emoji: "❤️" },
];

export async function seedDatabase() {
  const [adminHash, demoHash] = await Promise.all([bcrypt.hash("Admin@123", 12), bcrypt.hash("Demo@1234", 12)]);
  await User.updateOne({ email: "admin@demo.com" }, { $setOnInsert: { name: "Wishly Admin", email: "admin@demo.com", passwordHash: adminHash, role: "ADMIN", isActive: true } }, { upsert: true });
  await User.updateOne({ email: "demo@demo.com" }, { $setOnInsert: { name: "Arjun Mehta", email: "demo@demo.com", passwordHash: demoHash, role: "USER", isActive: true } }, { upsert: true });
  const creator = (await User.findOne({ email: "demo@demo.com" }))!;

  for (const t of CATALOG) {
    await Template.updateOne(
      { id: t.id },
      { $set: { id: t.id, name: t.name, description: t.note, previewImage: `/w/${t.demo}`, supportedOccasions: t.occasions, defaultPalette: t.palette, fonts: [t.font], isActive: true } },
      { upsert: true }
    );
  }

  for (const [i, s] of SAMPLES.entries()) {
    if (s.slug && (await Page.exists({ slug: s.slug }))) continue;
    if (!s.slug && (await Page.exists({ ownerId: creator._id, status: "DRAFT" }))) continue;
    const data: PageData = demoFor(s.template);
    const page = await Page.create({
      ...data,
      ownerId: creator._id,
      slug: s.slug || undefined,
      status: s.status ?? "PUBLISHED",
      revealAt: s.revealInDays ? new Date(Date.now() + s.revealInDays * DAY) : null,
      settings: { wishesWall: true, showViews: true, ...(s.password && { passwordHash: await bcrypt.hash(s.password, 10) }) },
      publishedAt: s.status === "DRAFT" ? undefined : new Date(Date.now() - (10 - i) * DAY),
      stats: { views: s.views, uniqueViews: Math.round(s.views * 0.7), wishes: s.status ? 0 : WISHES.length },
      ogImageUrl: s.slug ? `/api/og/${s.slug}` : undefined,
      thumbnailUrl: data.media.images[0]?.url,
    });

    if (!s.status) {
      await Wish.insertMany(WISHES.map((w, k) => ({ ...w, pageId: page._id, createdAt: new Date(Date.now() - (k + 1) * 3_600_000) })));
      // spread the views over the last 10 days for the insights chart
      await PageView.insertMany(
        Array.from({ length: s.views }, (_, k) => {
          const at = new Date(Date.now() - Math.floor(Math.random() * 10) * DAY - k * 60_000);
          return { pageId: page._id, visitorId: `seed-${k % Math.max(1, Math.round(s.views * 0.7))}`, day: at.toISOString().slice(0, 10), createdAt: at };
        })
      );
    }
  }
}

export async function seedIfEmpty() {
  if ((await User.estimatedDocumentCount()) > 0) return;
  console.log("[seed] Empty database — creating demo accounts and sample pages");
  await seedDatabase();
}
