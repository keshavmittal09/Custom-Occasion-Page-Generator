"use client";
import { useEffect, useMemo, useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { SectionProps, cfgOf, headingStyle, occasionTitle, optimized, t, useMode } from "./types";
import { OCCASION_ICONS } from "./occasion";

// Full-screen hero: background glow (0.2x), occasion icons (0.5x) and the name (1x) scroll at
// different speeds; the name tilts with the mouse (desktop) or gyroscope (phones).
export default function Hero({ page, theme, variant }: SectionProps) {
  const cfg = cfgOf(variant);
  const mode = useMode();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const midY = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const frontY = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const rotX = useSpring(useTransform(ty, [-1, 1], [8, -8]), { stiffness: 80, damping: 14 });
  const rotY = useSpring(useTransform(tx, [-1, 1], [-10, 10]), { stiffness: 80, damping: 14 });

  useEffect(() => {
    if (mode === "pane" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: PointerEvent) => {
      tx.set((e.clientX / window.innerWidth) * 2 - 1);
      ty.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      tx.set(Math.max(-1, Math.min(1, e.gamma / 30)));
      ty.set(Math.max(-1, Math.min(1, (e.beta - 45) / 30)));
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("deviceorientation", onTilt);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("deviceorientation", onTilt);
    };
  }, [mode, tx, ty]);

  const icons = useMemo(() => {
    const set = OCCASION_ICONS[page.occasion] ?? OCCASION_ICONS.CUSTOM;
    return set.map((ch, i) => ({ ch, x: [8, 82, 18, 72, 40, 90][i], y: [18, 14, 70, 66, 86, 44][i], s: [42, 34, 30, 44, 26, 30][i], d: 5 + i }));
  }, [page.occasion]);

  const cover = page.media?.images?.[0];
  const title = cfg.kicker?.(page, occasionTitle(page)) ?? occasionTitle(page);
  const words = page.recipient.name.split(/\s+/).filter(Boolean);
  const chip = { borderColor: `${theme.secondary}66`, background: cfg.light ? "#ffffffaa" : "rgba(255,255,255,0.06)", color: cfg.light ? cfg.cardInk(theme) : theme.text };
  let charIndex = 0;

  const photo = cover && (() => {
    const img = <img src={optimized(cover.url, 800)} alt={page.recipient.name} className="h-full w-full object-cover" />;
    if (cfg.heroShape === "letterbox")
      return (
        <div className="relative w-[min(88vw,640px)] overflow-hidden" style={{ aspectRatio: "2.39 / 1", boxShadow: "0 30px 60px -20px #000" }}>
          <div className="h-full w-full grayscale contrast-125">{img}</div>
        </div>
      );
    if (cfg.heroShape === "polaroid")
      return (
        <div className="relative rotate-[-4deg] bg-white p-3 pb-12 shadow-2xl">
          {cfg.tape && <span className="absolute -top-3 left-1/2 h-7 w-24 -translate-x-1/2 rotate-[3deg]" style={{ background: cfg.tape }} />}
          <div className="h-48 w-44 overflow-hidden sm:h-60 sm:w-56">{img}</div>
          <span className="absolute bottom-3 left-0 right-0 text-center text-lg text-neutral-700" style={{ fontFamily: theme.font }}>{page.recipient.nickname || page.recipient.name} ♡</span>
        </div>
      );
    if (cfg.heroShape === "square")
      return <div className="h-44 w-44 overflow-hidden sm:h-56 sm:w-56" style={cfg.frame(theme)}>{img}</div>;
    const round = cfg.heroShape === "arch" ? "rounded-t-full" : "rounded-full";
    return (
      <div className="relative">
        <motion.div className={`absolute -inset-2 ${round}`} style={{ background: `conic-gradient(from 0deg, ${theme.accent}, ${theme.secondary}, ${theme.accent})` }} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} />
        <div className={`relative h-44 w-44 overflow-hidden sm:h-56 sm:w-56 ${round}`} style={{ border: `5px solid ${cfg.light ? "#fff" : theme.background}`, boxShadow: `0 0 60px ${theme.accent}66` }}>
          {img}
        </div>
      </div>
    );
  })();

  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 py-24 text-center">
      {/* back layer */}
      <motion.div style={{ y: bgY }} className="pointer-events-none absolute inset-0 will-change-transform" aria-hidden>
        <div className="absolute left-1/2 top-1/3 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px]" style={{ background: `${theme.accent}33` }} />
        <div className="absolute bottom-10 right-10 h-[30vmin] w-[30vmin] rounded-full blur-[80px]" style={{ background: `${theme.secondary}33` }} />
      </motion.div>
      {/* mid layer — occasion-aware decoration */}
      <motion.div style={{ y: midY }} className="pointer-events-none absolute inset-0 will-change-transform" aria-hidden>
        {icons.map((ic, i) => (
          <motion.span key={i} className="absolute select-none" style={{ left: `${ic.x}%`, top: `${ic.y}%`, fontSize: ic.s }} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.85, scale: 1, y: [0, -14, 0] }} transition={{ opacity: { delay: 1 + i * 0.12 }, scale: { delay: 1 + i * 0.12, type: "spring" }, y: { repeat: Infinity, duration: ic.d, ease: "easeInOut" } }}>
            {ic.ch}
          </motion.span>
        ))}
      </motion.div>

      {/* front layer */}
      <motion.div style={{ y: frontY, opacity: fade, rotateX: rotX, rotateY: rotY, transformPerspective: 900 }} className="relative flex max-w-full flex-col items-center gap-7 will-change-transform">
        {photo && (
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}>
            {photo}
          </motion.div>
        )}

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="max-w-[90vw] text-sm font-semibold uppercase tracking-[0.35em] sm:text-base" style={{ color: theme.secondary }}>
          {title}
        </motion.p>

        <h1 className={`max-w-[92vw] break-words font-bold leading-[1.05] tracking-tight ${cfg.heroSize}`} style={headingStyle(variant, theme)}>
          {words.map((word, w) => (
            <span key={w} className="inline-block whitespace-nowrap">
              {word.split("").map((ch) => {
                const i = charIndex++;
                return (
                  <motion.span key={i} initial={{ opacity: 0, y: 50, rotateX: -90 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: 0.8 + i * 0.06, duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="inline-block">
                    {ch}
                  </motion.span>
                );
              })}
              {w < words.length - 1 && " "}
            </span>
          ))}
        </h1>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }} className="flex flex-wrap items-center justify-center gap-2.5 text-sm">
          {page.occasion === "BIRTHDAY" && page.recipient.age ? (
            <span className="rounded-full px-4 py-1.5 font-semibold shadow-lg" style={{ background: theme.accent, color: cfg.onAccent(theme) }}>
              🎂 {page.recipient.age}
            </span>
          ) : null}
          {page.recipient.relation && <span className="rounded-full border px-4 py-1.5 backdrop-blur" style={chip}>💝 {page.recipient.relation}</span>}
          {page.occasionDate && (
            <span className="rounded-full border px-4 py-1.5 backdrop-blur" style={chip}>
              📅 {new Date(page.occasionDate).toLocaleDateString(undefined, { day: "numeric", month: "long" })}
            </span>
          )}
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 2 }} className="absolute bottom-6 flex flex-col items-center gap-2 text-xs uppercase tracking-widest">
        <span>{t(page, "scroll")}</span>
        <span className="flex h-9 w-5 justify-center rounded-full border-2 pt-1.5" style={{ borderColor: theme.text }}>
          <motion.span className="h-2 w-1 rounded-full" style={{ background: theme.text }} animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1.6 }} />
        </span>
      </motion.div>
    </section>
  );
}
