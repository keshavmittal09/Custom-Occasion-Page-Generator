import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Page } from "@/models/Page";
import { requireAdmin } from "@/lib/auth";
import { successResponse, errorResponse, withErrorHandler } from "@/lib/api";

type Ctx = { params: Promise<{ pageId: string }> };

// PATCH /api/v1/admin/pages/:pageId — disable/enable page
export const PATCH = withErrorHandler(async (req: NextRequest, ctx: Ctx) => {
  await requireAdmin(req);
  const { pageId } = await ctx.params;
  const { status } = await req.json();
  await connectDB();

  const page = await Page.findByIdAndUpdate(pageId, { status }, { new: true });
  if (!page) return errorResponse("NOT_FOUND", "Page not found", 404);
  return successResponse(page, "Page updated");
});
