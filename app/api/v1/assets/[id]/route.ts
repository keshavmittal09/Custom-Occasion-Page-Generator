import { NextRequest } from "next/server";
import { ASSET_ID, contentTypeFor, getAsset } from "@/lib/assets";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/v1/assets/:id — serves uploads; supports Range so iPhone Safari can play audio
export async function GET(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  if (!ASSET_ID.test(id)) return new Response("Not found", { status: 404 });

  const data = await getAsset(id);
  if (!data) return new Response("Not found", { status: 404 });

  const total = data.length;
  const headers: Record<string, string> = {
    "Content-Type": contentTypeFor(id),
    "Cache-Control": "public, max-age=31536000, immutable",
    "Accept-Ranges": "bytes",
    "X-Content-Type-Options": "nosniff",
    "Content-Disposition": "inline",
  };

  const range = req.headers.get("range");
  const m = range && /^bytes=(\d*)-(\d*)$/.exec(range.trim());
  if (m && (m[1] || m[2])) {
    let start = m[1] ? parseInt(m[1], 10) : total - parseInt(m[2], 10);
    let end = m[1] && m[2] ? parseInt(m[2], 10) : total - 1;
    start = Math.max(0, start);
    end = Math.min(end, total - 1);
    if (start > end) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${total}` } });
    return new Response(new Uint8Array(data.subarray(start, end + 1)), {
      status: 206,
      headers: { ...headers, "Content-Range": `bytes ${start}-${end}/${total}`, "Content-Length": String(end - start + 1) },
    });
  }

  return new Response(new Uint8Array(data), { status: 200, headers: { ...headers, "Content-Length": String(total) } });
}
