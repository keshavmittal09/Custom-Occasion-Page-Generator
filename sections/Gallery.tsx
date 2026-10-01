"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import type { MediaItem } from "@/lib/schema";
import { SectionProps, cfgOf, headingStyle, optimized, sectionTitle } from "./types";
import { WinBar } from "./Chrome";

// Impact-style meme caption overlay
export function MemeText({ top, bottom, big = false }: { top?: string; bottom?: string; big?: boolean }) {
  if (!top && !bottom) return null;
  const cls = `absolute inset-x-2 text-center uppercase leading-tight text-white ${big ? "text-[clamp(1.5rem,5vw,3rem)]" : "text-[clamp(1rem,4.5vw,1.6rem)]"}`;
  const style = { fontFamily: "'Anton', Impact, sans-serif", WebkitTextStroke: big ? "2px #000" : "1.2px #000", textShadow: "0 2px 0 #000", letterSpacing: "0.02em", textTransform: "uppercase" as const };
  return (
    <>
      {top && <span className={`${cls} top-2`} style={style}>{top}</span>}
      {bottom && <span className={`${cls} bottom-2`} style={style}>{bottom}</span>}
    </>
  );
}

function Photo({ img, i, cfg, theme, onOpen, y }: { img: MediaItem; i: number; cfg: ReturnType<typeof cfgOf>; theme: SectionProps["theme"]; onOpen: () => void; y: MotionValue<number> }) {
  const tilt = cfg.tilt ? (i % 2 ? 2 : -2) : 0;
  const frame = cfg.frame(theme);
  const polaroid = frame.background === "#fff"; // white frame → caption sits on the paper below the photo
  return (
    <motion.div style={{ y }} className="mb-5 break-inside-avoid will-change-transform">
      <motion.figure
        initial={{ opacity: 0, y: 40, rotate: tilt * 2 }}
        whileInView={{ opacity: 1, y: 0, rotate: tilt }}
        whileHover={{ scale: 1.03, rotate: 0, zIndex: 10 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
        onClick={onOpen}
        className="group relative cursor-zoom-in"
        style={frame}
      >
        {cfg.tape && <span className="absolute -top-3 left-1/2 z-10 h-6 w-20" style={{ background: cfg.tape, transform: `translateX(-50%) rotate(${i % 2 ? 4 : -5}deg)` }} />}
        {cfg.badge && <span className="absolute -top-4 left-1/2 z-10 -translate-x-1/2 text-2xl">{cfg.badge}</span>}
        {cfg.chrome === "win98" && <WinBar title={`IMG_${String(i + 1).padStart(4, "0")}.JPG`} icon="🖼️" />}
        {cfg.filmstrip && <Sprockets />}
        <div className="relative overflow-hidden" style={cfg.badge ? { borderRadius: "999px 999px 12px 12px" } : undefined}>
          <img src={optimized(img.url, 900)} alt={img.caption || ""} loading="lazy" decoding="async" className={`w-full object-cover transition duration-700 group-hover:scale-110 ${cfg.filmstrip ? "grayscale group-hover:grayscale-0" : ""}`} style={{ aspectRatio: `${img.w} / ${img.h}` }} />
          <MemeText top={img.memeTop} bottom={img.memeBottom} />
          {!polaroid && img.caption && !img.memeBottom && (
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-10 text-sm font-medium text-white sm:translate-y-full sm:transition sm:duration-300 sm:group-hover:translate-y-0">
              {img.caption}
            </figcaption>
          )}
        </div>
        {cfg.filmstrip && <Sprockets />}
        {polaroid && img.caption && (
          <figcaption className="absolute bottom-2 left-0 right-0 truncate px-2 text-center text-base text-neutral-600" style={{ fontFamily: theme.font }}>{img.caption}</figcaption>
        )}
      </motion.figure>
    </motion.div>
  );
}

function Sprockets() {
  return <div className="h-3 w-full" style={{ background: "repeating-linear-gradient(90deg, transparent 0 6px, #f2efe9 6px 14px, transparent 14px 22px)", opacity: 0.85 }} aria-hidden />;
}

export default function Gallery({ page, theme, variant }: SectionProps) {
  const cfg = cfgOf(variant);
  const images = [...(page.media?.images ?? [])].sort((a, b) => a.order - b.order);
  const [active, setActive] = useState<number | null>(null);
  const n = images.length;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yA = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const yB = useTransform(scrollYProgress, [0, 1], [-15, 15]);

  const go = useCallback((dir: 1 | -1) => setActive((a) => (a === null ? a : (a + dir + n) % n)), [n]);

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

  return (
    <section ref={ref} className="mx-auto max-w-6xl px-4 py-24">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14 text-center">
        <h2 className={cfg.headingSize} style={headingStyle(variant, theme)}>{sectionTitle(page, variant, "gallery")}</h2>
        <p className="mt-3 text-sm uppercase tracking-[0.3em] opacity-50">{n} {n === 1 ? "moment" : "moments"} · tap to open</p>
      </motion.div>

      {n === 1 ? (
        <div className="mx-auto max-w-2xl">
          <Photo img={images[0]} i={0} cfg={cfg} theme={theme} onOpen={() => setActive(0)} y={yB} />
        </div>
      ) : (
        <div className={`gap-5 ${n === 2 ? "grid sm:grid-cols-2" : "columns-2 sm:columns-3"}`}>
          {images.map((img, i) => (
            <Photo key={img.id} img={img} i={i} cfg={cfg} theme={theme} onOpen={() => setActive(i)} y={i % 2 ? yA : yB} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {active !== null && (
          <motion.div data-lenis-prevent initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActive(null)} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4 backdrop-blur" style={{ textTransform: "none" }}>
            <motion.div key={active} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} drag={n > 1 ? "x" : false} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.6} onDragEnd={(_, info) => { if (info.offset.x < -80) go(1); else if (info.offset.x > 80) go(-1); }} className="relative max-h-[80vh] max-w-full touch-pan-y" onClick={(e) => e.stopPropagation()}>
              <img src={optimized(images[active].url, 1600)} alt="" className="max-h-[80vh] max-w-full rounded-xl object-contain shadow-2xl" />
              <MemeText top={images[active].memeTop} bottom={images[active].memeBottom} big />
            </motion.div>
            <div className="mt-4 text-center text-white">
              {images[active].caption && <p className="text-lg">{images[active].caption}</p>}
              <p className="text-sm text-white/50">{active + 1} / {n}{n > 1 ? " · swipe" : ""}</p>
            </div>
            <button aria-label="Close" onClick={() => setActive(null)} className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-xl text-white hover:bg-white/20">✕</button>
            {n > 1 && (
              <>
                <button aria-label="Previous" onClick={(e) => { e.stopPropagation(); go(-1); }} className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-3xl text-white hover:bg-white/20">‹</button>
                <button aria-label="Next" onClick={(e) => { e.stopPropagation(); go(1); }} className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-3xl text-white hover:bg-white/20">›</button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
