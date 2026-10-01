"use client";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { SectionProps, headingStyle, occasionTitle, t } from "./types";

export default function Finale({ page, theme, variant }: SectionProps) {
  const celebrate = () => {
    const end = Date.now() + 1500;
    const colors = [theme.accent, theme.secondary, "#ffffff"];
    (function frame() {
      confetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0 }, colors });
      confetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center gap-6 px-6 py-20 text-center">
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        onViewportEnter={celebrate}
        transition={{ type: "spring", stiffness: 120 }}
        className="text-7xl"
      >
        {variant === "royal" ? "🥂" : variant === "pastel" ? "🧁" : "🎉"}
      </motion.div>
      <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl font-bold sm:text-6xl" style={headingStyle(variant, theme)}>
        {occasionTitle(page)}, {page.recipient.nickname || page.recipient.name}!
      </motion.h2>
      <p className="max-w-md text-lg opacity-80">With all the love,</p>
      <p className="text-3xl font-semibold" style={{ color: theme.secondary }}>{page.from}</p>
      <div className="mt-6 flex gap-3">
        <button onClick={celebrate} className="rounded-full px-6 py-3 font-semibold" style={{ background: theme.accent, color: variant === "pastel" ? "#1A1A2E" : "#fff" }}>
          🎊 Celebrate again
        </button>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="rounded-full border px-6 py-3" style={{ borderColor: theme.secondary }}>
          ↺ {t(page, "finale.replay")}
        </button>
      </div>
    </section>
  );
}
