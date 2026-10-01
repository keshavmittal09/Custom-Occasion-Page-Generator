"use client";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Ban, CheckCircle2, EyeOff, Eye, FileText, MessageCircle, Search, Trash2, Users, Globe } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import { toast } from "@/components/ui/Toast";

type Tab = "pages" | "users" | "wishes";
type Stats = { totalPages: number; totalUsers: number; totalWishes: number; livePages: number; disabledPages: number; totalViews: number };
type List<T> = { items: T[]; page: number; totalPages: number; total: number };

async function call(url: string, method = "GET", body?: unknown) {
  const res = await fetch(url, { method, headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined });
  const json = await res.json().catch(() => null);
  if (!json?.success) throw new Error(json?.error?.message || "Request failed");
  return json;
}

const chip = (status: string) =>
  ({ PUBLISHED: "bg-[#d9f7e8] text-[#0b7a47]", SCHEDULED: "bg-[#fff1c9] text-[#8a5a00]", DISABLED: "bg-[#ffe4ec] text-[#b4235a]" })[status] ?? "bg-ink/10 text-ink/70";

// Admin: platform stats, pages (disable/enable), users (activate/deactivate), wishes moderation
export default function Admin() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [tab, setTab] = useState<Tab>("pages");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [list, setList] = useState<List<any> | null>(null);

  const loadStats = useCallback(() => call("/api/v1/admin/stats").then((j) => setStats(j.data)).catch((e) => toast(e.message)), []);
  const loadList = useCallback(() => {
    setList(null);
    const qs = new URLSearchParams({ page: String(page), limit: "15", ...(search && { search }) });
    call(`/api/v1/admin/${tab}?${qs}`).then((j) => setList(j.data)).catch((e) => toast(e.message));
  }, [tab, page, search]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);
  useEffect(() => {
    const id = setTimeout(loadList, search ? 300 : 0);
    return () => clearTimeout(id);
  }, [loadList, search]);

  const run = async (fn: () => Promise<any>) => {
    try {
      const j = await fn();
      toast(j.message || "Done");
      loadList();
      loadStats();
    } catch (e: any) {
      toast(e.message);
    }
  };

  const cards = stats
    ? ([[FileText, stats.totalPages, "pages"], [Globe, stats.livePages, "live"], [Ban, stats.disabledPages, "disabled"], [Users, stats.totalUsers, "users"], [MessageCircle, stats.totalWishes, "wishes"], [Eye, stats.totalViews, "views"]] as const)
    : [];

  return (
    <main className="relative min-h-[100svh] bg-cream text-ink">
      <div className="bg-aurora pointer-events-none fixed inset-0" />
      <Navbar />
      <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-32 sm:px-6">
        <p className="text-sm text-muted">Platform admin</p>
        <h1 className="font-display mt-1 text-5xl">Moderation</h1>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {stats ? cards.map(([Icon, n, label], i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass rounded-3xl p-4">
              <Icon size={16} className="text-lilac" />
              <p className="font-display mt-2 text-3xl">{n.toLocaleString()}</p>
              <p className="text-xs text-muted">{label}</p>
            </motion.div>
          )) : Array.from({ length: 6 }, (_, i) => <div key={i} className="glass h-28 animate-pulse rounded-3xl" />)}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <div className="flex gap-1 rounded-full bg-ink/5 p-1">
            {(["pages", "users", "wishes"] as Tab[]).map((t) => (
              <button key={t} onClick={() => { setTab(t); setPage(1); setSearch(""); }} className={`rounded-full px-4 py-1.5 text-sm capitalize transition ${tab === t ? "bg-white shadow" : "text-ink/60"}`}>{t}</button>
            ))}
          </div>
          <div className="relative min-w-[200px] flex-1">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder={`Search ${tab}…`} className="w-full rounded-full border border-ink/10 bg-white/80 py-2.5 pl-10 pr-4 text-base outline-none focus:border-lilac" />
          </div>
        </div>

        <div className="glass mt-4 overflow-x-auto rounded-[28px]">
          {!list ? (
            <div className="h-64 animate-pulse" />
          ) : list.items.length === 0 ? (
            <p className="p-10 text-center text-muted">Nothing here.</p>
          ) : tab === "pages" ? (
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted"><tr><th className="p-4">Page</th><th>Owner</th><th>Status</th><th>Views</th><th>Wishes</th><th className="pr-4 text-right">Actions</th></tr></thead>
              <tbody>
                {list.items.map((p: any) => (
                  <tr key={p.id} className="border-t border-ink/5">
                    <td className="p-4"><p className="font-medium">{p.recipient || "—"}</p><p className="text-xs text-muted">{p.slug ? `/w/${p.slug}` : "draft"} · {p.templateId}</p></td>
                    <td className="text-xs text-muted">{p.owner}</td>
                    <td><span className={`rounded-full px-2.5 py-1 text-xs ${chip(p.status)}`}>{p.status.toLowerCase()}</span></td>
                    <td>{p.views}</td>
                    <td>{p.wishes}</td>
                    <td className="pr-4 text-right">
                      {p.slug && <a href={`/w/${p.slug}`} target="_blank" rel="noreferrer" className="mr-2 text-xs underline">open</a>}
                      {p.status === "DISABLED" ? (
                        <button onClick={() => run(() => call(`/api/v1/admin/pages/${p.id}`, "PATCH", { action: "enable" }))} className="inline-flex items-center gap-1 rounded-full bg-[#d9f7e8] px-3 py-1.5 text-xs text-[#0b7a47]"><CheckCircle2 size={13} /> Enable</button>
                      ) : (
                        <button onClick={() => confirm("Disable this page? Visitors will see 'unavailable'.") && run(() => call(`/api/v1/admin/pages/${p.id}`, "PATCH", { action: "disable" }))} className="inline-flex items-center gap-1 rounded-full bg-[#ffe4ec] px-3 py-1.5 text-xs text-[#b4235a]"><Ban size={13} /> Disable</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : tab === "users" ? (
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted"><tr><th className="p-4">User</th><th>Role</th><th>Pages</th><th>Joined</th><th className="pr-4 text-right">Status</th></tr></thead>
              <tbody>
                {list.items.map((u: any) => (
                  <tr key={u.id} className="border-t border-ink/5">
                    <td className="p-4"><p className="font-medium">{u.name}</p><p className="text-xs text-muted">{u.email}</p></td>
                    <td className="text-xs">{u.role}</td>
                    <td>{u.pages}</td>
                    <td className="text-xs text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="pr-4 text-right">
                      <button onClick={() => run(() => call(`/api/v1/admin/users/${u.id}`, "PATCH", { isActive: !u.isActive }))} className={`rounded-full px-3 py-1.5 text-xs ${u.isActive ? "bg-[#d9f7e8] text-[#0b7a47]" : "bg-[#ffe4ec] text-[#b4235a]"}`}>
                        {u.isActive ? "Active · deactivate" : "Inactive · activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <ul className="divide-y divide-ink/5">
              {list.items.map((w: any) => (
                <li key={w.id} className="flex items-start gap-3 p-4">
                  <span className="text-2xl">{w.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm"><span className="font-semibold">{w.name}</span> <span className="text-muted">on /w/{w.page} · {new Date(w.createdAt).toLocaleString()}</span>{w.isHidden && <span className="ml-2 rounded-full bg-ink/10 px-2 py-0.5 text-[10px]">hidden</span>}</p>
                    <p className="text-sm text-ink/80">{w.message}</p>
                  </div>
                  <button onClick={() => run(() => call(`/api/v1/admin/wishes/${w.id}`, "PATCH", { isHidden: !w.isHidden }))} aria-label={w.isHidden ? "Unhide" : "Hide"} className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-white">{w.isHidden ? <Eye size={14} /> : <EyeOff size={14} />}</button>
                  <button onClick={() => confirm("Delete this wish?") && run(() => call(`/api/v1/admin/wishes/${w.id}`, "DELETE"))} aria-label="Delete" className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-[#ffe4ec] hover:text-[#b4235a]"><Trash2 size={14} /></button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {list && list.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-3 text-sm">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="btn-ghost px-4 py-2 disabled:opacity-40">Prev</button>
            <span className="text-muted">{list.page} / {list.totalPages}</span>
            <button disabled={page >= list.totalPages} onClick={() => setPage(page + 1)} className="btn-ghost px-4 py-2 disabled:opacity-40">Next</button>
          </div>
        )}
      </div>
    </main>
  );
}
