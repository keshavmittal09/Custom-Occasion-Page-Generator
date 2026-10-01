"use client";
import { catalogById } from "@/templates/catalog";
import type { Draft } from "./draft";

// Compact "what you've got so far" card (shown under the live preview)
export default function SummaryCard({ draft }: { draft: Draft }) {
  const t = catalogById[draft.templateId];
  const checks = [
    { ok: !!draft.recipient.name.trim(), label: "Recipient" },
    { ok: draft.messages.some((m) => m.trim()), label: "Message" },
    { ok: draft.images.length > 0, label: "Photo" },
  ];
  const done = checks.filter((c) => c.ok).length;
  return (
    <div className="glass rounded-3xl p-4">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl text-xl" style={{ background: t?.bg }}>{t?.emoji}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{draft.recipient.nickname || draft.recipient.name || "Your special person"}</p>
          <p className="text-xs text-ink/50">{t?.name} · {draft.images.length} photos · {draft.messages.filter((m) => m.trim()).length} notes</p>
        </div>
        <span className="text-xs tabular-nums text-ink/50">{done}/{checks.length}</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/5">
        <div className="h-full rounded-full bg-gradient-to-r from-lilac to-blush transition-all" style={{ width: `${(done / checks.length) * 100}%` }} />
      </div>
    </div>
  );
}
