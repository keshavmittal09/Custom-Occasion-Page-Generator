"use client";
import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SectionProps, cardStyle, cfgOf, headingStyle, sectionTitle, t } from "./types";
import { WinBar } from "./Chrome";

// Word-by-word reveal as each message scrolls into view
function RevealText({ text }: { text: string }) {
  const words = text.split(/(\s+)/);
  return (
    <motion.p className="whitespace-pre-line" initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={{ show: { transition: { staggerChildren: 0.035 } } }}>
      {words.map((w, i) =>
        /^\s+$/.test(w) ? (
          w
        ) : (
          <motion.span key={i} className="inline-block" variants={{ hidden: { opacity: 0, y: 12, filter: "blur(6px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)" } }}>
            {w}
          </motion.span>
        )
      )}
    </motion.p>
  );
}

// iMessage-style bubble that shows "typing…" before the text appears
function ChatBubble({ text, delay, accent }: { text: string; delay: number; accent: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [typing, setTyping] = useState(true);
  useEffect(() => {
    if (!inView) return;
    const id = setTimeout(() => setTyping(false), 900 + delay);
    return () => clearTimeout(id);
  }, [inView, delay]);

  return (
    <div ref={ref} className="flex min-h-12 justify-start">
      {inView && (
        <motion.div initial={{ opacity: 0, scale: 0.6, x: -20 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ type: "spring", stiffness: 260, damping: 20, delay: delay / 1000 }} className="max-w-[85%] rounded-[22px] rounded-bl-md bg-[#e9e9eb] px-4 py-2.5 text-[17px] leading-snug text-black">
          {typing ? (
            <span className="flex gap-1 py-1.5" aria-label="typing">
              {[0, 1, 2].map((i) => (
                <motion.span key={i} className="h-2 w-2 rounded-full bg-neutral-400" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />
              ))}
            </span>
          ) : (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-pre-line">
              {text}
            </motion.span>
          )}
        </motion.div>
      )}
      <span className="sr-only">{accent}</span>
    </div>
  );
}

export default function Message({ page, theme, variant }: SectionProps) {
  const cfg = cfgOf(variant);
  if (!page.messages?.length) return null;
  const title = sectionTitle(page, variant, "message");

  if (cfg.messages === "chat") {
    return (
      <section className="mx-auto max-w-xl px-4 py-20">
        <h2 className={`mb-8 text-center ${cfg.headingSize}`} style={headingStyle(variant, theme)}>{title}</h2>
        <div className="overflow-hidden rounded-[32px] bg-white shadow-xl">
          <div className="flex flex-col items-center gap-1 border-b border-neutral-200 bg-neutral-50/80 py-4">
            <span className="grid h-12 w-12 place-items-center rounded-full text-xl font-semibold text-white" style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.secondary})` }}>
              {page.from.trim()[0]?.toUpperCase() ?? "💬"}
            </span>
            <span className="text-sm font-semibold text-black">{page.from}</span>
            <span className="text-[11px] text-neutral-500">iMessage · Today</span>
          </div>
          <div className="space-y-3 p-4">
            {page.messages.map((m, i) => (
              <ChatBubble key={i} text={m} delay={i * 250} accent={theme.accent} />
            ))}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 1.6 + page.messages.length * 0.3 }} className="flex flex-col items-end">
              <span className="rounded-[22px] rounded-br-md px-4 py-2.5 text-[17px] text-white" style={{ background: theme.accent }}>🥹🥹🥹 love you</span>
              <span className="mt-1 text-[11px] text-neutral-400">Read just now</span>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-5 py-24">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14 text-center">
        <h2 className={cfg.headingSize} style={headingStyle(variant, theme)}>{title}</h2>
        <p className="mt-3 text-sm uppercase tracking-[0.3em] opacity-50">{t(page, "intro.for")} {page.recipient.nickname || page.recipient.name}</p>
      </motion.div>

      <div className="space-y-10">
        {page.messages.map((msg, i) => (
          <motion.blockquote
            key={i}
            initial={{ opacity: 0, y: 40, rotate: cfg.tilt ? (i % 2 ? 1.5 : -1.5) : 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={`relative overflow-hidden text-xl leading-relaxed sm:text-2xl ${i % 2 ? "sm:ml-12" : "sm:mr-12"}`}
            style={cardStyle(variant, theme)}
          >
            {cfg.chrome === "win98" && <WinBar title={`message_${i + 1}.txt`} />}
            <div className="relative p-7 sm:p-10">
              {!cfg.chrome && (
                <span className="absolute left-4 top-0 font-serif text-7xl leading-none" style={{ color: theme.accent, opacity: 0.55 }} aria-hidden>
                  “
                </span>
              )}
              <RevealText text={msg} />
            </div>
          </motion.blockquote>
        ))}
      </div>

      <motion.p initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="mt-12 text-right text-xl italic" style={{ color: cfg.light ? theme.text : theme.secondary }}>
        — {page.from}
      </motion.p>
    </section>
  );
}
