"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionProps, headingStyle } from "./types";

export default function Gallery({ page, theme, variant }: SectionProps) {
  const images = [...(page.media?.images ?? [])].sort((a, b) => a.order - b.order);
  const [active, setActive] = useState<number | null>(null);
  if (!images.length) return null;

  const frame =
    variant === "pastel"
      ? { background: "#fff", padding: "10px 10px 36px", borderRadius: 6, boxShadow: "0 12px 30px rgba(0,0,0,0.12)" }
      : variant === "royal"
        ? { border: `1px solid ${theme.secondary}`, padding: 6, background: "#0e0e10" }
        : { borderRadius: 18, overflow: "hidden" as const, boxShadow: `0 0 25px ${theme.accent}44`, border: `1px solid ${theme.accent}55` };

  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 text-center text-4xl font-bold sm:text-5xl" style={headingStyle(variant, theme)}>
        {variant === "pastel" ? "📸 Our Polaroids" : variant === "royal" ? "Cherished Moments" : "Memories"}
      </motion.h2>

      <div className="columns-2 gap-4 sm:columns-3">
        {images.map((img, i) => (
          <motion.figure
            key={img.id}
            initial={{ opacity: 0, scale: 0.85, rotate: variant === "pastel" ? (i % 2 ? 4 : -4) : 0 }}
            whileInView={{ opacity: 1, scale: 1, rotate: variant === "pastel" ? (i % 2 ? 2 : -2) : 0 }}
            whileHover={{ scale: 1.04, rotate: 0, zIndex: 10 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
            onClick={() => setActive(i)}
            className="relative mb-4 cursor-zoom-in break-inside-avoid"
            style={frame}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={img.caption || ""} loading="lazy" className="w-full object-cover" />
            {img.caption && (
              <figcaption
                className={variant === "pastel" ? "absolute bottom-2 left-0 right-0 text-center text-sm text-gray-700" : "mt-2 px-2 pb-2 text-center text-sm opacity-80"}
              >
                {img.caption}
              </figcaption>
            )}
          </motion.figure>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActive(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img key={active} initial={{ scale: 0.8 }} animate={{ scale: 1 }} src={images[active].url} alt="" className="max-h-[85vh] max-w-full rounded-lg object-contain" />
            <button onClick={(e) => { e.stopPropagation(); setActive((active - 1 + images.length) % images.length); }} className="absolute left-4 text-4xl text-white/70 hover:text-white">‹</button>
            <button onClick={(e) => { e.stopPropagation(); setActive((active + 1) % images.length); }} className="absolute right-4 text-4xl text-white/70 hover:text-white">›</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
