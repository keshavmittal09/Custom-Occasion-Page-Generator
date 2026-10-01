"use client";
import { motion } from "framer-motion";
import type { Variant } from "./types";

// Decorative break between sections, styled per template
export default function Divider({ variant, color }: { variant: Variant; color: string }) {
  if (variant === "royal") {
    return (
      <motion.div initial={{ opacity: 0, scaleX: 0.4 }} whileInView={{ opacity: 1, scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="mx-auto flex max-w-md items-center gap-4 px-6">
        <span className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${color})` }} />
        <svg width="44" height="24" viewBox="0 0 44 24" fill="none" aria-hidden>
          <path d="M22 2 L27 12 L22 22 L17 12 Z" stroke={color} strokeWidth="1.2" />
          <circle cx="22" cy="12" r="2" fill={color} />
          <path d="M2 12 H14 M30 12 H42" stroke={color} strokeWidth="1" />
        </svg>
        <span className="h-px flex-1" style={{ background: `linear-gradient(270deg, transparent, ${color})` }} />
      </motion.div>
    );
  }

  if (variant === "pastel") {
    return (
      <div className="flex justify-center py-2" aria-hidden>
        <svg width="220" height="24" viewBox="0 0 220 24" fill="none">
          <path d="M0 12 Q 13.75 0 27.5 12 T 55 12 T 82.5 12 T 110 12 T 137.5 12 T 165 12 T 192.5 12 T 220 12" stroke={color} strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  return (
    <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} className="mx-auto h-px max-w-2xl" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)`, boxShadow: `0 0 16px ${color}` }} />
  );
}
