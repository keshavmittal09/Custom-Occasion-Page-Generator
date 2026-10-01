"use client";
import { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

type Props = { url: string; text?: string; dark?: boolean };

// Copy link / WhatsApp / native share / downloadable QR code
export default function ShareKit({ url, text = "I made something special for you 🎉", dark = true }: Props) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const qrWrap = useRef<HTMLDivElement>(null);

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const nativeShare = () => navigator.share?.({ title: "A surprise for you", text, url }).catch(() => {});

  const downloadQr = () => {
    const canvas = qrWrap.current?.querySelector("canvas");
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "occasion-qr.png";
    a.click();
  };

  const btn = `rounded-full px-4 py-2 text-sm font-medium transition border ${dark ? "border-white/20 hover:bg-white/10" : "border-black/15 hover:bg-black/5"}`;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        <button onClick={copy} className={btn}>{copied ? "Copied ✓" : "🔗 Copy link"}</button>
        <a href={`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`} target="_blank" rel="noreferrer" className={btn}>
          💬 WhatsApp
        </a>
        {typeof navigator !== "undefined" && "share" in navigator && (
          <button onClick={nativeShare} className={btn}>📤 Share</button>
        )}
        <button onClick={() => setShowQr((s) => !s)} className={btn}>▦ QR code</button>
      </div>
      {showQr && (
        <div className="flex flex-col items-center gap-2">
          <div ref={qrWrap} className="rounded-xl bg-white p-3">
            <QRCodeCanvas value={url} size={160} />
          </div>
          <button onClick={downloadQr} className={btn}>⬇ Download QR</button>
        </div>
      )}
    </div>
  );
}
