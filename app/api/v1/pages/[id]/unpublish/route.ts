import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { errorResponse, successResponse, withErrorHandler } from "@/lib/api";
import { loadManagedPage, toOwnerPage } from "@/lib/pages";

type Ctx = { params: Promise<{ id: string }> };

// POST /api/v1/pages/:id/unpublish — take a page offline (slug is kept for re-publishing)
export const POST = withErrorHandler(async (req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params;
  const user = await requireAuth(req);
  await connectDB();
  const page = await loadManagedPage(id, user);
  if (page.status === "DISABLED") return errorResponse("FORBIDDEN", "This page was disabled by an admin", 403);
  page.status = "UNPUBLISHED";
  await page.save();
  return successResponse(toOwnerPage(page), "Page is offline");
});
