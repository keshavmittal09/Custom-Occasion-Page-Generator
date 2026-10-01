"use client";
import { motion } from "framer-motion";
import { SectionProps, cardStyle, cfgOf, headingStyle, optimized, sectionTitle } from "./types";
import { WinBar } from "./Chrome";

export default function Timeline({ page, theme, variant }: SectionProps) {
  const cfg = cfgOf(variant);
  const memories = (page.memories ?? []).filter((m) => m.title?.trim());
  if (!memories.length) return null;
  const images = page.media?.images ?? [];

  return (
    <section className="mx-auto max-w-4xl px-5 py-24">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 text-center">
        <h2 className={cfg.headingSize} style={headingStyle(variant, theme)}>{sectionTitle(page, variant, "timeline")}</h2>
      </motion.div>

      <div className="relative">
        <motion.div initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease: "easeOut" }} className="absolute bottom-0 left-5 top-0 w-0.5 origin-top sm:left-1/2 sm:-translate-x-1/2" style={{ background: `linear-gradient(${theme.accent}, ${theme.secondary})` }} />
        {memories.map((m, i) => {
          // Use the photo the creator linked, otherwise borrow one from the gallery
          const img = images.find((x) => x.id === m.mediaId) ?? (images.length > 1 ? images[(i + 1) % images.length] : undefined);
          const right = i % 2 === 1;
          return (
            <motion.div key={i} initial={{ opacity: 0, x: right ? 60 : -60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className={`relative mb-14 pl-14 sm:w-1/2 sm:pl-0 ${right ? "sm:ml-auto sm:pl-12" : "sm:pr-12"}`}>
              <span className={`absolute left-0 top-4 z-10 grid h-10 w-10 place-items-center rounded-full text-sm font-bold ${right ? "sm:-left-5" : "sm:left-auto sm:-right-5"}`} style={{ background: theme.accent, color: cfg.onAccent(theme), boxShadow: `0 0 0 6px ${cfg.light ? "#fff" : theme.background}, 0 0 24px ${theme.accent}` }}>
                {i + 1}
              </span>
              <div className="group overflow-hidden" style={cardStyle(variant, theme)}>
                {cfg.chrome === "win98" && <WinBar title={m.title} icon="📁" />}
                {img && (
                  <div className="overflow-hidden">
                    <img src={optimized(img.url, 700)} alt="" loading="lazy" className={`h-48 w-full object-cover transition duration-700 group-hover:scale-105 ${cfg.filmstrip ? "grayscale" : ""}`} />
                  </div>
                )}
                <div className="p-6">
                  {m.date && (
                    <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest" style={{ background: `${theme.accent}22`, color: cfg.light ? cfg.cardInk(theme) : theme.accent }}>
                      {new Date(m.date).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
                    </span>
                  )}
                  <h3 className="mt-3 text-2xl font-bold">{m.title}</h3>
                  {m.description && <p className="mt-2 leading-relaxed opacity-80">{m.description}</p>}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
