"use client";
import { motion } from "framer-motion";
import { SectionProps, cardStyle, headingStyle } from "./types";

export default function Message({ page, theme, variant }: SectionProps) {
  if (!page.messages?.length) return null;

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 text-center text-4xl font-bold sm:text-5xl" style={headingStyle(variant, theme)}>
        {variant === "pastel" ? "💌 A little note" : variant === "royal" ? "A Few Words" : "From the heart"}
      </motion.h2>
      <div className="space-y-8">
        {page.messages.map((msg, i) => (
          <motion.blockquote
            key={i}
            initial={{ opacity: 0, x: i % 2 ? 60 : -60, rotate: variant === "pastel" ? (i % 2 ? 2 : -2) : 0 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative p-8 text-xl leading-relaxed sm:text-2xl"
            style={{ ...cardStyle(variant, theme), color: variant === "pastel" ? "#1A1A2E" : theme.text }}
          >
            <span className="absolute -top-6 left-4 text-7xl leading-none" style={{ color: theme.accent, opacity: 0.6 }}>
              “
            </span>
            <p className="whitespace-pre-line">{msg}</p>
          </motion.blockquote>
        ))}
      </div>
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10 text-right text-lg italic opacity-80">
        — {page.from}
      </motion.p>
    </section>
  );
}
