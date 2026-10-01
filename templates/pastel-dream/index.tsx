"use client";
import { useMemo } from "react";
import type { TemplateProps } from "@/templates/registry";
import Shell from "@/templates/Shell";

const BALLOON_COLORS = ["#FBCFE8", "#C4B5FD", "#A5F3FC", "#FDE68A", "#FECACA"];

// Pastel Dream — balloons drifting up, twinkling sparkles
function Decor() {
  const balloons = useMemo(() => Array.from({ length: 10 }, (_, i) => ({ x: Math.random() * 95, d: 14 + Math.random() * 10, delay: -Math.random() * 20, c: BALLOON_COLORS[i % BALLOON_COLORS.length], s: 30 + Math.random() * 28 })), []);
  const sparkles = useMemo(() => Array.from({ length: 12 }, (_, i) => ({ ch: ["✨", "💖", "⭐", "🌸"][i % 4], x: Math.random() * 100, y: Math.random() * 100, d: 3 + Math.random() * 3, delay: Math.random() * 4 })), []);
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {balloons.map((b, i) => (
        <div key={i} className="anim-rise absolute bottom-0" style={{ left: `${b.x}%`, ["--d" as string]: `${b.d}s`, ["--delay" as string]: `${b.delay}s` }}>
          <div style={{ width: b.s, height: b.s * 1.2, background: b.c, borderRadius: "50% 50% 50% 50% / 45% 45% 55% 55%", opacity: 0.8 }} />
          <div className="mx-auto h-10 w-px bg-gray-400/50" />
        </div>
      ))}
      {sparkles.map((s, i) => (
        <span key={i} className="anim-twinkle absolute text-lg" style={{ left: `${s.x}%`, top: `${s.y}%`, ["--d" as string]: `${s.d}s`, ["--delay" as string]: `${s.delay}s` }}>
          {s.ch}
        </span>
      ))}
    </div>
  );
}

export default function PastelDream(props: TemplateProps) {
  return <Shell {...props} variant="pastel" background={`linear-gradient(180deg, ${props.theme.background}, #F5F3FF 50%, #FDF2F8)`} Decor={Decor} />;
}
