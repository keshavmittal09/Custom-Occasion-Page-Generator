"use client";
import { motion } from "framer-motion";
import { Language, Occasion } from "@/lib/schema";
import { StepProps } from "./draft";
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

const LANGUAGES: { id: Language; label: string; sample: string }[] = [
  { id: "ENGLISH", label: "English", sample: "Happy Birthday" },
  { id: "HINGLISH", label: "Hinglish", sample: "Badhaai Ho" },
  { id: "HINDI", label: "हिंदी", sample: "जन्मदिन मुबारक" },
];

export default function StepOccasion({ draft, update }: StepProps) {
  return (
    <div className="space-y-8">
      <StepTitle emoji="🎉" title="What are we celebrating?" subtitle="Pick the occasion. We'll tailor the page to it." />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {OCCASIONS.map((o) => {
          const active = draft.occasion === o.id;
          return (
            <motion.button
              key={o.id}
              type="button"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => update({ occasion: o.id })}
              className={`relative overflow-hidden rounded-2xl border p-4 text-left transition ${
                active ? "border-pink-400/80 bg-gradient-to-br from-pink-500/25 to-violet-500/20 shadow-lg shadow-pink-500/20" : "border-white/10 bg-white/[0.03] hover:border-white/20"
              }`}
            >
              <div className="text-3xl">{o.emoji}</div>
              <div className="mt-2 font-semibold text-white">{o.label}</div>
              <div className="text-xs text-white/50">{o.desc}</div>
              {active && <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-pink-500 text-[10px] text-white">✓</span>}
            </motion.button>
          );
        })}
      </div>

      {draft.occasion === "CUSTOM" && (
        <Field label="Occasion name" count={draft.customOccasionLabel.length} max={60}>
          <input className={inputCls} maxLength={60} placeholder="e.g. Promotion Party" value={draft.customOccasionLabel} onChange={(e) => update({ customOccasionLabel: e.target.value })} />
        </Field>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Occasion date" hint="Optional, shown on the hero">
          <input type="date" className={inputCls} value={draft.occasionDate} onChange={(e) => update({ occasionDate: e.target.value })} />
        </Field>
        <Field label="Page language">
          <div className="grid grid-cols-3 gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => update({ language: l.id })}
                className={`rounded-2xl border px-2 py-2.5 text-center transition ${
                  draft.language === l.id ? "border-pink-400 bg-pink-500/20 text-white" : "border-white/10 bg-white/[0.03] text-white/60 hover:text-white"
                }`}
              >
                <div className="text-sm font-semibold">{l.label}</div>
                <div className="truncate text-[11px] opacity-60">{l.sample}</div>
              </button>
            ))}
          </div>
        </Field>
      </div>
    </div>
  );
}
