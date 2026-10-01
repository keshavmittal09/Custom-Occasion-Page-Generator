"use client";
import { useEffect, useRef, useState } from "react";
import type { PageData } from "@/lib/schema";

// Live phone-frame preview: an iframe gets a real 390px mobile viewport (so responsive
// layouts and vw-based type behave exactly like on a phone). Draft data is posted in.
export default function PhonePreview({ page, scale = 0.72 }: { page: PageData; scale?: number }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const id = setTimeout(() => frame.current?.contentWindow?.postMessage({ type: "wishly:preview", page }, window.location.origin), 250);
    return () => clearTimeout(id);
  }, [page, ready]);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin === window.location.origin && e.data?.type === "wishly:preview-ready") setReady(true);
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const W = 390;
  const H = 780;
  return (
    <div className="mx-auto rounded-[46px] bg-ink p-2.5 shadow-[0_40px_80px_-30px_rgba(30,27,58,0.6)]" style={{ width: W * scale + 20, height: H * scale + 20 }}>
      <div className="relative overflow-hidden rounded-[38px] bg-black" style={{ width: W * scale, height: H * scale }}>
        <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-ink" />
        <iframe ref={frame} src="/preview" title="Live preview" className="origin-top-left border-0" style={{ width: W, height: H, transform: `scale(${scale})` }} />
      </div>
    </div>
  );
}
