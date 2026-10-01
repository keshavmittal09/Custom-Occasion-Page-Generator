import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Wish } from "@/models/Wish";
import { Page } from "@/models/Page";
import { requireAdmin } from "@/lib/auth";
import { errorResponse, successResponse, withErrorHandler } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

// PATCH /api/v1/admin/wishes/:id — { isHidden } hide or unhide a wish
export const PATCH = withErrorHandler(async (req: NextRequest, ctx: Ctx) => {
  await requireAdmin(req);
  const { id } = await ctx.params;
  const { isHidden } = z.object({ isHidden: z.boolean() }).parse(await req.json());
  await connectDB();
  const wish = await Wish.findByIdAndUpdate(id, { isHidden }, { new: true });
  if (!wish) return errorResponse("NOT_FOUND", "Wish not found", 404);
  return successResponse({ id, isHidden }, isHidden ? "Wish hidden" : "Wish visible again");
});

// DELETE /api/v1/admin/wishes/:id — remove an abusive wish
export const DELETE = withErrorHandler(async (req: NextRequest, ctx: Ctx) => {
  await requireAdmin(req);
  const { id } = await ctx.params;
  await connectDB();
  const wish = await Wish.findByIdAndDelete(id);
  if (!wish) return errorResponse("NOT_FOUND", "Wish not found", 404);
  await Page.updateOne({ _id: wish.pageId, "stats.wishes": { $gt: 0 } }, { $inc: { "stats.wishes": -1 } });
  return successResponse(null, "Wish deleted");
});
