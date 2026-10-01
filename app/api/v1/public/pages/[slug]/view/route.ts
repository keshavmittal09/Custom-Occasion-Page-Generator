import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { connectDB } from "@/lib/db";
import { Page } from "@/models/Page";
import { PageView } from "@/models/PageView";
import { getUser } from "@/lib/auth";
import { getClientIp, rateLimit, successResponse, withErrorHandler } from "@/lib/api";
import { isLocked } from "@/lib/pages";

type Ctx = { params: Promise<{ slug: string }> };
const VISITOR_COOKIE = "wv";
const WINDOW_MS = 30 * 60_000;

// POST /api/v1/public/pages/:slug/view — count once per visitor per 30 min; never count the owner
export const POST = withErrorHandler(async (req: NextRequest, ctx: Ctx) => {
  const { slug } = await ctx.params;
  let visitorId = req.cookies.get(VISITOR_COOKIE)?.value;
  const isNewVisitor = !visitorId;
  visitorId ||= nanoid(16);

  const respond = (counted: boolean) => {
    const res = successResponse({ counted });
    if (isNewVisitor) res.cookies.set(VISITOR_COOKIE, visitorId!, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 365, path: "/" });
    return res;
  };

  if (!rateLimit(`${getClientIp(req)}:view`, 120, 60_000).ok) return respond(false);

  await connectDB();
  const page = (await Page.findOne({ slug, status: { $in: ["PUBLISHED", "SCHEDULED"] } }, { ownerId: 1, revealAt: 1 }).lean()) as any;
  if (!page || isLocked(page)) return respond(false);

  const user = await getUser(req);
  if (user && String(page.ownerId) === user.userId) return respond(false);

  const recent = await PageView.exists({ pageId: page._id, visitorId, createdAt: { $gte: new Date(Date.now() - WINDOW_MS) } });
  if (recent) return respond(false);

  const seenBefore = !isNewVisitor && (await PageView.exists({ pageId: page._id, visitorId }));
  await PageView.create({ pageId: page._id, visitorId, day: new Date().toISOString().slice(0, 10), userAgent: req.headers.get("user-agent")?.slice(0, 200) });
  await Page.updateOne({ _id: page._id }, { $inc: { "stats.views": 1, ...(seenBefore ? {} : { "stats.uniqueViews": 1 }) } });
  return respond(true);
});
