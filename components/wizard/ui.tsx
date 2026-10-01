import React from "react";

export const inputCls =
  "w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[15px] text-white placeholder:text-white/30 outline-none transition [color-scheme:dark] hover:border-white/20 focus:border-pink-400/70 focus:bg-white/[0.06] focus:ring-4 focus:ring-pink-500/15";

export function Field({
  label,
  hint,
  count,
  max,
  children,
}: {
  label: string;
  hint?: string;
  count?: number;
  max?: number;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-white/85">{label}</span>
        {max !== undefined && (
          <span className={`text-xs tabular-nums ${count && count > max * 0.9 ? "text-pink-300" : "text-white/30"}`}>
            {count ?? 0}/{max}
          </span>
        )}
      </span>
      {children}
      {hint && <span className="block text-xs text-white/40">{hint}</span>}
    </label>
  );
}

export function StepTitle({ emoji, title, subtitle }: { emoji?: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-7 flex items-start gap-4">
      {emoji && (
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-pink-500/30 to-violet-500/30 text-2xl ring-1 ring-white/10">
          {emoji}
        </span>
      )}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 text-white/55">{subtitle}</p>}
      </div>
    </div>
  );
}

export function Chip({ active, onClick, children }: { active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
        active ? "border-pink-400 bg-pink-500/20 text-white" : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/25 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
