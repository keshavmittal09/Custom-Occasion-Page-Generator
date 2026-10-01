import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { getPage, incrementViews } from "@/lib/store";
import { demoPages } from "@/lib/fixtures/demos";
import { successResponse, errorResponse, withErrorHandler } from "@/lib/api";

type Ctx = { params: Promise<{ slug: string }> };

// GET /api/v1/public/pages/:slug
export const GET = withErrorHandler(async (req: NextRequest, ctx: Ctx) => {
  const { slug } = await ctx.params;

  // Demo fixture — works without any database
  if (slug in demoPages) {
    return successResponse({ page: { ...demoPages[slug], slug }, locked: false });
  }

  const page = (await getPage(slug)) as any;
  if (!page) return errorResponse("NOT_FOUND", "Page not found", 404);
  if (page.status === "DISABLED") return errorResponse("DISABLED", "This page is unavailable", 403);

  // Scheduled reveal lock
  if (page.revealAt && new Date(page.revealAt) > new Date()) {
    return successResponse({ locked: true, revealAt: page.revealAt, recipientName: page.recipient?.name });
  }

  // Password lock
  if (page.settings?.passwordHash) {
    const pw = req.headers.get("x-page-password");
    if (!pw) return successResponse({ locked: true, passwordRequired: true });
    const valid = await bcrypt.compare(pw, page.settings.passwordHash);
    if (!valid) return errorResponse("WRONG_PASSWORD", "Incorrect password", 401);
  }

  // ?peek=1 is used by the dashboard to read stats without counting a view
  if (!req.nextUrl.searchParams.has("peek")) await incrementViews(slug);

  // Never leak the password hash or internal ids
  const { settings, _id, __v, ownerId, ...rest } = page;
  const safePage = {
    ...rest,
    settings: { wishesWall: settings?.wishesWall ?? true, showViews: settings?.showViews ?? true },
  };

  return successResponse({ page: safePage, locked: false });
});
