import React from "react";

export const inputCls =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/30 transition";

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-white/80">{label}</span>
      {children}
      {hint && <span className="block text-xs text-white/40">{hint}</span>}
    </label>
  );
}

export function StepTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      {subtitle && <p className="mt-1 text-white/60">{subtitle}</p>}
    </div>
  );
}
