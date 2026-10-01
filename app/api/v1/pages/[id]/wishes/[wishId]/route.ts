import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Page } from "@/models/Page";
import { Wish } from "@/models/Wish";
import { requireAuth } from "@/lib/auth";
import { errorResponse, successResponse, withErrorHandler } from "@/lib/api";
import { loadManagedPage } from "@/lib/pages";

type Ctx = { params: Promise<{ id: string; wishId: string }> };

// DELETE /api/v1/pages/:id/wishes/:wishId — page owner or admin removes a wish
export const DELETE = withErrorHandler(async (req: NextRequest, ctx: Ctx) => {
  const { id, wishId } = await ctx.params;
  const user = await requireAuth(req);
  await connectDB();
  const page = await loadManagedPage(id, user, { allowAdmin: true });
  const wish = await Wish.findOneAndDelete({ _id: wishId, pageId: page._id });
  if (!wish) return errorResponse("NOT_FOUND", "Wish not found", 404);
  await Page.updateOne({ _id: page._id, "stats.wishes": { $gt: 0 } }, { $inc: { "stats.wishes": -1 } });
  return successResponse(null, "Wish removed");
});
