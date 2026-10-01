"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Eye, MessageCircle, Pencil, Trash2, Users } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import { toast } from "@/components/ui/Toast";

type Day = { day: string; views: number; uniques: number };
type Wish = { id: string; name: string; message: string; emoji: string; isHidden: boolean; createdAt: string };
type Data = { page: { id: string; slug?: string; status: string; recipient: { name: string } }; totals: { views: number; uniqueViews: number; wishes: number }; days: Day[]; wishes: Wish[] };

const BAR = "#7c6cf0"; // validated against the light surface
const niceMax = (n: number) => {
  if (n <= 4) return 4;
  const pow = 10 ** Math.floor(Math.log10(n));
  return Math.ceil(n / pow) * pow;
};

// Views per day (single series → the title names it, no legend). Hover/focus a bar for details.
function ViewsChart({ days }: { days: Day[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 640, H = 220, L = 32, B = 26, T = 12;
  const max = niceMax(Math.max(...days.map((d) => d.views), 1));
  const slot = (W - L) / days.length;
  const bw = Math.min(24, slot - 6);
  const y = (v: number) => T + (H - T - B) * (1 - v / max);
  const peak = days.reduce((a, d, i) => (d.views > days[a].views ? i : a), 0);
  const ticks = [0, max / 2, max];

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Views per day, last 14 days">
        {ticks.map((v) => (
          <g key={v}>
            <line x1={L} x2={W} y1={y(v)} y2={y(v)} stroke="#e7e5ef" strokeWidth={1} />
            <text x={L - 8} y={y(v) + 4} textAnchor="end" fontSize={11} fill="#6b6884">{v.toLocaleString()}</text>
          </g>
        ))}
        {days.map((d, i) => {
          const x = L + i * slot + (slot - bw) / 2;
          const h = Math.max(0, y(0) - y(d.views));
          const r = Math.min(4, h);
          return (
            <g key={d.day} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)} tabIndex={0} aria-label={`${d.day}: ${d.views} views, ${d.uniques} unique`}>
              <rect x={L + i * slot} y={T} width={slot} height={H - T - B} fill="transparent" />
              {h > 0 && <path d={`M${x},${y(0)} V${y(d.views) + r} Q${x},${y(d.views)} ${x + r},${y(d.views)} H${x + bw - r} Q${x + bw},${y(d.views)} ${x + bw},${y(d.views) + r} V${y(0)} Z`} fill={BAR} opacity={hover === null || hover === i ? 1 : 0.45} />}
              {i === peak && d.views > 0 && <text x={x + bw / 2} y={y(d.views) - 6} textAnchor="middle" fontSize={11} fontWeight={600} fill="#1e1b3a">{d.views}</text>}
              {(i % 2 === 0 || i === days.length - 1) && <text x={x + bw / 2} y={H - 8} textAnchor="middle" fontSize={10} fill="#6b6884">{new Date(d.day).toLocaleDateString(undefined, { day: "numeric", month: "short" })}</text>}
            </g>
          );
        })}
        <line x1={L} x2={W} y1={y(0)} y2={y(0)} stroke="#cfcbe0" strokeWidth={1} />
      </svg>
      {hover !== null && (
        <div className="pointer-events-none absolute -translate-x-1/2 rounded-xl bg-ink px-3 py-2 text-xs text-white shadow-xl" style={{ left: `${((L + hover * slot + slot / 2) / W) * 100}%`, top: 0 }}>
          <p className="font-semibold">{new Date(days[hover].day).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}</p>
          <p>{days[hover].views} views · {days[hover].uniques} unique</p>
        </div>
      )}
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-muted">View as table</summary>
        <table className="mt-2 w-full text-left text-xs">
          <thead><tr className="text-muted"><th className="py-1">Day</th><th>Views</th><th>Unique</th></tr></thead>
          <tbody>{days.map((d) => <tr key={d.day} className="border-t border-ink/5"><td className="py-1">{d.day}</td><td>{d.views}</td><td>{d.uniques}</td></tr>)}</tbody>
        </table>
      </details>
    </div>
  );
}

export default function Insights({ id }: { id: string }) {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch(`/api/v1/pages/${id}/insights`).catch(() => null);
    const json = await res?.json().catch(() => null);
    if (json?.success) setData(json.data);
    else setError(json?.error?.message || "Couldn't load insights");
  }, [id]);
  useEffect(() => {
    load();
  }, [load]);

  const removeWish = async (wishId: string) => {
    if (!confirm("Delete this wish?")) return;
    const res = await fetch(`/api/v1/pages/${id}/wishes/${wishId}`, { method: "DELETE" });
    const json = await res.json().catch(() => null);
    toast(json?.success ? "Wish deleted" : json?.error?.message || "Couldn't delete");
    load();
  };

  return (
    <main className="relative min-h-[100svh] bg-cream text-ink">
      <div className="bg-aurora pointer-events-none fixed inset-0" />
      <Navbar />
      <div className="relative mx-auto max-w-5xl px-4 pb-24 pt-32 sm:px-6">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"><ArrowLeft size={14} /> My pages</Link>
        {error && <p className="mt-6 rounded-2xl bg-[#ffe4ec] px-4 py-3 text-sm text-[#b4235a]">{error}</p>}
        {!data && !error && <div className="glass mt-6 h-96 animate-pulse rounded-[32px]" />}
        {data && (
          <>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
              <h1 className="font-display text-5xl">Insights · {data.page.recipient?.name}</h1>
              <div className="flex gap-2">
                {data.page.slug && <a href={`/w/${data.page.slug}`} target="_blank" rel="noreferrer" className="btn-ghost inline-flex items-center gap-2 px-4 py-2 text-sm"><ExternalLink size={14} /> Open</a>}
                <Link href={`/pages/${id}/edit`} className="btn-ink inline-flex items-center gap-2 px-4 py-2 text-sm"><Pencil size={14} /> Edit</Link>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {([[Eye, data.totals.views, "total views"], [Users, data.totals.uniqueViews, "unique visitors"], [MessageCircle, data.totals.wishes, "wishes"]] as const).map(([Icon, n, label], i) => (
                <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="glass rounded-[28px] p-6">
                  <Icon size={18} className="text-lilac" />
                  <p className="font-display mt-3 text-5xl">{n}</p>
                  <p className="text-sm text-muted">{label}</p>
                </motion.div>
              ))}
            </div>

            <section className="glass mt-6 rounded-[32px] p-6">
              <h2 className="text-lg font-semibold">Views per day</h2>
              <p className="mb-4 text-sm text-muted">Last 14 days · a visitor counts once per 30 minutes · your own visits aren&apos;t counted</p>
              <ViewsChart days={data.days} />
            </section>

            <section className="glass mt-6 rounded-[32px] p-6">
              <h2 className="text-lg font-semibold">Wishes ({data.wishes.length})</h2>
              {data.wishes.length === 0 ? (
                <p className="mt-4 text-sm text-muted">No wishes yet — share the link and they&apos;ll roll in 💌</p>
              ) : (
                <ul className="mt-4 divide-y divide-ink/5">
                  {data.wishes.map((w) => (
                    <li key={w.id} className="flex items-start gap-3 py-3">
                      <span className="text-2xl">{w.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">{w.name} <span className="font-normal text-muted">· {new Date(w.createdAt).toLocaleString()}</span>{w.isHidden && <span className="ml-2 rounded-full bg-ink/10 px-2 py-0.5 text-[10px]">hidden by admin</span>}</p>
                        <p className="text-sm text-ink/80">{w.message}</p>
                      </div>
                      <button onClick={() => removeWish(w.id)} aria-label="Delete wish" className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-[#ffe4ec] hover:text-[#b4235a]"><Trash2 size={14} /></button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
