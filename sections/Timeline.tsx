"use client";
import { motion } from "framer-motion";
import { SectionProps, cardStyle, headingStyle } from "./types";

export default function Timeline({ page, theme, variant }: SectionProps) {
  const memories = page.memories ?? [];
  if (!memories.length) return null;
  const images = page.media?.images ?? [];
  const textColor = variant === "pastel" ? "#1A1A2E" : theme.text;

  return (
    <section className="mx-auto max-w-4xl px-6 py-24">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 text-center">
        <h2 className="text-4xl font-bold tracking-tight sm:text-6xl" style={headingStyle(variant, theme)}>
          {variant === "royal" ? "Our Journey" : "Memory Lane"}
        </h2>
        <p className="mt-3 text-sm uppercase tracking-[0.3em] opacity-50">{memories.length} chapters of us</p>
      </motion.div>

      <div className="relative">
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className="absolute bottom-0 left-5 top-0 w-0.5 origin-top sm:left-1/2 sm:-translate-x-1/2"
          style={{ background: `linear-gradient(${theme.accent}, ${theme.secondary})` }}
        />
        {memories.map((m, i) => {
          const img = images.find((x) => x.id === m.mediaId);
          const right = i % 2 === 1;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: right ? 60 : -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={`relative mb-14 pl-14 sm:w-1/2 sm:pl-0 ${right ? "sm:ml-auto sm:pl-12" : "sm:pr-12"}`}
            >
              <span
                className={`absolute left-0 top-4 grid h-10 w-10 place-items-center rounded-full text-sm font-bold ${right ? "sm:-left-5" : "sm:left-auto sm:-right-5"}`}
                style={{ background: theme.accent, color: variant === "pastel" ? "#1A1A2E" : "#fff", boxShadow: `0 0 0 6px ${variant === "pastel" ? "#fff" : theme.background}, 0 0 24px ${theme.accent}` }}
              >
                {i + 1}
              </span>
              <div className="group overflow-hidden" style={{ ...cardStyle(variant, theme), color: textColor }}>
                {img && (
                  <div className="overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt="" className="h-48 w-full object-cover transition duration-700 group-hover:scale-105" />
                  </div>
                )}
                <div className="p-6">
                  {m.date && (
                    <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest" style={{ background: `${theme.accent}22`, color: variant === "pastel" ? "#be185d" : theme.accent }}>
                      {new Date(m.date).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
                    </span>
                  )}
                  <h3 className="mt-3 text-2xl font-bold">{m.title}</h3>
                  {m.description && <p className="mt-2 leading-relaxed opacity-75">{m.description}</p>}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
