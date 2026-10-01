import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Page } from "@/models/Page";
import { requireAuth } from "@/lib/auth";
import { successResponse, withErrorHandler } from "@/lib/api";
import { loadManagedPage, toOwnerPage } from "@/lib/pages";

type Ctx = { params: Promise<{ id: string }> };

// POST /api/v1/pages/:id/duplicate — clone as a new draft (no slug, fresh stats)
export const POST = withErrorHandler(async (req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params;
  const user = await requireAuth(req);
  await connectDB();
  const src = (await loadManagedPage(id, user)).toObject();

  const { _id, slug, status, stats, createdAt, updatedAt, publishedAt, ogImageUrl, __v, ...rest } = src;
  const copy = await Page.create({
    ...rest,
    ownerId: user.userId,
    status: "DRAFT",
    recipient: { ...rest.recipient },
  });
  return successResponse(toOwnerPage(copy), "Duplicated as a new draft", 201);
});
