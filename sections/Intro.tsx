"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { SectionProps, t, headingStyle } from "./types";

// Tap-to-open gate: unlocks audio autoplay + fires the first confetti burst
export default function Intro({ page, theme, variant }: SectionProps) {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);

  const begin = () => {
    setOpen(true);
    confetti({ particleCount: 160, spread: 100, origin: { y: 0.6 }, colors: [theme.accent, theme.secondary, "#ffffff"] });
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

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.div
            key="intro"
            exit={{ opacity: 0, scale: 1.2, filter: "blur(12px)" }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 px-6 text-center"
            style={{ background: theme.background }}
          >
            <motion.div animate={{ y: [0, -18, 0], rotate: [0, -6, 6, 0] }} transition={{ repeat: Infinity, duration: 2.2 }} className="text-8xl">
              {gift}
            </motion.div>
            <p className="text-lg opacity-70">Something special for</p>
            <h1 className="text-5xl font-bold sm:text-6xl" style={headingStyle(variant, theme)}>
              {page.recipient.nickname || page.recipient.name}
            </h1>
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              animate={{ boxShadow: [`0 0 0px ${theme.accent}`, `0 0 30px ${theme.accent}`, `0 0 0px ${theme.accent}`] }}
              transition={{ repeat: Infinity, duration: 2 }}
              onClick={begin}
              className="mt-4 rounded-full px-8 py-4 text-lg font-semibold"
              style={{ background: theme.accent, color: variant === "pastel" ? "#1A1A2E" : "#fff" }}
            >
              {t(page, "cta.begin")} ✨
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {open && page.theme.music && (
        <button
          onClick={toggle}
          aria-label={playing ? "Pause music" : "Play music"}
          className="fixed bottom-5 right-5 z-30 flex h-12 w-12 items-center justify-center rounded-full text-xl shadow-xl"
          style={{ background: theme.accent, color: "#fff" }}
        >
          {playing ? "🔊" : "🔇"}
        </button>
      )}
    </>
  );
}
