import React from "react";

// text-base (16px) on purpose: smaller inputs make iPhone Safari zoom in on focus
export const inputCls =
  "w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base text-ink placeholder:text-ink/30 outline-none transition [color-scheme:light] hover:border-ink/20 focus:border-lilac focus:ring-4 focus:ring-lilac/15";

export function Field({ label, hint, count, max, children }: { label: string; hint?: string; count?: number; max?: number; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-ink/85">{label}</span>
        {max !== undefined && <span className={`text-xs tabular-nums ${count && count > max * 0.9 ? "text-[#b4235a]" : "text-ink/30"}`}>{count ?? 0}/{max}</span>}
      </span>
      {children}
      {hint && <span className="block text-xs text-ink/45">{hint}</span>}
    </label>
  );
}

export function StepTitle({ emoji, title, subtitle }: { emoji?: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-7 flex items-start gap-4">
      {emoji && <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#ffd9c2] to-[#e3d9ff] text-2xl ring-1 ring-ink/10">{emoji}</span>}
      <div>
        <h2 className="font-display text-3xl text-ink sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-1 text-ink/55">{subtitle}</p>}
      </div>
    </div>
  );
}

export function Chip({ active, onClick, children }: { active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={`rounded-full border px-3.5 py-1.5 text-sm transition ${active ? "border-lilac bg-[#efe9ff] text-ink" : "border-ink/10 bg-white/70 text-ink/60 hover:border-ink/25 hover:text-ink"}`}>
      {children}
    </button>
  );
}

export function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="flex w-full items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 text-left">
      <span>
        <span className="block text-sm font-medium text-ink">{label}</span>
        {hint && <span className="block text-xs text-ink/45">{hint}</span>}
      </span>
      <span className={`relative h-7 w-12 shrink-0 rounded-full transition ${checked ? "bg-ink" : "bg-ink/15"}`}>
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${checked ? "left-6" : "left-1"}`} />
      </span>
    </button>
  );
}
