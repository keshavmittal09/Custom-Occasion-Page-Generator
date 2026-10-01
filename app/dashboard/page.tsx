"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyPages, removeMyPage, MyPage } from "@/lib/myPages";
import ShareKit from "@/components/ui/ShareKit";

const TEMPLATE_BG: Record<string, string> = {
  "neon-night": "linear-gradient(135deg,#0B0420,#3b0764 60%,#FF4FA3)",
  "pastel-dream": "linear-gradient(135deg,#FFF1F5,#FBCFE8 50%,#C4B5FD)",
  "royal-gold": "linear-gradient(135deg,#0E0E10,#3a2f12 60%,#D4AF37)",
};

type Stats = { views: number; wishes: number; status: string };

export default function DashboardPage() {
  const [pages, setPages] = useState<MyPage[]>([]);
  const [stats, setStats] = useState<Record<string, Stats>>({});
  const [sharing, setSharing] = useState<string | null>(null);

  useEffect(() => {
    const mine = getMyPages();
    setPages(mine);
    // Pull live view/wish counts for each page
    mine.forEach(async (p) => {
      try {
        const res = await fetch(`/api/v1/public/pages/${p.slug}?peek=1`);
        const json = await res.json();
        const s: Stats = json.data?.page
          ? { views: json.data.page.stats?.views ?? 0, wishes: json.data.page.stats?.wishes ?? 0, status: "Live" }
          : { views: 0, wishes: 0, status: json.data?.revealAt ? "Scheduled" : json.data?.passwordRequired ? "Protected" : "Unavailable" };
        setStats((prev) => ({ ...prev, [p.slug]: s }));
      } catch {}
    });
  }, []);

  const remove = (slug: string) => {
    if (!confirm("Remove this page from your dashboard?")) return;
    removeMyPage(slug);
    setPages(getMyPages());
  };

  return (
    <main className="min-h-screen bg-[#0B0420] px-4 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/" className="text-lg font-bold">🎁 Occasion<span className="text-pink-400">Pages</span></Link>
            <h1 className="mt-4 text-3xl font-bold">My pages</h1>
            <p className="text-white/50">Pages you&apos;ve published from this device.</p>
          </div>
          <Link href="/create" className="rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 px-5 py-3 font-semibold shadow-lg shadow-pink-500/30">
            + Create new
          </Link>
        </div>

        {pages.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/15 p-16 text-center">
            <div className="text-5xl">🎈</div>
            <p className="mt-4 text-white/60">No pages yet. Make someone&apos;s day!</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/create" className="rounded-xl bg-white px-5 py-3 font-semibold text-black">Create your first page</Link>
              <Link href="/w/demo" className="rounded-xl border border-white/15 px-5 py-3">See demo</Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((p) => {
              const s = stats[p.slug];
              return (
                <div key={p.slug} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <div className="flex h-28 items-end p-4" style={{ background: TEMPLATE_BG[p.templateId] ?? TEMPLATE_BG["neon-night"] }}>
                    <span className="rounded-full bg-black/50 px-3 py-1 text-xs">{s?.status ?? "…"}</span>
                  </div>
                  <div className="space-y-3 p-4">
                    <h3 className="font-semibold capitalize">{p.title}</h3>
                    <p className="text-xs text-white/50">{new Date(p.createdAt).toLocaleString()}</p>
                    <div className="flex gap-4 text-sm text-white/70">
                      <span>👀 {s?.views ?? 0} views</span>
                      <span>💬 {s?.wishes ?? 0} wishes</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <a href={`/w/${p.slug}`} target="_blank" rel="noreferrer" className="rounded-lg bg-pink-600 px-3 py-1.5 hover:bg-pink-500">Open</a>
                      <button onClick={() => setSharing(sharing === p.slug ? null : p.slug)} className="rounded-lg border border-white/15 px-3 py-1.5 hover:bg-white/10">Share</button>
                      <button onClick={() => remove(p.slug)} className="rounded-lg px-3 py-1.5 text-red-300 hover:bg-red-500/10">Remove</button>
                    </div>
                    {sharing === p.slug && (
                      <div className="pt-2">
                        <ShareKit url={`${window.location.origin}/w/${p.slug}`} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
