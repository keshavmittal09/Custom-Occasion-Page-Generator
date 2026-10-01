"use client";
import { TemplateId } from "@/lib/schema";
import { StepProps } from "./draft";
import { Field, StepTitle, inputCls } from "./ui";

const TEMPLATES: { id: TemplateId; name: string; desc: string; bg: string }[] = [
  { id: "neon-night", name: "Neon Night", desc: "Glowing, cinematic, party vibes", bg: "linear-gradient(135deg,#0B0420,#3b0764 60%,#FF4FA3)" },
  { id: "pastel-dream", name: "Pastel Dream", desc: "Soft, cute, balloons & polaroids", bg: "linear-gradient(135deg,#FFF1F5,#FBCFE8 50%,#C4B5FD)" },
  { id: "royal-gold", name: "Royal Gold", desc: "Elegant black & gold, serif", bg: "linear-gradient(135deg,#0E0E10,#3a2f12 60%,#D4AF37)" },
];

export default function StepStyle({ draft, update }: StepProps) {
  return (
    <div className="space-y-6">
      <StepTitle emoji="🎨" title="Pick a vibe" subtitle="Choose a template, then fine-tune the details." />
      <div className="grid gap-3 sm:grid-cols-3">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => update({ templateId: t.id })}
            className={`overflow-hidden rounded-2xl border text-left transition hover:scale-[1.02] ${
              draft.templateId === t.id ? "border-lilac ring-2 ring-lilac/40" : "border-ink/10"
            }`}
          >
            <div className="h-24" style={{ background: t.bg }} />
            <div className="bg-white/70 p-3">
              <div className="font-semibold text-ink">{t.name}</div>
              <div className="text-xs text-ink/60">{t.desc}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Accent colour" hint="Leave as-is to use the template default">
          <div className="flex gap-2">
            <input type="color" className="h-12 w-12 cursor-pointer rounded-lg bg-transparent" value={draft.accent || "#ff4fa3"} onChange={(e) => update({ accent: e.target.value })} />
            {["#FF4FA3", "#A78BFA", "#22D3EE", "#F59E0B", "#34D399"].map((c) => (
              <button key={c} type="button" aria-label={`Accent ${c}`} onClick={() => update({ accent: c })} className={`h-12 w-9 rounded-lg ring-2 transition hover:scale-110 ${draft.accent === c ? "ring-white" : "ring-transparent"}`} style={{ background: c }} />
            ))}
            {draft.accent && (
              <button type="button" onClick={() => update({ accent: "" })} className="rounded-xl border border-ink/15 px-3 text-sm text-ink/70 hover:bg-white">
                Reset
              </button>
            )}
          </div>
        </Field>
        <Field label="Background music URL" hint="Optional — direct .mp3 link, plays after the intro tap">
          <input className={inputCls} placeholder="https://…/song.mp3" value={draft.music} onChange={(e) => update({ music: e.target.value })} />
        </Field>
        <Field label="Reveal at" hint="Optional — page stays locked with a countdown until then">
          <input type="datetime-local" className={inputCls} value={draft.revealAt} onChange={(e) => update({ revealAt: e.target.value })} />
        </Field>
        <Field label="Password" hint="Optional — only people with the password can open it">
          <input type="text" className={inputCls} maxLength={60} placeholder="secret" value={draft.password} onChange={(e) => update({ password: e.target.value })} />
        </Field>
      </div>

      <label className="flex items-center gap-3 text-ink/80">
        <input type="checkbox" className="h-5 w-5 accent-pink-500" checked={draft.wishesWall} onChange={(e) => update({ wishesWall: e.target.checked })} />
        Let visitors leave wishes on the page
      </label>
    </div>
  );
}
