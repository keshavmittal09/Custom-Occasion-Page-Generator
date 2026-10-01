import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Page } from "@/models/Page";
import { Wish } from "@/models/Wish";
import { requireAdmin } from "@/lib/auth";
import { successResponse, errorResponse, withErrorHandler } from "@/lib/api";

// GET /api/v1/admin/stats
export const GET = withErrorHandler(async (req: NextRequest) => {
  await requireAdmin(req);
  await connectDB();

  const [totalPages, totalUsers, totalWishes, publishedPages] = await Promise.all([
    Page.countDocuments(),
    (await import("@/models/User")).User.countDocuments(),
    Wish.countDocuments(),
    Page.countDocuments({ status: "PUBLISHED" }),
  ]);

  return successResponse({ totalPages, totalUsers, totalWishes, publishedPages });
});
