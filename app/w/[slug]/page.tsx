"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageData, TemplateId } from "@/lib/schema";
import { getTemplate, getTheme } from "@/templates/registry";

const shell = "flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0B0420] px-6 text-center text-white";

function Countdown({ to, name, onDone }: { to: string; name?: string; onDone: () => void }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, new Date(to).getTime() - now);
  useEffect(() => {
    if (diff === 0) onDone();
  }, [diff, onDone]);

  const parts = [
    ["Days", Math.floor(diff / 86_400_000)],
    ["Hours", Math.floor(diff / 3_600_000) % 24],
    ["Minutes", Math.floor(diff / 60_000) % 60],
    ["Seconds", Math.floor(diff / 1000) % 60],
  ] as const;

  return (
    <div className={shell}>
      <div className="text-6xl">🔒</div>
      <h1 className="text-3xl font-bold">A surprise {name ? `for ${name} ` : ""}is waiting…</h1>
      <p className="text-white/60">It unlocks in</p>
      <div className="flex gap-3">
        {parts.map(([label, v]) => (
          <div key={label} className="w-20 rounded-2xl border border-pink-400/40 bg-white/5 py-4 shadow-[0_0_25px_rgba(255,79,163,0.25)]">
            <div className="text-3xl font-bold tabular-nums text-pink-300">{String(v).padStart(2, "0")}</div>
            <div className="text-xs uppercase tracking-wider text-white/50">{label}</div>
          </div>
        ))}
      </div>
      <p className="text-sm text-white/40">{new Date(to).toLocaleString()}</p>
    </div>
  );
}

export default function PublicPage() {
  const { slug } = useParams<{ slug: string }>();

  const [state, setState] = useState<"loading" | "locked" | "password" | "error" | "ready">("loading");
  const [page, setPage] = useState<PageData | null>(null);
  const [lock, setLock] = useState<{ revealAt: string; name?: string } | null>(null);
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchPage = async (pw?: string) => {
    const res = await fetch(`/api/v1/public/pages/${slug}`, { headers: pw ? { "x-page-password": pw } : {} });
    const json = await res.json();
    if (!json.success) {
      if (json.error?.code === "WRONG_PASSWORD") return setPwError("Wrong password. Try again.");
      setErrorMsg(json.error?.message || "Page not found");
      return setState("error");
    }
    const data = json.data;
    if (data.locked && data.revealAt) {
      setLock({ revealAt: data.revealAt, name: data.recipientName });
      setState("locked");
    } else if (data.locked && data.passwordRequired) {
      setState("password");
    } else {
      setPage(data.page);
      setState("ready");
      document.title = `For ${data.page.recipient?.name} 🎉`;
    }
  };

  useEffect(() => {
    fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (state === "loading") {
    return (
      <div className={shell}>
        <div className="relative grid h-24 w-24 place-items-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-pink-500/30" />
          <span className="text-5xl">🎁</span>
        </div>
        <p className="text-white/70">Wrapping your surprise…</p>
      </div>
    );
  }

  if (state === "locked" && lock) {
    return <Countdown to={lock.revealAt} name={lock.name} onDone={() => fetchPage()} />;
  }

  if (state === "password") {
    return (
      <div className={shell}>
        <div className="text-6xl">🔐</div>
        <h1 className="text-2xl font-bold">This surprise is password protected</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPwError("");
            fetchPage(password);
          }}
          className="flex w-full max-w-xs flex-col gap-3"
        >
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="rounded-xl border border-pink-400/60 bg-transparent px-4 py-3 text-white outline-none focus:ring-2 focus:ring-pink-400/40"
          />
          {pwError && <p className="text-sm text-pink-300">{pwError}</p>}
          <button type="submit" className="rounded-xl bg-pink-500 px-4 py-3 font-semibold hover:bg-pink-400">
            Unlock ✨
          </button>
        </form>
      </div>
    );
  }

  if (state === "error" || !page) {
    return (
      <div className={shell}>
        <div className="text-6xl">💔</div>
        <h1 className="text-2xl font-bold">{errorMsg || "Page not found"}</h1>
        <p className="text-white/50">This occasion page doesn&apos;t exist or is no longer available.</p>
        <a href="/create" className="mt-2 text-pink-300 hover:text-pink-200">Create your own surprise →</a>
      </div>
    );
  }

  const Template = getTemplate(page.theme.templateId as TemplateId);
  return (
    <>
      <Template page={page} theme={getTheme(page)} />
      <a href="/create" className="fixed bottom-5 left-5 z-30 rounded-full bg-black/60 px-4 py-2.5 text-xs font-medium text-white ring-1 ring-white/20 backdrop-blur-md transition hover:bg-black/80">
        ✨ Make your own
      </a>
    </>
  );
}
