import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { PageView } from "@/models/PageView";
import { Wish } from "@/models/Wish";
import { requireAuth } from "@/lib/auth";
import { successResponse, withErrorHandler } from "@/lib/api";
import { loadManagedPage, toOwnerPage } from "@/lib/pages";

type Ctx = { params: Promise<{ id: string }> };

const dayKey = (d: Date) => d.toISOString().slice(0, 10);

// GET /api/v1/pages/:id/insights — views by day (14 days), uniques, wishes
export const GET = withErrorHandler(async (req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params;
  const user = await requireAuth(req);
  await connectDB();
  const page = await loadManagedPage(id, user, { allowAdmin: true });

  const since = new Date(Date.now() - 13 * 86_400_000);
  const [byDay, wishes] = await Promise.all([
    PageView.aggregate([
      { $match: { pageId: page._id, day: { $gte: dayKey(since) } } },
      { $group: { _id: "$day", views: { $sum: 1 }, visitors: { $addToSet: "$visitorId" } } },
    ]),
    Wish.find({ pageId: page._id }).sort({ createdAt: -1 }).limit(200).lean(),
  ]);

  const map = new Map(byDay.map((d: any) => [d._id, { views: d.views, uniques: d.visitors.length }]));
  const days = Array.from({ length: 14 }, (_, i) => {
    const day = dayKey(new Date(since.getTime() + i * 86_400_000));
    return { day, views: map.get(day)?.views ?? 0, uniques: map.get(day)?.uniques ?? 0 };
  });

  return successResponse({
    page: toOwnerPage(page),
    totals: { views: page.stats?.views ?? 0, uniqueViews: page.stats?.uniqueViews ?? 0, wishes: page.stats?.wishes ?? 0 },
    days,
    wishes: wishes.map((w: any) => ({ id: String(w._id), name: w.name, message: w.message, emoji: w.emoji, isHidden: w.isHidden, createdAt: w.createdAt })),
  });
});
