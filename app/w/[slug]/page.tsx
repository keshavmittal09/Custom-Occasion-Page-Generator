"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageData, TemplateId } from "@/lib/schema";
import { getTemplate, getTheme } from "@/templates/registry";
import { riyaFixture } from "@/lib/fixtures/riya";

export default function PublicPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [state, setState] = useState<"loading" | "locked" | "password" | "error" | "ready">("loading");
  const [page, setPage] = useState<PageData | null>(null);
  const [revealAt, setRevealAt] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState("");

  const fetchPage = async (pw?: string) => {
    const headers: Record<string, string> = {};
    if (pw) headers["x-page-password"] = pw;

    const res = await fetch(`/api/v1/public/pages/${slug}`, { headers });
    const json = await res.json();

    if (!json.success) {
      setState("error");
      return;
    }

    const data = json.data;
    if (data.locked && data.revealAt) {
      setRevealAt(data.revealAt);
      setState("locked");
    } else if (data.locked && data.passwordRequired) {
      setState("password");
    } else {
      setPage(data.page);
      setState("ready");
    }
  };

  useEffect(() => { fetchPage(); }, [slug]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    const res = await fetch(`/api/v1/public/pages/${slug}`, {
      headers: { "x-page-password": password },
    });
    const json = await res.json();
    if (!json.success) { setPwError("Wrong password. Try again."); return; }
    const data = json.data;
    setPage(data.page);
    setState("ready");
  };

  if (state === "loading") {
    return (
      <div style={{ background: "#0B0420", color: "#fff", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>✨</div>
          <p>Loading your surprise...</p>
        </div>
      </div>
    );
  }

  if (state === "locked" && revealAt) {
    return (
      <div style={{ background: "#0B0420", color: "#fff", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
        <div style={{ fontSize: "4rem" }}>🔒</div>
        <h1 style={{ fontSize: "1.5rem" }}>This page unlocks on</h1>
        <p style={{ color: "#FF4FA3", fontSize: "1.2rem" }}>{new Date(revealAt).toLocaleString()}</p>
        <p style={{ opacity: 0.5 }}>Come back then! 🎉</p>
      </div>
    );
  }

  if (state === "password") {
    return (
      <div style={{ background: "#0B0420", color: "#fff", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
        <div style={{ fontSize: "4rem" }}>🔐</div>
        <h1>Password Required</h1>
        <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", minWidth: 280 }}>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter password"
            style={{ padding: "0.75rem", borderRadius: 8, border: "1px solid #FF4FA3", background: "transparent", color: "#fff", fontSize: "1rem" }}
          />
          {pwError && <p style={{ color: "#FF4FA3", fontSize: "0.85rem" }}>{pwError}</p>}
          <button type="submit" style={{ padding: "0.75rem", borderRadius: 8, background: "#FF4FA3", color: "#fff", border: "none", cursor: "pointer", fontSize: "1rem" }}>
            Unlock ✨
          </button>
        </form>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div style={{ background: "#0B0420", color: "#fff", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
        <div style={{ fontSize: "4rem" }}>💔</div>
        <h1>Page Not Found</h1>
        <p style={{ opacity: 0.5 }}>This occasion page doesn't exist.</p>
        <a href="/" style={{ color: "#FF4FA3", marginTop: "1rem" }}>Create your own surprise →</a>
      </div>
    );
  }

  if (!page) return null;

  const Template = getTemplate(page.theme.templateId as TemplateId);
  const theme = getTheme(page);

  return <Template page={page} theme={theme} />;
}
