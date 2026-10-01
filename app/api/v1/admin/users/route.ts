import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Page } from "@/models/Page";
import { requireAdmin } from "@/lib/auth";
import { escapeRegex, listParams, paginated, successResponse, withErrorHandler } from "@/lib/api";

// GET /api/v1/admin/users?page=1&limit=20&search=
export const GET = withErrorHandler(async (req: NextRequest) => {
  await requireAdmin(req);
  await connectDB();
  const { page, limit, sort, search, skip } = listParams(req);
  const filter = search ? { $or: [{ name: { $regex: escapeRegex(search), $options: "i" } }, { email: { $regex: escapeRegex(search), $options: "i" } }] } : {};
  const [docs, total] = await Promise.all([User.find(filter, { passwordHash: 0 }).sort(sort).skip(skip).limit(limit).lean(), User.countDocuments(filter)]);
  const counts = await Page.aggregate([{ $match: { ownerId: { $in: docs.map((d: any) => d._id) } } }, { $group: { _id: "$ownerId", n: { $sum: 1 } } }]);
  const countMap = new Map(counts.map((c: any) => [String(c._id), c.n]));
  const items = docs.map((u: any) => ({ id: String(u._id), name: u.name, email: u.email, role: u.role, isActive: u.isActive, pages: countMap.get(String(u._id)) ?? 0, createdAt: u.createdAt }));
  return successResponse(paginated(items, total, page, limit));
});
