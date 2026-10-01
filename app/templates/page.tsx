"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, MotionConfig, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Eye, Play, Sparkles, X } from "lucide-react";
import Navbar from "@/components/ui/Navbar";

type T = {
  id: "neon-night" | "pastel-dream" | "royal-gold";
  demo: string;
  name: string;
  note: string;
  occasions: string[];
  gradient: string;
  palette: [string, string, string];
  motion: string;
  font: string;
  emoji: string;
  dark?: boolean;
};

// The three templates that actually ship, each backed by a live demo page
const templates: T[] = [
  { id: "neon-night", demo: "demo", name: "Neon Night", note: "Starfield, glow and party energy", occasions: ["Birthday", "Friendship", "Congrats"], gradient: "from-[#1b1250] via-[#4a2fb0] to-[#e85fa8]", palette: ["#ffd1ec", "#a78bfa", "#22d3ee"], motion: "Twinkling stars", font: "Space Grotesk", emoji: "🎁", dark: true },
  { id: "pastel-dream", demo: "demo-pastel", name: "Pastel Dream", note: "Balloons, polaroids and soft pinks", occasions: ["Birthday", "Anniversary", "Friendship"], gradient: "from-[#fde2f0] via-[#e8dcff] to-[#cfe3ff]", palette: ["#fff0f7", "#d9ccff", "#bcd8ff"], motion: "Floating balloons", font: "Fredoka", emoji: "🎀" },
  { id: "royal-gold", demo: "demo-royal", name: "Royal Gold", note: "Black velvet, gold petals, serif", occasions: ["Wedding", "Anniversary", "Farewell"], gradient: "from-[#1a140a] via-[#5a4318] to-[#e8c27a]", palette: ["#f6e3b4", "#c99a3c", "#6b4a14"], motion: "Falling gold petals", font: "Playfair Display", emoji: "👑", dark: true },
];
const filters = ["All", "Birthday", "Anniversary", "Wedding", "Farewell", "Friendship", "Congrats"];

function MiniPage({ t, big = false }: { t: T; big?: boolean }) {
  return (
    <div className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${t.gradient} ${t.dark ? "text-white" : "text-ink"}`}>
      <motion.div animate={{ x: [0, 24, 0], scale: [1, 1.2, 1] }} transition={{ duration: 9, repeat: Infinity }} className="absolute -left-8 top-4 h-32 w-32 rounded-full bg-white/30 blur-2xl" />
      <motion.div animate={{ x: [0, -20, 0] }} transition={{ duration: 11, repeat: Infinity }} className="absolute -right-8 bottom-2 h-36 w-36 rounded-full bg-white/20 blur-2xl" />
      {["left-[12%] top-[14%]", "right-[14%] top-[22%]", "left-[22%] bottom-[20%]"].map((p, i) => (
        <motion.span key={p} animate={{ y: [0, -10, 0], opacity: [0.3, 1, 0.3] }} transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.6 }} className={`absolute ${p}`}>
          <Sparkles size={big ? 22 : 13} className="text-white" />
        </motion.span>
      ))}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <span className={big ? "text-5xl" : "text-2xl"}>{t.emoji}</span>
        <span className={`mt-1 opacity-70 ${big ? "text-sm" : "text-[9px]"}`}>a little something for you</span>
        <h4 className={`leading-tight ${big ? "mt-1 text-5xl" : "mt-0.5 text-xl"}`} style={{ fontFamily: `'${t.font}', serif`, fontStyle: t.id === "royal-gold" ? "italic" : "normal" }}>
          Happy birthday
        </h4>
        <div className={`flex ${big ? "mt-6 gap-3" : "mt-3 gap-1.5"}`}>
          {t.palette.map((c, i) => (
            <motion.div key={c} animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }} style={{ background: c, rotate: `${(i - 1) * 7}deg` }} className={`border-white/80 shadow-md ${big ? "h-24 w-20 rounded-xl border-4" : "h-10 w-8 rounded-md border-2"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({ t, i, onOpen }: { t: T; i: number; onOpen: () => void }) {
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 140, damping: 16 });
  const rX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 140, damping: 16 });
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: i * 0.06, type: "spring", stiffness: 140, damping: 20 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      style={{ rotateX: rX, rotateY: rY, transformPerspective: 900 }}
      className="glass group overflow-hidden rounded-[30px]"
    >
      <button onClick={onOpen} className="relative block h-72 w-full overflow-hidden text-left">
        <motion.div layoutId={`prev-${t.id}`} className="h-full w-full"><MiniPage t={t} /></motion.div>
        <span className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 transition duration-300 group-hover:opacity-100">
          <span className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-medium text-ink backdrop-blur"><Eye size={14} /> Preview</span>
        </span>
      </button>
      <div className="p-5">
        <h3 className="font-display text-2xl">{t.name}</h3>
        <p className="mt-0.5 text-sm text-muted">{t.note}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-1.5">{t.palette.map((c) => <span key={c} style={{ background: c }} className="h-4 w-4 rounded-full ring-2 ring-white" />)}</div>
          <span className="text-xs text-muted">{t.motion}</span>
        </div>
      </div>
    </motion.article>
  );
}

export default function TemplatesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<T | null>(null);
  const shown = templates.filter((t) => filter === "All" || t.occasions.includes(filter));

  // Pre-select the template in the saved wizard draft, then jump into the wizard
  const use = (t: T) => {
    try {
      const d = JSON.parse(localStorage.getItem("occasion:draft") || "{}");
      localStorage.setItem("occasion:draft", JSON.stringify({ ...d, templateId: t.id }));
    } catch {}
    router.push("/create");
  };

  return (
    <MotionConfig reducedMotion="user">
      <main className="relative min-h-screen bg-cream text-ink">
        <div className="bg-aurora pointer-events-none fixed inset-0" />
        <Navbar />

        <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-36 sm:px-6">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-ink/80">
            <Sparkles size={14} className="text-lilac" /> Three styles, each with its own motion
          </motion.p>
          <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.05] sm:text-7xl">
            Pick the mood, <span className="text-shine italic">we&apos;ll do the magic.</span>
          </h1>

          <div className="mt-10 flex flex-wrap gap-2">
            {filters.map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`relative rounded-full px-4 py-2 text-sm transition ${filter === f ? "text-white" : "text-muted hover:text-ink"}`}>
                {filter === f && <motion.span layoutId="filter" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 300, damping: 26 }} />}
                <span className="relative">{f}</span>
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {shown.map((t, i) => <Card key={t.id} t={t} i={i} onOpen={() => setOpen(t)} />)}
            </AnimatePresence>
          </div>
          {!shown.length && <p className="mt-10 text-muted">No template tagged for that yet. Try Custom in the wizard.</p>}
        </div>

        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)} className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-md">
              <motion.div initial={{ y: 30, scale: 0.96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 30, scale: 0.96 }} onClick={(e) => e.stopPropagation()} className="glass relative grid w-full max-w-4xl overflow-hidden rounded-[36px] md:grid-cols-[1.2fr_1fr]">
                <motion.div layoutId={`prev-${open.id}`} className="h-80 md:h-[460px]"><MiniPage t={open} big /></motion.div>
                <div className="flex flex-col p-8">
                  <button onClick={() => setOpen(null)} aria-label="Close" className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/80 text-ink"><X size={18} /></button>
                  <h2 className="font-display text-4xl">{open.name}</h2>
                  <p className="mt-2 text-muted">{open.note}</p>
                  <dl className="mt-6 space-y-3 text-sm">
                    <div className="flex justify-between border-b border-ink/5 pb-3"><dt className="text-muted">Motion</dt><dd>{open.motion}</dd></div>
                    <div className="flex justify-between border-b border-ink/5 pb-3"><dt className="text-muted">Typeface</dt><dd>{open.font}</dd></div>
                    <div className="flex justify-between"><dt className="text-muted">Great for</dt><dd>{open.occasions.join(", ")}</dd></div>
                  </dl>
                  <div className="mt-auto flex flex-col gap-3 pt-8">
                    <button onClick={() => use(open)} className="btn-ink group inline-flex items-center justify-center gap-2 py-3.5">
                      Use this template <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                    </button>
                    <Link href={`/w/${open.demo}`} className="btn-ghost inline-flex items-center justify-center gap-2 py-3.5">
                      <Play size={14} fill="currentColor" /> Open live demo
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </MotionConfig>
  );
}
