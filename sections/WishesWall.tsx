"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionProps, cardStyle, headingStyle, t } from "./types";

type Wish = { _id: string; name: string; message: string; emoji: string; createdAt: string };
const EMOJIS = ["❤️", "🎉", "🥳", "🌟", "🤗", "🎂"];

function timeAgo(iso: string) {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

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
    if (!name.trim() || !message.trim()) return setStatus("Add your name and a message 🙂");
    setStatus("sending");
    try {
      const res = await fetch(`/api/v1/public/pages/${slug}/wishes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, emoji }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message);
      setWishes((w) => [json.data, ...w]);
      setMessage("");
      setStatus("sent");
      setTimeout(() => setStatus(""), 2000);
    } catch (err: any) {
      setStatus(err.message || "Could not send");
    }
  };

  const pastel = variant === "pastel";
  const textColor = pastel ? "#1A1A2E" : theme.text;
  const field = `w-full rounded-2xl px-4 py-3 outline-none transition placeholder:opacity-50 focus:ring-2 ${pastel ? "bg-pink-50 focus:ring-pink-300" : "bg-white/[0.06] focus:ring-white/20"}`;

  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold tracking-tight sm:text-6xl" style={headingStyle(variant, theme)}>
          {t(page, "wishes.title")} 💬
        </h2>
        <p className="mt-3 text-sm uppercase tracking-[0.3em] opacity-50">
          {wishes.length ? `${wishes.length} wish${wishes.length > 1 ? "es" : ""} so far` : "leave yours below"}
        </p>
      </div>

      <form onSubmit={send} className="mx-auto mb-14 max-w-xl space-y-3 p-6 sm:p-7" style={{ ...cardStyle(variant, theme), color: textColor }}>
        <input className={field} style={{ color: textColor }} maxLength={50} placeholder={t(page, "wishes.name")} value={name} onChange={(e) => setName(e.target.value)} />
        <div className="relative">
          <textarea className={`${field} min-h-28 resize-none`} style={{ color: textColor }} maxLength={280} placeholder={t(page, "wishes.placeholder")} value={message} onChange={(e) => setMessage(e.target.value)} />
          <span className="absolute bottom-3 right-4 text-xs tabular-nums opacity-40">{message.length}/280</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1">
            {EMOJIS.map((em) => (
              <button type="button" key={em} onClick={() => setEmoji(em)} aria-label={`React ${em}`} className={`grid h-9 w-9 place-items-center rounded-full text-lg transition ${emoji === em ? "scale-110 ring-2" : "opacity-50 hover:opacity-100"}`} style={emoji === em ? { boxShadow: `0 0 0 2px ${theme.accent}` } : undefined}>
                {em}
              </button>
            ))}
          </div>
          <button type="submit" disabled={status === "sending"} className="rounded-full px-7 py-3 font-semibold shadow-lg transition hover:brightness-110 active:scale-95 disabled:opacity-60" style={{ background: theme.accent, color: pastel ? "#1A1A2E" : "#fff" }}>
            {status === "sending" ? "Sending…" : status === "sent" ? "Sent ✓" : `${t(page, "wishes.send")} ${emoji}`}
          </button>
        </div>
        {status && !["sending", "sent"].includes(status) && <p className="text-sm text-red-400">{status}</p>}
      </form>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        <AnimatePresence>
          {wishes.map((w) => (
            <motion.div key={w._id} layout initial={{ opacity: 0, scale: 0.85, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="mb-4 break-inside-avoid p-5" style={{ ...cardStyle(variant, theme), color: textColor }}>
              <div className="mb-3 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full text-xl" style={{ background: `${theme.accent}25` }}>{w.emoji}</span>
                <div>
                  <p className="font-semibold leading-tight">{w.name}</p>
                  <p className="text-xs opacity-50">{timeAgo(w.createdAt)}</p>
                </div>
              </div>
              <p className="whitespace-pre-line leading-relaxed opacity-90">{w.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {!wishes.length && <p className="text-center opacity-50">Be the first to leave a wish ✨</p>}
    </section>
  );
}
