import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Page } from "@/models/Page";
import { requireAuth } from "@/lib/auth";
import { escapeRegex, listParams, paginated, successResponse, withErrorHandler } from "@/lib/api";
import { toOwnerPage } from "@/lib/pages";

// GET /api/v1/pages/mine?page=1&limit=20&sort=-createdAt&search=riya&status=PUBLISHED
export const GET = withErrorHandler(async (req: NextRequest) => {
  const user = await requireAuth(req);
  await connectDB();
  const { page, limit, sort, search, skip } = listParams(req, ["createdAt", "updatedAt", "stats.views"]);
  const status = req.nextUrl.searchParams.get("status");

  const filter: Record<string, unknown> = { ownerId: user.userId };
  if (status) filter.status = status;
  if (search) filter["recipient.name"] = { $regex: escapeRegex(search), $options: "i" };

  const [docs, total] = await Promise.all([Page.find(filter).sort(sort).skip(skip).limit(limit).lean(), Page.countDocuments(filter)]);
  return successResponse(paginated(docs.map(toOwnerPage), total, page, limit));
});
