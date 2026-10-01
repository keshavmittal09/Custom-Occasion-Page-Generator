"use client";
import { useMemo } from "react";
import type { TemplateProps } from "@/templates/registry";
import Shell from "@/templates/Shell";

// Y2K Chrome — holographic background, chrome blobs, twinkling 4-point stars, butterflies
function Decor() {
  const stars = useMemo(() => Array.from({ length: 16 }, () => ({ x: Math.random() * 100, y: Math.random() * 100, s: 14 + Math.random() * 22, d: 2 + Math.random() * 3, delay: Math.random() * 3, c: ["#ff4fd8", "#6c5cff", "#41e1ff", "#ffffff"][Math.floor(Math.random() * 4)] })), []);
  const flies = useMemo(() => Array.from({ length: 5 }, (_, i) => ({ x: 8 + i * 20 + Math.random() * 8, y: 15 + Math.random() * 70, d: 4 + Math.random() * 3, r: -12 + Math.random() * 24 })), []);
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      <div className="anim-holo absolute inset-0 opacity-60" style={{ backgroundImage: "linear-gradient(115deg, transparent 20%, rgba(255,255,255,.55) 35%, transparent 50%, rgba(255,255,255,.4) 65%, transparent 80%)" }} />
      <div className="absolute -left-24 top-20 h-72 w-72 rounded-full blur-2xl" style={{ background: "radial-gradient(circle at 30% 30%, #ffffff, #c7cff9 40%, #8b7cf6 70%, transparent 72%)" }} />
      <div className="absolute -right-20 bottom-24 h-80 w-80 rounded-full blur-2xl" style={{ background: "radial-gradient(circle at 30% 30%, #ffffff, #ffd1f4 45%, #ff4fd8 70%, transparent 72%)" }} />
      {stars.map((s, i) => (
        <span key={i} className="anim-twinkle absolute" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, background: s.c, clipPath: "polygon(50% 0, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0 50%, 40% 40%)", filter: "drop-shadow(0 0 6px rgba(255,255,255,.9))", ["--d" as string]: `${s.d}s`, ["--delay" as string]: `${s.delay}s` }} />
      ))}
      {flies.map((f, i) => (
        <span key={i} className="anim-bob absolute text-3xl" style={{ left: `${f.x}%`, top: `${f.y}%`, ["--d" as string]: `${f.d}s`, ["--r" as string]: `${f.r}deg`, filter: "hue-rotate(200deg) saturate(1.4)" }}>
          🦋
        </span>
      ))}
    </div>
  );
}

export default function Y2KChrome(props: TemplateProps) {
  return <Shell {...props} variant="y2k" background="linear-gradient(135deg,#d7fbff 0%,#efe2ff 35%,#ffd3f1 65%,#e2fff3 100%)" Decor={Decor} />;
}
