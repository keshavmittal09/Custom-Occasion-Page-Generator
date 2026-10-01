"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { MediaItem } from "@/lib/schema";
import { SectionProps, cfgOf, headingStyle, sectionTitle, t } from "./types";
import { WinBar } from "./Chrome";

// Auto-plays muted when in view (lazy: nothing loads until then); tap to unmute
function Clip({ v, page, theme, variant }: { v: MediaItem } & SectionProps) {
  const cfg = cfgOf(variant);
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoaded(true);
          el.play().catch(() => {});
        } else el.pause();
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const src = v.url.includes("res.cloudinary.com") ? v.url.replace("/upload/", "/upload/q_auto/") : v.url;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative overflow-hidden" style={{ ...cfg.frame(theme), borderRadius: cfg.chrome ? 0 : 28, boxShadow: `0 0 60px ${theme.accent}55` }}>
      {cfg.chrome === "win98" && <WinBar title="Media Player" icon="📼" />}
      <video ref={ref} src={loaded ? src : undefined} muted={muted} loop playsInline preload="none" className="w-full" style={{ aspectRatio: `${v.w} / ${v.h}`, maxHeight: "80vh", background: "#000" }} />
      <button onClick={() => setMuted((m) => !m)} className="absolute bottom-4 right-4 rounded-full bg-black/60 px-4 py-2 text-sm text-white backdrop-blur" style={{ textTransform: "none" }}>
        {muted ? `🔇 ${t(page, "video.unmute")}` : "🔊"}
      </button>
    </motion.div>
  );
}

export default function Video(props: SectionProps) {
  const { page, theme, variant } = props;
  const videos = page.media?.videos ?? [];
  if (!videos.length) return null;
  return (
    <section className="mx-auto max-w-4xl px-4 py-24">
      <h2 className={`mb-12 text-center ${cfgOf(variant).headingSize}`} style={headingStyle(variant, theme)}>{sectionTitle(page, variant, "video")}</h2>
      <div className="space-y-10">
        {videos.map((v) => (
          <Clip key={v.id} v={v} {...props} />
        ))}
      </div>
    </section>
  );
}
