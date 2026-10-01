"use client";
import { StepProps } from "./draft";
import { Field, StepTitle, inputCls } from "./ui";

export default function StepRecipient({ draft, update }: StepProps) {
  const r = draft.recipient;
  const setR = (patch: Partial<typeof r>) => update({ recipient: { ...r, ...patch } });

  return (
    <div className="space-y-5">
      <StepTitle title="Who is it for?" subtitle="Tell us about the special person." />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Their name *">
          <input className={inputCls} maxLength={40} placeholder="Riya" value={r.name} onChange={(e) => setR({ name: e.target.value })} />
        </Field>
        <Field label="Nickname" hint="Optional — shown on the intro screen">
          <input className={inputCls} maxLength={40} placeholder="Riyu" value={r.nickname} onChange={(e) => setR({ nickname: e.target.value })} />
        </Field>
        <Field label="Relation *">
          <input className={inputCls} maxLength={40} placeholder="Best Friend" value={r.relation} onChange={(e) => setR({ relation: e.target.value })} />
        </Field>
        <Field label="Age" hint="Optional">
          <input type="number" min={0} max={150} className={inputCls} placeholder="22" value={r.age} onChange={(e) => setR({ age: e.target.value })} />
        </Field>
      </div>
      <Field label="From *" hint="Who is sending this surprise?">
        <input className={inputCls} maxLength={80} placeholder="Arjun & gang" value={draft.from} onChange={(e) => update({ from: e.target.value })} />
      </Field>
    </div>
  );
}
