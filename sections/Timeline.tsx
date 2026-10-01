"use client";
import { motion } from "framer-motion";
import { SectionProps, cardStyle, headingStyle } from "./types";

export default function Timeline({ page, theme, variant }: SectionProps) {
  const memories = page.memories ?? [];
  if (!memories.length) return null;
  const images = page.media?.images ?? [];

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14 text-center text-4xl font-bold sm:text-5xl" style={headingStyle(variant, theme)}>
        {variant === "royal" ? "Our Journey" : "Memory Lane"}
      </motion.h2>

      <div className="relative">
        <div className="absolute bottom-0 left-4 top-0 w-0.5 sm:left-1/2" style={{ background: `linear-gradient(${theme.accent}, ${theme.secondary})` }} />
        {memories.map((m, i) => {
          const img = images.find((x) => x.id === m.mediaId);
          const right = i % 2 === 1;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7 }}
              className={`relative mb-12 pl-12 sm:w-1/2 sm:pl-0 ${right ? "sm:ml-auto sm:pl-10" : "sm:pr-10"}`}
            >
              <span
                className={`absolute top-3 left-[9px] h-4 w-4 rounded-full ${right ? "sm:-left-2" : "sm:left-auto sm:-right-2"}`}
                style={{ background: theme.accent, boxShadow: `0 0 15px ${theme.accent}` }}
              />
              <div className="overflow-hidden" style={{ ...cardStyle(variant, theme), color: variant === "pastel" ? "#1A1A2E" : theme.text }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {img && <img src={img.url} alt="" className="h-40 w-full object-cover" />}
                <div className="p-5">
                  {m.date && <p className="text-xs uppercase tracking-widest opacity-60">{new Date(m.date).toLocaleDateString(undefined, { month: "short", year: "numeric" })}</p>}
                  <h3 className="mt-1 text-xl font-bold">{m.title}</h3>
                  {m.description && <p className="mt-2 opacity-80">{m.description}</p>}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
