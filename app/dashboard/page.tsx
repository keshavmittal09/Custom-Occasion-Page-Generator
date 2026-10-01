"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, animate, useInView } from "framer-motion";
import { Plus, Eye, MessageCircle, Gift, ArrowUpRight, Share2, Trash2, Sparkles } from "lucide-react";
import { getMyPages, removeMyPage, MyPage } from "@/lib/myPages";
import ShareKit from "@/components/ui/ShareKit";
import Navbar from "@/components/ui/Navbar";

const TEMPLATE: Record<string, { name: string; gradient: string; emoji: string; dark: boolean }> = {
  "neon-night": { name: "Neon Night", gradient: "from-[#1b1250] via-[#4a2fb0] to-[#e85fa8]", emoji: "🎁", dark: true },
  "pastel-dream": { name: "Pastel Dream", gradient: "from-[#fde2f0] via-[#e8dcff] to-[#cfe3ff]", emoji: "🎀", dark: false },
  "royal-gold": { name: "Royal Gold", gradient: "from-[#1a140a] via-[#5a4318] to-[#e8c27a]", emoji: "👑", dark: true },
};

type Stats = { views: number; wishes: number; status: string };

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.4, ease: "easeOut", onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{v}</span>;
}

export default function DashboardPage() {
  const [pages, setPages] = useState<MyPage[]>([]);
  const [stats, setStats] = useState<Record<string, Stats>>({});
  const [sharing, setSharing] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const mine = getMyPages();
    setPages(mine);
    setLoaded(true);
    // Pull live view/wish counts without counting a view (?peek=1)
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

  const totals = Object.values(stats).reduce((a, s) => ({ views: a.views + s.views, wishes: a.wishes + s.wishes }), { views: 0, wishes: 0 });

  return (
    <main className="relative min-h-screen bg-cream text-ink">
      <div className="bg-aurora pointer-events-none fixed inset-0" />
      <Navbar />

      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-32 sm:px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted">Your little archive of surprises</p>
            <h1 className="font-display mt-1 text-5xl sm:text-6xl">My pages</h1>
          </div>
          <Link href="/create" className="btn-ink inline-flex items-center gap-2 px-6 py-3.5">
            <Plus size={17} /> New surprise
          </Link>
        </div>

        {pages.length > 0 && (
          <div className="mb-10 grid gap-4 sm:grid-cols-3">
            {[
              [Gift, pages.length, "pages created", "from-[#ffd9c2] to-[#ffc4d6]"],
              [Eye, totals.views, "total views", "from-[#cfe3ff] to-[#d9d2ff]"],
              [MessageCircle, totals.wishes, "wishes received", "from-[#c9f1e3] to-[#cfe3ff]"],
            ].map(([Icon, n, label, tint], i) => {
              const I = Icon as typeof Gift;
              return (
                <motion.div key={label as string} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass relative overflow-hidden rounded-[28px] p-6">
                  <div className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br opacity-70 blur-2xl ${tint}`} />
                  <div className={`relative grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${tint}`}><I size={19} /></div>
                  <div className="font-display relative mt-5 text-5xl"><Counter to={n as number} /></div>
                  <div className="relative text-sm text-muted">{label as string}</div>
                </motion.div>
              );
            })}
          </div>
        )}

        {loaded && pages.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-[36px] px-6 py-20 text-center">
            <motion.div animate={{ y: [0, -10, 0], rotate: [0, -6, 6, 0] }} transition={{ duration: 4, repeat: Infinity }} className="text-7xl">🎈</motion.div>
            <h2 className="font-display mt-6 text-4xl">Nothing here yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-muted">Pages you publish from this device show up here, with views and wishes.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/create" className="btn-ink px-6 py-3.5">Create your first page</Link>
              <Link href="/w/demo" className="btn-ghost inline-flex items-center gap-2 px-6 py-3.5"><Sparkles size={15} /> See a demo</Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {pages.map((p, i) => {
                const s = stats[p.slug];
                const t = TEMPLATE[p.templateId] ?? TEMPLATE["neon-night"];
                return (
                  <motion.article key={p.slug} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -6 }} className="glass group overflow-hidden rounded-[30px]">
                    <a href={`/w/${p.slug}`} target="_blank" rel="noreferrer" className={`relative flex h-40 items-center justify-center bg-gradient-to-br ${t.gradient} ${t.dark ? "text-white" : "text-ink"}`}>
                      <motion.span animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }} className="text-5xl">{t.emoji}</motion.span>
                      <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs backdrop-blur ${s?.status === "Live" ? "bg-white/80 text-ink" : "bg-black/30 text-white"}`}>
                        {s?.status === "Live" && <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 align-middle" />}
                        {s?.status ?? "…"}
                      </span>
                      <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-ink opacity-0 transition group-hover:opacity-100"><ArrowUpRight size={16} /></span>
                    </a>
                    <div className="p-5">
                      <h3 className="font-display truncate text-2xl capitalize">{p.title}</h3>
                      <p className="mt-0.5 text-xs text-muted">{t.name} · {new Date(p.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short" })}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex gap-4 text-sm text-muted">
                          <span className="inline-flex items-center gap-1.5"><Eye size={14} /> {s?.views ?? 0}</span>
                          <span className="inline-flex items-center gap-1.5"><MessageCircle size={14} /> {s?.wishes ?? 0}</span>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => setSharing(sharing === p.slug ? null : p.slug)} aria-label="Share" className="grid h-9 w-9 place-items-center rounded-full bg-ink/5 transition hover:bg-ink hover:text-white"><Share2 size={15} /></button>
                          <button onClick={() => remove(p.slug)} aria-label="Remove" className="grid h-9 w-9 place-items-center rounded-full bg-ink/5 text-muted transition hover:bg-[#ffe4ec] hover:text-[#b4235a]"><Trash2 size={15} /></button>
                        </div>
                      </div>
                      <AnimatePresence>
                        {sharing === p.slug && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="pt-5">
                              <ShareKit url={`${window.location.origin}/w/${p.slug}`} dark={false} />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}
