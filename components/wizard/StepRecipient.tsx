"use client";
import { StepProps } from "./draft";
import { Chip, Field, StepTitle, inputCls } from "./ui";

const RELATIONS = ["Best Friend", "Partner", "Mom", "Dad", "Sister", "Brother", "Cousin", "Grandma", "Colleague", "Teacher", "Bestie 💅"];

export default function StepRecipient({ draft, update }: StepProps) {
  const r = draft.recipient;
  const setR = (patch: Partial<typeof r>) => update({ recipient: { ...r, ...patch } });

  return (
    <div className="space-y-6">
      <StepTitle emoji="💝" title="Who is it for?" subtitle="Tell us about the special person." />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Their name *" count={r.name.length} max={40}>
          <input className={inputCls} maxLength={40} placeholder="Riya" value={r.name} onChange={(e) => setR({ name: e.target.value })} autoFocus />
        </Field>
        <Field label="Nickname" hint="Optional — shown on the intro. Names in हिंदी work too.">
          <input className={inputCls} maxLength={40} placeholder="Riyu" value={r.nickname} onChange={(e) => setR({ nickname: e.target.value })} />
        </Field>
      </div>

      <Field label="Relation *">
        <input className={inputCls} maxLength={40} placeholder="Best Friend" value={r.relation} onChange={(e) => setR({ relation: e.target.value })} />
      </Field>
      <div className="-mt-3 flex flex-wrap gap-2">
        {RELATIONS.map((rel) => (
          <Chip key={rel} active={r.relation === rel} onClick={() => setR({ relation: rel })}>
            {rel}
          </Chip>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-[140px_1fr]">
        <Field label="Age" hint="Optional">
          <input type="number" min={0} max={150} className={inputCls} placeholder="22" value={r.age} onChange={(e) => setR({ age: e.target.value })} />
        </Field>
        <Field label="From *" hint="Who is sending this surprise?">
          <input className={inputCls} maxLength={80} placeholder="Arjun & gang" value={draft.from} onChange={(e) => update({ from: e.target.value })} />
        </Field>
      </div>

      {r.name && (
        <div className="rounded-2xl border border-ink/10 bg-gradient-to-r from-[#ffe3cf]/60 to-[#e3d9ff]/60 p-4 text-sm text-ink/70">
          Preview: <span className="font-semibold text-ink">“{r.nickname || r.name}”</span>
          {r.relation && <> · your {r.relation.toLowerCase()}</>}
          {draft.from && <> · from <span className="text-ink">{draft.from}</span></>}
        </div>
      )}
    </div>
  );
}
