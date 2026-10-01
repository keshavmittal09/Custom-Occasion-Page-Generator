import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Page } from "@/models/Page";
import { User } from "@/models/User";
import { requireAdmin } from "@/lib/auth";
import { escapeRegex, listParams, paginated, successResponse, withErrorHandler } from "@/lib/api";

// GET /api/v1/admin/pages?page=1&limit=20&search=&status=
export const GET = withErrorHandler(async (req: NextRequest) => {
  await requireAdmin(req);
  await connectDB();
  const { page, limit, sort, search, skip } = listParams(req, ["createdAt", "updatedAt", "stats.views"]);
  const status = req.nextUrl.searchParams.get("status");
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (search) filter.$or = [{ "recipient.name": { $regex: escapeRegex(search), $options: "i" } }, { slug: { $regex: escapeRegex(search), $options: "i" } }];

  const [docs, total] = await Promise.all([Page.find(filter).sort(sort).skip(skip).limit(limit).lean(), Page.countDocuments(filter)]);
  const owners = await User.find({ _id: { $in: docs.map((d: any) => d.ownerId) } }, { name: 1, email: 1 }).lean();
  const ownerMap = new Map(owners.map((o: any) => [String(o._id), o]));
  const items = docs.map((d: any) => ({
    id: String(d._id),
    slug: d.slug,
    status: d.status,
    recipient: d.recipient?.name,
    occasion: d.occasion,
    templateId: d.theme?.templateId,
    views: d.stats?.views ?? 0,
    wishes: d.stats?.wishes ?? 0,
    owner: (ownerMap.get(String(d.ownerId)) as any)?.email ?? "—",
    createdAt: d.createdAt,
  }));
  return successResponse(paginated(items, total, page, limit));
});
