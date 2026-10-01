"use client";
import { useEffect, useState } from "react";
import { Search, Link2 } from "lucide-react";
import { imageSize } from "@/lib/upload";
import { toast } from "@/components/ui/Toast";
import { inputCls } from "./ui";

type Gif = { id: string; title: string; url: string; preview: string; w: number; h: number };
export type PickedGif = { url: string; w: number; h: number; caption?: string };

// giphy.com/gifs/some-name-AbC123 → direct media URL
function normaliseGifUrl(raw: string): string | null {
  const url = raw.trim();
  const giphy = url.match(/giphy\.com\/(?:gifs|stickers)\/(?:.*-)?([A-Za-z0-9]+)\/?$/);
  if (giphy) return `https://media.giphy.com/media/${giphy[1]}/giphy.gif`;
  if (/^https:\/\/.+\.(gif|webp|png|jpe?g)(\?.*)?$/i.test(url) || /^https:\/\/media\d*\.giphy\.com\//.test(url) || /^https:\/\/media\.tenor\.com\//.test(url)) return url;
  return null;
}

// GIFs & memes: search GIPHY (if the server has a key) or paste any GIF/image link
export default function GifPicker({ onPick, disabled }: { onPick: (g: PickedGif) => void; disabled?: boolean }) {
  const [searchOn, setSearchOn] = useState<boolean | null>(null);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Gif[]>([]);
  const [link, setLink] = useState("");

  useEffect(() => {
    fetch("/api/v1/gifs?q=birthday")
      .then((r) => r.json())
      .then((j) => {
        setSearchOn(!!j.success);
        if (j.success) setResults(j.data);
      })
      .catch(() => setSearchOn(false));
  }, []);

  useEffect(() => {
    if (!searchOn || !q.trim()) return;
    const id = setTimeout(() => {
      fetch(`/api/v1/gifs?q=${encodeURIComponent(q)}`)
        .then((r) => r.json())
        .then((j) => j.success && setResults(j.data))
        .catch(() => {});
    }, 400);
    return () => clearTimeout(id);
  }, [q, searchOn]);

  const addLink = async () => {
    const url = normaliseGifUrl(link);
    if (!url) return toast("Paste a direct GIF/image link (https://…gif) or a giphy.com link");
    const { w, h } = await imageSize(url);
    onPick({ url, w, h });
    setLink("");
  };

  return (
    <div className="space-y-3">
      {searchOn && (
        <>
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
            <input className={`${inputCls} pl-10`} placeholder="Search GIFs — birthday, cat, dance…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="grid max-h-64 grid-cols-3 gap-2 overflow-y-auto rounded-2xl sm:grid-cols-4" data-lenis-prevent>
            {results.map((g) => (
              <button key={g.id} type="button" disabled={disabled} onClick={() => onPick({ url: g.url, w: g.w, h: g.h, caption: g.title?.slice(0, 120) })} className="aspect-square overflow-hidden rounded-xl bg-ink/5 transition hover:ring-2 hover:ring-lilac disabled:opacity-40">
                <img src={g.preview} alt={g.title} loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <p className="text-[11px] text-ink/40">Powered by GIPHY</p>
        </>
      )}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
          <input className={`${inputCls} pl-10`} placeholder="Paste a GIF or meme link (giphy, tenor, imgur…)" value={link} onChange={(e) => setLink(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLink())} />
        </div>
        <button type="button" onClick={addLink} disabled={disabled || !link.trim()} className="btn-ink px-5 text-sm disabled:opacity-40">Add</button>
      </div>
    </div>
  );
}
