"use client";
import { motion } from "framer-motion";
import type { ThemeTokens } from "@/templates/registry";
import { VARIANTS, type Variant } from "./variants";

// Decorative break between sections, styled per template
export default function Divider({ variant, theme }: { variant: Variant; theme: ThemeTokens }) {
  const kind = VARIANTS[variant].divider;
  const c = theme.accent;
  const reveal = { initial: { opacity: 0, scaleX: 0.3 }, whileInView: { opacity: 1, scaleX: 1 }, viewport: { once: true }, transition: { duration: 1 } };

  switch (kind) {
    case "none":
      return <div className="h-6" />;
    case "ornament":
      return (
        <motion.div {...reveal} className="mx-auto flex max-w-md items-center gap-4 px-6" aria-hidden>
          <span className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${theme.secondary})` }} />
          <svg width="44" height="24" viewBox="0 0 44 24" fill="none">
            <path d="M22 2 L27 12 L22 22 L17 12 Z" stroke={theme.secondary} strokeWidth="1.2" />
            <circle cx="22" cy="12" r="2" fill={theme.secondary} />
            <path d="M2 12 H14 M30 12 H42" stroke={theme.secondary} strokeWidth="1" />
          </svg>
          <span className="h-px flex-1" style={{ background: `linear-gradient(270deg, transparent, ${theme.secondary})` }} />
        </motion.div>
      );
    case "wave":
      return (
        <div className="flex justify-center py-2" aria-hidden>
          <svg width="220" height="24" viewBox="0 0 220 24" fill="none">
            <path d="M0 12 Q 13.75 0 27.5 12 T 55 12 T 82.5 12 T 110 12 T 137.5 12 T 165 12 T 192.5 12 T 220 12" stroke="#F9A8D4" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      );
    case "stars":
      return (
        <motion.p {...reveal} className="text-center text-2xl tracking-[1em]" style={{ color: c }} aria-hidden>
          ✦✧✦
        </motion.p>
      );
    case "line":
      return <div className="mx-auto h-0.5 max-w-5xl bg-black" aria-hidden />;
    case "doodle":
      return (
        <div className="flex justify-center" aria-hidden>
          <svg width="260" height="30" viewBox="0 0 260 30" fill="none">
            <path d="M4 18 C 30 2, 50 30, 80 14 S 130 4, 160 16 S 220 28, 256 10" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 7" />
            <path d="M120 8 l4 8 l8 1 l-6 5 l2 8 l-8 -4 l-8 4 l2 -8 l-6 -5 l8 -1 z" stroke={theme.secondary} strokeWidth="1.5" fill="none" />
          </svg>
        </div>
      );
    case "film":
      return <div className="h-8 w-full" style={{ background: "#000", backgroundImage: "repeating-linear-gradient(90deg, transparent 0 10px, #2a2a2a 10px 24px, transparent 24px 34px)" }} aria-hidden />;
    case "pixel":
      return <div className="mx-auto h-2 max-w-3xl" style={{ backgroundImage: `repeating-linear-gradient(90deg, ${c} 0 8px, transparent 8px 16px)` }} aria-hidden />;
    case "chat":
      return (
        <p className="text-center text-xs font-medium text-neutral-500" aria-hidden>
          Today {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      );
    case "bow":
      return (
        <div className="mx-auto flex max-w-sm items-center gap-3 px-6" aria-hidden>
          <span className="h-px flex-1 bg-[#f4c6d2]" />
          <span className="text-2xl">🎀</span>
          <span className="h-px flex-1 bg-[#f4c6d2]" />
        </div>
      );
    default:
      return (
        <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} className="mx-auto h-px max-w-2xl" style={{ background: `linear-gradient(90deg, transparent, ${c}, transparent)`, boxShadow: `0 0 16px ${c}` }} aria-hidden />
      );
  }
}
