"use client";
import { useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { DndContext, KeyboardSensor, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ImagePlus, Laugh, Star, Trash2, Video, X } from "lucide-react";
import type { MediaItem } from "@/lib/schema";
import { LIMITS, imageSize, prepareImage, uploadFile, videoMeta } from "@/lib/upload";
import { toast } from "@/components/ui/Toast";
import type { StepProps } from "./draft";
import { StepTitle } from "./ui";
import GifPicker from "./GifPicker";
import MusicPicker from "./MusicPicker";

const MAX_IMAGES = 15;
const MAX_VIDEOS = 2;
type Job = { key: string; name: string; progress: number; kind: "image" | "video" };

const uid = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2));

function SortablePhoto({ img, index, onChange, onRemove, onCover }: { img: MediaItem; index: number; onChange: (patch: Partial<MediaItem>) => void; onRemove: () => void; onCover: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: img.id });
  const [meme, setMeme] = useState(!!(img.memeTop || img.memeBottom));
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 20 : undefined }} className={`overflow-hidden rounded-2xl border bg-white/80 ${isDragging ? "border-lilac shadow-2xl" : "border-ink/10"}`}>
      <div className="relative">
        <img src={img.url} alt="" className="h-36 w-full object-cover" />
        {(img.memeTop || img.memeBottom) && (
          <>
            <span className="absolute inset-x-1 top-1 text-center text-sm uppercase leading-tight text-white" style={{ fontFamily: "Anton, Impact, sans-serif", WebkitTextStroke: "1px #000" }}>{img.memeTop}</span>
            <span className="absolute inset-x-1 bottom-1 text-center text-sm uppercase leading-tight text-white" style={{ fontFamily: "Anton, Impact, sans-serif", WebkitTextStroke: "1px #000" }}>{img.memeBottom}</span>
          </>
        )}
        <button type="button" {...attributes} {...listeners} aria-label="Drag to reorder" className="absolute left-2 top-2 grid h-8 w-8 cursor-grab touch-none place-items-center rounded-full bg-white/90 text-ink shadow active:cursor-grabbing">
          <GripVertical size={15} />
        </button>
        {index === 0 ? (
          <span className="absolute right-2 top-2 rounded-full bg-ink px-2 py-1 text-[10px] font-semibold text-white">★ Cover</span>
        ) : (
          <button type="button" onClick={onCover} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-ink shadow" aria-label="Make cover photo"><Star size={14} /></button>
        )}
      </div>
      <div className="space-y-2 p-2.5">
        <input className="w-full rounded-lg bg-ink/5 px-2.5 py-1.5 text-sm text-ink outline-none placeholder:text-ink/35" maxLength={120} placeholder="Caption" value={img.caption ?? ""} onChange={(e) => onChange({ caption: e.target.value })} />
        {meme && (
          <div className="space-y-1.5">
            <input className="w-full rounded-lg bg-ink/5 px-2.5 py-1.5 text-sm uppercase text-ink outline-none placeholder:normal-case placeholder:text-ink/35" maxLength={80} placeholder="Top meme text" value={img.memeTop ?? ""} onChange={(e) => onChange({ memeTop: e.target.value })} />
            <input className="w-full rounded-lg bg-ink/5 px-2.5 py-1.5 text-sm uppercase text-ink outline-none placeholder:normal-case placeholder:text-ink/35" maxLength={80} placeholder="Bottom meme text" value={img.memeBottom ?? ""} onChange={(e) => onChange({ memeBottom: e.target.value })} />
          </div>
        )}
        <div className="flex items-center justify-between text-xs">
          <button type="button" onClick={() => { if (meme) onChange({ memeTop: "", memeBottom: "" }); setMeme(!meme); }} className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${meme ? "bg-[#efe9ff] text-ink" : "text-ink/55 hover:text-ink"}`}>
            <Laugh size={13} /> {meme ? "Meme on" : "Make it a meme"}
          </button>
          <button type="button" onClick={onRemove} className="grid h-7 w-7 place-items-center rounded-full text-ink/45 hover:bg-[#ffe4ec] hover:text-[#b4235a]" aria-label="Remove photo"><Trash2 size={14} /></button>
        </div>
      </div>
    </div>
  );
}

export default function StepMedia({ draft, update, mutate }: StepProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [tab, setTab] = useState<"photos" | "gifs">("photos");
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const pendingImages = jobs.filter((j) => j.kind === "image").length;
  const roomImages = MAX_IMAGES - draft.images.length - pendingImages;
  const roomVideos = MAX_VIDEOS - draft.videos.length - jobs.filter((j) => j.kind === "video").length;

  const setProgress = (key: string, progress: number) => setJobs((js) => js.map((j) => (j.key === key ? { ...j, progress } : j)));
  const finish = (key: string) => setJobs((js) => js.filter((j) => j.key !== key));

  const addImage = (item: MediaItem) => mutate((d) => (d.images.length >= MAX_IMAGES ? {} : { images: [...d.images, item] }));

  const uploadImage = async (file: File) => {
    const key = uid();
    setJobs((js) => [...js, { key, name: file.name, progress: 0, kind: "image" }]);
    try {
      const blob = await prepareImage(file);
      const up = await uploadFile(blob, "image", (p) => setProgress(key, p));
      const size = up.w && up.h ? { w: up.w, h: up.h } : await imageSize(URL.createObjectURL(blob));
      addImage({ id: uid(), type: "image", url: up.url, publicId: up.publicId, provider: up.provider, w: size.w, h: size.h, caption: "", order: 0 });
    } catch (e: any) {
      toast(`${file.name}: ${e.message || "upload failed"}`);
    } finally {
      finish(key);
    }
  };

  const onDropImages = async (files: File[], rejected: FileRejection[]) => {
    rejected.forEach((r) => toast(`${r.file.name}: ${r.errors[0]?.code === "file-too-large" ? "over 8 MB" : "unsupported file"}`));
    const take = files.slice(0, Math.max(0, roomImages));
    if (files.length > take.length) toast(`Only ${MAX_IMAGES} photos per page — added the first ${take.length}`);
    // 3 uploads at a time
    const queue = [...take];
    await Promise.all(Array.from({ length: Math.min(3, queue.length) }, async () => {
      while (queue.length) await uploadImage(queue.shift()!);
    }));
  };

  const onDropVideos = async (files: File[], rejected: FileRejection[]) => {
    rejected.forEach((r) => toast(`${r.file.name}: ${r.errors[0]?.code === "file-too-large" ? "over 50 MB" : "use MP4/WEBM"}`));
    for (const file of files.slice(0, Math.max(0, roomVideos))) {
      const meta = await videoMeta(file);
      if (meta.duration > LIMITS.videoSeconds) {
        toast(`${file.name}: videos can be at most 60 seconds`);
        continue;
      }
      const key = uid();
      setJobs((js) => [...js, { key, name: file.name, progress: 0, kind: "video" }]);
      try {
        const up = await uploadFile(file, "video", (p) => setProgress(key, p));
        const item: MediaItem = { id: uid(), type: "video", url: up.url, publicId: up.publicId, provider: up.provider, w: up.w ?? meta.w, h: up.h ?? meta.h, duration: Math.round((up.duration ?? meta.duration) * 10) / 10, order: 0 };
        mutate((d) => (d.videos.length >= MAX_VIDEOS ? {} : { videos: [...d.videos, item] }));
      } catch (e: any) {
        toast(`${file.name}: ${e.message || "upload failed"}`);
      } finally {
        finish(key);
      }
    }
  };

  const photos = useDropzone({ onDrop: onDropImages, accept: { "image/jpeg": [], "image/png": [], "image/webp": [], "image/gif": [], "image/heic": [".heic"], "image/heif": [".heif"] }, maxSize: LIMITS.imageBytes, multiple: true, disabled: roomImages <= 0 });
  const videos = useDropzone({ onDrop: onDropVideos, accept: { "video/mp4": [], "video/webm": [], "video/quicktime": [".mov"] }, maxSize: LIMITS.videoBytes, multiple: true, disabled: roomVideos <= 0 });

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    mutate((d) => {
      const from = d.images.findIndex((i) => i.id === active.id);
      const to = d.images.findIndex((i) => i.id === over.id);
      return { images: arrayMove(d.images, from, to) };
    });
  };

  const patchImage = (id: string, patch: Partial<MediaItem>) => mutate((d) => ({ images: d.images.map((i) => (i.id === id ? { ...i, ...patch } : i)) }));

  return (
    <div className="space-y-10">
      <div>
        <StepTitle emoji="📸" title="Photos, GIFs & memes" subtitle={`Add up to ${MAX_IMAGES}. Select many at once — they're compressed and uploaded in parallel.`} />

        <div className="mb-4 inline-flex rounded-full bg-ink/5 p-1 text-sm">
          {(["photos", "gifs"] as const).map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)} className={`rounded-full px-4 py-1.5 transition ${tab === t ? "bg-white text-ink shadow" : "text-ink/55"}`}>
              {t === "photos" ? "📁 Upload" : "🎞️ GIFs & meme links"}
            </button>
          ))}
        </div>

        {tab === "photos" ? (
          <div {...photos.getRootProps()} className={`cursor-pointer rounded-3xl border-2 border-dashed p-8 text-center transition ${photos.isDragActive ? "border-lilac bg-[#efe9ff]" : "border-ink/15 bg-white/60 hover:border-lilac/60"} ${roomImages <= 0 ? "opacity-50" : ""}`}>
            <input {...photos.getInputProps()} />
            <ImagePlus className="mx-auto text-lilac" size={36} />
            <p className="mt-3 font-medium text-ink">{roomImages > 0 ? "Drop photos here or tap to choose (select multiple)" : "Photo limit reached"}</p>
            <p className="mt-1 text-sm text-ink/50">JPG · PNG · WEBP · GIF · HEIC · up to 8 MB each · {draft.images.length}/{MAX_IMAGES}</p>
          </div>
        ) : (
          <GifPicker disabled={roomImages <= 0} onPick={(g) => addImage({ id: uid(), type: "image", url: g.url, publicId: "", provider: "remote", w: g.w, h: g.h, caption: g.caption ?? "", order: 0 })} />
        )}

        {jobs.length > 0 && (
          <div className="mt-4 space-y-2">
            {jobs.map((j) => (
              <div key={j.key} className="rounded-xl bg-white/70 px-3 py-2 text-sm">
                <div className="flex justify-between text-ink/70">
                  <span className="truncate">{j.kind === "video" ? "🎬" : "🖼️"} {j.name}</span>
                  <span className="tabular-nums">{Math.round(j.progress * 100)}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-lilac to-blush transition-all" style={{ width: `${Math.max(4, j.progress * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {draft.images.length > 0 && (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={draft.images.map((i) => i.id)} strategy={rectSortingStrategy}>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {draft.images.map((img, i) => (
                  <SortablePhoto
                    key={img.id}
                    img={img}
                    index={i}
                    onChange={(p) => patchImage(img.id, p)}
                    onRemove={() => mutate((d) => ({ images: d.images.filter((x) => x.id !== img.id), memories: d.memories.map((m) => (m.mediaId === img.id ? { ...m, mediaId: undefined } : m)) }))}
                    onCover={() => mutate((d) => ({ images: [img, ...d.images.filter((x) => x.id !== img.id)] }))}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
        {draft.images.length > 1 && <p className="mt-2 text-xs text-ink/45">Drag the ⠿ handle to reorder · ★ sets the cover photo</p>}
      </div>

      <div className="border-t border-ink/10 pt-8">
        <StepTitle emoji="🎬" title="Videos" subtitle="Optional — up to 2 clips, 60 seconds each. They auto-play muted on the page." />
        <div {...videos.getRootProps()} className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed px-4 py-4 transition ${videos.isDragActive ? "border-lilac bg-[#efe9ff]" : "border-ink/15 hover:border-lilac/60"} ${roomVideos <= 0 ? "opacity-50" : ""}`}>
          <input {...videos.getInputProps()} />
          <Video className="text-lilac" />
          <span className="text-sm text-ink/70">{roomVideos > 0 ? "Add a video (MP4, ≤ 50 MB, ≤ 60 s)" : "Video limit reached"} · {draft.videos.length}/{MAX_VIDEOS}</span>
        </div>
        {draft.videos.length > 0 && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {draft.videos.map((v) => (
              <div key={v.id} className="relative overflow-hidden rounded-2xl bg-black">
                <video src={v.url} muted playsInline preload="metadata" className="h-40 w-full object-cover" />
                <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">{v.duration ? `${Math.round(v.duration)}s` : "video"}</span>
                <button type="button" onClick={() => mutate((d) => ({ videos: d.videos.filter((x) => x.id !== v.id) }))} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-ink" aria-label="Remove video"><X size={15} /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-ink/10 pt-8">
        <StepTitle emoji="🎵" title="Background music" subtitle="Pick a vibe from the library, or upload your song." />
        <MusicPicker value={draft.music} onChange={(music) => update({ music })} />
      </div>

    </div>
  );
}
