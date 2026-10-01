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
import Sparkles from "@/sections/Sparkles";
import ScrollProgress from "@/sections/ScrollProgress";
import Divider from "@/sections/Divider";

// Pastel Dream — soft gradients with balloons floating up the page
const BALLOON_COLORS = ["#FBCFE8", "#C4B5FD", "#A5F3FC", "#FDE68A", "#FECACA"];

function Balloons() {
  const balloons = useMemo(
    () => Array.from({ length: 12 }, (_, i) => ({ x: Math.random() * 95, d: 12 + Math.random() * 10, delay: Math.random() * 10, c: BALLOON_COLORS[i % BALLOON_COLORS.length], s: 30 + Math.random() * 30 })),
    []
  );
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {balloons.map((b, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${b.x}%`, bottom: -120 }}
          animate={{ y: [0, -1400], x: [0, 20, -20, 0] }}
          transition={{ repeat: Infinity, duration: b.d, delay: b.delay, ease: "linear" }}
        >
          <div style={{ width: b.s, height: b.s * 1.2, background: b.c, borderRadius: "50% 50% 50% 50% / 45% 45% 55% 55%", opacity: 0.8 }} />
          <div className="mx-auto h-10 w-px bg-gray-400/50" />
        </motion.div>
      ))}
    </div>
  );
}

export default function PastelDream({ page, theme }: TemplateProps) {
  const props = { page, theme, variant: "pastel" as const };
  const DIVIDER = "#F9A8D4";
  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: `linear-gradient(180deg, ${theme.background}, #F5F3FF 50%, #FDF2F8)`, color: theme.text, fontFamily: fontStack(theme) }}
    >
      <ScrollProgress color="#F472B6" color2="#A78BFA" />
      <Balloons />
      <Sparkles />
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
            <ShareKit url={`${window.location.origin}/w/${page.slug}`} dark={false} />
          </footer>
        )}
      </main>
    </div>
  );
}
