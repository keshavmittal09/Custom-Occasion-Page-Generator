import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Wish } from "@/models/Wish";
import { Page } from "@/models/Page";
import { requireAdmin } from "@/lib/auth";
import { escapeRegex, listParams, paginated, successResponse, withErrorHandler } from "@/lib/api";

// GET /api/v1/admin/wishes?page=1&limit=20&search= — newest wishes across the platform
export const GET = withErrorHandler(async (req: NextRequest) => {
  await requireAdmin(req);
  await connectDB();
  const { page, limit, sort, search, skip } = listParams(req);
  const filter = search ? { $or: [{ name: { $regex: escapeRegex(search), $options: "i" } }, { message: { $regex: escapeRegex(search), $options: "i" } }] } : {};
  const [docs, total] = await Promise.all([Wish.find(filter).sort(sort).skip(skip).limit(limit).lean(), Wish.countDocuments(filter)]);
  const pages = await Page.find({ _id: { $in: docs.map((w: any) => w.pageId) } }, { slug: 1, "recipient.name": 1 }).lean();
  const pageMap = new Map(pages.map((p: any) => [String(p._id), p]));
  const items = docs.map((w: any) => {
    const p: any = pageMap.get(String(w.pageId));
    return { id: String(w._id), name: w.name, message: w.message, emoji: w.emoji, isHidden: w.isHidden, page: p?.slug ?? "—", recipient: p?.recipient?.name ?? "—", createdAt: w.createdAt };
  });
  return successResponse(paginated(items, total, page, limit));
});
