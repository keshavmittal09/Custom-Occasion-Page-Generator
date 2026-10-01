"use client";
import { useMemo } from "react";
import type { TemplateProps } from "@/templates/registry";
import { displayStack, type SectionProps } from "@/sections/types";
import Shell from "@/templates/Shell";

// Pixel Quest — CRT scanlines, square pixel stars, floating hearts and a HUD
function Decor({ page, theme, mode }: SectionProps) {
  const stars = useMemo(() => Array.from({ length: 36 }, () => ({ x: Math.random() * 100, y: Math.random() * 100, s: Math.random() > 0.7 ? 4 : 2, d: 1.5 + Math.random() * 2, delay: Math.random() * 2, c: ["#ffec27", "#29adff", "#ff77a8", "#ffffff"][Math.floor(Math.random() * 4)] })), []);
  const hearts = useMemo(() => Array.from({ length: 6 }, (_, i) => ({ x: 6 + i * 16, y: 20 + Math.random() * 60, d: 3 + Math.random() * 2 })), []);
  const score = String((page.recipient.age ?? 1) * 1000).padStart(6, "0");
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {stars.map((s, i) => (
        <span key={i} className="anim-twinkle absolute" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, background: s.c, ["--d" as string]: `${s.d}s`, ["--delay" as string]: `${s.delay}s` }} />
      ))}
      {hearts.map((h, i) => (
        <span key={i} className="anim-bob absolute text-xl opacity-60" style={{ left: `${h.x}%`, top: `${h.y}%`, color: theme.accent, fontFamily: displayStack(theme), ["--d" as string]: `${h.d}s` }}>
          ♥
        </span>
      ))}
      {mode !== "pane" && (
        <div className="absolute left-3 top-4 z-20 flex gap-4 text-[10px] text-white sm:text-xs" style={{ fontFamily: displayStack(theme) }}>
          <span>HP <span style={{ color: theme.accent }}>♥♥♥♥♥</span></span>
          <span>SCORE {score}</span>
        </div>
      )}
      <div className="absolute inset-0 opacity-25" style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,.7) 0 2px, transparent 2px 4px)" }} />
    </div>
  );
}

export default function PixelQuest(props: TemplateProps) {
  return <Shell {...props} variant="pixel" background="linear-gradient(180deg,#0f0f23,#1d2b53 70%,#0f0f23)" Decor={Decor} />;
}
