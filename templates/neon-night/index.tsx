"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { TemplateProps } from "@/templates/registry";
import { fontStack } from "@/sections/types";
import Intro from "@/sections/Intro";
import Hero from "@/sections/Hero";
import Message from "@/sections/Message";
import Gallery from "@/sections/Gallery";
import Timeline from "@/sections/Timeline";
import WishesWall from "@/sections/WishesWall";
import Finale from "@/sections/Finale";
import ShareKit from "@/components/ui/ShareKit";

// Neon Night — dark sky, twinkling stars, glowing accents
function Stars({ color }: { color: string }) {
  const stars = useMemo(
    () => Array.from({ length: 60 }, () => ({ x: Math.random() * 100, y: Math.random() * 100, s: Math.random() * 2 + 1, d: Math.random() * 3 + 2 })),
    []
  );
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {stars.map((st, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white"
          style={{ left: `${st.x}%`, top: `${st.y}%`, width: st.s, height: st.s }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ repeat: Infinity, duration: st.d, delay: i * 0.05 }}
        />
      ))}
      <div className="absolute -left-40 top-1/4 h-96 w-96 rounded-full blur-[120px]" style={{ background: `${color}40` }} />
      <div className="absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-cyan-400/20 blur-[120px]" />
    </div>
  );
}

export default function NeonNight({ page, theme }: TemplateProps) {
  const props = { page, theme, variant: "neon" as const };
  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: theme.background, color: theme.text, fontFamily: fontStack(theme) }}>
      <Stars color={theme.accent} />
      <Intro {...props} />
      <main className="relative">
        <Hero {...props} />
        <Message {...props} />
        <Gallery {...props} />
        <Timeline {...props} />
        <WishesWall {...props} />
        <Finale {...props} />
        {page.slug && (
          <footer className="pb-16">
            <ShareKit url={`${window.location.origin}/w/${page.slug}`} />
          </footer>
        )}
      </main>
    </div>
  );
}
