"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageData, TemplateId } from "@/lib/schema";
import { getTemplate, getTheme } from "@/templates/registry";

const shell = "bg-aurora flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center text-ink";

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
      <h1 className="font-display max-w-xl text-4xl sm:text-5xl">A surprise {name ? `for ${name} ` : ""}is waiting…</h1>
      <p className="text-muted">It unlocks in</p>
      <div className="flex gap-3">
        {parts.map(([label, v]) => (
          <div key={label} className="w-20 glass rounded-3xl py-5">
            <div className="font-display text-4xl tabular-nums text-ink">{String(v).padStart(2, "0")}</div>
            <div className="text-xs uppercase tracking-wider text-muted">{label}</div>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted">{new Date(to).toLocaleString()}</p>
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
          <span className="absolute inset-0 animate-ping rounded-full bg-blush/40" />
          <span className="text-5xl">🎁</span>
        </div>
        <p className="text-muted">Wrapping your surprise…</p>
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
        <h1 className="font-display text-4xl">This surprise is password protected</h1>
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
            className="glass rounded-full px-5 py-3.5 text-center text-ink outline-none focus:ring-4 focus:ring-lilac/20"
          />
          {pwError && <p className="text-sm text-[#b4235a]">{pwError}</p>}
          <button type="submit" className="btn-ink px-4 py-3.5">
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
        <h1 className="font-display text-4xl">{errorMsg || "Page not found"}</h1>
        <p className="text-muted">This occasion page doesn&apos;t exist or is no longer available.</p>
        <a href="/create" className="btn-ink mt-4 px-7 py-3.5">Create your own surprise →</a>
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
