"use client";
import { motion } from "framer-motion";
import { SectionProps, headingStyle, occasionTitle } from "./types";

export default function Hero({ page, theme, variant }: SectionProps) {
  const cover = page.media?.images?.[0];
  const title = occasionTitle(page);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center gap-6 px-6 py-20 text-center">
      {cover && (
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className={`h-40 w-40 overflow-hidden sm:h-52 sm:w-52 ${variant === "royal" ? "rounded-t-full" : "rounded-full"}`}
          style={{ border: `4px solid ${theme.accent}`, boxShadow: `0 0 50px ${theme.accent}66` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cover.url} alt={page.recipient.name} className="h-full w-full object-cover" />
        </motion.div>
      )}

      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-xl uppercase tracking-[0.3em] opacity-80" style={{ color: theme.secondary }}>
        {title}
      </motion.p>

      <h1 className="text-6xl font-bold leading-tight sm:text-8xl" style={headingStyle(variant, theme)}>
        {page.recipient.name.split("").map((ch, i) => (
          <motion.span key={i} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i * 0.07, ease: [0.16, 1, 0.3, 1] }} className="inline-block">
            {ch === " " ? " " : ch}
          </motion.span>
        ))}
      </h1>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="flex flex-wrap items-center justify-center gap-3 text-sm">
        {page.occasion === "BIRTHDAY" && page.recipient.age ? (
          <span className="rounded-full px-4 py-1.5 font-semibold" style={{ background: theme.accent, color: "#fff" }}>
            🎂 {page.recipient.age}
          </span>
        ) : null}
        <span className="rounded-full border px-4 py-1.5 opacity-80" style={{ borderColor: `${theme.secondary}88` }}>
          {page.recipient.relation}
        </span>
        {page.occasionDate && (
          <span className="rounded-full border px-4 py-1.5 opacity-80" style={{ borderColor: `${theme.secondary}88` }}>
            📅 {new Date(page.occasionDate).toLocaleDateString(undefined, { day: "numeric", month: "long" })}
          </span>
        )}
      </motion.div>

      <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.8 }} className="absolute bottom-8 text-2xl opacity-60">
        ↓
      </motion.div>
    </section>
  );
}
