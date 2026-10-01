import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getPageSummary } from "@/lib/publicPage";
import { catalogById } from "@/templates/catalog";
import type { TemplateId } from "@/lib/schema";

export const runtime = "nodejs";

// GET /api/og/:slug — 1200×630 preview card so WhatsApp/Instagram show the name + first photo
export async function GET(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const s = await getPageSummary(slug);
  const tpl = catalogById[(s?.template ?? "neon-night") as TemplateId] ?? catalogById["neon-night"];
  const photo = s?.photo ? (s.photo.startsWith("/") ? `${req.nextUrl.origin}${s.photo}` : s.photo) : undefined;
  const ink = tpl.dark ? "#ffffff" : "#1e1b3a";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", background: tpl.bg, padding: 64, gap: 56, fontFamily: "sans-serif" }}>
        {photo ? (
          <img src={photo} width={400} height={480} style={{ objectFit: "cover", borderRadius: 32, border: "10px solid white", transform: "rotate(-3deg)", boxShadow: "0 30px 60px rgba(0,0,0,.35)" }} />
        ) : (
          <div style={{ width: 400, height: 480, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 200, borderRadius: 32, background: "rgba(255,255,255,.25)" }}>{s?.locked ? "🔒" : tpl.emoji}</div>
        )}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, color: ink }}>
          <div style={{ fontSize: 34, opacity: 0.75, display: "flex" }}>{s ? (s.locked ? "Something special is coming…" : s.title) : "A surprise for you"}</div>
          <div style={{ fontSize: 110, fontWeight: 800, lineHeight: 1, marginTop: 12, display: "flex" }}>{s ? `${s.firstName}!` : "Wishly"}</div>
          {s?.from && <div style={{ fontSize: 34, marginTop: 28, opacity: 0.8, display: "flex" }}>with love, {s.from}</div>}
          <div style={{ fontSize: 26, marginTop: 40, opacity: 0.7, display: "flex" }}>Tap to open 🎁 · made with Wishly</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, emoji: "twemoji", headers: { "Cache-Control": "public, max-age=600, s-maxage=3600, stale-while-revalidate=86400" } }
  );
}
