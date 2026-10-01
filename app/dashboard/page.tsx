"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion, AnimatePresence, MotionConfig, useMotionValue, useSpring, useTransform, useInView, animate,
} from "framer-motion";
import {
  Plus, Heart, LayoutDashboard, Sparkles, Settings, LogOut, Eye, Pencil, Share2, BarChart3,
  Clock3, Image as ImageIcon, ArrowRight, Check, ArrowUpRight,
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
const dark = "group relative overflow-hidden rounded-full bg-[#1e1b3a] font-medium text-white shadow-[0_14px_30px_-10px_rgba(30,27,58,0.55)] transition hover:-translate-y-0.5";

const pages = [
  { id: 1, title: "Happy Birthday, Ananya!", recipient: "For Ananya", occasion: "Birthday", template: "Pastel Dream", date: "2 days ago", views: 124, status: "Published", gradient: "from-[#ffe3cf] via-[#ffd1d9] to-[#ffc4d6]", emoji: "🎂" },
  { id: 2, title: "Our 2 Years Together", recipient: "For Someone Special", occasion: "Anniversary", template: "Neon Night", date: "5 days ago", views: 87, status: "Published", gradient: "from-[#e3d9ff] via-[#d3c8ff] to-[#cfe3ff]", emoji: "💜" },
  { id: 3, title: "A Little Surprise", recipient: "For Mom", occasion: "Custom", template: "Royal Gold", date: "1 week ago", views: 42, status: "Draft", gradient: "from-[#fff0c9] via-[#ffe3cf] to-[#ffd9c2]", emoji: "✨" },
];
const totalViews = pages.reduce((a, p) => a + p.views, 0);
const week = [12, 18, 15, 28, 22, 35, 30];
const days = ["M", "T", "W", "T", "F", "S", "S"];
const activity = [
  { t: "Someone opened Happy Birthday, Ananya", w: "12 min ago", c: "bg-[#f59ec0]" },
  { t: "Our 2 Years Together was viewed 8 times", w: "Today", c: "bg-[#8b7cf6]" },
  { t: "You saved a draft for Mom", w: "Yesterday", c: "bg-[#ffb48a]" },
];

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.8, ease: "easeOut", onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{v}</span>;
}

function Sparkline() {
  const w = 460, h = 150, max = 40;
  const pts = week.map((v, i) => [(i / (week.length - 1)) * w, h - (v / max) * (h - 20) - 10]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h + 22}`} className="w-full">
      <defs>
        <linearGradient id="wf-area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#8b7cf6" stopOpacity="0.35" /><stop offset="100%" stopColor="#8b7cf6" stopOpacity="0" /></linearGradient>
        <linearGradient id="wf-line" x1="0" x2="1"><stop offset="0%" stopColor="#8b7cf6" /><stop offset="100%" stopColor="#f59ec0" /></linearGradient>
      </defs>
      <motion.path d={`${line} L${w},${h} L0,${h} Z`} fill="url(#wf-area)" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.8, duration: 1 }} />
      <motion.path d={line} fill="none" stroke="url(#wf-line)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease: "easeInOut" }} />
      {pts.map((p, i) => (
        <motion.g key={i} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.18 }}>
          <circle cx={p[0]} cy={p[1]} r="4.5" fill="#fff" stroke="#8b7cf6" strokeWidth="2.5" />
          <text x={p[0]} y={h + 18} textAnchor="middle" fontSize="11" fill="#6b6884">{days[i]}</text>
        </motion.g>
      ))}
    </svg>
  );
}

function Dock() {
  const items = [[LayoutDashboard, "Dashboard", true], [Sparkles, "Templates", false], [BarChart3, "Insights", false], [Settings, "Settings", false]] as const;
  return (
    <aside className={`fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 gap-1 rounded-full p-2 lg:bottom-auto lg:left-5 lg:top-1/2 lg:-translate-x-0 lg:-translate-y-1/2 lg:flex-col ${glass}`}>
      {items.map(([Icon, label, on]) => (
        <button key={label} aria-label={label} className="group relative flex h-11 w-11 items-center justify-center rounded-full transition">
          {on && <motion.span layoutId="dock" className="absolute inset-0 rounded-full bg-[#1e1b3a]" />}
          <Icon size={18} className={`relative ${on ? "text-white" : "text-[#6b6884] group-hover:text-[#1e1b3a]"}`} />
          <span className="pointer-events-none absolute left-14 hidden whitespace-nowrap rounded-full bg-[#1e1b3a] px-3 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100 lg:block">{label}</span>
        </button>
      ))}
      <span className="mx-2 my-1 h-px bg-[#1e1b3a]/10 max-lg:hidden" />
      <button aria-label="Log out" className="group relative flex h-11 w-11 items-center justify-center rounded-full text-[#6b6884] hover:text-[#1e1b3a]">
        <LogOut size={18} />
        <span className="pointer-events-none absolute left-14 hidden rounded-full bg-[#1e1b3a] px-3 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100 lg:block">Log out</span>
      </button>
    </aside>
  );
}

function PageCard({ page, index }: { page: (typeof pages)[number]; index: number }) {
  const [copied, setCopied] = useState(false);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 140, damping: 16 });
  const rX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 140, damping: 16 });
  const share = async () => {
    try { await navigator.clipboard.writeText(`${window.location.origin}/w/demo`); } catch {}
    setCopied(true); setTimeout(() => setCopied(false), 1800);
  };
  const live = page.status === "Published";
  return (
    <motion.article layout initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: index * 0.08, type: "spring", stiffness: 140, damping: 20 }}
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width - 0.5); my.set((e.clientY - r.top) / r.height - 0.5); }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      style={{ rotateX: rX, rotateY: rY, transformPerspective: 900 }} className={`group overflow-hidden rounded-[30px] ${glass}`}>
      <div className={`relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br ${page.gradient}`}>
        <motion.div animate={{ x: [0, 20, 0] }} transition={{ duration: 9, repeat: Infinity }} className="absolute -left-8 -top-10 h-40 w-40 rounded-full bg-white/50 blur-2xl" />
        <motion.div animate={{ y: [0, -8, 0], rotate: [-3, 3, -3] }} transition={{ duration: 5, repeat: Infinity, delay: index * 0.4, ease: "easeInOut" }}
          className="relative z-10 flex h-24 w-24 items-center justify-center rounded-[28px] bg-white/70 text-5xl shadow-[0_20px_40px_-14px_rgba(70,50,140,0.45)] backdrop-blur-xl">{page.emoji}</motion.div>
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium backdrop-blur">
          <span className="relative flex h-2 w-2">
            {live && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />}
            <span className={`relative inline-flex h-2 w-2 rounded-full ${live ? "bg-emerald-500" : "bg-amber-400"}`} />
          </span>
          {page.status}
        </div>
        <Link href="/w/demo" aria-label="Open page" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 opacity-0 backdrop-blur transition group-hover:opacity-100"><ArrowUpRight size={16} /></Link>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between text-xs"><span className="font-medium text-[#8b7cf6]">{page.occasion}</span><span className="text-[#6b6884]">{page.template}</span></div>
        <h3 className="wf-display mt-1 line-clamp-1 text-2xl">{page.title}</h3>
        <p className="text-sm text-[#6b6884]">{page.recipient}</p>
        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-xs text-[#6b6884]">
            <span className="flex items-center gap-1.5"><Eye size={13} />{page.views} views</span>
            <span className="flex items-center gap-1.5"><Clock3 size={13} />{page.date}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#1e1b3a]/5">
            <motion.div initial={{ width: 0 }} animate={{ width: `${(page.views / totalViews) * 100}%` }} transition={{ delay: 0.5 + index * 0.1, duration: 1.1, ease: "easeOut" }} className="h-full rounded-full bg-gradient-to-r from-[#8b7cf6] to-[#f59ec0]" />
          </div>
        </div>
        <div className="mt-5 flex gap-2">
          <Link href="/w/demo" className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#1e1b3a] py-2.5 text-sm font-medium text-white transition hover:opacity-90"><Eye size={15} />View</Link>
          <Link href="/create" className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#1e1b3a]/5 py-2.5 text-sm font-medium transition hover:bg-[#1e1b3a]/10"><Pencil size={15} />Edit</Link>
          <button onClick={share} aria-label="Copy link" className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#1e1b3a]/5 transition hover:bg-[#1e1b3a]/10">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={copied ? "c" : "s"} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}>{copied ? <Check size={15} className="text-emerald-600" /> : <Share2 size={15} />}</motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default function DashboardPage() {
  const [filter, setFilter] = useState("All");
  const [greet, setGreet] = useState("Welcome back");
  useEffect(() => {
    const h = new Date().getHours();
    setGreet(h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
  }, []);

  const shown = pages.filter((p) => filter === "All" || p.status === filter);
  const stats = [
    { icon: Sparkles, label: "Pages", value: pages.length, tint: "from-[#ffd9c2] to-[#ffc4d6]" },
    { icon: Eye, label: "Views", value: totalViews, tint: "from-[#e3d9ff] to-[#cfe3ff]" },
    { icon: ImageIcon, label: "Memories", value: 47, tint: "from-[#ffe9c2] to-[#ffd9c2]" },
    { icon: Heart, label: "Published", value: pages.filter((p) => p.status === "Published").length, tint: "from-[#c9f1e3] to-[#cfe3ff]" },
  ];
  const create = [
    { href: "/create?occasion=birthday", e: "🎂", t: "Birthday", d: "Make their day unforgettable", c: "from-[#ffe3cf] to-[#ffc4d6]" },
    { href: "/create?occasion=anniversary", e: "💗", t: "Anniversary", d: "Celebrate your story together", c: "from-[#e3d9ff] to-[#ffd9e8]" },
    { href: "/create?occasion=custom", e: "✨", t: "Something else", d: "Create your own occasion", c: "from-[#d6e8ff] to-[#c9f1e3]" },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <style>{CSS}</style>
      <main className="wf-body relative min-h-screen overflow-hidden bg-[#f8f7fc] text-[#1e1b3a] antialiased">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(55%_45%_at_10%_10%,#ffe1d0_0%,transparent_70%),radial-gradient(45%_45%_at_90%_20%,#dcd3ff_0%,transparent_70%),radial-gradient(50%_45%_at_70%_100%,#cdeee0_0%,transparent_70%)]" />
        <motion.div animate={{ x: [0, 40, 0], y: [0, 30, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} className="pointer-events-none fixed -left-20 top-40 h-72 w-72 rounded-full bg-[#ffc4d6]/40 blur-[90px]" />
        <motion.div animate={{ x: [0, -40, 0], y: [0, 40, 0] }} transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }} className="pointer-events-none fixed -right-20 bottom-10 h-80 w-80 rounded-full bg-[#b9a9ff]/40 blur-[100px]" />

        <Dock />

        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-32 pt-6 sm:px-8 lg:pl-28 lg:pr-10">
          {/* top bar */}
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

          {/* welcome */}
          <section className="mt-14 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mb-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${glass}`}><Sparkles size={14} className="text-[#8b7cf6]" /> Your creative space</motion.div>
              <h1 className="wf-display text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
                {greet.split(" ").map((w, i) => (
                  <span key={i} className="mr-[0.25em] inline-block overflow-hidden pb-2 align-bottom">
                    <motion.span className="inline-block" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 0.15 + i * 0.1, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}>{w}</motion.span>
                  </span>
                ))}
                <br />
                <motion.span className="wf-shine inline-block italic" initial={{ opacity: 0, filter: "blur(10px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ delay: 0.5, duration: 1 }}>Khushi.</motion.span>
              </h1>
              <p className="mt-5 max-w-md leading-[1.8] text-[#6b6884]">Create beautiful surprise pages, manage your memories, and share moments that matter.</p>
            </div>
            <Link href="/create" className={`${dark} inline-flex h-14 items-center gap-2 px-8`}>
              <span className="pointer-events-none absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-700 group-hover:left-[150%]" />
              <Plus size={18} /> Create new surprise <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
          </section>

          {/* insights bento */}
          <section className="mt-12 grid gap-5 lg:grid-cols-[1.25fr_1fr]">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`rounded-[32px] p-7 ${glass}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#6b6884]">Views this week</p>
                  <p className="wf-display mt-1 text-6xl"><Counter to={week.reduce((a, b) => a + b, 0)} /></p>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-medium text-emerald-700"><ArrowUpRight size={13} /> 18% more than last week</span>
              </div>
              <div className="mt-6"><Sparkline /></div>
            </motion.div>

            <div className="grid grid-cols-2 gap-5">
              {stats.map(({ icon: Icon, label, value, tint }, i) => (
                <motion.div key={label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }} className={`relative overflow-hidden rounded-[28px] p-5 ${glass}`}>
                  <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-80 blur-xl ${tint}`} />
                  <div className={`relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${tint}`}><Icon size={18} /></div>
                  <p className="wf-display relative mt-5 text-5xl"><Counter to={value} /></p>
                  <p className="relative mt-1 text-sm text-[#6b6884]">{label}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* quick create */}
          <section className="mt-16">
            <h2 className="wf-display text-3xl">Create something special</h2>
            <p className="mt-1 text-sm text-[#6b6884]">Start with an occasion and make it yours.</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {create.map((c, i) => (
                <Link key={c.t} href={c.href}>
                  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -8 }}
                    className={`group relative h-44 overflow-hidden rounded-[30px] bg-gradient-to-br p-6 ring-1 ring-white/70 shadow-[0_24px_60px_-28px_rgba(70,50,140,0.4)] ${c.c}`}>
                    <motion.span animate={{ y: [0, -8, 0], rotate: [-6, 6, -6] }} transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }} className="absolute -right-2 -top-2 text-[88px] opacity-90 transition-transform duration-500 group-hover:scale-125">{c.e}</motion.span>
                    <div className="absolute bottom-6 left-6">
                      <h3 className="wf-display text-3xl">{c.t}</h3>
                      <p className="mt-1 text-sm text-[#1e1b3a]/65">{c.d}</p>
                    </div>
                    <span className="absolute bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 transition group-hover:bg-[#1e1b3a] group-hover:text-white"><ArrowRight size={16} /></span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </section>

          {/* pages */}
          <section className="mt-16">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="wf-display text-3xl">Your surprise pages</h2>
                <p className="mt-1 text-sm text-[#6b6884]">Manage everything you have created.</p>
              </div>
              <div className={`flex w-fit gap-1 rounded-full p-1 ${glass}`}>
                {["All", "Published", "Draft"].map((f) => (
                  <button key={f} onClick={() => setFilter(f)} className={`relative rounded-full px-5 py-2 text-sm font-medium transition ${filter === f ? "text-white" : "text-[#6b6884]"}`}>
                    {filter === f && <motion.span layoutId="filter" className="absolute inset-0 rounded-full bg-[#1e1b3a]" transition={{ type: "spring", stiffness: 300, damping: 28 }} />}
                    <span className="relative">{f}</span>
                  </button>
                ))}
              </div>
            </div>
            <motion.div layout className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {shown.map((p, i) => <PageCard key={p.id} page={p} index={i} />)}
              </AnimatePresence>
            </motion.div>
          </section>

          {/* activity */}
          <section className="mt-16 grid gap-5 lg:grid-cols-[1fr_1.2fr]">
            <div className={`rounded-[32px] p-7 ${glass}`}>
              <h2 className="wf-display text-3xl">Recent activity</h2>
              <ol className="relative mt-6 space-y-6 border-l border-[#1e1b3a]/10 pl-6">
                {activity.map((a, i) => (
                  <motion.li key={a.t} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative">
                    <span className={`absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-white ${a.c}`} />
                    <p className="text-sm">{a.t}</p><p className="text-xs text-[#6b6884]">{a.w}</p>
                  </motion.li>
                ))}
              </ol>
            </div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative flex flex-col justify-between overflow-hidden rounded-[32px] bg-gradient-to-br from-[#e4dcff] via-[#ffd9e8] to-[#ffe3cf] p-8 ring-1 ring-white/80">
              <motion.div animate={{ x: [0, 40, 0] }} transition={{ duration: 12, repeat: Infinity }} className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/50 blur-3xl" />
              <div className="relative">
                <div className="mb-3 flex items-center gap-2 text-sm text-[#1e1b3a]/70"><Heart size={15} fill="#f59ec0" className="text-[#f59ec0]" /> Make another memory</div>
                <h2 className="wf-display text-4xl sm:text-5xl">Someone deserves a surprise.</h2>
                <p className="mt-3 max-w-sm text-sm text-[#1e1b3a]/65">Turn your favorite memories into something they can keep.</p>
              </div>
              <Link href="/create" className={`${dark} relative mt-8 inline-flex w-fit items-center gap-2 px-7 py-3.5`}>Start creating <ArrowRight size={16} className="transition group-hover:translate-x-1" /></Link>
            </motion.div>
          </section>

          <footer className="mt-16 border-t border-[#1e1b3a]/10 pt-6 text-center text-sm text-[#6b6884]">Made for moments that matter. ♥</footer>
        </div>
      </main>
    </MotionConfig>
  );
}