"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";

// Soft floating emoji sparkles used as ambient decoration
export default function Sparkles({ items = ["✨", "💖", "⭐", "🌸"], count = 14 }: { items?: string[]; count?: number }) {
  const sparkles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        ch: items[i % items.length],
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: 12 + Math.random() * 16,
        d: 4 + Math.random() * 4,
        delay: Math.random() * 4,
      })),
    [count, items]
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {sparkles.map((sp, i) => (
        <motion.span
          key={i}
          className="absolute select-none"
          style={{ left: `${sp.x}%`, top: `${sp.y}%`, fontSize: sp.s }}
          animate={{ y: [0, -20, 0], opacity: [0, 0.8, 0], scale: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: sp.d, delay: sp.delay, ease: "easeInOut" }}
        >
          {sp.ch}
        </motion.span>
      ))}
    </div>
  );
}
