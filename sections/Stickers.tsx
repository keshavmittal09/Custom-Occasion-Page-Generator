"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { useMode } from "./types";

const isEmoji = (s: string) => /\p{Extended_Pictographic}/u.test(s);
const SPOTS = [
  { left: "4%", top: "22%" },
  { right: "5%", top: "34%" },
  { left: "6%", top: "62%" },
  { right: "4%", top: "74%" },
  { left: "46%", top: "8%" },
  { right: "18%", top: "88%" },
];

// Draggable emoji stickers the creator picked in the wizard (Gen Z scrapbook energy)
export default function Stickers({ stickers }: { stickers: string[] }) {
  const mode = useMode();
  const list = useMemo(() => stickers.filter(isEmoji).slice(0, 6), [stickers]);
  if (!list.length || mode === "pane") return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-20">
      {list.map((s, i) => (
        <motion.button
          key={i}
          drag
          dragMomentum={false}
          whileDrag={{ scale: 1.3, rotate: 10 }}
          whileTap={{ scale: 1.2 }}
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: [0, -8, 8, 0], y: [0, -8, 0] }}
          transition={{ scale: { delay: 2 + i * 0.15, type: "spring" }, rotate: { repeat: Infinity, duration: 4 + i }, y: { repeat: Infinity, duration: 3 + i * 0.4 } }}
          className="pointer-events-auto absolute cursor-grab select-none text-4xl drop-shadow-lg active:cursor-grabbing sm:text-5xl"
          style={SPOTS[i]}
          aria-label="Sticker — drag me"
        >
          {s}
        </motion.button>
      ))}
    </div>
  );
}
