"use client";
import { motion, useScroll, useSpring } from "framer-motion";

// Thin reading-progress bar pinned to the top of a template
export default function ScrollProgress({ color, color2 }: { color: string; color2?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-30 h-1 origin-left"
      style={{ scaleX, background: `linear-gradient(90deg, ${color}, ${color2 ?? color})`, boxShadow: `0 0 12px ${color}` }}
    />
  );
}
