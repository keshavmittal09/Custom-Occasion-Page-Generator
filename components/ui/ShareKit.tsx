"use client";
import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "@/components/ui/Toast";

type Props = { url: string; text?: string; dark?: boolean };

// Copy link / WhatsApp / native share / downloadable QR code
export default function ShareKit({ url, text = "I made something special for you 🎉", dark = true }: Props) {
  const [showQr, setShowQr] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const qrWrap = useRef<HTMLDivElement>(null);

  useEffect(() => setCanShare(typeof navigator !== "undefined" && "share" in navigator), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast("🔗 Link copied!");
    } catch {
      toast("Couldn't copy, long-press the link instead");
    }
  };

  const nativeShare = () => navigator.share?.({ title: "A surprise for you", text, url }).catch(() => {});

  const downloadQr = () => {
    const canvas = qrWrap.current?.querySelector("canvas");
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "occasion-qr.png";
    a.click();
    toast("⬇ QR code downloaded");
  };

  const btn = `inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition active:scale-95 ${
    dark ? "bg-white/[0.07] text-white ring-1 ring-white/15 hover:bg-white/15" : "bg-white text-gray-800 shadow-md ring-1 ring-black/5 hover:shadow-lg"
  }`;

  return (
    <div className="flex flex-col items-center gap-4">
      <p className={`text-xs uppercase tracking-[0.3em] ${dark ? "text-white/40" : "text-gray-500"}`}>Share the love</p>
      <div className="flex flex-wrap justify-center gap-2">
        <button onClick={copy} className={btn}>🔗 Copy link</button>
        <a href={`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`} target="_blank" rel="noreferrer" className={`${btn} !bg-[#25D366] !text-white !ring-0 hover:!bg-[#1ebe5b]`}>
          💬 WhatsApp
        </a>
        {canShare && <button onClick={nativeShare} className={btn}>📤 Share</button>}
        <button onClick={() => setShowQr((s) => !s)} className={btn}>▦ {showQr ? "Hide QR" : "QR code"}</button>
      </div>
      {showQr && (
        <div className="flex flex-col items-center gap-3">
          <div ref={qrWrap} className="rounded-2xl bg-white p-4 shadow-xl">
            <QRCodeCanvas value={url} size={168} />
          </div>
          <button onClick={downloadQr} className={btn}>⬇ Download QR</button>
        </div>
      )}
    </div>
  );
}
