"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { AnimatePresence, motion } from "framer-motion";
import type { PageData, TemplateId } from "@/lib/schema";
import { getTemplate, getTheme } from "@/templates/registry";
import en from "@/locales/en.json";
import hi from "@/locales/hi.json";

type State = "loading" | "locked" | "password" | "disabled" | "missing" | "ready";
const shell = "bg-aurora flex min-h-[100svh] flex-col items-center justify-center gap-4 px-6 text-center text-ink";

// Flip-style digit for the countdown lock screen
function Flip({ value, label }: { value: number; label: string }) {
  const v = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="glass relative h-20 w-16 overflow-hidden rounded-2xl sm:h-24 sm:w-20" style={{ perspective: 400 }}>
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span key={v} initial={{ rotateX: -90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} exit={{ rotateX: 90, opacity: 0 }} transition={{ duration: 0.35 }} className="font-display absolute inset-0 grid place-items-center text-4xl tabular-nums sm:text-5xl">
            {v}
          </motion.span>
        </AnimatePresence>
        <span className="absolute inset-x-0 top-1/2 h-px bg-ink/10" />
      </div>
      <span className="text-[11px] uppercase tracking-widest text-muted">{label}</span>
    </div>
  );
}

function Countdown({ to, name, onDone }: { to: string; name?: string; onDone: () => void }) {
  const [now, setNow] = useState(() => Date.now());
  const lang = (typeof navigator !== "undefined" && navigator.language?.startsWith("hi")) ? hi : en;
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, new Date(to).getTime() - now);
  useEffect(() => {
    if (diff === 0) onDone();
  }, [diff, onDone]);

  return (
    <div className={shell}>
      <motion.div animate={{ rotate: [0, -8, 8, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="text-6xl">🎁</motion.div>
      <h1 className="font-display max-w-xl text-4xl sm:text-5xl">{lang["lock.teaser"].replace("{name}", name || "you")}</h1>
      <p className="text-muted">{lang["countdown.title"]}</p>
      <div className="flex gap-2 sm:gap-3">
        <Flip value={Math.floor(diff / 86_400_000)} label={lang["countdown.days"]} />
        <Flip value={Math.floor(diff / 3_600_000) % 24} label={lang["countdown.hours"]} />
        <Flip value={Math.floor(diff / 60_000) % 60} label={lang["countdown.minutes"]} />
        <Flip value={Math.floor(diff / 1000) % 60} label={lang["countdown.seconds"]} />
      </div>
      <p className="text-sm text-muted">{new Date(to).toLocaleString()}</p>
    </div>
  );
}

export default function Viewer({ slug }: { slug: string }) {
  const [state, setState] = useState<State>("loading");
  const [page, setPage] = useState<PageData | null>(null);
  const [lock, setLock] = useState<{ revealAt?: string; name?: string }>({});
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [unlocking, setUnlocking] = useState(false);
  const viewed = useRef(false);
  const tokenKey = `vt:${slug}`;

  const load = useCallback(async () => {
    let token: string | null = null;
    try {
      token = sessionStorage.getItem(tokenKey);
    } catch {}
    const res = await fetch(`/api/v1/public/pages/${slug}`, { headers: token ? { "x-view-token": token } : {} }).catch(() => null);
    const json = await res?.json().catch(() => null);
    if (!json?.success) return setState(json?.error?.code === "DISABLED" ? "disabled" : "missing");
    const d = json.data;
    if (d.locked && d.revealAt) {
      setLock({ revealAt: d.revealAt, name: d.recipientName });
      setState("locked");
    } else if (d.locked && d.passwordRequired) {
      setLock({ name: d.recipientName });
      setState("password");
    } else {
      setPage(d.page);
      setState("ready");
      document.title = `For ${d.page.recipient?.name} 🎉 · Wishly`;
    }
  }, [slug, tokenKey]);

  useEffect(() => {
    load();
  }, [load]);

  // Count the view once the page actually renders (server dedupes per visitor per 30 min)
  useEffect(() => {
    if (state !== "ready" || viewed.current || !page?.slug || slug.startsWith("demo")) return;
    viewed.current = true;
    fetch(`/api/v1/public/pages/${slug}/view`, { method: "POST" }).catch(() => {});
  }, [state, page, slug]);

  // Page-wide smooth scrolling (skipped for reduced motion)
  useEffect(() => {
    if (state !== "ready" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1 });
    (window as any).__lenis = lenis;
    let id = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
      (window as any).__lenis = undefined;
    };
  }, [state]);

  const unlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setUnlocking(true);
    const res = await fetch(`/api/v1/public/pages/${slug}/unlock`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    const json = await res.json().catch(() => null);
    setUnlocking(false);
    if (!json?.success) return setPwError(json?.error?.message || "Wrong password");
    try {
      sessionStorage.setItem(tokenKey, json.data.token);
    } catch {}
    load();
  };

  if (state === "loading")
    return (
      <div className={shell}>
        <div className="relative grid h-24 w-24 place-items-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-blush/40" />
          <span className="text-5xl">🎁</span>
        </div>
        <p className="text-muted">Wrapping your surprise…</p>
      </div>
    );

  if (state === "locked" && lock.revealAt) return <Countdown to={lock.revealAt} name={lock.name} onDone={load} />;

  if (state === "password") {
    const copy = en;
    return (
      <div className={shell}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="text-6xl">🔐</motion.div>
        <h1 className="font-display text-4xl">{copy["password.title"]}</h1>
        {lock.name && <p className="text-muted">A little something for {lock.name}</p>}
        <form onSubmit={unlock} className="mt-2 flex w-full max-w-xs flex-col gap-3">
          <input type="password" autoFocus value={password} onChange={(e) => setPassword(e.target.value)} placeholder={copy["password.placeholder"]} className="glass rounded-full px-5 py-3.5 text-center text-base text-ink outline-none focus:ring-4 focus:ring-lilac/20" />
          {pwError && <p className="text-sm text-[#b4235a]">{pwError}</p>}
          <button type="submit" disabled={unlocking || !password} className="btn-ink px-4 py-3.5 disabled:opacity-60">
            {unlocking ? "…" : `${copy["password.submit"]} ✨`}
          </button>
        </form>
      </div>
    );
  }

  if (state === "disabled" || state === "missing" || !page)
    return (
      <div className={shell}>
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-display text-8xl">{state === "disabled" ? "🚫" : "404"}</motion.div>
        <h1 className="font-display text-4xl">{state === "disabled" ? "This page is unavailable" : "This surprise doesn't exist (yet)"}</h1>
        <p className="max-w-sm text-muted">{state === "disabled" ? "It was taken down by the Wishly team." : "The link might be mistyped, or the page was taken offline."}</p>
        <a href="/create" className="btn-ink mt-4 px-7 py-3.5">Create your own surprise →</a>
      </div>
    );

  const Template = getTemplate(page.theme.templateId as TemplateId);
  return <Template page={page} theme={getTheme(page)} mode="live" />;
}

