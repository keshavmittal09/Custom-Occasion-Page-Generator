import { NextRequest } from "next/server";
import QRCode from "qrcode";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { successResponse, withErrorHandler } from "@/lib/api";
import { PublishPageSchema } from "@/lib/schema";
import { appUrl, isLocked, loadManagedPage, toPageData, uniqueSlug } from "@/lib/pages";

type Ctx = { params: Promise<{ id: string }> };

// POST /api/v1/pages/:id/publish — validate fully, assign slug (once), go live, return URL + QR + OG
export const POST = withErrorHandler(async (req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params;
  const user = await requireAuth(req);
  await connectDB();
  const page = await loadManagedPage(id, user);

  // Throws VALIDATION_ERROR with details (e.g. "Add at least 1 photo") if anything required is missing
  PublishPageSchema.parse(toPageData(page));

  if (!page.slug) page.slug = await uniqueSlug(page.recipient?.name || "", page.occasion);
  page.status = isLocked(page) ? "SCHEDULED" : "PUBLISHED";
  page.publishedAt ??= new Date();

  const base = appUrl(req);
  const url = `${base}/w/${page.slug}`;
  page.ogImageUrl = `${base}/api/og/${page.slug}`;
  page.thumbnailUrl = page.media?.images?.[0]?.url;
  await page.save();

  const qrCode = await QRCode.toDataURL(url, { margin: 1, width: 512, color: { dark: "#1e1b3a", light: "#ffffff" } });

  return successResponse(
    { id: String(page._id), slug: page.slug, url, status: page.status, revealAt: page.revealAt, qrCode, ogImage: page.ogImageUrl },
    page.status === "SCHEDULED" ? "Scheduled! It unlocks at the reveal time." : "Page published!"
  );
});
