import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import slugify from "slugify";
import { connectDB } from "@/lib/db";
import { Page } from "@/models/Page";
import { requireAuth } from "@/lib/auth";
import { successResponse, errorResponse, withErrorHandler } from "@/lib/api";
import { PublishPageSchema } from "@/lib/schema";

type Ctx = { params: Promise<{ id: string }> };

export const POST = withErrorHandler(async (req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params;
  const user = await requireAuth(req);
  await connectDB();

  const page = await Page.findOne({ _id: id, ownerId: user.userId });
  if (!page) return errorResponse("NOT_FOUND", "Page not found", 404);

  // Validate publishable
  PublishPageSchema.parse({
    occasion: page.occasion,
    recipient: page.recipient,
    from: page.from,
    language: page.language,
    messages: page.messages,
    media: page.media,
    theme: page.theme,
  });

  // Generate unique slug
  const base = slugify(page.recipient?.name || "occasion", { lower: true, strict: true });
  let slug = `${base}-${nanoid(6)}`;
  const exists = await Page.findOne({ slug });
  if (exists) slug = `${base}-${nanoid(8)}`;

  page.slug = slug;
  page.status = page.revealAt && new Date(page.revealAt) > new Date() ? "SCHEDULED" : "PUBLISHED";
  await page.save();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return successResponse({ slug, url: `${appUrl}/w/${slug}` }, "Page published!");
});
