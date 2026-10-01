"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionProps, cardStyle, headingStyle, t } from "./types";

type Wish = { _id: string; name: string; message: string; emoji: string; createdAt: string };
const EMOJIS = ["❤️", "🎉", "🥳", "🌟", "🤗", "🎂"];

export default function WishesWall({ page, theme, variant }: SectionProps) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [status, setStatus] = useState("");
  const slug = page.slug;

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/v1/public/pages/${slug}/wishes`)
      .then((r) => r.json())
      .then((j) => j.success && setWishes(j.data))
      .catch(() => {});
  }, [slug]);

  if (!slug || page.settings?.wishesWall === false) return null;

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setStatus("sending");
    const res = await fetch(`/api/v1/public/pages/${slug}/wishes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message, emoji }),
    });
    const json = await res.json();
    if (json.success) {
      setWishes((w) => [json.data, ...w]);
      setMessage("");
      setStatus("");
    } else setStatus(json.error?.message || "Could not send");
  };

  const textColor = variant === "pastel" ? "#1A1A2E" : theme.text;
  const field = "w-full rounded-xl px-4 py-3 outline-none bg-black/10 placeholder:opacity-50";

  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <h2 className="mb-10 text-center text-4xl font-bold sm:text-5xl" style={headingStyle(variant, theme)}>
        💬 {t(page, "wishes.title")}
      </h2>

      <form onSubmit={send} className="mx-auto mb-12 max-w-xl space-y-3 p-6" style={{ ...cardStyle(variant, theme), color: textColor }}>
        <input className={field} style={{ color: textColor }} maxLength={50} placeholder={t(page, "wishes.name")} value={name} onChange={(e) => setName(e.target.value)} />
        <textarea className={`${field} min-h-24`} style={{ color: textColor }} maxLength={280} placeholder={t(page, "wishes.placeholder")} value={message} onChange={(e) => setMessage(e.target.value)} />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1">
            {EMOJIS.map((em) => (
              <button type="button" key={em} onClick={() => setEmoji(em)} className={`rounded-lg p-1.5 text-xl transition ${emoji === em ? "scale-125 bg-white/20" : "opacity-60"}`}>
                {em}
              </button>
            ))}
          </div>
          <button type="submit" disabled={status === "sending"} className="rounded-full px-6 py-2.5 font-semibold disabled:opacity-60" style={{ background: theme.accent, color: variant === "pastel" ? "#1A1A2E" : "#fff" }}>
            {status === "sending" ? "…" : t(page, "wishes.send")}
          </button>
        </div>
        {status && status !== "sending" && <p className="text-sm text-red-400">{status}</p>}
      </form>

      <div className="grid gap-4 sm:grid-cols-2">
        <AnimatePresence>
          {wishes.map((w) => (
            <motion.div key={w._id} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="p-5" style={{ ...cardStyle(variant, theme), color: textColor }}>
              <div className="flex items-start gap-3">
                <span className="text-3xl">{w.emoji}</span>
                <div>
                  <p className="whitespace-pre-line">{w.message}</p>
                  <p className="mt-2 text-sm font-semibold opacity-70">— {w.name}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {!wishes.length && <p className="text-center opacity-50">Be the first to leave a wish ✨</p>}
    </section>
  );
}
