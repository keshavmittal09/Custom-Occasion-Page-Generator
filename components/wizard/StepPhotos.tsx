"use client";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import { MediaItem } from "@/lib/schema";
import { StepProps } from "./draft";
import { StepTitle, inputCls } from "./ui";

const MAX_IMAGES = 10;

function readSize(src: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth || 800, h: img.naturalHeight || 600 });
    img.onerror = () => resolve({ w: 800, h: 600 });
    img.src = src;
  });
}

// Photos are compressed in the browser and stored as data URLs —
// no Cloudinary keys needed for the MVP.
export default function StepPhotos({ draft, update }: StepProps) {
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState("");
  const room = MAX_IMAGES - draft.images.length;

  const addItems = (items: MediaItem[]) => update({ images: [...draft.images, ...items].slice(0, MAX_IMAGES) });

  const onDrop = async (files: File[]) => {
    if (!files.length || room <= 0) return;
    setBusy(true);
    try {
      const items: MediaItem[] = [];
      for (const file of files.slice(0, room)) {
        const small = await imageCompression(file, { maxSizeMB: 0.2, maxWidthOrHeight: 1200, useWebWorker: true });
        const dataUrl = await imageCompression.getDataUrlFromFile(small);
        const { w, h } = await readSize(dataUrl);
        items.push({ id: crypto.randomUUID(), type: "image", url: dataUrl, publicId: "local", w, h, caption: "", order: 0 });
      }
      addItems(items);
    } finally {
      setBusy(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "image/*": [] }, disabled: busy || room <= 0 });

  const addUrl = async () => {
    if (!/^https?:\/\//.test(url)) return;
    const { w, h } = await readSize(url);
    addItems([{ id: crypto.randomUUID(), type: "image", url, publicId: "remote", w, h, caption: "", order: 0 }]);
    setUrl("");
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= draft.images.length) return;
    const next = [...draft.images];
    [next[i], next[j]] = [next[j], next[i]];
    update({ images: next });
  };

  const setCaption = (i: number, caption: string) => update({ images: draft.images.map((img, j) => (j === i ? { ...img, caption } : img)) });

  return (
    <div className="space-y-6">
      <StepTitle title="Add your favourite photos" subtitle={`Up to ${MAX_IMAGES} photos. They're compressed automatically.`} />

      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition ${
          isDragActive ? "border-pink-400 bg-pink-500/10" : "border-white/20 bg-white/5 hover:border-white/40"
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-4xl">📸</div>
        <p className="mt-2 text-white">{busy ? "Compressing…" : room > 0 ? "Drop photos here or click to browse" : "Photo limit reached"}</p>
        <p className="text-sm text-white/50">JPG, PNG, WEBP · {draft.images.length}/{MAX_IMAGES}</p>
      </div>

      <div className="flex gap-2">
        <input className={inputCls} placeholder="…or paste an image URL (https://)" value={url} onChange={(e) => setUrl(e.target.value)} />
        <button type="button" onClick={addUrl} className="rounded-xl border border-white/15 px-4 text-white/80 hover:bg-white/10">
          Add
        </button>
      </div>

      {draft.images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {draft.images.map((img, i) => (
            <div key={img.id} className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="h-32 w-full object-cover" />
              <div className="space-y-2 p-2">
                <input className="w-full rounded-lg bg-white/10 px-2 py-1 text-xs text-white placeholder:text-white/40 outline-none" maxLength={120} placeholder="Caption" value={img.caption ?? ""} onChange={(e) => setCaption(i, e.target.value)} />
                <div className="flex justify-between text-xs text-white/60">
                  <button type="button" onClick={() => move(i, -1)} className="hover:text-white">◀</button>
                  <button type="button" onClick={() => update({ images: draft.images.filter((_, j) => j !== i) })} className="hover:text-red-400">Remove</button>
                  <button type="button" onClick={() => move(i, 1)} className="hover:text-white">▶</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
