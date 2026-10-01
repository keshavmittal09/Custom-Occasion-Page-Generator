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
    <div className="space-y-8">
      <div>
        <StepTitle title="Write from the heart" subtitle="Up to 5 messages — they'll appear one by one." />
        <div className="space-y-3">
          {draft.messages.map((m, i) => (
            <div key={i} className="flex gap-2">
              <textarea className={`${inputCls} min-h-24`} maxLength={600} placeholder={`Message ${i + 1}`} value={m} onChange={(e) => setMsg(i, e.target.value)} />
              {draft.messages.length > 1 && (
                <button type="button" onClick={() => update({ messages: draft.messages.filter((_, j) => j !== i) })} className="self-start rounded-lg px-3 py-2 text-white/50 hover:bg-white/10 hover:text-white">
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {draft.messages.length < 5 && (
            <button type="button" onClick={() => update({ messages: [...draft.messages, ""] })} className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/80 hover:bg-white/10">
              + Add message
            </button>
          )}
          <button type="button" onClick={suggest} className="rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 px-4 py-2 text-sm font-medium text-white">
            ✨ Suggest a message
          </button>
        </div>
      </div>

      <div>
        <StepTitle title="Memory lane" subtitle="Optional — shared moments shown as a timeline (max 8)." />
        <div className="space-y-4">
          {draft.memories.map((mem, i) => (
            <div key={i} className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="grid gap-3 sm:grid-cols-[1fr_180px_auto]">
                <input className={inputCls} maxLength={80} placeholder="Goa trip 2023" value={mem.title} onChange={(e) => setMem(i, { title: e.target.value })} />
                <input type="date" className={inputCls} value={mem.date ?? ""} onChange={(e) => setMem(i, { date: e.target.value })} />
                <button type="button" onClick={() => update({ memories: draft.memories.filter((_, j) => j !== i) })} className="rounded-lg px-3 text-white/50 hover:bg-white/10 hover:text-white">
                  ✕
                </button>
              </div>
              <Field label="What happened?">
                <input className={inputCls} maxLength={300} placeholder="That beach night we'll never forget 🌊" value={mem.description ?? ""} onChange={(e) => setMem(i, { description: e.target.value })} />
              </Field>
            </div>
          ))}
        </div>
        {draft.memories.length < 8 && (
          <button type="button" onClick={() => update({ memories: [...draft.memories, { title: "", date: "", description: "" }] })} className="mt-3 rounded-xl border border-white/15 px-4 py-2 text-sm text-white/80 hover:bg-white/10">
            + Add memory
          </button>
        )}
      </div>
    </div>
  );
}
