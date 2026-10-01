"use client";
import { useMemo } from "react";
import type { TemplateProps } from "@/templates/registry";
import Shell from "@/templates/Shell";

// Coquette — lace dots, floating bows, pearls and tiny hearts
function Decor() {
  const items = useMemo(
    () => Array.from({ length: 14 }, (_, i) => ({ kind: i % 3, x: Math.random() * 94, y: Math.random() * 94, d: 4 + Math.random() * 4, r: -15 + Math.random() * 30, delay: Math.random() * 3, s: 10 + Math.random() * 10 })),
    []
  );
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {items.map((it, i) =>
        it.kind === 0 ? (
          <span key={i} className="anim-bob absolute text-3xl" style={{ left: `${it.x}%`, top: `${it.y}%`, ["--d" as string]: `${it.d}s`, ["--r" as string]: `${it.r}deg` }}>🎀</span>
        ) : it.kind === 1 ? (
          <span key={i} className="anim-bob absolute rounded-full" style={{ left: `${it.x}%`, top: `${it.y}%`, width: it.s, height: it.s, background: "radial-gradient(circle at 35% 35%, #fff, #f3e7ea 60%, #d9c4ca)", boxShadow: "0 2px 6px rgba(201,123,142,.35)", ["--d" as string]: `${it.d}s` }} />
        ) : (
          <span key={i} className="anim-twinkle absolute text-lg text-[#f4a7b9]" style={{ left: `${it.x}%`, top: `${it.y}%`, ["--d" as string]: `${it.d}s`, ["--delay" as string]: `${it.delay}s` }}>♡</span>
        )
      )}
    </div>
  );
}

export default function Coquette(props: TemplateProps) {
  return <Shell {...props} variant="coquette" background="radial-gradient(#f9d5df 1.5px, transparent 1.5px) 0 0 / 18px 18px, linear-gradient(180deg,#fff7f9,#ffe9ef)" Decor={Decor} />;
}
