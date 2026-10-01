import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Page } from "@/models/Page";
import { requireAdmin } from "@/lib/auth";
import { successResponse, errorResponse, withErrorHandler } from "@/lib/api";
import { isLocked } from "@/lib/pages";

type Ctx = { params: Promise<{ pageId: string }> };
const Body = z.object({ action: z.enum(["disable", "enable"]) });

// PATCH /api/v1/admin/pages/:pageId — { action: "disable" | "enable" }
export const PATCH = withErrorHandler(async (req: NextRequest, ctx: Ctx) => {
  await requireAdmin(req);
  const { pageId } = await ctx.params;
  const { action } = Body.parse(await req.json());
  await connectDB();
  const page = await Page.findById(pageId);
  if (!page) return errorResponse("NOT_FOUND", "Page not found", 404);
  page.status = action === "disable" ? "DISABLED" : page.slug ? (isLocked(page) ? "SCHEDULED" : "PUBLISHED") : "DRAFT";
  await page.save();
  return successResponse({ id: pageId, status: page.status }, action === "disable" ? "Page disabled" : "Page re-enabled");
});
