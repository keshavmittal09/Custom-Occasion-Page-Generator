import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Wish } from "@/models/Wish";
import { PageView } from "@/models/PageView";
import { requireAuth } from "@/lib/auth";
import { successResponse, withErrorHandler } from "@/lib/api";
import { DraftPageSchema } from "@/lib/schema";
import { draftToUpdate, loadManagedPage, toOwnerPage } from "@/lib/pages";
import { destroyPageMedia } from "@/lib/media";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/v1/pages/:id — owner (or admin) loads a page into the editor
export const GET = withErrorHandler(async (req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params;
  const user = await requireAuth(req);
  await connectDB();
  const page = await loadManagedPage(id, user, { allowAdmin: true });
  return successResponse(toOwnerPage(page));
});

// PATCH /api/v1/pages/:id — autosave any step. Slug never changes once published.
export const PATCH = withErrorHandler(async (req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params;
  const user = await requireAuth(req);
  await connectDB();
  const page = await loadManagedPage(id, user);
  const { set, clearPassword } = await draftToUpdate(DraftPageSchema.parse(await req.json()));
  page.set(set);
  if (clearPassword) page.set("settings.passwordHash", undefined);
  await page.save();
  return successResponse(toOwnerPage(page), "Saved");
});

// DELETE /api/v1/pages/:id — owner or admin; also removes media, wishes and view logs
export const DELETE = withErrorHandler(async (req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params;
  const user = await requireAuth(req);
  await connectDB();
  const page = await loadManagedPage(id, user, { allowAdmin: true });
  await destroyPageMedia(page);
  await Promise.all([Wish.deleteMany({ pageId: page._id }), PageView.deleteMany({ pageId: page._id }), page.deleteOne()]);
  return successResponse(null, "Page deleted");
});
