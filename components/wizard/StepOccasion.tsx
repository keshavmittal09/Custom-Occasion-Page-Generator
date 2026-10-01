"use client";
import { Language, Occasion } from "@/lib/schema";
import { StepProps } from "./draft";
import { Field, StepTitle, inputCls } from "./ui";

const OCCASIONS: { id: Occasion; label: string; emoji: string }[] = [
  { id: "BIRTHDAY", label: "Birthday", emoji: "🎂" },
  { id: "ANNIVERSARY", label: "Anniversary", emoji: "💞" },
  { id: "WEDDING", label: "Wedding", emoji: "💍" },
  { id: "FAREWELL", label: "Farewell", emoji: "👋" },
  { id: "CONGRATS", label: "Congrats", emoji: "🏆" },
  { id: "FRIENDSHIP", label: "Friendship", emoji: "🤝" },
  { id: "CUSTOM", label: "Custom", emoji: "✨" },
];

const LANGUAGES: { id: Language; label: string }[] = [
  { id: "ENGLISH", label: "English" },
  { id: "HINGLISH", label: "Hinglish" },
  { id: "HINDI", label: "हिंदी" },
];

export default function StepOccasion({ draft, update }: StepProps) {
  return (
    <div className="space-y-6">
      <StepTitle title="What are we celebrating?" subtitle="Pick the occasion — we'll tailor the page to it." />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {OCCASIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => update({ occasion: o.id })}
            className={`rounded-2xl border p-4 text-center transition hover:scale-[1.03] ${
              draft.occasion === o.id ? "border-pink-400 bg-pink-500/20 shadow-lg shadow-pink-500/20" : "border-white/10 bg-white/5"
            }`}
          >
            <div className="text-3xl">{o.emoji}</div>
            <div className="mt-1 text-sm font-medium text-white">{o.label}</div>
          </button>
        ))}
      </div>

      {draft.occasion === "CUSTOM" && (
        <Field label="Occasion name">
          <input className={inputCls} maxLength={60} placeholder="e.g. Promotion Party" value={draft.customOccasionLabel} onChange={(e) => update({ customOccasionLabel: e.target.value })} />
        </Field>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Occasion date" hint="Optional">
          <input type="date" className={inputCls} value={draft.occasionDate} onChange={(e) => update({ occasionDate: e.target.value })} />
        </Field>
        <Field label="Page language">
          <div className="flex gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => update({ language: l.id })}
                className={`flex-1 rounded-xl border px-3 py-3 text-sm transition ${
                  draft.language === l.id ? "border-pink-400 bg-pink-500/20 text-white" : "border-white/10 bg-white/5 text-white/70"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </Field>
      </div>
    </div>
  );
}
