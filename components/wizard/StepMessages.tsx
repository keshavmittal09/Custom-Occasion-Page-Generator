"use client";
import { Language, Occasion } from "@/lib/schema";
import { StepProps } from "./draft";
import { Field, StepTitle, inputCls } from "./ui";

// Quick-fill suggestions so users are never stuck on a blank box
const SUGGESTIONS: Partial<Record<Occasion, Record<Language, string>>> = {
  BIRTHDAY: {
    ENGLISH: "Happy birthday {name}! May this year bring you everything you've been dreaming of. 🎂",
    HINGLISH: "Happy birthday {name}! Tu hamesha aise hi muskurati reh, saari khushiyan tujhe mile 🎉",
    HINDI: "जन्मदिन की ढेर सारी शुभकामनाएँ {name}! तुम्हारा हर सपना पूरा हो 🎂",
  },
  ANNIVERSARY: {
    ENGLISH: "Happy anniversary {name}! Every year with you is better than the last. 💞",
    HINGLISH: "Happy anniversary {name}! Tumhare saath har saal aur bhi khaas lagta hai 💞",
    HINDI: "सालगिरह मुबारक हो {name}! साथ का हर पल अनमोल है 💞",
  },
  FAREWELL: {
    ENGLISH: "{name}, you'll be missed more than you know. Go conquer the world! 👋",
    HINGLISH: "{name}, tujhe bohot miss karenge yaar. All the best for the new journey! 👋",
    HINDI: "{name}, तुम्हारी बहुत याद आएगी। नई शुरुआत के लिए शुभकामनाएँ! 👋",
  },
};

const fallback: Record<Language, string> = {
  ENGLISH: "{name}, you deserve all the love and happiness in the world! ✨",
  HINGLISH: "{name}, tu sach mein bohot special hai, hamesha khush reh! ✨",
  HINDI: "{name}, तुम्हें दुनिया की सारी खुशियाँ मिलें! ✨",
};

export default function StepMessages({ draft, update }: StepProps) {
  const setMsg = (i: number, v: string) => update({ messages: draft.messages.map((m, j) => (j === i ? v : m)) });

  const suggest = () => {
    const tpl = SUGGESTIONS[draft.occasion]?.[draft.language] ?? fallback[draft.language];
    const text = tpl.replace("{name}", draft.recipient.nickname || draft.recipient.name || "you");
    const empty = draft.messages.findIndex((m) => !m.trim());
    if (empty >= 0) setMsg(empty, text);
    else if (draft.messages.length < 5) update({ messages: [...draft.messages, text] });
  };

  const setMem = (i: number, patch: Partial<(typeof draft.memories)[number]>) =>
    update({ memories: draft.memories.map((m, j) => (j === i ? { ...m, ...patch } : m)) });

  return (
    <div className="space-y-10">
      <div>
        <StepTitle emoji="💌" title="Write from the heart" subtitle="Up to 5 messages. They'll animate in one by one." />
        <div className="space-y-4">
          {draft.messages.map((m, i) => (
            <div key={i} className="group relative">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-ink/50">Message {i + 1}</span>
                <span className={`tabular-nums ${m.length > 540 ? "text-pink-600" : "text-ink/30"}`}>{m.length}/600</span>
              </div>
              <textarea className={`${inputCls} min-h-28 resize-y leading-relaxed`} maxLength={600} placeholder={i === 0 ? "Happy birthday! You make every day brighter…" : "Another little note…"} value={m} onChange={(e) => setMsg(i, e.target.value)} />
              {draft.messages.length > 1 && (
                <button type="button" aria-label="Remove message" onClick={() => update({ messages: draft.messages.filter((_, j) => j !== i) })} className="absolute right-2 top-8 grid h-7 w-7 place-items-center rounded-full bg-ink/5 text-xs text-ink/60 opacity-0 transition hover:bg-red-500/30 hover:text-ink group-hover:opacity-100">
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={suggest} className="rounded-full bg-gradient-to-r from-lilac to-blush px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#8b7cf6]/30 transition hover:brightness-110">
            ✨ Suggest a message
          </button>
          {draft.messages.length < 5 && (
            <button type="button" onClick={() => update({ messages: [...draft.messages, ""] })} className="rounded-full border border-ink/15 px-5 py-2.5 text-sm text-ink/80 transition hover:bg-white">
              + Add message
            </button>
          )}
        </div>
      </div>

      <div className="border-t border-ink/10 pt-8">
        <StepTitle emoji="🗓️" title="Memory lane" subtitle="Optional. Shared moments shown as a timeline (max 8)." />
        <div className="space-y-4">
          {draft.memories.map((mem, i) => (
            <div key={i} className="relative space-y-3 rounded-2xl border border-ink/10 bg-white/70 p-4 pl-14">
              <span className="absolute left-4 top-4 grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-lilac to-blush text-xs font-bold text-white">{i + 1}</span>
              <div className="grid gap-3 sm:grid-cols-[1fr_170px_auto]">
                <input className={inputCls} maxLength={80} placeholder="Goa trip 2023" value={mem.title} onChange={(e) => setMem(i, { title: e.target.value })} />
                <input type="date" className={inputCls} value={mem.date ?? ""} onChange={(e) => setMem(i, { date: e.target.value })} />
                <button type="button" aria-label="Remove memory" onClick={() => update({ memories: draft.memories.filter((_, j) => j !== i) })} className="rounded-xl px-3 py-2 text-ink/40 transition hover:bg-red-500/20 hover:text-ink">
                  ✕
                </button>
              </div>
              <Field label="What happened?" count={(mem.description ?? "").length} max={300}>
                <input className={inputCls} maxLength={300} placeholder="That beach night we'll never forget 🌊" value={mem.description ?? ""} onChange={(e) => setMem(i, { description: e.target.value })} />
              </Field>
            </div>
          ))}
        </div>
        {draft.memories.length < 8 && (
          <button type="button" onClick={() => update({ memories: [...draft.memories, { title: "", date: "", description: "" }] })} className="mt-4 w-full rounded-2xl border border-dashed border-ink/15 py-4 text-sm text-ink/60 transition hover:border-pink-400/50 hover:bg-white/70 hover:text-ink">
            + Add a memory
          </button>
        )}
      </div>
    </div>
  );
}
