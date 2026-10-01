"use client";
import { useMemo } from "react";
import type { TemplateProps } from "@/templates/registry";
import type { SectionProps } from "@/sections/types";
import Shell from "@/templates/Shell";

// Scrapbook — kraft paper texture, hand-drawn doodles, paper clips and pressed flowers
function Doodle({ kind, color }: { kind: number; color: string }) {
  const p = { stroke: color, strokeWidth: 2.5, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (kind === 0) return <svg width="46" height="42" viewBox="0 0 46 42"><path {...p} d="M23 38 C 5 26, 2 12, 12 6 C 18 2, 23 8, 23 12 C 23 8, 28 2, 34 6 C 44 12, 41 26, 23 38 Z" /></svg>;
  if (kind === 1) return <svg width="44" height="44" viewBox="0 0 44 44"><path {...p} d="M22 3 L27 17 L41 18 L30 27 L34 41 L22 33 L10 41 L14 27 L3 18 L17 17 Z" /></svg>;
  if (kind === 2) return <svg width="50" height="50" viewBox="0 0 50 50"><path {...p} d="M25 25 m0 0 c3 0 5 2 5 5 c0 5 -5 8 -10 8 c-8 0 -12 -7 -12 -13 c0 -10 8 -16 17 -16 c11 0 19 9 19 19" /></svg>;
  return <svg width="60" height="20" viewBox="0 0 60 20"><path {...p} d="M3 10 Q 10 2, 17 10 T 31 10 T 45 10 T 57 10" /></svg>;
}

function Decor({ theme }: SectionProps) {
  const items = useMemo(() => Array.from({ length: 12 }, (_, i) => ({ kind: i % 4, x: Math.random() * 92, y: Math.random() * 92, r: -20 + Math.random() * 40, d: 5 + Math.random() * 4, c: [theme.accent, theme.secondary, "#f4a261", "#8d6e63"][i % 4] })), [theme.accent, theme.secondary]);
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {items.map((it, i) => (
        <span key={i} className="anim-bob absolute opacity-40" style={{ left: `${it.x}%`, top: `${it.y}%`, ["--r" as string]: `${it.r}deg`, ["--d" as string]: `${it.d}s` }}>
          <Doodle kind={it.kind} color={it.c} />
        </span>
      ))}
      <span className="absolute right-6 top-24 rotate-12 text-4xl opacity-70">📎</span>
      <span className="absolute bottom-24 left-5 -rotate-12 text-4xl opacity-70">🌼</span>
    </div>
  );
}

export default function Scrapbook(props: TemplateProps) {
  return (
    <Shell
      {...props}
      variant="scrapbook"
      background="radial-gradient(rgba(59,47,42,.07) 1px, transparent 1px) 0 0 / 7px 7px, linear-gradient(160deg,#f6eee2,#ead9bf)"
      Decor={Decor}
    />
  );
}
