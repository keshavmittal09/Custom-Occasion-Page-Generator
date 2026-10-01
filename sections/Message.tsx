"use client";
import { motion } from "framer-motion";
import { SectionProps, cardStyle, headingStyle } from "./types";

// Word-by-word reveal as each message card scrolls into view
function RevealText({ text }: { text: string }) {
  const words = text.split(/(\s+)/);
  return (
    <motion.p
      className="whitespace-pre-line"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ show: { transition: { staggerChildren: 0.035 } } }}
    >
      {words.map((w, i) =>
        /^\s+$/.test(w) ? (
          w
        ) : (
          <motion.span key={i} className="inline-block" variants={{ hidden: { opacity: 0, y: 12, filter: "blur(6px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)" } }}>
            {w}
          </motion.span>
        )
      )}
    </motion.p>
  );
}

export default function Message({ page, theme, variant }: SectionProps) {
  if (!page.messages?.length) return null;

  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14 text-center">
        <h2 className="text-4xl font-bold tracking-tight sm:text-6xl" style={headingStyle(variant, theme)}>
          {variant === "pastel" ? "💌 A little note" : variant === "royal" ? "A Few Words" : "From the heart"}
        </h2>
        <p className="mt-3 text-sm uppercase tracking-[0.3em] opacity-50">for {page.recipient.nickname || page.recipient.name}</p>
      </motion.div>

      <div className="space-y-10">
        {page.messages.map((msg, i) => (
          <motion.blockquote
            key={i}
            initial={{ opacity: 0, y: 40, rotate: variant === "pastel" ? (i % 2 ? 1.5 : -1.5) : 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`relative p-8 text-xl leading-relaxed sm:p-10 sm:text-2xl ${i % 2 ? "sm:ml-12" : "sm:mr-12"}`}
            style={{ ...cardStyle(variant, theme), color: variant === "pastel" ? "#1A1A2E" : theme.text }}
          >
            <span className="absolute -top-7 left-5 font-serif text-8xl leading-none" style={{ color: theme.accent, opacity: 0.7 }} aria-hidden>
              “
            </span>
            <RevealText text={msg} />
          </motion.blockquote>
        ))}
      </div>

      <motion.p initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="mt-12 text-right text-xl italic" style={{ color: theme.secondary }}>
        with love, {page.from}
      </motion.p>
    </section>
  );
}
