"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion, AnimatePresence, MotionConfig, useScroll, useSpring, useMotionValue,
  useTransform, useMotionTemplate, useInView, animate,
} from "framer-motion";
import {
  ArrowRight, Heart, Sparkles, Image as ImageIcon, Palette, Share2, Gift, Cake,
  GraduationCap, Link2, Play, Check, Menu, X, Star,
} from "lucide-react";

/* Single file. Needs: framer-motion, lucide-react, Tailwind. Fonts load from Google Fonts below. */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..600,0..100,0..1;1,9..144,300..600,0..100,0..1&family=Plus+Jakarta+Sans:wght@300..700&display=swap');
.wf-display{font-family:'Fraunces',Georgia,serif;font-variation-settings:'SOFT' 100,'WONK' 0;letter-spacing:-0.03em;font-weight:300}
.wf-body{font-family:'Plus Jakarta Sans',system-ui,sans-serif}
.wf-shine{background-image:linear-gradient(100deg,#8b7cf6,#f59ec0,#ffb48a,#8b7cf6);background-size:220% auto;-webkit-background-clip:text;background-clip:text;color:transparent;animation:wf-shine 8s linear infinite}
.wf-marquee{animation:wf-marquee 60s linear infinite}
@keyframes wf-shine{to{background-position:220% center}}
@keyframes wf-marquee{to{transform:translateX(-50%)}}
`;

const glass = "border border-white/80 bg-white/65 backdrop-blur-xl shadow-[0_24px_60px_-24px_rgba(70,50,140,0.35)] ring-1 ring-[#1e1b3a]/5";
const dark = "group relative overflow-hidden rounded-full bg-[#1e1b3a] font-medium text-white shadow-[0_14px_30px_-10px_rgba(30,27,58,0.55)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-10px_rgba(30,27,58,0.6)]";
const ghost = "rounded-full border border-[#1e1b3a]/15 bg-white/60 font-medium backdrop-blur transition hover:bg-white";

const steps = [
  { title: "Choose an occasion", text: "Birthday, anniversary or any moment worth marking.", icon: Gift, tint: "from-[#ffd9c2] to-[#ffc4d6]", pos: "left-0 top-4" },
  { title: "Add your memories", text: "Photos, videos and the words you never said out loud.", icon: ImageIcon, tint: "from-[#cfe3ff] to-[#d9d2ff]", pos: "right-0 top-16" },
  { title: "Pick your style", text: "Start from a template and make it feel like them.", icon: Palette, tint: "from-[#e3d9ff] to-[#ffd1e8]", pos: "right-[-10px] top-[280px]" },
  { title: "Share one link", text: "Send a link or QR code. They open it and it plays.", icon: Share2, tint: "from-[#c9f1e3] to-[#cfe3ff]", pos: "bottom-10 left-2" },
];

const themes = [
  { name: "Peach Glow", note: "Warm apricot melting into rose", gradient: "from-[#ffe3cf] via-[#ffc7b0] to-[#f9a8c4]" },
  { name: "Sage Mist", note: "Quiet greens with a hint of sky", gradient: "from-[#e3f6ec] via-[#b9e6d2] to-[#b6d4ff]" },
  { name: "Lilac Haze", note: "Soft violet with a bright glow", gradient: "from-[#f1eaff] via-[#cbbdff] to-[#a99bf5]" },
];

const img = (id: string, w = 400) => `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;
const photoIds = ["photo-1511632765486-a01980e01a18", "photo-1529156069898-49953e39b3ac", "photo-1517457373958-b7bdd4587205", "photo-1506869640319-fe1a24fd76dc"];
const occasions = ["Birthdays", "Anniversaries", "Graduations", "Weddings", "Baby showers", "Farewells", "Thank-yous", "Just because"];
const petals = ["#c9bdff", "#ffc4d6", "#ffd9c2", "#b9e6d2", "#cfe3ff", "#f3d68f"];

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2.4, ease: "easeOut", onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

function PhoneScreen({ active }: { active: number }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div key={active} initial={{ opacity: 0, y: 22, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -22, filter: "blur(6px)" }}
        className="flex h-[400px] flex-col items-center px-5 pt-8 text-center">
        {active === 0 && (<>
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="mb-4 text-6xl">🎂</motion.div>
          <h3 className="wf-display text-2xl">Choose an occasion</h3>
          <p className="mt-2 text-xs text-[#6b6884]">What are you celebrating?</p>
          <div className="mt-6 flex gap-2">{["🎂", "💞", "🎓"].map((e, i) => (
            <motion.div key={e} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15 * i, type: "spring" }} className="rounded-2xl bg-white/80 p-4 shadow-sm">{e}</motion.div>
          ))}</div>
        </>)}
        {active === 1 && (<>
          <h3 className="wf-display text-2xl">Add your memories</h3>
          <p className="mt-2 text-xs text-[#6b6884]">Photos that tell your story.</p>
          <div className="mt-5 grid w-full grid-cols-2 gap-3">
            {photoIds.map((p, i) => (
              <motion.img key={p} src={img(p, 300)} alt="Memory" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.12, type: "spring" }} className="h-24 w-full rounded-2xl object-cover shadow-sm" />
            ))}
          </div>
        </>)}
        {active === 2 && (<>
          <h3 className="wf-display text-2xl">Pick your style</h3>
          <p className="mt-2 text-xs text-[#6b6884]">Set the mood.</p>
          <div className="mt-5 w-full space-y-3">
            {themes.map((t, i) => (
              <motion.div key={t.name} initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.12 }}
                className={`flex items-center justify-between rounded-2xl bg-gradient-to-r ${t.gradient} p-4 text-sm font-medium shadow-sm`}>
                <span>{t.name}</span>{i === 0 && <Check size={16} />}
              </motion.div>
            ))}
          </div>
        </>)}
        {active === 3 && (<>
          <motion.div animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 2.4, repeat: Infinity }} className="text-6xl">✨</motion.div>
          <h3 className="wf-display mt-4 text-3xl">Your surprise<br />is ready</h3>
          <div className="mt-5 rounded-2xl bg-white p-4 shadow-lg">
            <div className="grid grid-cols-5 gap-1">
              {Array.from({ length: 25 }).map((_, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.025 }} className={`h-2 w-2 rounded-[2px] ${i % 3 === 0 || i % 5 === 0 ? "bg-[#1e1b3a]" : "bg-slate-100"}`} />
              ))}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-[#6b6884]"><Link2 size={14} /> wishly.com/w/riya</div>
        </>)}
      </motion.div>
    </AnimatePresence>
  );
}

export default function Home() {
  const [active, setActive] = useState(0);
  const [menu, setMenu] = useState(false);
  const [theme, setTheme] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [dust, setDust] = useState<{ x: number; y: number; s: number; d: number; t: number; c: string }[]>([]);
  const [burst, setBurst] = useState<{ id: number; dx: number; dy: number; r: number; c: string; s: number }[]>([]);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const px = useMotionValue(600), py = useMotionValue(300), nx = useMotionValue(0), ny = useMotionValue(0);
  const rotY = useSpring(useTransform(nx, [-0.5, 0.5], [-12, 12]), { stiffness: 90, damping: 14 });
  const rotX = useSpring(useTransform(ny, [-0.5, 0.5], [10, -10]), { stiffness: 90, damping: 14 });
  const glow = useMotionTemplate`radial-gradient(460px circle at ${px}px ${py}px, rgba(139,124,246,0.16), transparent 60%)`;

  useEffect(() => {
    setMounted(true);
    setDust(Array.from({ length: 20 }, (_, i) => ({ x: Math.random() * 100, y: Math.random() * 100, s: 4 + Math.random() * 7, d: 6 + Math.random() * 8, t: Math.random() * 4, c: petals[i % 6] })));
    const t = setInterval(() => setActive((c) => (c + 1) % steps.length), 3600);
    return () => clearInterval(t);
  }, []);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    px.set(e.clientX - r.left); py.set(e.clientY - r.top);
    nx.set((e.clientX - r.left) / r.width - 0.5); ny.set((e.clientY - r.top) / r.height - 0.5);
  };

  const fire = () => {
    const base = Date.now();
    setBurst(Array.from({ length: 50 }, (_, i) => {
      const a = Math.random() * Math.PI * 2, d = 110 + Math.random() * 260;
      return { id: base + i, dx: Math.cos(a) * d, dy: Math.sin(a) * d - 40, r: Math.random() * 540 - 270, c: petals[i % 6], s: 8 + Math.random() * 10 };
    }));
    setTimeout(() => setBurst([]), 2000);
  };

  const links = [["How it works", "#how"], ["Templates", "#templates"], ["Occasions", "#occasions"]];
  const T = themes[theme];

  return (
    <MotionConfig reducedMotion="user">
      <style>{CSS}</style>
      <motion.div style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-[#8b7cf6] via-[#f59ec0] to-[#ffb48a]" />

      <main className="wf-body min-h-screen overflow-hidden bg-[#f8f7fc] text-[#1e1b3a] antialiased">
        {/* NAV */}
        <nav className="fixed inset-x-0 top-0 z-50">
          <div className={`mx-auto mt-4 flex h-14 max-w-6xl items-center justify-between rounded-full px-4 pl-6 ${glass}`}>
            <a href="#" className="flex items-center gap-2">
              <span className="wf-display text-2xl italic">Wishly</span>
              <motion.span animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 1.8, repeat: Infinity }}><Heart size={14} fill="#f59ec0" className="text-[#f59ec0]" /></motion.span>
            </a>
            <div className="hidden items-center gap-9 text-sm text-[#1e1b3a]/70 md:flex">
              {links.map(([l, h]) => <a key={l} href={h} className="transition hover:text-[#1e1b3a]">{l}</a>)}
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <button className="px-4 py-2 text-sm text-[#1e1b3a]/70 hover:text-[#1e1b3a]">Log in</button>
              <button className={`${dark} px-5 py-2.5 text-sm`}>Create a surprise</button>
            </div>
            <button aria-label="Menu" className="rounded-full p-2 md:hidden" onClick={() => setMenu(!menu)}>{menu ? <X size={20} /> : <Menu size={20} />}</button>
          </div>
          <AnimatePresence>
            {menu && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`mx-4 mt-2 rounded-3xl p-5 md:hidden ${glass}`}>
                <div className="flex flex-col gap-4">
                  {links.map(([l, h]) => <a key={l} href={h} onClick={() => setMenu(false)}>{l}</a>)}
                  <button className={`${dark} py-3`}>Create a surprise</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* HERO */}
        <section onMouseMove={onMove} className="relative px-5 pb-24 pt-36 sm:px-8 lg:px-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_15%_20%,#ffe1d0_0%,transparent_70%),radial-gradient(50%_50%_at_85%_15%,#dcd3ff_0%,transparent_70%),radial-gradient(50%_50%_at_60%_95%,#cdeee0_0%,transparent_70%)]" />
          <motion.div style={{ background: glow }} className="pointer-events-none absolute inset-0" />
          <motion.div animate={{ x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} className="pointer-events-none absolute -left-24 top-32 h-72 w-72 rounded-full bg-[#ffc4d6]/50 blur-[80px]" />
          <motion.div animate={{ x: [0, -40, 0], y: [0, 50, 0] }} transition={{ duration: 21, repeat: Infinity, ease: "easeInOut" }} className="pointer-events-none absolute -right-24 top-24 h-80 w-80 rounded-full bg-[#b9a9ff]/50 blur-[90px]" />
          {mounted && dust.map((p, i) => (
            <motion.span key={i} className="pointer-events-none absolute rounded-full" style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, background: p.c }}
              animate={{ y: [0, -30, 0], opacity: [0.2, 0.9, 0.2] }} transition={{ duration: p.d, delay: p.t, repeat: Infinity, ease: "easeInOut" }} />
          ))}

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`mb-7 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-[#1e1b3a]/80 ${glass}`}>
                <Sparkles size={14} className="text-[#8b7cf6]" /> Interactive pages for people you love
              </motion.div>
              <h1 className="wf-display max-w-[660px] text-5xl leading-[1.03] sm:text-6xl lg:text-[76px]">
                {"Give them a page".split(" ").map((w, i) => (
                  <span key={i} className="mr-[0.25em] inline-block overflow-hidden pb-2 align-bottom">
                    <motion.span className="inline-block" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 0.25 + i * 0.12, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}>{w}</motion.span>
                  </span>
                ))}
                <br />
                <motion.span className="wf-shine inline-block italic" initial={{ opacity: 0, y: 24, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.9, duration: 1.1 }}>that feels like a gift.</motion.span>
              </h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="mt-7 max-w-lg text-lg leading-[1.8] text-[#6b6884]">
                Turn your photos, memories and words into a beautiful page they can open, scroll and keep. Made for birthdays, anniversaries and everything in between.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }} className="mt-9 flex flex-wrap gap-4">
                <button className={`${dark} px-8 py-4`}>
                  <span className="pointer-events-none absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-700 group-hover:left-[150%]" />
                  Create your surprise <ArrowRight size={17} className="ml-2 inline transition group-hover:translate-x-1" />
                </button>
                <button className={`${ghost} flex items-center gap-2 px-7 py-4`}><Play size={14} fill="currentColor" /> Watch demo</button>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="mt-10 flex items-center gap-4 text-sm text-[#6b6884]">
                <div className="flex -space-x-2">{photoIds.slice(0, 4).map((p) => <img key={p} src={img(p, 80)} alt="" className="h-9 w-9 rounded-full border-2 border-white object-cover" />)}</div>
                <div><div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} fill="#f3c969" stroke="none" />)}</div>Loved by thousands of gift-givers</div>
              </motion.div>
            </div>

            <div className="relative flex min-h-[620px] items-center justify-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="absolute h-[500px] w-[500px] rounded-full border border-dashed border-[#8b7cf6]/30" />
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 65, repeat: Infinity, ease: "linear" }} className="absolute h-[390px] w-[390px] rounded-full border border-dashed border-[#f59ec0]/40" />
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: "linear" }} className="absolute h-[440px] w-[440px]">
                <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-[#f59ec0] shadow-[0_0_18px_5px_rgba(245,158,192,0.55)]" />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 70, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.5, duration: 1, type: "spring" }} style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1000 }} className="relative z-20">
                <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative h-[485px] w-[245px] rounded-[42px] bg-[#1e1b3a] p-[7px] shadow-[0_50px_90px_-20px_rgba(70,50,140,0.55),0_0_0_1px_rgba(255,255,255,0.4)_inset]">
                  <div className="absolute left-1/2 top-3 z-30 h-5 w-20 -translate-x-1/2 rounded-full bg-[#1e1b3a]" />
                  <div className="relative h-full overflow-hidden rounded-[36px] bg-gradient-to-b from-[#fff3ea] via-[#f4efff] to-[#e6f6ef]">
                    <div className="flex justify-between px-6 pb-2 pt-9 text-[10px] text-[#6b6884]"><span>9:41</span><span>● ● ●</span></div>
                    <PhoneScreen active={active} />
                    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                      {steps.map((_, i) => <span key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? "w-5 bg-[#1e1b3a]" : "w-1.5 bg-[#1e1b3a]/20"}`} />)}
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* floating photo */}
              <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.4, type: "spring" }} className="absolute left-0 top-[205px] z-10 hidden sm:block">
                <motion.img animate={{ y: [0, -12, 0], rotate: [-6, -3, -6] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} src={img(photoIds[1], 300)} alt="" className="h-32 w-28 rounded-2xl border-[5px] border-white object-cover shadow-[0_24px_50px_-18px_rgba(70,50,140,0.5)]" />
              </motion.div>
              {/* rotating text badge */}
              <motion.svg viewBox="0 0 120 120" animate={{ rotate: 360 }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }} className={`absolute bottom-6 right-[2%] z-30 hidden h-28 w-28 rounded-full sm:block ${glass}`}>
                <defs><path id="wf-c" d="M60 60 m-40 0 a40 40 0 1 1 80 0 a40 40 0 1 1 -80 0" /></defs>
                <text fontSize="10.5" fontWeight="600" fill="#1e1b3a" letterSpacing="2.6"><textPath href="#wf-c">MADE WITH LOVE • MADE WITH LOVE •</textPath></text>
                <path d="M60 50c-5-8-18-3-13 7 4 6 13 11 13 11s9-5 13-11c5-10-8-15-13-7z" fill="#f59ec0" />
              </motion.svg>

              {steps.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.button key={s.title} onClick={() => setActive(i)} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 + i * 0.15, type: "spring", stiffness: 140 }} whileHover={{ scale: 1.06 }}
                    className={`absolute z-30 hidden w-48 rounded-3xl p-4 text-left transition-shadow sm:block ${glass} ${s.pos} ${active === i ? "shadow-[0_24px_60px_-18px_rgba(139,124,246,0.7)] ring-[#8b7cf6]/40" : ""}`}>
                    <motion.div animate={{ y: i % 2 ? [0, 8, 0] : [0, -8, 0] }} transition={{ duration: 5 + i * 0.4, repeat: Infinity, ease: "easeInOut" }} className="flex items-center gap-3">
                      <div className={`rounded-xl bg-gradient-to-br p-2 ${s.tint}`}><Icon size={17} /></div>
                      <h4 className="text-xs font-semibold">{s.title}</h4>
                    </motion.div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="overflow-hidden py-10 [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
          <div className="wf-marquee flex w-max gap-12 whitespace-nowrap">
            {[...occasions, ...occasions].map((o, i) => (
              <span key={i} className="wf-display flex items-center gap-12 text-4xl italic text-[#1e1b3a]/35">{o}<Sparkles size={16} className="text-[#8b7cf6]/60" /></span>
            ))}
          </div>
        </div>

        {/* HOW */}
        <section id="how" className="px-5 py-28 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <motion.h2 initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }} whileInView={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }} viewport={{ once: true }} transition={{ duration: 1.1, ease: "easeOut" }} className="wf-display max-w-2xl text-4xl sm:text-6xl">Four quiet steps to a surprise</motion.h2>
            <p className="mt-4 max-w-md text-[#6b6884]">No design skills needed. Bring the memories and we handle the rest.</p>
            <div className="relative mt-16">
              <div className="absolute left-[8%] right-[8%] top-[52px] hidden h-px bg-[#1e1b3a]/10 md:block">
                <motion.span animate={{ left: ["0%", "100%"] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-[3px] h-[7px] w-[7px] rounded-full bg-[#8b7cf6] shadow-[0_0_12px_3px_rgba(139,124,246,0.6)]" />
              </div>
              <div className="grid gap-6 md:grid-cols-4">
                {steps.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <motion.div key={s.title} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.8 }} whileHover={{ y: -8 }} onClick={() => setActive(i)}
                      className={`relative cursor-pointer overflow-hidden rounded-[28px] p-7 ${glass} ${active === i ? "ring-[#8b7cf6]/40" : ""}`}>
                      <div className={`absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br opacity-70 blur-2xl ${s.tint}`} />
                      <div className={`relative mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br shadow-sm ${s.tint}`}><Icon size={21} /></div>
                      <span className="wf-display absolute right-5 top-4 text-5xl italic text-[#1e1b3a]/10">0{i + 1}</span>
                      <h3 className="relative text-lg font-semibold">{s.title}</h3>
                      <p className="relative mt-2 text-sm leading-6 text-[#6b6884]">{s.text}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* TEMPLATES */}
        <section id="templates" className="relative px-5 py-28 sm:px-8 lg:px-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(50%_50%_at_80%_40%,#e4dcff_0%,transparent_70%)]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="wf-display text-4xl sm:text-6xl">Templates with a point of view</h2>
              <p className="mt-4 max-w-md text-[#6b6884]">Tap a style and watch the page change. Each one has its own colors, mood and motion.</p>
              <div className="mt-8 space-y-3">
                {themes.map((t, i) => (
                  <button key={t.name} onClick={() => setTheme(i)} className={`flex w-full items-center gap-4 rounded-2xl p-4 text-left transition ${theme === i ? glass : "hover:bg-white/50"}`}>
                    <span className={`h-12 w-12 rounded-xl bg-gradient-to-br shadow-inner ${t.gradient}`} />
                    <span><span className="block font-semibold">{t.name}</span><span className="text-sm text-[#6b6884]">{t.note}</span></span>
                    {theme === i && <motion.span layoutId="tick" className="ml-auto rounded-full bg-[#1e1b3a] p-1 text-white"><Check size={14} /></motion.span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div key={theme} initial={{ opacity: 0, rotateY: -20, scale: 0.95 }} animate={{ opacity: 1, rotateY: 0, scale: 1 }} exit={{ opacity: 0, rotateY: 20, scale: 0.95 }} transition={{ duration: 0.55 }} style={{ transformPerspective: 1200 }}
                  className={`relative flex h-[450px] flex-col items-center justify-center overflow-hidden rounded-[40px] bg-gradient-to-br p-8 text-center shadow-[0_50px_100px_-30px_rgba(70,50,140,0.5)] ring-1 ring-white/70 ${T.gradient}`}>
                  <motion.div animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }} transition={{ duration: 10, repeat: Infinity }} className="absolute -left-10 top-10 h-56 w-56 rounded-full bg-white/40 blur-3xl" />
                  <motion.div animate={{ scale: [1.2, 1, 1.2] }} transition={{ duration: 12, repeat: Infinity }} className="absolute -right-10 bottom-0 h-60 w-60 rounded-full bg-white/30 blur-3xl" />
                  {[["left-[9%] top-[14%]", 20], ["right-[11%] top-[20%]", 14], ["left-[16%] bottom-[16%]", 16], ["right-[14%] bottom-[12%]", 22]].map(([p, s], i) => (
                    <motion.span key={i} animate={{ y: [0, -14, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }} className={`absolute ${p}`}><Sparkles size={s as number} className="text-white" /></motion.span>
                  ))}
                  <span className="relative text-sm tracking-wide text-[#1e1b3a]/60">a little something for you</span>
                  <h3 className="wf-display relative mt-2 text-5xl italic sm:text-6xl">Happy birthday, Riya</h3>
                  <div className="relative mt-8 flex gap-4">
                    {photoIds.slice(0, 3).map((p, i) => (
                      <motion.img key={p} src={img(p, 240)} alt="" initial={{ y: 40, opacity: 0, rotate: 0 }} animate={{ y: 0, opacity: 1, rotate: (i - 1) * 7 }} transition={{ delay: 0.35 + i * 0.12, type: "spring" }} whileHover={{ y: -10, rotate: 0, scale: 1.08 }} className="h-28 w-24 rounded-xl border-[5px] border-white object-cover shadow-xl" />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* OCCASIONS */}
        <section id="occasions" className="px-5 py-28 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <h2 className="wf-display max-w-2xl text-4xl sm:text-6xl">For every moment worth remembering</h2>
            <div className="mt-14 grid auto-rows-[200px] gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { i: Cake, t: "Birthday", d: "Celebrate their day with everything they love.", c: "from-[#ffe3cf] to-[#ffc4d6]", span: "lg:col-span-2 lg:row-span-2" },
                { i: Heart, t: "Anniversary", d: "Look back on your story", c: "from-[#ffd9e8] to-[#e3d9ff]", span: "" },
                { i: GraduationCap, t: "Graduation", d: "Mark the next chapter", c: "from-[#d6e8ff] to-[#c9f1e3]", span: "" },
                { i: Sparkles, t: "Something else", d: "Any moment you want to hold onto", c: "from-[#e3d9ff] to-[#cfe3ff]", span: "lg:col-span-2" },
              ].map(({ i: Icon, t, d, c, span }, k) => (
                <motion.div key={t} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: k * 0.1, duration: 0.8 }} whileHover={{ y: -8 }}
                  className={`group relative flex flex-col justify-end overflow-hidden rounded-[30px] bg-gradient-to-br p-7 ring-1 ring-white/70 shadow-[0_24px_60px_-28px_rgba(70,50,140,0.4)] ${c} ${span}`}>
                  <motion.div animate={{ rotate: [0, 8, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute -right-4 -top-4 text-white/60 transition-transform duration-700 group-hover:scale-125"><Icon size={span ? 190 : 120} strokeWidth={1} /></motion.div>
                  <h3 className="wf-display relative text-3xl">{t}</h3>
                  <p className="relative mt-1 max-w-xs text-sm text-[#1e1b3a]/70">{d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="px-5 sm:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 rounded-[40px] bg-[#1e1b3a] px-8 py-16 text-center text-white sm:grid-cols-3">
            {[[3, " min", "average time to build a page"], [40, "+", "templates to start from"], [100, "%", "of pages open on any phone"]].map(([n, s, l]) => (
              <div key={String(l)}>
                <div className="wf-display bg-gradient-to-r from-[#d9d2ff] via-[#ffc4d6] to-[#ffd9c2] bg-clip-text text-7xl text-transparent"><Counter to={n as number} suffix={s as string} /></div>
                <p className="mt-2 text-sm text-white/60">{l}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="px-5 py-28 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="wf-display max-w-xl text-4xl sm:text-5xl">Said with a lot of happy tears</h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[["She opened it on the train and cried laughing. Best gift I've made.", "Aarav", "from-[#ffd9c2] to-[#ffc4d6]"], ["Took ten minutes and felt like I'd hired a designer.", "Meera", "from-[#cfe3ff] to-[#d9d2ff]"], ["Our anniversary page is now the first link on their phone.", "Kabir", "from-[#c9f1e3] to-[#cfe3ff]"]].map(([q, n, c], i) => (
                <motion.figure key={n} initial={{ opacity: 0, y: 40 + i * 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.8 }} whileHover={{ y: -6 }} className={`rounded-[28px] p-8 ${glass}`}>
                  <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, s) => <Star key={s} size={14} fill="#f3c969" stroke="none" />)}</div>
                  <blockquote className="wf-display mt-5 text-2xl leading-snug">&ldquo;{q}&rdquo;</blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 text-sm"><span className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br font-semibold ${c}`}>{(n as string)[0]}</span>{n}</figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 pb-24 sm:px-8">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[44px] bg-gradient-to-br from-[#e4dcff] via-[#ffd9e8] to-[#ffe3cf] px-6 py-28 text-center ring-1 ring-white/80">
            <motion.div animate={{ x: [0, 60, 0], y: [0, 30, 0] }} transition={{ duration: 14, repeat: Infinity }} className="absolute -left-10 top-0 h-72 w-72 rounded-full bg-white/50 blur-3xl" />
            <motion.div animate={{ x: [0, -60, 0], y: [0, -30, 0] }} transition={{ duration: 17, repeat: Infinity }} className="absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-[#b9a9ff]/40 blur-3xl" />
            <div className="relative mx-auto max-w-3xl">
              <h2 className="wf-display text-4xl sm:text-6xl md:text-7xl">Make the moment last longer than the day.</h2>
              <p className="mx-auto mt-6 max-w-xl text-[#1e1b3a]/70">Start with a template, add your memories, and send a link they&apos;ll open more than once.</p>
              <div className="relative mt-10 inline-block">
                <motion.button onClick={fire} whileTap={{ scale: 0.95 }} className={`${dark} px-10 py-4 text-lg`}>
                  <span className="pointer-events-none absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-700 group-hover:left-[150%]" />
                  Create your surprise
                </motion.button>
                {burst.map((b) => (
                  <motion.span key={b.id} initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }} animate={{ x: b.dx, y: b.dy + 140, opacity: 0, rotate: b.r, scale: 0.5 }} transition={{ duration: 1.8, ease: [0.1, 0.7, 0.3, 1] }}
                    className="pointer-events-none absolute left-1/2 top-1/2 rounded-full" style={{ width: b.s, height: b.s * 1.5, background: b.c }} />
                ))}
              </div>
              <p className="mt-4 text-sm italic text-[#1e1b3a]/50">Go on, press it.</p>
            </div>
          </div>
        </section>

        <footer className="border-t border-[#1e1b3a]/10 px-5 py-10 sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 md:flex-row md:items-center">
            <div className="wf-display text-2xl italic">Wishly <span className="text-[#f59ec0]">♥</span></div>
            <p className="text-sm text-[#6b6884]">Made for moments that matter.</p>
          </div>
        </footer>
      </main>
    </MotionConfig>
  );
}