"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionProps, cardStyle, cfgOf, headingStyle, sectionTitle, t, useMode } from "./types";
import { WinBar } from "./Chrome";

type Wish = { _id: string; name: string; message: string; emoji: string; createdAt: string };
const EMOJIS = ["❤️", "🎉", "🥳", "🌟", "🤗", "🎂", "🫶", "😭"];
const NOTE_COLORS = ["#fff4a3", "#ffd6e7", "#d6f5ff", "#e3ffd6", "#efe1ff"];

function timeAgo(iso: string) {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function WishesWall({ page, theme, variant }: SectionProps) {
  const cfg = cfgOf(variant);
  const mode = useMode();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [status, setStatus] = useState("");
  const slug = page.slug;
  const enabled = !!slug && mode === "live" && page.settings?.wishesWall !== false;

  const headers = () => {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    try {
      const tok = slug && sessionStorage.getItem(`vt:${slug}`);
      if (tok) h["x-view-token"] = tok;
    } catch {}
    return h;
  };

  useEffect(() => {
    if (!enabled) return;
    fetch(`/api/v1/public/pages/${slug}/wishes`, { headers: headers() })
      .then((r) => r.json())
      .then((j) => j.success && setWishes(j.data))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, slug]);

  if (!enabled) return null;

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return setStatus("Add your name and a message 🙂");
    setStatus("sending");
    try {
      const res = await fetch(`/api/v1/public/pages/${slug}/wishes`, { method: "POST", headers: headers(), body: JSON.stringify({ name, message, emoji }) });
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

  const ink = cfg.cardInk(theme);
  const field = "w-full rounded-2xl px-4 py-3 text-base outline-none transition placeholder:opacity-50 focus:ring-2";
  const fieldStyle = { color: ink, background: cfg.light ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.08)" };
  const notes = cfg.light && !cfg.chrome && variant !== "brat";

  return (
    <section className="mx-auto max-w-5xl px-5 py-24">
      <div className="mb-12 text-center">
        <h2 className={cfg.headingSize} style={headingStyle(variant, theme)}>{sectionTitle(page, variant, "wishes")}</h2>
        <p className="mt-3 text-sm uppercase tracking-[0.3em] opacity-50">{wishes.length ? `${wishes.length} 💌` : t(page, "wishes.empty")}</p>
      </div>

      <form onSubmit={send} className="mx-auto mb-14 max-w-xl overflow-hidden" style={cardStyle(variant, theme)}>
        {cfg.chrome === "win98" && <WinBar title="New wish.txt" icon="✏️" />}
        <div className="space-y-3 p-6 sm:p-7">
          <input className={field} style={fieldStyle} maxLength={50} placeholder={t(page, "wishes.name")} value={name} onChange={(e) => setName(e.target.value)} />
          <div className="relative">
            <textarea className={`${field} min-h-28 resize-none`} style={fieldStyle} maxLength={280} placeholder={t(page, "wishes.placeholder")} value={message} onChange={(e) => setMessage(e.target.value)} />
            <span className="absolute bottom-3 right-4 text-xs tabular-nums opacity-40">{message.length}/280</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1">
              {EMOJIS.map((em) => (
                <button type="button" key={em} onClick={() => setEmoji(em)} aria-label={`React ${em}`} className={`grid h-9 w-9 place-items-center rounded-full text-lg transition ${emoji === em ? "scale-110" : "opacity-50 hover:opacity-100"}`} style={emoji === em ? { boxShadow: `0 0 0 2px ${theme.accent}` } : undefined}>
                  {em}
                </button>
              ))}
            </div>
            <button type="submit" disabled={status === "sending"} className="rounded-full px-7 py-3 font-semibold shadow-lg transition hover:brightness-110 active:scale-95 disabled:opacity-60" style={{ background: theme.accent, color: cfg.onAccent(theme) }}>
              {status === "sending" ? "…" : status === "sent" ? "✓" : `${t(page, "wishes.send")} ${emoji}`}
            </button>
          </div>
          {status && !["sending", "sent"].includes(status) && <p className="text-sm text-red-500">{status}</p>}
        </div>
      </form>

      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        <AnimatePresence>
          {wishes.map((w, i) => (
            <motion.div
              key={w._id}
              layout
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: notes ? (i % 3) - 1 : 0 }}
              className="mb-5 break-inside-avoid overflow-hidden"
              style={notes ? { background: NOTE_COLORS[i % NOTE_COLORS.length], color: "#2b2b2b", borderRadius: 4, boxShadow: "0 12px 24px -12px rgba(0,0,0,.35)" } : cardStyle(variant, theme)}
            >
              {cfg.chrome === "win98" && <WinBar title={`from_${w.name}.txt`} icon="💌" />}
              <div className="p-5">
                <div className="mb-3 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full text-xl" style={{ background: `${theme.accent}25` }}>{w.emoji}</span>
                  <div>
                    <p className="font-semibold leading-tight">{w.name}</p>
                    <p className="text-xs opacity-50">{timeAgo(w.createdAt)}</p>
                  </div>
                </div>
                <p className="whitespace-pre-line leading-relaxed opacity-90">{w.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
