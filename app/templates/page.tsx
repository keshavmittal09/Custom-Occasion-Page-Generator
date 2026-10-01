"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  motion, AnimatePresence, MotionConfig, useMotionValue, useSpring, useTransform,
} from "framer-motion";
import {
  Heart, LayoutDashboard, Sparkles, Settings, LogOut, BarChart3, ArrowRight, ArrowLeft,
  Search, X, Eye, Check, Wand2,
} from "lucide-react";

/* Single file. Needs: framer-motion, lucide-react, Tailwind, next/link. Fonts load from Google Fonts below. */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..600,0..100,0..1;1,9..144,300..600,0..100,0..1&family=Plus+Jakarta+Sans:wght@300..700&display=swap');
.wf-display{font-family:'Fraunces',Georgia,serif;font-variation-settings:'SOFT' 100,'WONK' 0;letter-spacing:-0.03em;font-weight:300}
.wf-body{font-family:'Plus Jakarta Sans',system-ui,sans-serif}
.wf-shine{background-image:linear-gradient(100deg,#8b7cf6,#f59ec0,#ffb48a,#8b7cf6);background-size:220% auto;-webkit-background-clip:text;background-clip:text;color:transparent;animation:wf-shine 8s linear infinite}
@keyframes wf-shine{to{background-position:220% center}}
`;

const glass = "border border-white/80 bg-white/65 backdrop-blur-xl shadow-[0_24px_60px_-28px_rgba(70,50,140,0.35)] ring-1 ring-[#1e1b3a]/5";
const darkBtn = "group relative overflow-hidden rounded-full bg-[#1e1b3a] font-medium text-white shadow-[0_14px_30px_-10px_rgba(30,27,58,0.55)] transition hover:-translate-y-0.5";

type T = { id: string; name: string; note: string; occasions: string[]; gradient: string; palette: [string, string, string]; motion: string; dark?: boolean };

const templates: T[] = [
  { id: "peach-glow", name: "Peach Glow", note: "Warm apricot melting into rose", occasions: ["Birthday", "Custom"], gradient: "from-[#ffe3cf] via-[#ffc7b0] to-[#f9a8c4]", palette: ["#fff3e6", "#ffb48a", "#ffc4d6"], motion: "Floating petals" },
  { id: "pastel-dream", name: "Pastel Dream", note: "Soft, dreamy and elegant", occasions: ["Anniversary", "Wedding"], gradient: "from-[#fde2f0] via-[#e8dcff] to-[#cfe3ff]", palette: ["#fff0f7", "#d9ccff", "#bcd8ff"], motion: "Soft shimmer" },
  { id: "sage-mist", name: "Sage Mist", note: "Quiet greens with a hint of sky", occasions: ["Graduation", "Custom"], gradient: "from-[#e3f6ec] via-[#b9e6d2] to-[#b6d4ff]", palette: ["#e5fff4", "#a8f0dc", "#bfe6ff"], motion: "Drifting mist" },
  { id: "lilac-haze", name: "Lilac Haze", note: "Soft violet with a bright glow", occasions: ["Birthday", "Anniversary"], gradient: "from-[#f1eaff] via-[#cbbdff] to-[#a99bf5]", palette: ["#f6f1ff", "#d9ccff", "#ffd9ec"], motion: "Glow pulse" },
  { id: "sea-glass", name: "Sea Glass", note: "Calm teals and soft light", occasions: ["Graduation", "Birthday"], gradient: "from-[#d8f3f0] via-[#8fd8cf] to-[#7fb8e8]", palette: ["#e9fffb", "#a8efe3", "#bfe0ff"], motion: "Gentle waves" },
  { id: "royal-gold", name: "Royal Gold", note: "Classic and quietly luxurious", occasions: ["Wedding", "Anniversary"], gradient: "from-[#3a2a12] via-[#8a6420] to-[#e8c27a]", palette: ["#f6e3b4", "#c99a3c", "#6b4a14"], motion: "Gold dust", dark: true },
  { id: "neon-night", name: "Neon Night", note: "Bold, vibrant and magical", occasions: ["Birthday"], gradient: "from-[#1b1250] via-[#4a2fb0] to-[#e85fa8]", palette: ["#ffd1ec", "#a78bfa", "#4a2fb0"], motion: "Confetti rain", dark: true },
  { id: "midnight-lanterns", name: "Midnight Lanterns", note: "Deep blue, glowing gold", occasions: ["Anniversary", "Wedding"], gradient: "from-[#101a4d] via-[#2a2f7a] to-[#e0a43a]", palette: ["#ffe29a", "#7d86ff", "#2a2f7a"], motion: "Rising lanterns", dark: true },
  { id: "wild-orchid", name: "Wild Orchid", note: "Plum, violet and a spark of coral", occasions: ["Birthday", "Custom"], gradient: "from-[#2b0f4a] via-[#7b3fbf] to-[#ff8a65]", palette: ["#ffd2c2", "#c79bff", "#7b3fbf"], motion: "Slow bloom", dark: true },
];
const filters = ["All", "Birthday", "Anniversary", "Graduation", "Wedding", "Custom"];
const featured = templates.slice(0, 6);

function MiniPage({ t, big = false }: { t: T; big?: boolean }) {
  return (
    <div className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${t.gradient} ${t.dark ? "text-white" : "text-[#1e1b3a]"}`}>
      <motion.div animate={{ x: [0, 24, 0], scale: [1, 1.2, 1] }} transition={{ duration: 9, repeat: Infinity }} className="absolute -left-8 top-4 h-32 w-32 rounded-full bg-white/35 blur-2xl" />
      <motion.div animate={{ x: [0, -20, 0] }} transition={{ duration: 11, repeat: Infinity }} className="absolute -right-8 bottom-2 h-36 w-36 rounded-full bg-white/25 blur-2xl" />
      {[["left-[12%] top-[14%]", 0], ["right-[14%] top-[22%]", 1], ["left-[22%] bottom-[20%]", 2]].map(([p, i]) => (
        <motion.span key={String(p)} animate={{ y: [0, -10, 0], opacity: [0.3, 1, 0.3] }} transition={{ duration: 3 + Number(i), repeat: Infinity, delay: Number(i) * 0.6 }} className={`absolute ${p}`}>
          <Sparkles size={big ? 22 : 13} className={t.dark ? "text-white/90" : "text-white"} />
        </motion.span>
      ))}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <span className={`opacity-70 ${big ? "text-sm" : "text-[9px]"}`}>a little something for you</span>
        <h4 className={`wf-display italic leading-tight ${big ? "mt-1 text-5xl" : "mt-0.5 text-xl"}`}>Happy birthday</h4>
        <div className={`flex ${big ? "mt-6 gap-3" : "mt-3 gap-1.5"}`}>
          {t.palette.map((c, i) => (
            <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }} style={{ background: c, rotate: `${(i - 1) * 7}deg` }}
              className={`rounded-md border-white/80 shadow-md ${big ? "h-24 w-20 rounded-xl border-4" : "h-10 w-8 border-2"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Dock() {
  const items = [[LayoutDashboard, "Dashboard", "/dashboard", false], [Sparkles, "Templates", "/templates", true], [BarChart3, "Insights", "#", false], [Settings, "Settings", "#", false]] as const;
  return (
    <aside className={`fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 gap-1 rounded-full p-2 lg:bottom-auto lg:left-5 lg:top-1/2 lg:-translate-x-0 lg:-translate-y-1/2 lg:flex-col ${glass}`}>
      {items.map(([Icon, label, href, on]) => (
        <Link key={label} href={href} aria-label={label} className="group relative flex h-11 w-11 items-center justify-center rounded-full">
          {on && <motion.span layoutId="dock" className="absolute inset-0 rounded-full bg-[#1e1b3a]" />}
          <Icon size={18} className={`relative ${on ? "text-white" : "text-[#6b6884] group-hover:text-[#1e1b3a]"}`} />
          <span className="pointer-events-none absolute left-14 hidden whitespace-nowrap rounded-full bg-[#1e1b3a] px-3 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100 lg:block">{label}</span>
        </Link>
      ))}
      <span className="mx-2 my-1 h-px bg-[#1e1b3a]/10 max-lg:hidden" />
      <button aria-label="Log out" className="flex h-11 w-11 items-center justify-center rounded-full text-[#6b6884] hover:text-[#1e1b3a]"><LogOut size={18} /></button>
    </aside>
  );
}

function Card({ t, i, liked, onLike, onOpen }: { t: T; i: number; liked: boolean; onLike: () => void; onOpen: () => void }) {
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 140, damping: 16 });
  const rX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 140, damping: 16 });
  return (
    <motion.article layout initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05, type: "spring", stiffness: 140, damping: 20 }}
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width - 0.5); my.set((e.clientY - r.top) / r.height - 0.5); }}
      onMouseLeave={() => { mx.set(0); my.set(0); }} style={{ rotateX: rX, rotateY: rY, transformPerspective: 900 }} className={`group overflow-hidden rounded-[30px] ${glass}`}>
      <button onClick={onOpen} className="relative block h-64 w-full overflow-hidden text-left">
        <motion.div layoutId={`prev-${t.id}`} className="h-full w-full"><MiniPage t={t} /></motion.div>
        <span className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 transition duration-300 group-hover:opacity-100">
          <span className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-medium backdrop-blur"><Eye size={14} /> Preview</span>
        </span>
      </button>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="wf-display text-2xl">{t.name}</h3>
            <p className="mt-0.5 text-sm text-[#6b6884]">{t.note}</p>
          </div>
          <button onClick={onLike} aria-label="Save template" className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1e1b3a]/5 transition hover:bg-[#1e1b3a]/10">
            <motion.span key={String(liked)} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 12 }}>
              <Heart size={16} fill={liked ? "#f59ec0" : "none"} className={liked ? "text-[#f59ec0]" : "text-[#6b6884]"} />
            </motion.span>
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-1.5">{t.palette.map((c) => <span key={c} style={{ background: c }} className="h-4 w-4 rounded-full ring-2 ring-white" />)}</div>
          <div className="flex gap-1.5">{t.occasions.map((o) => <span key={o} className="rounded-full bg-[#1e1b3a]/5 px-2.5 py-1 text-[11px] text-[#6b6884]">{o}</span>)}</div>
        </div>
      </div>
    </motion.article>
  );
}

export default function TemplatesPage() {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [liked, setLiked] = useState<string[]>([]);
  const [open, setOpen] = useState<T | null>(null);
  const [fi, setFi] = useState(0);

  const nx = useMotionValue(0), ny = useMotionValue(0);
  const rotY = useSpring(useTransform(nx, [-0.5, 0.5], [-12, 12]), { stiffness: 90, damping: 14 });
  const rotX = useSpring(useTransform(ny, [-0.5, 0.5], [10, -10]), { stiffness: 90, damping: 14 });

  useEffect(() => {
    const t = setInterval(() => setFi((c) => (c + 1) % featured.length), 5200);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  const shown = templates.filter((t) => (filter === "All" || t.occasions.includes(filter)) && t.name.toLowerCase().includes(query.toLowerCase()));
  const F = featured[fi];
  const toggle = (id: string) => setLiked((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));

  return (
    <MotionConfig reducedMotion="user">
      <style>{CSS}</style>
      <main className="wf-body relative min-h-screen overflow-hidden bg-[#f8f7fc] text-[#1e1b3a] antialiased">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(55%_45%_at_10%_10%,#ffe1d0_0%,transparent_70%),radial-gradient(45%_45%_at_90%_20%,#dcd3ff_0%,transparent_70%),radial-gradient(50%_45%_at_70%_100%,#cdeee0_0%,transparent_70%)]" />
        <Dock />

        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-32 pt-6 sm:px-8 lg:pl-28 lg:pr-10">
          <header className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="wf-display text-3xl italic">Wishly</span>
              <motion.span animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 1.8, repeat: Infinity }}><Heart size={15} fill="#f59ec0" className="text-[#f59ec0]" /></motion.span>
            </Link>
            <div className={`flex items-center gap-3 rounded-full py-1.5 pl-5 pr-1.5 ${glass}`}>
              <div className="hidden text-right sm:block"><p className="text-sm font-semibold leading-none">Khushi</p><p className="mt-1 text-[11px] leading-none text-[#6b6884]">Creator</p></div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#8b7cf6] to-[#f59ec0] text-sm font-semibold text-white">K</div>
            </div>
          </header>

          {/* SPOTLIGHT */}
          <section onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); nx.set((e.clientX - r.left) / r.width - 0.5); ny.set((e.clientY - r.top) / r.height - 0.5); }}
            className={`relative mt-10 overflow-hidden rounded-[44px] ${glass}`}>
            <AnimatePresence mode="wait">
              <motion.div key={F.id} initial={{ opacity: 0 }} animate={{ opacity: 0.55 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }} className={`absolute inset-0 bg-gradient-to-br blur-2xl ${F.gradient}`} />
            </AnimatePresence>
            <div className="relative grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm backdrop-blur"><Wand2 size={14} className="text-[#8b7cf6]" /> Template library</div>
                <h1 className="wf-display text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">Pick a mood.<br /><span className="wf-shine italic">Make it theirs.</span></h1>
                <div className="mt-8 min-h-[130px]">
                  <AnimatePresence mode="wait">
                    <motion.div key={F.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.45 }}>
                      <p className="text-sm text-[#1e1b3a]/60">Featured · {F.motion}</p>
                      <h2 className="wf-display mt-1 text-4xl">{F.name}</h2>
                      <p className="mt-1 text-[#1e1b3a]/70">{F.note}</p>
                      <div className="mt-4 flex items-center gap-4">
                        <Link href={`/create?template=${F.id}`} className={`${darkBtn} inline-flex items-center gap-2 px-6 py-3 text-sm`}>
                          <span className="pointer-events-none absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-700 group-hover:left-[150%]" />
                          Use this template <ArrowRight size={15} className="transition group-hover:translate-x-1" />
                        </Link>
                        <div className="flex gap-1.5">{F.palette.map((c) => <span key={c} style={{ background: c }} className="h-5 w-5 rounded-full ring-2 ring-white" />)}</div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="mt-8 flex items-center gap-3">
                  <button onClick={() => setFi((fi + featured.length - 1) % featured.length)} aria-label="Previous" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 transition hover:bg-white"><ArrowLeft size={16} /></button>
                  <button onClick={() => setFi((fi + 1) % featured.length)} aria-label="Next" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 transition hover:bg-white"><ArrowRight size={16} /></button>
                  <div className="ml-2 flex gap-1.5">
                    {featured.map((f, i) => (
                      <button key={f.id} onClick={() => setFi(i)} aria-label={f.name} className="relative h-1.5 overflow-hidden rounded-full bg-[#1e1b3a]/15 transition-all" style={{ width: i === fi ? 40 : 10 }}>
                        {i === fi && <motion.span key={fi} initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 5.2, ease: "linear" }} className="absolute inset-y-0 left-0 bg-[#1e1b3a]" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative flex justify-center py-4">
                <motion.div style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1000 }}>
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="relative h-[430px] w-[220px] rounded-[40px] bg-[#1e1b3a] p-[7px] shadow-[0_50px_90px_-20px_rgba(70,50,140,0.55)]">
                    <div className="absolute left-1/2 top-3 z-30 h-5 w-16 -translate-x-1/2 rounded-full bg-[#1e1b3a]" />
                    <div className="h-full overflow-hidden rounded-[34px]">
                      <AnimatePresence mode="wait">
                        <motion.div key={F.id} initial={{ opacity: 0, scale: 1.08, filter: "blur(8px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }} transition={{ duration: 0.55 }} className="h-full w-full"><MiniPage t={F} /></motion.div>
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* FILTERS */}
          <section className="mt-16">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <h2 className="wf-display text-4xl">All templates</h2>
                <p className="mt-1 text-sm text-[#6b6884]">{shown.length} {shown.length === 1 ? "style" : "styles"} to start from</p>
              </div>
              <label className={`flex items-center gap-3 rounded-full px-5 py-3 lg:w-72 ${glass}`}>
                <Search size={16} className="text-[#6b6884]" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name" className="w-full bg-transparent text-sm outline-none placeholder:text-[#6b6884]/70" />
                {query && <button onClick={() => setQuery("")} aria-label="Clear"><X size={14} /></button>}
              </label>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {filters.map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`relative rounded-full px-5 py-2.5 text-sm font-medium transition ${filter === f ? "text-white" : `text-[#1e1b3a]/70 hover:text-[#1e1b3a] ${glass}`}`}>
                  {filter === f && <motion.span layoutId="chip" className="absolute inset-0 rounded-full bg-[#1e1b3a]" transition={{ type: "spring", stiffness: 300, damping: 28 }} />}
                  <span className="relative">{f}</span>
                </button>
              ))}
            </div>

            <motion.div layout className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {shown.map((t, i) => <Card key={t.id} t={t} i={i} liked={liked.includes(t.id)} onLike={() => toggle(t.id)} onOpen={() => setOpen(t)} />)}
              </AnimatePresence>
            </motion.div>
            {shown.length === 0 && (
              <div className={`mt-8 rounded-[30px] p-12 text-center ${glass}`}>
                <p className="wf-display text-3xl">Nothing matches that yet</p>
                <p className="mt-2 text-sm text-[#6b6884]">Try another name or clear the filters.</p>
                <button onClick={() => { setQuery(""); setFilter("All"); }} className={`${darkBtn} mt-6 px-6 py-3 text-sm`}>Show all templates</button>
              </div>
            )}
          </section>

          {/* CTA */}
          <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative mt-16 overflow-hidden rounded-[36px] bg-gradient-to-br from-[#e4dcff] via-[#ffd9e8] to-[#ffe3cf] p-10 ring-1 ring-white/80 sm:p-14">
            <motion.div animate={{ x: [0, 40, 0] }} transition={{ duration: 12, repeat: Infinity }} className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/50 blur-3xl" />
            <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h2 className="wf-display text-4xl sm:text-5xl">Want to start from a blank page?</h2>
                <p className="mt-3 max-w-md text-sm text-[#1e1b3a]/65">Choose your own colors and layout, and add your memories one by one.</p>
              </div>
              <Link href="/create" className={`${darkBtn} inline-flex w-fit items-center gap-2 px-7 py-3.5`}>Start from scratch <ArrowRight size={16} className="transition group-hover:translate-x-1" /></Link>
            </div>
          </motion.section>
        </div>

        {/* PREVIEW MODAL */}
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)} className="fixed inset-0 z-[70] flex items-center justify-center bg-[#1e1b3a]/30 p-4 backdrop-blur-md">
              <motion.div onClick={(e) => e.stopPropagation()} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ type: "spring", stiffness: 220, damping: 26 }}
                className="relative grid max-h-[92vh] w-full max-w-4xl overflow-auto rounded-[36px] bg-[#f8f7fc] shadow-[0_60px_120px_-30px_rgba(30,27,58,0.6)] md:grid-cols-[1.2fr_1fr]">
                <motion.div layoutId={`prev-${open.id}`} className="relative min-h-[320px] md:min-h-[520px]"><MiniPage t={open} big /></motion.div>
                <div className="flex flex-col p-8">
                  <button onClick={() => setOpen(null)} aria-label="Close" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur transition hover:bg-white"><X size={18} /></button>
                  <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="my-auto">
                    <div className="flex flex-wrap gap-2">{open.occasions.map((o) => <span key={o} className="rounded-full bg-[#1e1b3a]/5 px-3 py-1 text-xs text-[#6b6884]">{o}</span>)}</div>
                    <h2 className="wf-display mt-4 text-5xl">{open.name}</h2>
                    <p className="mt-2 text-[#6b6884]">{open.note}</p>
                    <dl className="mt-6 space-y-3 text-sm">
                      <div className="flex justify-between border-b border-[#1e1b3a]/10 pb-3"><dt className="text-[#6b6884]">Motion</dt><dd className="font-medium">{open.motion}</dd></div>
                      <div className="flex items-center justify-between border-b border-[#1e1b3a]/10 pb-3"><dt className="text-[#6b6884]">Palette</dt><dd className="flex gap-1.5">{open.palette.map((c) => <span key={c} style={{ background: c }} className="h-5 w-5 rounded-full ring-2 ring-white" />)}</dd></div>
                    </dl>
                    <div className="mt-8 flex gap-3">
                      <Link href={`/create?template=${open.id}`} className={`${darkBtn} flex flex-1 items-center justify-center gap-2 py-3.5 text-sm`}>
                        <span className="pointer-events-none absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-700 group-hover:left-[150%]" />
                        Use this template <ArrowRight size={15} />
                      </Link>
                      <button onClick={() => toggle(open.id)} aria-label="Save template" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1e1b3a]/5 transition hover:bg-[#1e1b3a]/10">
                        {liked.includes(open.id) ? <Check size={17} className="text-emerald-600" /> : <Heart size={17} className="text-[#6b6884]" />}
                      </button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </MotionConfig>
  );
}