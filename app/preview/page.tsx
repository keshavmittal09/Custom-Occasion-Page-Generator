"use client";
import { useEffect, useState } from "react";
import type { PageData, TemplateId } from "@/lib/schema";
import { getTemplate, getTheme } from "@/templates/registry";

// Rendered inside the wizard's phone-frame iframe. Receives draft data via postMessage
// (same origin only) and renders the exact same template component as the live page.
export default function PreviewFrame() {
  const [page, setPage] = useState<PageData | null>(null);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data?.type !== "wishly:preview") return;
      setPage(e.data.page);
    };
    window.addEventListener("message", onMsg);
    window.parent?.postMessage({ type: "wishly:preview-ready" }, window.location.origin);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  if (!page)
    return (
      <div className="bg-aurora flex min-h-[100svh] items-center justify-center text-sm text-muted">
        <span className="animate-pulse">Preparing preview…</span>
      </div>
    );

  const Template = getTemplate(page.theme.templateId as TemplateId);
  return <Template page={page} theme={getTheme(page)} mode="pane" />;
}
