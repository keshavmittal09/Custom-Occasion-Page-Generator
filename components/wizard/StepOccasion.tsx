"use client";
import { motion } from "framer-motion";
import type { Occasion } from "@/lib/schema";
import type { StepProps } from "./draft";
import { Field, StepTitle, inputCls } from "./ui";

const OCCASIONS: { id: Occasion; label: string; emoji: string; desc: string }[] = [
  { id: "BIRTHDAY", label: "Birthday", emoji: "🎂", desc: "Cake, candles & chaos" },
  { id: "ANNIVERSARY", label: "Anniversary", emoji: "💞", desc: "Years of us" },
  { id: "WEDDING", label: "Wedding", emoji: "💍", desc: "Happily ever after" },
  { id: "FAREWELL", label: "Farewell", emoji: "👋", desc: "Not goodbye, see you" },
  { id: "CONGRATS", label: "Congrats", emoji: "🏆", desc: "Big win energy" },
  { id: "FRIENDSHIP", label: "Friendship", emoji: "🤝", desc: "For the ride-or-die" },
  { id: "CUSTOM", label: "Custom", emoji: "✨", desc: "Your own occasion" },
];

export default function StepOccasion({ draft, update }: StepProps) {
  return (
    <div className="space-y-8">
      <StepTitle emoji="🎉" title="What are we celebrating?" subtitle="Pick the occasion. Decorations and copy adapt to it." />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {OCCASIONS.map((o) => {
          const active = draft.occasion === o.id;
          return (
            <motion.button
              key={o.id}
              type="button"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => update({ occasion: o.id })}
              className={`relative overflow-hidden rounded-2xl border p-4 text-left transition ${active ? "border-lilac bg-gradient-to-br from-[#ffd9e8] to-[#e3d9ff] shadow-lg shadow-[#8b7cf6]/25" : "border-ink/10 bg-white/70 hover:border-ink/20"}`}
            >
              <div className="text-3xl">{o.emoji}</div>
              <div className="mt-2 font-semibold text-ink">{o.label}</div>
              <div className="text-xs text-ink/50">{o.desc}</div>
              {active && <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-ink text-[10px] text-white">✓</span>}
            </motion.button>
          );
        })}
      </div>

      {draft.occasion === "CUSTOM" && (
        <Field label="Occasion name *" count={draft.customOccasionLabel.length} max={60}>
          <input className={inputCls} maxLength={60} placeholder="e.g. Promotion Party" value={draft.customOccasionLabel} onChange={(e) => update({ customOccasionLabel: e.target.value })} />
        </Field>
      )}

      <Field label="Occasion date" hint="Optional — shown on the hero. Want it locked until then? Set a reveal time in the Style step.">
        <input type="date" className={inputCls} value={draft.occasionDate} onChange={(e) => update({ occasionDate: e.target.value })} />
      </Field>
    </div>
  );
}
