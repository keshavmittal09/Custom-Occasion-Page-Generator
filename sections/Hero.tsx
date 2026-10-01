"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionProps, headingStyle, occasionTitle } from "./types";

export default function Hero({ page, theme, variant }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const cover = page.media?.images?.[0];
  const title = occasionTitle(page);
  const chip = { borderColor: `${theme.secondary}66`, background: variant === "pastel" ? "#ffffffaa" : "rgba(255,255,255,0.04)" };

  return (
    <section ref={ref} className="relative flex min-h-screen flex-col items-center justify-center gap-7 px-6 py-24 text-center">
      <motion.div style={{ y, opacity: fade }} className="flex flex-col items-center gap-7">
        {cover && (
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} className="relative">
            {/* rotating gradient ring */}
            <motion.div
              className={`absolute -inset-2 ${variant === "royal" ? "rounded-t-full" : "rounded-full"}`}
              style={{ background: `conic-gradient(from 0deg, ${theme.accent}, ${theme.secondary}, ${theme.accent})` }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            />
            <div
              className={`relative h-44 w-44 overflow-hidden sm:h-56 sm:w-56 ${variant === "royal" ? "rounded-t-full" : "rounded-full"}`}
              style={{ border: `5px solid ${variant === "pastel" ? "#fff" : theme.background}`, boxShadow: `0 0 60px ${theme.accent}66` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cover.url} alt={page.recipient.name} className="h-full w-full object-cover" />
            </div>
          </motion.div>
        )}

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-sm font-semibold uppercase tracking-[0.4em] sm:text-base" style={{ color: theme.secondary }}>
          {title}
        </motion.p>

        <h1 className="text-6xl font-bold leading-[1.05] tracking-tight sm:text-8xl md:text-9xl" style={headingStyle(variant, theme)}>
          {page.recipient.name.split("").map((ch, i) => (
            <motion.span key={i} initial={{ opacity: 0, y: 50, rotateX: -90 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: 0.8 + i * 0.06, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="inline-block">
              {ch === " " ? " " : ch}
            </motion.span>
          ))}
        </h1>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }} className="flex flex-wrap items-center justify-center gap-2.5 text-sm">
          {page.occasion === "BIRTHDAY" && page.recipient.age ? (
            <span className="rounded-full px-4 py-1.5 font-semibold shadow-lg" style={{ background: theme.accent, color: variant === "pastel" ? "#1A1A2E" : "#fff" }}>
              🎂 Turning {page.recipient.age}
            </span>
          ) : null}
          <span className="rounded-full border px-4 py-1.5 backdrop-blur" style={chip}>💝 {page.recipient.relation}</span>
          {page.occasionDate && (
            <span className="rounded-full border px-4 py-1.5 backdrop-blur" style={chip}>
              📅 {new Date(page.occasionDate).toLocaleDateString(undefined, { day: "numeric", month: "long" })}
            </span>
          )}
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 2 }} className="absolute bottom-8 flex flex-col items-center gap-2 text-xs uppercase tracking-widest">
        <span>Scroll</span>
        <span className="flex h-9 w-5 justify-center rounded-full border-2 pt-1.5" style={{ borderColor: theme.text }}>
          <motion.span className="h-2 w-1 rounded-full" style={{ background: theme.text }} animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1.6 }} />
        </span>
      </motion.div>
    </section>
  );
}
