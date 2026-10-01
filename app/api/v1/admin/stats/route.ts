import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Page } from "@/models/Page";
import { User } from "@/models/User";
import { Wish } from "@/models/Wish";
import { requireAdmin } from "@/lib/auth";
import { successResponse, withErrorHandler } from "@/lib/api";

// GET /api/v1/admin/stats — platform totals
export const GET = withErrorHandler(async (req: NextRequest) => {
  await requireAdmin(req);
  await connectDB();
  const [totalPages, totalUsers, totalWishes, livePages, disabledPages, views] = await Promise.all([
    Page.countDocuments(),
    User.countDocuments(),
    Wish.countDocuments(),
    Page.countDocuments({ status: { $in: ["PUBLISHED", "SCHEDULED"] } }),
    Page.countDocuments({ status: "DISABLED" }),
    Page.aggregate([{ $group: { _id: null, views: { $sum: "$stats.views" } } }]),
  ]);
  return successResponse({ totalPages, totalUsers, totalWishes, livePages, disabledPages, totalViews: views[0]?.views ?? 0 });
});
