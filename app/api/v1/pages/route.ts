import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import slugify from "slugify";
import { connectDB } from "@/lib/db";
import { Page } from "@/models/Page";
import { requireAuth } from "@/lib/auth";
import { successResponse, errorResponse, withErrorHandler } from "@/lib/api";
import { DraftPageSchema } from "@/lib/schema";

// POST /api/v1/pages — create draft
export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await requireAuth(req);
  await connectDB();
  const body = DraftPageSchema.parse(await req.json());
  const page = await Page.create({ ownerId: user.userId, ...body });
  return successResponse({ id: page._id }, "Draft created", 201);
});

// GET /api/v1/pages/mine — list my pages
export async function GET(req: NextRequest) {
  const user = await requireAuth(req);
  await connectDB();
  const pages = await Page.find({ ownerId: user.userId }).sort({ updatedAt: -1 }).lean();
  return successResponse(pages);
}
