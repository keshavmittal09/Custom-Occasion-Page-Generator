import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Page } from "@/models/Page";
import { requireAuth } from "@/lib/auth";
import { successResponse, withErrorHandler } from "@/lib/api";
import { DraftPageSchema } from "@/lib/schema";
import { draftToUpdate, toOwnerPage } from "@/lib/pages";

// POST /api/v1/pages — create a draft (partial data allowed)
export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await requireAuth(req);
  await connectDB();
  const { set } = await draftToUpdate(DraftPageSchema.parse(await req.json()));
  const page = new Page({ ownerId: user.userId, status: "DRAFT" });
  page.set(set);
  await page.save();
  return successResponse(toOwnerPage(page), "Draft created", 201);
});
