"use client";
import { useMemo } from "react";
import type { TemplateProps } from "@/templates/registry";
import type { SectionProps } from "@/sections/types";
import Shell from "@/templates/Shell";

// Neon Night — starfield, perspective grid and neon glow
function Decor({ theme }: SectionProps) {
  const stars = useMemo(() => Array.from({ length: 50 }, () => ({ x: Math.random() * 100, y: Math.random() * 100, s: Math.random() * 2 + 1, d: 2 + Math.random() * 3, delay: Math.random() * 3 })), []);
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      {stars.map((st, i) => (
        <span key={i} className="anim-twinkle absolute rounded-full bg-white" style={{ left: `${st.x}%`, top: `${st.y}%`, width: st.s, height: st.s, ["--d" as string]: `${st.d}s`, ["--delay" as string]: `${st.delay}s` }} />
      ))}
      <div className="absolute -left-40 top-1/4 h-96 w-96 rounded-full blur-[120px]" style={{ background: `${theme.accent}40` }} />
      <div className="absolute -right-40 bottom-1/4 h-96 w-96 rounded-full blur-[120px]" style={{ background: `${theme.secondary}33` }} />
    </div>
  );
}

export default function NeonNight(props: TemplateProps) {
  return <Shell {...props} variant="neon" background={props.theme.background} Decor={Decor} />;
}
