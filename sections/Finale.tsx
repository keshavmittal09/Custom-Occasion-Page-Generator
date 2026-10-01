"use client";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { SectionProps, headingStyle, occasionTitle, t } from "./types";

export default function Finale({ page, theme, variant }: SectionProps) {
  const celebrate = () => {
    const end = Date.now() + 1600;
    const colors = [theme.accent, theme.secondary, "#ffffff"];
    (function frame() {
      confetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0 }, colors });
      confetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };
  const onAccent = variant === "pastel" ? "#1A1A2E" : "#fff";

  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center gap-6 overflow-hidden px-6 py-24 text-center">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" style={{ background: `${theme.accent}30` }} />
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        onViewportEnter={celebrate}
        transition={{ type: "spring", stiffness: 120 }}
        className="relative text-8xl"
      >
        <motion.span className="inline-block" animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.4 }}>
          {variant === "royal" ? "🥂" : variant === "pastel" ? "🧁" : "🎉"}
        </motion.span>
      </motion.div>
      <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative max-w-4xl text-5xl font-bold leading-tight tracking-tight sm:text-7xl" style={headingStyle(variant, theme)}>
        {occasionTitle(page)}, {page.recipient.nickname || page.recipient.name}!
      </motion.h2>
      <p className="relative text-lg opacity-70">With all the love in the world,</p>
      <p className="relative text-4xl font-semibold italic" style={{ color: theme.secondary }}>{page.from} ❤</p>
      <div className="relative mt-6 flex flex-wrap justify-center gap-3">
        <button onClick={celebrate} className="rounded-full px-7 py-3.5 font-semibold shadow-xl transition hover:brightness-110 active:scale-95" style={{ background: theme.accent, color: onAccent, boxShadow: `0 10px 40px ${theme.accent}66` }}>
          🎊 Celebrate again
        </button>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="rounded-full border px-7 py-3.5 transition hover:bg-white/10" style={{ borderColor: theme.secondary }}>
          ↺ {t(page, "finale.replay")}
        </button>
      </div>
    </section>
  );
}
