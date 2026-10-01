"use client";
import { Check, CircleAlert } from "lucide-react";
import { catalogById } from "@/templates/catalog";
import { trackBySrc } from "@/lib/music";
import { validateStep, type StepProps } from "./draft";
import { StepTitle } from "./ui";

const STEP_NAMES = ["Occasion", "Recipient", "Words & language", "Media", "Style"];

// Summary of every input + what's still missing before Generate
export default function StepReview({ draft, goTo }: StepProps & { goTo: (step: number) => void }) {
  const t = catalogById[draft.templateId];
  const issues = STEP_NAMES.map((name, i) => ({ name, i, error: validateStep(i, draft) }));
  const music = draft.music ? trackBySrc(draft.music)?.title ?? "Your own song" : "No music";
  const rows: [string, string, number][] = [
    ["Occasion", draft.occasion === "CUSTOM" ? draft.customOccasionLabel || "Custom" : draft.occasion.toLowerCase(), 0],
    ["For", `${draft.recipient.name || "—"}${draft.recipient.nickname ? ` (“${draft.recipient.nickname}”)` : ""} · ${draft.recipient.relation || "—"}`, 1],
    ["From", draft.from || "—", 1],
    ["Language", draft.language === "HINDI" ? "हिंदी" : draft.language.toLowerCase(), 2],
    ["Messages", `${draft.messages.filter((m) => m.trim()).length} · memories ${draft.memories.filter((m) => m.title.trim()).length}`, 2],
    ["Media", `${draft.images.length} photos · ${draft.videos.length} videos · 🎵 ${music}`, 3],
    ["Template", `${t?.emoji} ${t?.name}${draft.accent ? ` · accent ${draft.accent}` : ""}`, 4],
    ["Extras", [draft.revealAt && `🔒 unlocks ${new Date(draft.revealAt).toLocaleString()}`, (draft.hasPassword || draft.password) && "🔐 password", draft.wishesWall && "💬 wishes wall", draft.stickers.length && `stickers ${draft.stickers.join("")}`].filter(Boolean).join(" · ") || "—", 4],
  ];

  return (
    <div className="space-y-8">
      <StepTitle emoji="🚀" title="Review & generate" subtitle="Check everything, then generate your link." />
      <div className="divide-y divide-ink/5 overflow-hidden rounded-2xl bg-white/70 ring-1 ring-ink/5">
        {rows.map(([k, v, step]) => (
          <button key={k} type="button" onClick={() => goTo(step)} className="flex w-full items-start gap-4 px-4 py-3 text-left transition hover:bg-white">
            <span className="w-24 shrink-0 text-sm text-ink/45">{k}</span>
            <span className="flex-1 text-sm capitalize text-ink">{v}</span>
            <span className="text-xs text-lilac">edit</span>
          </button>
        ))}
      </div>
      <ul className="space-y-2">
        {issues.map(({ name, i, error }) => (
          <li key={name}>
            <button type="button" onClick={() => goTo(i)} className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm ${error ? "bg-[#ffe4ec] text-[#b4235a]" : "text-ink/70"}`}>
              {error ? <CircleAlert size={16} /> : <Check size={16} className="text-emerald-500" />}
              <span className="font-medium">{name}</span>
              {error && <span className="opacity-80">— {error}</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
