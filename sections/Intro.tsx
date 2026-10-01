"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { createPlayer, type Player } from "@/lib/player";
import { SectionProps, cfgOf, displayStack, headingStyle, occasionTitle, t, useMode } from "./types";
import { WinBar } from "./Chrome";

// Cinematic "tap to begin" gate — unlocks audio on mobile and sets the mood per template
export default function Intro({ page, theme, variant }: SectionProps) {
  const mode = useMode();
  const cfg = cfgOf(variant);
  const [open, setOpen] = useState(mode === "pane");
  const [opening, setOpening] = useState(false);
  const [playing, setPlaying] = useState(false);
  const player = useRef<Player | null>(null);
  const name = page.recipient.nickname || page.recipient.name;

  useEffect(() => {
    if (mode === "pane") return;
    const lenis = (window as any).__lenis;
    document.body.style.overflow = open ? "" : "hidden";
    if (open) lenis?.start();
    else lenis?.stop();
    return () => {
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [open, mode]);

  useEffect(() => () => player.current?.stop(), []);

  const begin = () => {
    if (open) return;
    setOpen(true);
    window.scrollTo({ top: 0 });
    const colors = [theme.accent, theme.secondary, "#ffffff"];
    confetti({ particleCount: 140, spread: 100, origin: { y: 0.6 }, colors, disableForReducedMotion: true });
    setTimeout(() => confetti({ particleCount: 80, spread: 140, startVelocity: 25, origin: { y: 0.4 }, colors, disableForReducedMotion: true }), 350);
    if (page.theme.music) {
      player.current = createPlayer(page.theme.music);
      player.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  // Envelope intros animate the flap first, then reveal the page
  const openEnvelope = () => {
    if (opening) return;
    setOpening(true);
    setTimeout(begin, 1100);
  };

  const toggle = () => {
    if (!player.current) return;
    if (playing) player.current.pause();
    else player.current.play().catch(() => {});
    setPlaying(!playing);
  };

  if (mode === "pane") return null;

  const letters = (text: string, delay = 0.4) =>
    text.split("").map((ch, i) => (
      <motion.span key={i} className="inline-block" initial={{ opacity: 0, y: 30, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: delay + i * 0.06, duration: 0.6 }}>
        {ch === " " ? " " : ch}
      </motion.span>
    ));

  const cta = (label = t(page, "cta.begin")) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{ boxShadow: [`0 0 0px ${theme.accent}00`, `0 0 36px ${theme.accent}aa`, `0 0 0px ${theme.accent}00`] }}
      transition={{ repeat: Infinity, duration: 2.4 }}
      onClick={begin}
      className="mt-10 rounded-full px-9 py-4 text-lg font-semibold"
      style={{ background: theme.accent, color: cfg.onAccent(theme) }}
    >
      {label} ✨
    </motion.button>
  );

  let screen: React.ReactNode;

  if (cfg.intro === "envelope") {
    const paper = variant === "coquette" ? "#fff0f4" : variant === "royal" ? "#1a1408" : "#f6e9d4";
    const flap = variant === "coquette" ? "#f9c9d6" : variant === "royal" ? "#2a2010" : "#e9d3b0";
    screen = (
      <div className="flex flex-col items-center px-6 text-center" style={{ color: theme.text }}>
        <p className="mb-8 text-sm uppercase tracking-[0.35em] opacity-60">{occasionTitle(page)}</p>
        <button onClick={openEnvelope} aria-label="Open the envelope" className="relative h-52 w-80 max-w-[85vw]" style={{ perspective: 900 }}>
          <div className="absolute inset-0 rounded-lg shadow-2xl" style={{ background: flap }} />
          <motion.div className="absolute inset-x-5 top-4 flex h-40 flex-col items-center justify-center rounded bg-white px-4 text-center shadow-md" animate={opening ? { y: -110 } : { y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
            <span className="text-xs uppercase tracking-widest text-neutral-400">{t(page, "intro.for")}</span>
            <span className="mt-1 text-3xl text-neutral-800" style={{ fontFamily: displayStack(theme) }}>{name}</span>
          </motion.div>
          <div className="absolute inset-0 rounded-lg" style={{ background: paper, clipPath: "polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%)" }} />
          <motion.div className="absolute inset-x-0 top-0 h-[60%] origin-top" style={{ background: flap, clipPath: "polygon(0 0, 100% 0, 50% 100%)", filter: "brightness(0.95)" }} animate={opening ? { rotateX: 180 } : { rotateX: 0 }} transition={{ duration: 0.6 }} />
          {!opening && <motion.span className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 text-5xl" animate={{ scale: [1, 1.12, 1] }} transition={{ repeat: Infinity, duration: 1.6 }}>{cfg.gift}</motion.span>}
        </button>
        <p className="mt-10 text-sm opacity-60">{opening ? "…" : t(page, "cta.begin")}</p>
      </div>
    );
  } else if (cfg.intro === "notification") {
    const now = new Date();
    screen = (
      <div className="flex w-full max-w-sm flex-col items-center px-5 text-center text-white">
        <p className="text-lg font-medium opacity-80">{now.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}</p>
        <p className="text-8xl font-semibold tracking-tight">{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}</p>
        <motion.button onClick={begin} initial={{ y: 40, opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ delay: 0.8, type: "spring" }} whileTap={{ scale: 0.97 }} className="mt-16 w-full rounded-3xl bg-white/25 p-4 text-left backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide opacity-80">
            <span className="grid h-5 w-5 place-items-center rounded-md bg-[#34c759] text-[11px]">💬</span> Messages <span className="ml-auto normal-case">now</span>
          </div>
          <p className="mt-2 font-semibold">{page.from}</p>
          <p className="text-sm opacity-90">sent you something special for {name} 🎁 tap to open</p>
        </motion.button>
        <motion.p className="mt-10 text-xs opacity-70" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2 }}>
          {t(page, "cta.begin")}
        </motion.p>
      </div>
    );
  } else if (cfg.intro === "press-start") {
    screen = (
      <div className="flex flex-col items-center px-6 text-center" style={{ color: theme.text }}>
        <p className="text-xs tracking-widest" style={{ fontFamily: displayStack(theme), color: theme.secondary }}>PLAYER 1</p>
        <h1 className="mt-6 text-[clamp(1.5rem,7vw,3.5rem)] leading-relaxed" style={headingStyle(variant, theme)}>{letters(name.toUpperCase())}</h1>
        <motion.button onClick={begin} className="mt-14 text-sm sm:text-base" style={{ fontFamily: displayStack(theme), color: "#ffec27" }} animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}>
          ▶ PRESS START
        </motion.button>
        <p className="mt-8 text-xs opacity-50" style={{ fontFamily: displayStack(theme) }}>INSERT COIN ● {page.from.toUpperCase()}</p>
      </div>
    );
  } else if (cfg.intro === "projector") {
    screen = (
      <div className="flex flex-col items-center px-6 text-center" style={{ color: theme.text }}>
        <p className="text-sm uppercase tracking-[0.4em] opacity-60">{page.from} presents</p>
        <div className="relative mt-8 grid h-48 w-48 place-items-center rounded-full border-4 border-white/80">
          <motion.div className="absolute inset-0 rounded-full" style={{ background: "conic-gradient(rgba(255,255,255,.25) 0deg, transparent 0deg)" }} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} />
          <div className="absolute h-full w-px bg-white/50" />
          <div className="absolute h-px w-full bg-white/50" />
          <Countdown3 font={displayStack(theme)} />
        </div>
        <h1 className="mt-8 text-5xl sm:text-6xl" style={headingStyle(variant, theme)}>{letters(name)}</h1>
        {cta("▶ Roll film")}
      </div>
    );
  } else if (cfg.intro === "boot") {
    screen = (
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, type: "spring" }} className="w-[min(92vw,420px)] text-black" style={cfg.card(theme)}>
        <WinBar title={`surprise_for_${name.toLowerCase().replace(/\s+/g, "_")}.exe`} icon="💾" />
        <div className="flex gap-4 p-5 text-left" style={{ fontFamily: theme.font }}>
          <span className="text-5xl">🎁</span>
          <div>
            <p className="font-bold">{page.from} sent you a file.</p>
            <p className="mt-1 text-sm">{occasionTitle(page)}, {name}! Do you want to open it?</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 pb-5">
          <button onClick={begin} className="min-w-20 px-4 py-1 text-sm font-bold" style={cfg.card(theme)}>Open</button>
          <button disabled className="min-w-20 px-4 py-1 text-sm text-neutral-500" style={cfg.card(theme)}>Cancel</button>
        </div>
      </motion.div>
    );
  } else {
    screen = (
      <div className="flex flex-col items-center px-6 text-center" style={{ color: theme.text }}>
        {[0, 1, 2].map((i) => (
          <motion.span key={i} className="absolute rounded-full border" style={{ borderColor: `${theme.accent}55`, width: 180, height: 180 }} animate={{ scale: [1, 2.6], opacity: [0.6, 0] }} transition={{ repeat: Infinity, duration: 3, delay: i, ease: "easeOut" }} />
        ))}
        <p className="mb-6 text-xs uppercase tracking-[0.35em] opacity-70">{occasionTitle(page)}</p>
        <motion.button onClick={begin} aria-label="Open your surprise" initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 160, damping: 12 }} whileHover={{ scale: 1.1, rotate: -6 }} whileTap={{ scale: 0.9 }} className="relative text-8xl sm:text-9xl" style={{ filter: `drop-shadow(0 0 30px ${theme.accent}88)` }}>
          <motion.span className="inline-block" animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}>
            {cfg.gift}
          </motion.span>
        </motion.button>
        <p className="mt-8 text-base opacity-60">{t(page, "intro.for")}</p>
        <h1 className="mt-1 text-5xl font-bold tracking-tight sm:text-7xl" style={headingStyle(variant, theme)}>{letters(name, 0.5)}</h1>
        {cta()}
        <p className="mt-5 text-xs opacity-50">{t(page, "intro.from")} {page.from}{page.theme.music ? " · 🎵 sound on" : ""}</p>
      </div>
    );
  }

  const bg =
    cfg.intro === "notification"
      ? "radial-gradient(120% 80% at 20% 10%, #7aa7ff 0%, #6d5bd0 40%, #2b1d55 100%)"
      : variant === "pastel"
        ? "linear-gradient(180deg,#FFF1F5,#F5F3FF)"
        : variant === "y2k"
          ? "linear-gradient(135deg,#d7fbff,#efe2ff 45%,#ffd3f1)"
          : theme.background;

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.div key="intro" exit={{ opacity: 0, scale: 1.12, filter: "blur(16px)" }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="fixed inset-0 z-40 flex items-center justify-center overflow-hidden" style={{ background: bg, textTransform: cfg.lowercase ? "lowercase" : undefined }}>
            {variant === "pixel" && <div className="pointer-events-none absolute inset-0 opacity-30" style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,.6) 0 2px, transparent 2px 4px)" }} />}
            {screen}
          </motion.div>
        )}
      </AnimatePresence>

      {open && page.theme.music && mode === "live" && (
        <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} onClick={toggle} aria-label={playing ? "Mute music" : "Play music"} className="fixed bottom-5 right-5 z-30 flex h-12 w-12 items-center justify-center rounded-full text-xl shadow-xl" style={{ background: theme.accent, color: cfg.onAccent(theme) }}>
          {playing ? "🔊" : "🔇"}
        </motion.button>
      )}
    </>
  );
}

function Countdown3({ font }: { font: string }) {
  const [n, setN] = useState(3);
  useEffect(() => {
    const id = setInterval(() => setN((v) => (v === 1 ? 3 : v - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <motion.span key={n} initial={{ scale: 1.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative text-8xl" style={{ fontFamily: font }}>
      {n}
    </motion.span>
  );
}
