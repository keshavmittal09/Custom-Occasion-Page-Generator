import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Page } from "@/models/Page";
import { requireAuth } from "@/lib/auth";
import { successResponse, errorResponse, withErrorHandler } from "@/lib/api";
import { DraftPageSchema } from "@/lib/schema";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/v1/pages/:id
export const GET = withErrorHandler(async (req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params;
  const user = await requireAuth(req);
  await connectDB();
  const page = await Page.findOne({ _id: id, ownerId: user.userId }).lean();
  if (!page) return errorResponse("NOT_FOUND", "Page not found", 404);
  return successResponse(page);
});

// PATCH /api/v1/pages/:id
export const PATCH = withErrorHandler(async (req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params;
  const user = await requireAuth(req);
  await connectDB();
  const body = DraftPageSchema.parse(await req.json());
  const page = await Page.findOneAndUpdate(
    { _id: id, ownerId: user.userId },
    { $set: body },
    { new: true }
  );
  if (!page) return errorResponse("NOT_FOUND", "Page not found", 404);
  return successResponse(page);
});

// DELETE /api/v1/pages/:id
export const DELETE = withErrorHandler(async (req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params;
  const user = await requireAuth(req);
  await connectDB();
  const page = await Page.findOneAndDelete({ _id: id, ownerId: user.userId });
  if (!page) return errorResponse("NOT_FOUND", "Page not found", 404);
  return successResponse(null, "Page deleted");
});
