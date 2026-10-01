"use client";
import { useState } from "react";
import type { Language, Occasion } from "@/lib/schema";
import type { StepProps } from "./draft";
import { Field, StepTitle, inputCls } from "./ui";

const LANGUAGES: { id: Language; label: string; sample: string }[] = [
  { id: "ENGLISH", label: "English", sample: "Happy Birthday" },
  { id: "HINGLISH", label: "Hinglish", sample: "Tu toh star hai!" },
  { id: "HINDI", label: "हिंदी", sample: "जन्मदिन मुबारक" },
];

// Quick-fill suggestions per occasion + language so nobody stares at a blank box
const SUGGESTIONS: Partial<Record<Occasion, Record<Language, string[]>>> = {
  BIRTHDAY: {
    ENGLISH: ["Happy birthday {name}! May this year bring you everything you've been dreaming of 🎂", "Another year of you being iconic. The world is lucky you were born ✨"],
    HINGLISH: ["Happy Birthday {name}, tu toh star hai! Hamesha aise hi muskurati reh 🎉", "Ek saal aur bada, par dimaag abhi bhi utna hi pagal 😂 Love you!"],
    HINDI: ["जन्मदिन की ढेर सारी शुभकामनाएँ {name}! तुम्हारा हर सपना पूरा हो 🎂", "भगवान तुम्हें हमेशा खुश रखे, यही दुआ है ✨"],
  },
  ANNIVERSARY: {
    ENGLISH: ["Happy anniversary {name}! Every year with you is better than the last 💞", "Here's to more inside jokes, late-night talks and forever 🥂"],
    HINGLISH: ["Happy anniversary {name}! Tumhare saath har saal aur bhi khaas lagta hai 💞", "Ladte bhi hain, manate bhi hain — yahi toh pyaar hai 🥂"],
    HINDI: ["सालगिरह मुबारक हो {name}! साथ का हर पल अनमोल है 💞", "यूँ ही हमेशा साथ रहो, खुश रहो 🥂"],
  },
  FAREWELL: {
    ENGLISH: ["{name}, you'll be missed more than you know. Go conquer the world! 👋", "Not goodbye — just see you later ✈️"],
    HINGLISH: ["{name}, tujhe bohot miss karenge yaar. Nayi journey ke liye all the best! 👋", "Bye nahi, see you soon bolte hain ✈️"],
    HINDI: ["{name}, तुम्हारी बहुत याद आएगी। नई शुरुआत के लिए शुभकामनाएँ! 👋", "अलविदा नहीं, फिर मिलेंगे ✈️"],
  },
};
const FALLBACK: Record<Language, string[]> = {
  ENGLISH: ["{name}, you deserve all the love and happiness in the world! ✨", "So proud of you, today and always 💛"],
  HINGLISH: ["{name}, tu sach mein bohot special hai, hamesha khush reh! ✨", "Proud of you yaar, hamesha 💛"],
  HINDI: ["{name}, तुम्हें दुनिया की सारी खुशियाँ मिलें! ✨", "तुम पर हमेशा गर्व है 💛"],
};

export default function StepWords({ draft, update }: StepProps) {
  const [suggestIdx, setSuggestIdx] = useState(0);
  const setMsg = (i: number, v: string) => update({ messages: draft.messages.map((m, j) => (j === i ? v : m)) });
  const setMem = (i: number, patch: Partial<(typeof draft.memories)[number]>) => update({ memories: draft.memories.map((m, j) => (j === i ? { ...m, ...patch } : m)) });

  const suggest = () => {
    const pool = SUGGESTIONS[draft.occasion]?.[draft.language] ?? FALLBACK[draft.language];
    const text = pool[suggestIdx % pool.length].replace("{name}", draft.recipient.nickname || draft.recipient.name || "you");
    setSuggestIdx((n) => n + 1);
    const empty = draft.messages.findIndex((m) => !m.trim());
    if (empty >= 0) setMsg(empty, text);
    else if (draft.messages.length < 5) update({ messages: [...draft.messages, text] });
  };

  return (
    <div className="space-y-10">
      <div>
        <StepTitle emoji="💌" title="Words & language" subtitle="All page headings, buttons and captions switch to this language." />
        <div className="grid grid-cols-3 gap-2">
          {LANGUAGES.map((l) => (
            <button key={l.id} type="button" onClick={() => update({ language: l.id })} className={`rounded-2xl border px-2 py-3 text-center transition ${draft.language === l.id ? "border-lilac bg-[#efe9ff] text-ink" : "border-ink/10 bg-white/70 text-ink/60 hover:text-ink"}`}>
              <div className="font-semibold">{l.label}</div>
              <div className="truncate text-xs opacity-60">{l.sample}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {draft.messages.map((m, i) => (
          <div key={i} className="relative">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-medium text-ink/50">Message {i + 1}{i === 0 ? " *" : ""}</span>
              <span className={`tabular-nums ${m.length > 540 ? "text-[#b4235a]" : "text-ink/30"}`}>{m.length}/600</span>
            </div>
            <textarea className={`${inputCls} min-h-28 resize-y leading-relaxed`} maxLength={600} placeholder={i === 0 ? "Happy birthday! You make every day brighter…" : "Another little note…"} value={m} onChange={(e) => setMsg(i, e.target.value)} />
            {draft.messages.length > 1 && (
              <button type="button" aria-label="Remove message" onClick={() => update({ messages: draft.messages.filter((_, j) => j !== i) })} className="absolute right-2 top-8 grid h-8 w-8 place-items-center rounded-full bg-ink/5 text-xs text-ink/60 transition hover:bg-[#ffe4ec] hover:text-[#b4235a]">
                ✕
              </button>
            )}
          </div>
        ))}
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={suggest} className="rounded-full bg-gradient-to-r from-lilac to-blush px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#8b7cf6]/30 transition hover:brightness-110">
            ✨ Write it for me
          </button>
          {draft.messages.length < 5 && (
            <button type="button" onClick={() => update({ messages: [...draft.messages, ""] })} className="rounded-full border border-ink/15 bg-white/70 px-5 py-2.5 text-sm text-ink/80 transition hover:bg-white">
              + Add message
            </button>
          )}
        </div>
      </div>

      <div className="border-t border-ink/10 pt-8">
        <StepTitle emoji="🗓️" title="Memory lane" subtitle="Optional — shared moments shown as a timeline (max 8)." />
        <div className="space-y-4">
          {draft.memories.map((mem, i) => (
            <div key={i} className="relative space-y-3 rounded-2xl border border-ink/10 bg-white/70 p-4 pl-14">
              <span className="absolute left-4 top-4 grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-lilac to-blush text-xs font-bold text-white">{i + 1}</span>
              <div className="grid gap-3 sm:grid-cols-[1fr_170px_auto]">
                <input className={inputCls} maxLength={80} placeholder="Goa trip 2023" value={mem.title} onChange={(e) => setMem(i, { title: e.target.value })} />
                <input type="date" className={inputCls} value={mem.date ?? ""} onChange={(e) => setMem(i, { date: e.target.value })} />
                <button type="button" aria-label="Remove memory" onClick={() => update({ memories: draft.memories.filter((_, j) => j !== i) })} className="rounded-xl px-3 py-2 text-ink/40 transition hover:bg-[#ffe4ec] hover:text-[#b4235a]">
                  ✕
                </button>
              </div>
              <Field label="What happened?" count={(mem.description ?? "").length} max={300}>
                <input className={inputCls} maxLength={300} placeholder="That beach night we'll never forget 🌊" value={mem.description ?? ""} onChange={(e) => setMem(i, { description: e.target.value })} />
              </Field>
              {draft.images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {draft.images.map((img) => (
                    <button key={img.id} type="button" onClick={() => setMem(i, { mediaId: mem.mediaId === img.id ? undefined : img.id })} className={`h-14 w-14 shrink-0 overflow-hidden rounded-xl ring-2 transition ${mem.mediaId === img.id ? "ring-lilac" : "ring-transparent opacity-60 hover:opacity-100"}`} aria-label="Use this photo for the memory">
                      <img src={img.url} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        {draft.memories.length < 8 && (
          <button type="button" onClick={() => update({ memories: [...draft.memories, { title: "", date: "", description: "" }] })} className="mt-4 w-full rounded-2xl border border-dashed border-ink/15 py-4 text-sm text-ink/60 transition hover:border-lilac/60 hover:bg-white/60 hover:text-ink">
            + Add a memory
          </button>
        )}
      </div>
    </div>
  );
}
