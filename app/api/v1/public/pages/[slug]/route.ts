import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { Page } from "@/models/Page";
import { Wish } from "@/models/Wish";
import { successResponse, errorResponse, withErrorHandler, rateLimit, getClientIp } from "@/lib/api";
import { sanitize } from "@/lib/sanitize";
import crypto from "crypto";
import { z } from "zod";

type Ctx = { params: Promise<{ slug: string }> };

// GET /api/v1/public/pages/:slug
export const GET = withErrorHandler(async (req: NextRequest, ctx: Ctx) => {
  const { slug } = await ctx.params;
  await connectDB();

  // Handle demo fixture
  if (slug === "demo") {
    const { riyaFixture } = await import("@/lib/fixtures/riya");
    return successResponse({ page: riyaFixture, locked: false });
  }

  const page = await Page.findOne({ slug }).lean() as any;
  if (!page) return errorResponse("NOT_FOUND", "Page not found", 404);
  if (page.status === "DISABLED") return errorResponse("DISABLED", "This page is unavailable", 403);
  if (!["PUBLISHED", "SCHEDULED"].includes(page.status)) return errorResponse("NOT_FOUND", "Page not found", 404);

  // Check revealAt lock
  const now = new Date();
  if (page.revealAt && new Date(page.revealAt) > now) {
    return successResponse({ locked: true, revealAt: page.revealAt });
  }

  // Check password
  const passwordHeader = req.headers.get("x-page-password");
  if (page.settings?.passwordHash) {
    if (!passwordHeader) return successResponse({ locked: true, passwordRequired: true });
    const valid = await bcrypt.compare(passwordHeader, page.settings.passwordHash);
    if (!valid) return errorResponse("WRONG_PASSWORD", "Incorrect password", 401);
  }

  // Increment views
  const ip = getClientIp(req);
  const ipHash = crypto.createHash("sha256").update(ip).digest("hex");
  await Page.findByIdAndUpdate(page._id, { $inc: { "stats.views": 1 } });

  // Sanitize user text before sending
  const safePage = {
    ...page,
    recipient: {
      ...page.recipient,
      name: sanitize(page.recipient?.name || ""),
      nickname: page.recipient?.nickname ? sanitize(page.recipient.nickname) : undefined,
    },
    from: sanitize(page.from || ""),
    messages: (page.messages || []).map(sanitize),
  };

  return successResponse({ page: safePage, locked: false });
});

// GET /api/v1/public/pages/:slug/wishes
export async function fetchWishes() {}
