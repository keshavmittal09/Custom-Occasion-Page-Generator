"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { SectionProps, cfgOf, headingStyle, occasionTitle, t, useMode } from "./types";
import { CONFETTI_SHAPES } from "./occasion";

function fireworks(colors: string[], emojis: string[]) {
  let shapes: confetti.Shape[] | undefined;
  try {
    shapes = emojis.map((text) => confetti.shapeFromText({ text, scalar: 2 }));
  } catch {
    shapes = undefined;
  }
  const end = Date.now() + 1800;
  (function frame() {
    confetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0 }, colors, disableForReducedMotion: true });
    confetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1 }, colors, disableForReducedMotion: true });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
  for (let i = 0; i < 4; i++) {
    setTimeout(() => {
      confetti({ particleCount: 60, spread: 360, startVelocity: 28, gravity: 0.7, origin: { x: 0.2 + Math.random() * 0.6, y: 0.2 + Math.random() * 0.3 }, colors, disableForReducedMotion: true });
      if (shapes) confetti({ particleCount: 14, spread: 100, scalar: 2, shapes, origin: { x: 0.5, y: 0.5 }, disableForReducedMotion: true });
    }, 300 + i * 450);
  }
}

// Cake with candles: tap each flame, or blow into the mic (Web Audio volume detection)
function Cake({ count, onDone, accent, page }: { count: number; onDone: () => void; accent: string; page: SectionProps["page"] }) {
  const [lit, setLit] = useState<boolean[]>(() => Array(count).fill(true));
  const [listening, setListening] = useState(false);
  const stopMic = useRef<() => void>(() => {});
  const done = lit.every((l) => !l);

  useEffect(() => {
    if (done) {
      stopMic.current();
      onDone();
    }
  }, [done, onDone]);
  useEffect(() => () => stopMic.current(), []);

  const blow = (i: number) => setLit((l) => l.map((v, j) => (j === i ? false : v)));

  const useMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const data = new Uint8Array(analyser.fftSize);
      setListening(true);
      let loud = 0;
      const id = setInterval(() => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (const v of data) sum += ((v - 128) / 128) ** 2;
        const rms = Math.sqrt(sum / data.length);
        loud = rms > 0.18 ? loud + 1 : Math.max(0, loud - 1);
        if (loud > 3) {
          setLit((l) => {
            const idx = l.indexOf(true);
            return idx === -1 ? l : l.map((v, j) => (j === idx ? false : v));
          });
          loud = 1;
        }
      }, 60);
      stopMic.current = () => {
        clearInterval(id);
        stream.getTracks().forEach((tr) => tr.stop());
        ctx.close().catch(() => {});
        setListening(false);
      };
    } catch {
      setListening(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative mt-6 h-48 w-64">
        {/* candles */}
        <div className="absolute inset-x-0 top-0 flex justify-center gap-5">
          {lit.map((on, i) => (
            <button key={i} onClick={() => blow(i)} aria-label={`Blow out candle ${i + 1}`} className="relative flex flex-col items-center">
              <AnimatePresence>
                {on ? (
                  <motion.span key="flame" className="block h-6 w-3.5 rounded-[50%_50%_50%_50%/60%_60%_40%_40%]" style={{ background: "radial-gradient(circle at 50% 70%, #fff7b0, #ffb300 55%, #ff5a00)", boxShadow: "0 0 18px 6px rgba(255,170,0,.55)" }} animate={{ scaleY: [1, 1.15, 0.95, 1], rotate: [-3, 3, -2, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} exit={{ opacity: 0, scale: 0 }} />
                ) : (
                  <motion.span key="smoke" initial={{ opacity: 0.8, y: 0 }} animate={{ opacity: 0, y: -30 }} transition={{ duration: 1.2 }} className="block h-6 w-3.5 text-center text-xs">💨</motion.span>
                )}
              </AnimatePresence>
              <span className="mt-0.5 block h-12 w-3 rounded-sm" style={{ background: `repeating-linear-gradient(45deg, #fff 0 5px, ${accent} 5px 10px)` }} />
            </button>
          ))}
        </div>
        {/* cake */}
        <div className="absolute inset-x-4 bottom-0 h-28 rounded-t-3xl rounded-b-xl" style={{ background: "linear-gradient(#ffe4ec, #f9a8c4)", boxShadow: "0 20px 40px -20px rgba(0,0,0,.5)" }}>
          <div className="h-6 rounded-t-3xl" style={{ background: "repeating-radial-gradient(circle at 10px 0, #fff 0 10px, transparent 10px 20px)" }} />
          <div className="mt-6 h-2 bg-white/70" />
          <div className="mt-6 h-2 bg-white/70" />
        </div>
      </div>
      <p className="mt-5 text-sm opacity-80">{done ? t(page, "finale.wished") : t(page, "finale.blow")}</p>
      {!done && !listening && typeof navigator !== "undefined" && !!navigator.mediaDevices && (
        <button onClick={useMic} className="mt-3 rounded-full border px-4 py-2 text-sm opacity-80 hover:opacity-100" style={{ borderColor: "currentColor" }}>
          🎤 Use mic
        </button>
      )}
      {listening && !done && <p className="mt-3 animate-pulse text-sm">🎤 listening… blow!</p>}
    </div>
  );
}

function GiftBox({ onOpen, accent, gift }: { onOpen: () => void; accent: string; gift: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button onClick={() => { if (!open) { setOpen(true); onOpen(); } }} className="relative mt-8 h-40 w-40" aria-label="Open the gift">
      <motion.div className="absolute inset-x-0 top-4 z-10 h-10 rounded-md" style={{ background: accent, boxShadow: "inset 0 -6px 0 rgba(0,0,0,.15)" }} animate={open ? { y: -140, rotate: -25, opacity: 0 } : { y: [0, -6, 0] }} transition={open ? { duration: 0.7 } : { repeat: Infinity, duration: 1.4 }}>
        <span className="absolute left-1/2 top-0 h-full w-5 -translate-x-1/2 bg-white/80" />
      </motion.div>
      <div className="absolute inset-x-3 bottom-0 h-28 rounded-md" style={{ background: accent, filter: "brightness(0.9)" }}>
        <span className="absolute left-1/2 top-0 h-full w-5 -translate-x-1/2 bg-white/80" />
      </div>
      <AnimatePresence>{open && <motion.span initial={{ y: 0, scale: 0 }} animate={{ y: -90, scale: 1.4 }} className="absolute left-1/2 top-10 -translate-x-1/2 text-5xl">{gift}</motion.span>}</AnimatePresence>
    </button>
  );
}

export default function Finale({ page, theme, variant }: SectionProps) {
  const cfg = cfgOf(variant);
  const mode = useMode();
  const [celebrated, setCelebrated] = useState(false);
  const colors = [theme.accent, theme.secondary, "#ffffff", "#ffd166"];
  const emojis = CONFETTI_SHAPES[page.occasion] ?? CONFETTI_SHAPES.CUSTOM;
  const celebrate = () => {
    setCelebrated(true);
    if (mode !== "pane") fireworks(colors, emojis);
  };
  const isCake = page.occasion === "BIRTHDAY" || page.occasion === "ANNIVERSARY";
  const candles = Math.min(5, Math.max(1, page.recipient.age && page.recipient.age < 5 ? page.recipient.age : 5));

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) await navigator.share({ title: occasionTitle(page), url }).catch(() => {});
    else document.getElementById("share-kit")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-[90svh] flex-col items-center justify-center gap-5 overflow-hidden px-5 py-24 text-center">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" style={{ background: `${theme.accent}30` }} />

      {isCake ? (
        <>
          <p className="relative text-sm uppercase tracking-[0.3em] opacity-70">{t(page, "finale.candles")}</p>
          <div className="relative" style={{ color: theme.text }}>
            <Cake count={candles} onDone={celebrate} accent={theme.accent} page={page} />
          </div>
        </>
      ) : (
        <GiftBox onOpen={celebrate} accent={theme.accent} gift={cfg.finale} />
      )}

      <motion.div initial={false} animate={celebrated ? { opacity: 1, y: 0 } : { opacity: 0.35, y: 10 }} className="relative mt-4 flex flex-col items-center gap-4">
        {cfg.finaleTag && <p className="text-sm uppercase tracking-[0.4em] opacity-70">{cfg.finaleTag}</p>}
        <h2 className={`max-w-4xl font-bold leading-tight ${cfg.headingSize}`} style={headingStyle(variant, theme)}>
          {occasionTitle(page)}, {page.recipient.nickname || page.recipient.name}!
        </h2>
        <p className="text-lg opacity-70">{t(page, "finale.love")}</p>
        <p className="text-3xl font-semibold italic sm:text-4xl" style={{ color: cfg.light ? theme.text : theme.secondary }}>{page.from} ❤</p>
      </motion.div>

      <div className="relative mt-6 flex flex-wrap justify-center gap-3">
        <button onClick={celebrate} className="rounded-full px-7 py-3.5 font-semibold shadow-xl transition hover:brightness-110 active:scale-95" style={{ background: theme.accent, color: cfg.onAccent(theme) }}>
          🎊 {celebrated ? "Again!" : "Celebrate"}
        </button>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="rounded-full border px-7 py-3.5 transition hover:opacity-80" style={{ borderColor: theme.secondary }}>
          ↺ {t(page, "finale.replay")}
        </button>
        {mode === "live" && (
          <button onClick={share} className="rounded-full border px-7 py-3.5 transition hover:opacity-80" style={{ borderColor: theme.secondary }}>
            📤 {t(page, "finale.share")}
          </button>
        )}
      </div>
    </section>
  );
}
