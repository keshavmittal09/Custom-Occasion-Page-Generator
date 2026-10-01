"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Eye } from "lucide-react";
import { CATALOG, fontsHref, type CatalogEntry } from "@/templates/catalog";
import type { StepProps } from "./draft";
import { Field, StepTitle, Toggle, inputCls } from "./ui";

const VIBES = ["All", "Gen Z", "Aesthetic", "Classic"] as const;
const ACCENTS = ["#FF4FA3", "#8B7CF6", "#22D3EE", "#F59E0B", "#34D399", "#EF4444"];
const STICKERS = ["🎉", "🎂", "🎈", "💖", "🫶", "🥹", "😭", "💀", "🔥", "✨", "💅", "🦋", "🎀", "🌸", "👑", "🍾", "💿", "🎮", "🌻", "💚"];

function TemplateCard({ t, active, onPick }: { t: CatalogEntry; active: boolean; onPick: () => void }) {
  return (
    <motion.button type="button" whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }} onClick={onPick} className={`group relative overflow-hidden rounded-2xl text-left ring-2 transition ${active ? "ring-lilac shadow-xl shadow-[#8b7cf6]/25" : "ring-transparent hover:ring-ink/10"}`}>
      <div className={`relative flex h-28 flex-col items-center justify-center ${t.dark ? "text-white" : "text-ink"}`} style={{ background: t.bg }}>
        <span className="text-3xl">{t.emoji}</span>
        <span className="mt-1 text-lg leading-none" style={{ fontFamily: `'${t.font}', serif` }}>Happy day</span>
        <span className="absolute left-2 top-2 rounded-full bg-black/25 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">{t.vibe}</span>
        {active && <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-ink text-white"><Check size={13} /></span>}
      </div>
      <div className="bg-white/80 p-2.5">
        <div className="text-sm font-semibold text-ink">{t.name}</div>
        <div className="truncate text-[11px] text-ink/50">{t.motion}</div>
      </div>
    </motion.button>
  );
}

export default function StepStyle({ draft, update }: StepProps) {
  const [vibe, setVibe] = useState<(typeof VIBES)[number]>("All");
  const list = CATALOG.filter((t) => vibe === "All" || t.vibe === vibe);
  const current = CATALOG.find((t) => t.id === draft.templateId);

  const toggleSticker = (s: string) => update({ stickers: draft.stickers.includes(s) ? draft.stickers.filter((x) => x !== s) : draft.stickers.length >= 6 ? draft.stickers : [...draft.stickers, s] });

  return (
    <div className="space-y-10">
      <link rel="stylesheet" href={fontsHref(CATALOG.map((t) => t.font))} precedence="default" />
      <div>
        <StepTitle emoji="🎨" title="Pick a vibe" subtitle="11 templates — each with its own layout, palette, fonts and motion." />
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {VIBES.map((v) => (
            <button key={v} type="button" onClick={() => setVibe(v)} className={`relative rounded-full px-4 py-1.5 text-sm transition ${vibe === v ? "text-white" : "text-ink/60 hover:text-ink"}`}>
              {vibe === v && <motion.span layoutId="vibe" className="absolute inset-0 rounded-full bg-ink" />}
              <span className="relative">{v}</span>
            </button>
          ))}
          {current && (
            <a href={`/w/${current.demo}`} target="_blank" rel="noreferrer" className="ml-auto inline-flex items-center gap-1.5 text-sm text-ink/60 underline-offset-4 hover:text-ink hover:underline">
              <Eye size={14} /> See {current.name} demo
            </a>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {list.map((t) => (
            <TemplateCard key={t.id} t={t} active={draft.templateId === t.id} onPick={() => update({ templateId: t.id })} />
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Accent colour" hint="Optional — overrides the template accent">
          <div className="flex flex-wrap items-center gap-2">
            {ACCENTS.map((c) => (
              <button key={c} type="button" aria-label={`Accent ${c}`} onClick={() => update({ accent: c })} className={`h-9 w-9 rounded-full ring-2 ring-offset-2 transition hover:scale-110 ${draft.accent.toLowerCase() === c.toLowerCase() ? "ring-ink" : "ring-transparent"}`} style={{ background: c }} />
            ))}
            <input type="color" aria-label="Custom accent" className="h-9 w-9 cursor-pointer rounded-full bg-transparent" value={draft.accent || "#ff4fa3"} onChange={(e) => update({ accent: e.target.value })} />
            {draft.accent && <button type="button" onClick={() => update({ accent: "" })} className="text-xs text-ink/50 underline">reset</button>}
          </div>
        </Field>
        <Field label={`Stickers (${draft.stickers.length}/6)`} hint="Draggable stickers floating on the page">
          <div className="flex flex-wrap gap-1.5">
            {STICKERS.map((s) => (
              <button key={s} type="button" onClick={() => toggleSticker(s)} className={`grid h-9 w-9 place-items-center rounded-xl text-xl transition ${draft.stickers.includes(s) ? "bg-[#efe9ff] ring-2 ring-lilac" : "bg-white/70 hover:scale-110"}`}>
                {s}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <div className="grid gap-6 border-t border-ink/10 pt-8 sm:grid-cols-2">
        <Field label="Reveal at (countdown lock)" hint="Optional — the page stays locked with a live countdown until this moment">
          <div className="flex gap-2">
            <input type="datetime-local" className={inputCls} value={draft.revealAt} onChange={(e) => update({ revealAt: e.target.value })} />
            {draft.revealAt && <button type="button" onClick={() => update({ revealAt: "" })} className="rounded-xl px-3 text-sm text-ink/50 hover:bg-white">✕</button>}
          </div>
        </Field>
        <Field label="Password" hint={draft.hasPassword ? "This page is password protected. Type a new one to change it." : "Optional — only people with the password can open it"}>
          <div className="flex gap-2">
            <input type="text" autoComplete="off" className={inputCls} maxLength={60} placeholder={draft.hasPassword ? "•••••• (set)" : "secret"} value={draft.password} onChange={(e) => update({ password: e.target.value, clearPassword: false })} />
            {draft.hasPassword && !draft.password && (
              <button type="button" onClick={() => update({ clearPassword: true, hasPassword: false })} className="shrink-0 rounded-xl px-3 text-sm text-[#b4235a] hover:bg-[#ffe4ec]">Remove</button>
            )}
          </div>
        </Field>
      </div>

      <Toggle checked={draft.wishesWall} onChange={(v) => update({ wishesWall: v })} label="Wishes wall" hint="Let friends leave their own wishes on the page (you can delete any of them later)" />
    </div>
  );
}
