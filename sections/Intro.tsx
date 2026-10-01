"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { SectionProps, t, headingStyle, occasionTitle } from "./types";

// Tap-to-open gate: unlocks audio autoplay + fires the first confetti burst
export default function Intro({ page, theme, variant }: SectionProps) {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);

  // Lock page scroll until the gift is opened
  useEffect(() => {
    document.body.style.overflow = open ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => () => audio.current?.pause(), []);

  const begin = () => {
    setOpen(true);
    const colors = [theme.accent, theme.secondary, "#ffffff"];
    confetti({ particleCount: 140, spread: 100, origin: { y: 0.6 }, colors });
    setTimeout(() => confetti({ particleCount: 80, spread: 140, startVelocity: 25, origin: { y: 0.4 }, colors }), 350);
    if (page.theme.music) {
      audio.current = new Audio(page.theme.music);
      audio.current.loop = true;
      audio.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const toggle = () => {
    if (!audio.current) return;
    if (playing) audio.current.pause();
    else audio.current.play().catch(() => {});
    setPlaying(!playing);
  };

  const gift = variant === "royal" ? "👑" : variant === "pastel" ? "🎀" : "🎁";
  const onAccent = variant === "pastel" ? "#1A1A2E" : "#fff";

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.div
            key="intro"
            exit={{ opacity: 0, scale: 1.15, filter: "blur(16px)" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center overflow-hidden px-6 text-center"
            style={{ background: variant === "pastel" ? "linear-gradient(180deg,#FFF1F5,#F5F3FF)" : theme.background }}
          >
            {/* pulsing rings behind the gift */}
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="absolute rounded-full border"
                style={{ borderColor: `${theme.accent}55`, width: 180, height: 180 }}
                animate={{ scale: [1, 2.6], opacity: [0.6, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: i, ease: "easeOut" }}
              />
            ))}

            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 0.7, y: 0 }} transition={{ delay: 0.2 }} className="mb-6 text-xs uppercase tracking-[0.35em]">
              {occasionTitle(page)}
            </motion.p>

            <motion.button
              onClick={begin}
              aria-label="Open your surprise"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 160, damping: 12 }}
              whileHover={{ scale: 1.1, rotate: -6 }}
              whileTap={{ scale: 0.9 }}
              className="relative text-8xl sm:text-9xl"
              style={{ filter: `drop-shadow(0 0 30px ${theme.accent}88)` }}
            >
              <motion.span className="inline-block" animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}>
                {gift}
              </motion.span>
            </motion.button>

            <p className="mt-8 text-base opacity-60">A little something for</p>
            <h1 className="mt-1 text-5xl font-bold tracking-tight sm:text-7xl" style={headingStyle(variant, theme)}>
              {page.recipient.nickname || page.recipient.name}
            </h1>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ boxShadow: [`0 0 0px ${theme.accent}00`, `0 0 40px ${theme.accent}aa`, `0 0 0px ${theme.accent}00`] }}
              transition={{ repeat: Infinity, duration: 2.4 }}
              onClick={begin}
              className="mt-10 rounded-full px-9 py-4 text-lg font-semibold"
              style={{ background: theme.accent, color: onAccent }}
            >
              {t(page, "cta.begin")} ✨
            </motion.button>
            <p className="mt-5 text-xs opacity-40">From {page.from}{page.theme.music ? " · 🎵 turn your sound on" : ""}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {open && page.theme.music && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={toggle}
          aria-label={playing ? "Pause music" : "Play music"}
          className="fixed bottom-5 right-5 z-30 flex h-12 w-12 items-center justify-center rounded-full text-xl shadow-xl"
          style={{ background: theme.accent, color: onAccent }}
        >
          {playing ? "🔊" : "🔇"}
        </motion.button>
      )}
    </>
  );
}
