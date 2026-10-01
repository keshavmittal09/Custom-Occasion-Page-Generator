"use client";
import { useMemo } from "react";
import type { TemplateProps } from "@/templates/registry";
import type { SectionProps } from "@/sections/types";
import Shell from "@/templates/Shell";

// Royal Gold — falling gold & rose petals, framed border, gold foil shimmer
function Decor({ theme }: SectionProps) {
  const petals = useMemo(() => Array.from({ length: 16 }, () => ({ x: Math.random() * 100, d: 10 + Math.random() * 10, delay: -Math.random() * 20, s: 6 + Math.random() * 6 })), []);
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {petals.map((p, i) => (
        <span key={i} className="anim-fall absolute top-0 rounded-[60%_0]" style={{ left: `${p.x}%`, width: p.s, height: p.s * 1.4, background: i % 4 === 0 ? "#7F1D1D" : theme.secondary, opacity: 0.6, ["--d" as string]: `${p.d}s`, ["--delay" as string]: `${p.delay}s` }} />
      ))}
      <div className="absolute inset-3 border sm:inset-6" style={{ borderColor: `${theme.secondary}44` }} />
      <div className="anim-holo absolute inset-x-0 top-0 h-1" style={{ backgroundImage: `linear-gradient(90deg, transparent, ${theme.secondary}, #fff3c4, ${theme.secondary}, transparent)` }} />
    </div>
  );
}

export default function RoyalGold(props: TemplateProps) {
  return <Shell {...props} variant="royal" background={`radial-gradient(ellipse at top, #2a2210, ${props.theme.background} 60%)`} Decor={Decor} />;
}
