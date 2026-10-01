import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Page } from "@/models/Page";
import { verifyViewToken } from "@/lib/auth";
import { successResponse, errorResponse, withErrorHandler } from "@/lib/api";
import { demoPages } from "@/lib/fixtures/demos";
import { isLocked, toPageData } from "@/lib/pages";

type Ctx = { params: Promise<{ slug: string }> };

// GET /api/v1/public/pages/:slug — page data for rendering.
// Scheduled pages return only { locked, revealAt, recipient first name } — content never leaks early.
// Password pages need the short-lived token from POST /unlock (header x-view-token).
export const GET = withErrorHandler(async (req: NextRequest, ctx: Ctx) => {
  const { slug } = await ctx.params;

  if (slug in demoPages) return successResponse({ locked: false, page: { ...demoPages[slug], slug } });

  await connectDB();
  const page = (await Page.findOne({ slug }).lean()) as any;
  if (!page || !["PUBLISHED", "SCHEDULED", "DISABLED"].includes(page.status)) return errorResponse("NOT_FOUND", "Page not found", 404);
  if (page.status === "DISABLED") return errorResponse("DISABLED", "This page is unavailable", 403);

  const firstName = (page.recipient?.name || "").split(" ")[0];
  if (isLocked(page)) return successResponse({ locked: true, revealAt: new Date(page.revealAt).toISOString(), recipientName: firstName });

  if (page.settings?.passwordHash && !verifyViewToken(req.headers.get("x-view-token"), slug)) {
    return successResponse({ locked: true, passwordRequired: true, recipientName: firstName });
  }

  return successResponse({ locked: false, page: toPageData(page) });
});
