"use client";
import { Draft } from "./draft";

const TEMPLATE_NAMES: Record<string, string> = { "neon-night": "Neon Night", "pastel-dream": "Pastel Dream", "royal-gold": "Royal Gold" };
const TEMPLATE_BG: Record<string, string> = {
  "neon-night": "linear-gradient(135deg,#0B0420,#3b0764 60%,#FF4FA3)",
  "pastel-dream": "linear-gradient(135deg,#FFF1F5,#FBCFE8 50%,#C4B5FD)",
  "royal-gold": "linear-gradient(135deg,#0E0E10,#3a2f12 60%,#D4AF37)",
};

// Sidebar showing what the page will contain + a readiness checklist
export default function SummaryCard({ draft }: { draft: Draft }) {
  const checks = [
    { ok: !!draft.recipient.name.trim(), label: "Recipient name" },
    { ok: !!draft.from.trim(), label: "From" },
    { ok: draft.messages.some((m) => m.trim()), label: "At least one message" },
    { ok: draft.images.length > 0, label: "Photos (recommended)" },
  ];
  const done = checks.filter((c) => c.ok).length;

  return (
    <aside className="sticky top-6 overflow-hidden rounded-3xl border border-ink/10 bg-white/70 backdrop-blur">
      <div className="relative h-28 p-5" style={{ background: TEMPLATE_BG[draft.templateId] }}>
        <span className="absolute bottom-3 left-5 rounded-full bg-black/40 px-3 py-1 text-xs text-white backdrop-blur">{TEMPLATE_NAMES[draft.templateId]}</span>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs uppercase tracking-widest text-ink/40">{draft.occasion === "CUSTOM" ? draft.customOccasionLabel || "Custom" : draft.occasion.toLowerCase()}</p>
          <p className="truncate text-xl font-bold text-ink">{draft.recipient.nickname || draft.recipient.name || "Your special person"}</p>
          {draft.from && <p className="text-sm text-ink/50">from {draft.from}</p>}
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          {[
            [draft.messages.filter((m) => m.trim()).length, "notes"],
            [draft.images.length, "photos"],
            [draft.memories.length, "memories"],
          ].map(([n, l]) => (
            <div key={l} className="rounded-xl bg-white/70 py-2">
              <div className="text-lg font-bold text-ink">{n}</div>
              <div className="text-ink/40">{l}</div>
            </div>
          ))}
        </div>
        <div>
          <div className="mb-2 flex justify-between text-xs text-ink/50">
            <span>Ready to publish</span>
            <span>{done}/{checks.length}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-ink/5">
            <div className="h-full rounded-full bg-gradient-to-r from-lilac to-blush transition-all" style={{ width: `${(done / checks.length) * 100}%` }} />
          </div>
          <ul className="mt-3 space-y-1.5 text-sm">
            {checks.map((c) => (
              <li key={c.label} className={c.ok ? "text-ink/80" : "text-ink/35"}>
                {c.ok ? "✅" : "○"} {c.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
