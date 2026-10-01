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
import ScrollProgress from "@/sections/ScrollProgress";
import Divider from "@/sections/Divider";

// Royal Gold — black velvet, falling gold petals, framed borders
function Petals({ gold }: { gold: string }) {
  const petals = useMemo(
    () => Array.from({ length: 18 }, () => ({ x: Math.random() * 100, d: 10 + Math.random() * 10, delay: Math.random() * 10, r: Math.random() * 360 })),
    []
  );
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {petals.map((p, i) => (
        <motion.span
          key={i}
          className="absolute h-3 w-2 rounded-full"
          style={{ left: `${p.x}%`, top: -20, background: gold, opacity: 0.6 }}
          animate={{ y: [0, 1200], rotate: [p.r, p.r + 360], x: [0, 40, -20] }}
          transition={{ repeat: Infinity, duration: p.d, delay: p.delay, ease: "linear" }}
        />
      ))}
      <div className="absolute inset-3 border sm:inset-6" style={{ borderColor: `${gold}44` }} />
    </div>
  );
}

export default function RoyalGold({ page, theme }: TemplateProps) {
  const props = { page, theme, variant: "royal" as const };
  const DIVIDER = theme.secondary;
  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: `radial-gradient(ellipse at top, #2a2210, ${theme.background} 60%)`, color: theme.text, fontFamily: fontStack(theme) }}
    >
      <ScrollProgress color={theme.secondary} color2="#fff3c4" />
      <Petals gold={theme.secondary} />
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
