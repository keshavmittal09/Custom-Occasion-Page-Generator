"use client";
import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "@/components/ui/Toast";

type Labels = { title: string; copy: string; whatsapp: string; instagram: string; qr: string; native: string };
const EN: Labels = { title: "Share the love", copy: "Copy link", whatsapp: "WhatsApp", instagram: "Instagram", qr: "QR code", native: "Share" };

type Props = { url: string; text?: string; dark?: boolean; labels?: Partial<Labels> };

// Copy link · WhatsApp · Instagram · native share · downloadable QR (PNG)
export default function ShareKit({ url, text = "I made something special for you 🎉", dark = true, labels }: Props) {
  const L = { ...EN, ...labels };
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

  // Instagram has no web share URL: use the phone's share sheet, or copy + open Instagram
  const instagram = async () => {
    if (canShare) return nativeShare();
    await navigator.clipboard.writeText(url).catch(() => {});
    toast("📸 Link copied — paste it in your story or DM");
    window.open("https://www.instagram.com/direct/inbox/", "_blank", "noopener");
  };

  const downloadQr = () => {
    const canvas = qrWrap.current?.querySelector("canvas");
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "wishly-qr.png";
    a.click();
    toast("⬇ QR code downloaded");
  };

  const btn = `inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition active:scale-95 ${
    dark ? "bg-white/[0.08] text-white ring-1 ring-white/15 hover:bg-white/15" : "bg-white/80 text-[#1e1b3a] ring-1 ring-black/10 backdrop-blur hover:bg-white"
  }`;

  return (
    <div className="flex flex-col items-center gap-4" style={{ textTransform: "none" }}>
      <p className={`text-xs uppercase tracking-[0.3em] ${dark ? "text-white/50" : "text-black/50"}`}>{L.title}</p>
      <div className="flex flex-wrap justify-center gap-2">
        <button onClick={copy} className={btn}>🔗 {L.copy}</button>
        <a href={`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`} target="_blank" rel="noreferrer" className={`${btn} !bg-[#25D366] !text-white !ring-0 hover:!bg-[#1ebe5b]`}>
          💬 {L.whatsapp}
        </a>
        <button onClick={instagram} className={`${btn} !text-white !ring-0`} style={{ background: "linear-gradient(45deg,#f58529,#dd2a7b,#8134af)" }}>
          📸 {L.instagram}
        </button>
        {canShare && <button onClick={nativeShare} className={btn}>📤 {L.native}</button>}
        <button onClick={() => setShowQr((s) => !s)} className={btn}>▦ {L.qr}</button>
      </div>
      {showQr && (
        <div className="flex flex-col items-center gap-3">
          <div ref={qrWrap} className="rounded-2xl bg-white p-4 shadow-xl">
            <QRCodeCanvas value={url} size={168} />
          </div>
          <button onClick={downloadQr} className={btn}>⬇ PNG</button>
        </div>
      )}
    </div>
  );
}
