import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { errorResponse, rateLimit, successResponse, withErrorHandler } from "@/lib/api";

// GET /api/v1/gifs?q=birthday — optional GIF search via GIPHY (needs GIPHY_API_KEY).
// The key stays on the server; without it the wizard falls back to "paste a GIF link" + upload.
export const GET = withErrorHandler(async (req: NextRequest) => {
  const user = await requireAuth(req);
  const key = process.env.GIPHY_API_KEY;
  if (!key) return errorResponse("GIFS_DISABLED", "GIF search isn't configured", 404);
  if (!rateLimit(`${user.userId}:gifs`, 60, 60_000).ok) return errorResponse("RATE_LIMITED", "Slow down a little 🙂", 429);

  const q = (req.nextUrl.searchParams.get("q") || "").trim().slice(0, 50);
  const endpoint = q ? "search" : "trending";
  const url = `https://api.giphy.com/v1/gifs/${endpoint}?api_key=${key}&limit=24&rating=pg-13${q ? `&q=${encodeURIComponent(q)}` : ""}`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return errorResponse("GIFS_UNAVAILABLE", "GIF search is unavailable right now", 502);
  const json = await res.json();
  const items = (json.data ?? []).map((g: any) => ({
    id: g.id,
    title: g.title,
    url: g.images?.downsized_medium?.url ?? g.images?.original?.url,
    preview: g.images?.fixed_width_small?.url ?? g.images?.fixed_width?.url,
    w: Number(g.images?.downsized_medium?.width ?? g.images?.original?.width ?? 480),
    h: Number(g.images?.downsized_medium?.height ?? g.images?.original?.height ?? 360),
  }));
  return successResponse(items.filter((i: any) => i.url?.startsWith("https://")));
});
