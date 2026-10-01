"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, animate, useInView } from "framer-motion";
import { BarChart3, Copy, Eye, Gift, MessageCircle, MoreHorizontal, Pencil, Plus, Power, Search, Share2, Sparkles, Trash2, ExternalLink } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import ShareKit from "@/components/ui/ShareKit";
import { toast } from "@/components/ui/Toast";
import { catalogById } from "@/templates/catalog";
import type { TemplateId } from "@/lib/schema";

type OwnerPage = {
  id: string;
  slug?: string;
  status: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "UNPUBLISHED" | "DISABLED";
  occasion: string;
  customOccasionLabel?: string;
  recipient: { name: string };
  theme: { templateId: TemplateId };
  thumbnailUrl?: string;
  stats: { views: number; uniqueViews: number; wishes: number };
  createdAt: string;
  revealAt?: string | null;
};

const STATUS: Record<OwnerPage["status"], { label: string; cls: string }> = {
  DRAFT: { label: "Draft", cls: "bg-ink/10 text-ink" },
  SCHEDULED: { label: "Scheduled", cls: "bg-[#fff1c9] text-[#8a5a00]" },
  PUBLISHED: { label: "Live", cls: "bg-[#d9f7e8] text-[#0b7a47]" },
  UNPUBLISHED: { label: "Offline", cls: "bg-ink/10 text-ink/70" },
  DISABLED: { label: "Disabled", cls: "bg-[#ffe4ec] text-[#b4235a]" },
};
const FILTERS = [["", "All"], ["PUBLISHED", "Live"], ["SCHEDULED", "Scheduled"], ["DRAFT", "Drafts"], ["UNPUBLISHED", "Offline"]] as const;

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.2, ease: "easeOut", onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{v}</span>;
}

async function api(url: string, method = "POST") {
  const res = await fetch(url, { method });
  const json = await res.json().catch(() => null);
  if (!json?.success) throw new Error(json?.error?.message || "Something went wrong");
  return json;
}

export default function Dashboard({ name }: { name: string }) {
  const [pages, setPages] = useState<OwnerPage[] | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sharing, setSharing] = useState<string | null>(null);
  const [menu, setMenu] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError("");
    try {
      const qs = new URLSearchParams({ limit: "50", sort: "-createdAt", ...(search && { search }), ...(status && { status }) });
      const json = await api(`/api/v1/pages/mine?${qs}`, "GET");
      setPages(json.data.items);
    } catch (e: any) {
      setError(e.message);
      setPages([]);
    }
  }, [search, status]);

  useEffect(() => {
    const id = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(id);
  }, [load, search]);

  const act = async (fn: () => Promise<unknown>, msg: string) => {
    setMenu(null);
    try {
      await fn();
      toast(msg);
      load();
    } catch (e: any) {
      toast(e.message);
    }
  };

  const totals = (pages ?? []).reduce((a, p) => ({ views: a.views + p.stats.views, wishes: a.wishes + p.stats.wishes }), { views: 0, wishes: 0 });

  return (
    <main className="relative min-h-[100svh] bg-cream text-ink">
      <div className="bg-aurora pointer-events-none fixed inset-0" />
      <Navbar />

      <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-32 sm:px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted">Hi {name.split(" ")[0]} 👋</p>
            <h1 className="font-display mt-1 text-5xl sm:text-6xl">My pages</h1>
          </div>
          <Link href="/create" className="btn-ink inline-flex items-center gap-2 px-6 py-3.5">
            <Plus size={17} /> New surprise
          </Link>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {([[Gift, pages?.length ?? 0, "pages", "from-[#ffd9c2] to-[#ffc4d6]"], [Eye, totals.views, "total views", "from-[#cfe3ff] to-[#d9d2ff]"], [MessageCircle, totals.wishes, "wishes received", "from-[#c9f1e3] to-[#cfe3ff]"]] as const).map(([Icon, n, label, tint], i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass relative overflow-hidden rounded-[28px] p-6">
              <div className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br opacity-70 blur-2xl ${tint}`} />
              <div className={`relative grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${tint}`}><Icon size={19} /></div>
              <div className="font-display relative mt-5 text-5xl">{pages ? <Counter to={n} /> : "–"}</div>
              <div className="relative text-sm text-muted">{label}</div>
            </motion.div>
          ))}
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name…" className="w-full rounded-full border border-ink/10 bg-white/80 py-3 pl-10 pr-4 text-base outline-none focus:border-lilac focus:ring-4 focus:ring-lilac/15" />
          </div>
          <div className="flex gap-1 overflow-x-auto">
            {FILTERS.map(([v, label]) => (
              <button key={label} onClick={() => setStatus(v)} className={`relative shrink-0 rounded-full px-4 py-2 text-sm transition ${status === v ? "text-white" : "text-ink/60 hover:text-ink"}`}>
                {status === v && <motion.span layoutId="status-filter" className="absolute inset-0 rounded-full bg-ink" />}
                <span className="relative">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {error && <p className="mb-6 rounded-2xl bg-[#ffe4ec] px-4 py-3 text-sm text-[#b4235a]">{error} <button onClick={load} className="underline">Retry</button></p>}

        {pages === null ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="glass h-72 animate-pulse rounded-[30px]" />
            ))}
          </div>
        ) : pages.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-[36px] px-6 py-20 text-center">
            <motion.div animate={{ y: [0, -10, 0], rotate: [0, -6, 6, 0] }} transition={{ duration: 4, repeat: Infinity }} className="text-7xl">🎈</motion.div>
            <h2 className="font-display mt-6 text-4xl">{search || status ? "Nothing matches" : "No pages yet"}</h2>
            <p className="mx-auto mt-2 max-w-sm text-muted">{search || status ? "Try a different search or filter." : "Make your first surprise — it takes about two minutes."}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/create" className="btn-ink px-6 py-3.5">Create your first page</Link>
              <Link href="/templates" className="btn-ghost inline-flex items-center gap-2 px-6 py-3.5"><Sparkles size={15} /> Browse templates</Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {pages.map((p, i) => {
                const t = catalogById[p.theme.templateId] ?? catalogById["neon-night"];
                const live = p.status === "PUBLISHED" || p.status === "SCHEDULED";
                const occasion = p.occasion === "CUSTOM" ? p.customOccasionLabel || "Custom" : p.occasion.toLowerCase();
                return (
                  <motion.article key={p.id} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.04 }} className="glass group relative overflow-hidden rounded-[30px]">
                    <div className="relative h-44 overflow-hidden" style={{ background: t.bg }}>
                      {p.thumbnailUrl ? <img src={p.thumbnailUrl} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : <span className="grid h-full place-items-center text-5xl">{t.emoji}</span>}
                      <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium backdrop-blur ${STATUS[p.status].cls}`}>
                        {p.status === "PUBLISHED" && <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 align-middle" />}
                        {STATUS[p.status].label}
                      </span>
                      <span className="absolute right-4 top-4 rounded-full bg-white/85 px-2.5 py-1 text-xs capitalize text-ink">{t.emoji} {occasion}</span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-display truncate text-2xl">For {p.recipient?.name || "someone special"}</h3>
                      <p className="mt-0.5 text-xs text-muted">{t.name} · created {new Date(p.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex gap-4 text-sm text-muted">
                          <span className="inline-flex items-center gap-1.5" title="views"><Eye size={14} /> {p.stats.views}</span>
                          <span className="inline-flex items-center gap-1.5" title="wishes"><MessageCircle size={14} /> {p.stats.wishes}</span>
                        </div>
                        <div className="flex gap-1">
                          {live && p.slug && <a href={`/w/${p.slug}`} target="_blank" rel="noreferrer" aria-label="Open" className="grid h-9 w-9 place-items-center rounded-full bg-ink/5 transition hover:bg-ink hover:text-white"><ExternalLink size={15} /></a>}
                          <Link href={`/pages/${p.id}/edit`} aria-label="Edit" className="grid h-9 w-9 place-items-center rounded-full bg-ink/5 transition hover:bg-ink hover:text-white"><Pencil size={15} /></Link>
                          {live && p.slug && <button onClick={() => setSharing(sharing === p.id ? null : p.id)} aria-label="Share" className="grid h-9 w-9 place-items-center rounded-full bg-ink/5 transition hover:bg-ink hover:text-white"><Share2 size={15} /></button>}
                          <button onClick={() => setMenu(menu === p.id ? null : p.id)} aria-label="More actions" className="grid h-9 w-9 place-items-center rounded-full bg-ink/5 transition hover:bg-ink hover:text-white"><MoreHorizontal size={15} /></button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {menu === p.id && (
                          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 grid grid-cols-2 gap-2 text-sm">
                            <Link href={`/pages/${p.id}/insights`} className="inline-flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2 hover:bg-white"><BarChart3 size={14} /> Insights</Link>
                            <button onClick={() => act(() => api(`/api/v1/pages/${p.id}/duplicate`), "Duplicated as a new draft")} className="inline-flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2 hover:bg-white"><Copy size={14} /> Duplicate</button>
                            {live ? (
                              <button onClick={() => act(() => api(`/api/v1/pages/${p.id}/unpublish`), "Page is offline")} className="inline-flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2 hover:bg-white"><Power size={14} /> Unpublish</button>
                            ) : p.status !== "DISABLED" ? (
                              <Link href={`/create/${p.id}/review`} className="inline-flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2 hover:bg-white"><Power size={14} /> Publish</Link>
                            ) : null}
                            <button onClick={() => confirm("Delete this page, its media and its wishes? This can't be undone.") && act(() => api(`/api/v1/pages/${p.id}`, "DELETE"), "Page deleted")} className="inline-flex items-center gap-2 rounded-xl bg-[#ffe4ec] px-3 py-2 text-[#b4235a]"><Trash2 size={14} /> Delete</button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <AnimatePresence>
                        {sharing === p.id && p.slug && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="pt-5"><ShareKit url={`${window.location.origin}/w/${p.slug}`} dark={false} /></div>
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
