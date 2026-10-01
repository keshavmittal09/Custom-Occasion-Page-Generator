"use client";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionProps, headingStyle } from "./types";

export default function Gallery({ page, theme, variant }: SectionProps) {
  const images = [...(page.media?.images ?? [])].sort((a, b) => a.order - b.order);
  const [active, setActive] = useState<number | null>(null);
  const n = images.length;

  const go = useCallback((dir: 1 | -1) => setActive((a) => (a === null ? a : (a + dir + n) % n)), [n]);

  // Keyboard controls for the lightbox
  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, go]);

  if (!n) return null;

  const frame =
    variant === "pastel"
      ? { background: "#fff", padding: "10px 10px 38px", borderRadius: 8, boxShadow: "0 14px 34px rgba(124,58,237,0.15)" }
      : variant === "royal"
        ? { border: `1px solid ${theme.secondary}`, padding: 6, background: "#0e0e10" }
        : { borderRadius: 20, overflow: "hidden" as const, boxShadow: `0 0 25px ${theme.accent}33`, border: `1px solid ${theme.accent}44` };

  return (
    <section className="mx-auto max-w-6xl px-4 py-24">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14 text-center">
        <h2 className="text-4xl font-bold tracking-tight sm:text-6xl" style={headingStyle(variant, theme)}>
          {variant === "pastel" ? "📸 Our Polaroids" : variant === "royal" ? "Cherished Moments" : "Memories"}
        </h2>
        <p className="mt-3 text-sm uppercase tracking-[0.3em] opacity-50">{n} moments · tap to open</p>
      </motion.div>

      <div className="columns-2 gap-4 sm:columns-3 sm:gap-5">
        {images.map((img, i) => (
          <motion.figure
            key={img.id}
            initial={{ opacity: 0, y: 40, rotate: variant === "pastel" ? (i % 2 ? 4 : -4) : 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: variant === "pastel" ? (i % 2 ? 2 : -2) : 0 }}
            whileHover={{ scale: 1.03, rotate: 0, zIndex: 10 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
            onClick={() => setActive(i)}
            className="group relative mb-4 cursor-zoom-in break-inside-avoid sm:mb-5"
            style={frame}
          >
            <div className="relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.caption || ""} loading="lazy" className="w-full object-cover transition duration-700 group-hover:scale-110" />
              {variant !== "pastel" && img.caption && (
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent p-3 pt-10 text-sm font-medium text-white transition duration-300 group-hover:translate-y-0">
                  {img.caption}
                </figcaption>
              )}
            </div>
            {variant === "pastel" && img.caption && <figcaption className="absolute bottom-2.5 left-0 right-0 text-center text-sm font-medium text-gray-600">{img.caption}</figcaption>}
          </motion.figure>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActive(null)} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4 backdrop-blur">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img key={active} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} src={images[active].url} alt="" className="max-h-[80vh] max-w-full rounded-xl object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
            <div className="mt-4 text-center text-white">
              {images[active].caption && <p className="text-lg">{images[active].caption}</p>}
              <p className="text-sm text-white/50">{active + 1} / {n}</p>
            </div>
            <button aria-label="Close" onClick={() => setActive(null)} className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-xl text-white hover:bg-white/20">✕</button>
            <button aria-label="Previous" onClick={(e) => { e.stopPropagation(); go(-1); }} className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-3xl text-white hover:bg-white/20">‹</button>
            <button aria-label="Next" onClick={(e) => { e.stopPropagation(); go(1); }} className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-3xl text-white hover:bg-white/20">›</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
