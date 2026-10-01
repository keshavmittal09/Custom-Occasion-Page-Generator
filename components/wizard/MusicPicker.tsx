"use client";
import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Check, Music2, Pause, Play, Upload, VolumeX } from "lucide-react";
import { LIBRARY, MOODS, trackBySrc, type Mood } from "@/lib/music";
import { createPlayer, type Player } from "@/lib/player";
import { uploadFile } from "@/lib/upload";
import { toast } from "@/components/ui/Toast";

// Background music: built-in library (with previews) or the creator's own song
export default function MusicPicker({ value, onChange }: { value: string; onChange: (src: string) => void }) {
  const [mood, setMood] = useState<Mood | "All">("All");
  const [playing, setPlaying] = useState<string | null>(null);
  const [uploading, setUploading] = useState<number | null>(null);
  const player = useRef<Player | null>(null);

  const stop = () => {
    player.current?.stop();
    player.current = null;
    setPlaying(null);
  };
  useEffect(() => stop, []);

  const preview = (src: string) => {
    if (playing === src) return stop();
    stop();
    player.current = createPlayer(src, { loop: false });
    player.current.play().then(() => setPlaying(src)).catch(() => toast("Couldn't play this track"));
  };

  const onDrop = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setUploading(0);
    try {
      const up = await uploadFile(file, "audio", setUploading);
      onChange(up.url);
      toast("🎵 Your song is ready");
    } catch (e: any) {
      toast(e.message || "Upload failed");
    } finally {
      setUploading(null);
    }
  };
  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { "audio/*": [".mp3", ".m4a", ".aac", ".ogg", ".wav"] }, multiple: false, disabled: uploading !== null });

  const tracks = LIBRARY.filter((t) => mood === "All" || t.mood === mood);
  const custom = value && !trackBySrc(value);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(["All", ...MOODS.map((m) => m.id)] as const).map((m) => (
          <button key={m} type="button" onClick={() => setMood(m)} className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm transition ${mood === m ? "bg-ink text-white" : "bg-white/70 text-ink/60 ring-1 ring-ink/10 hover:text-ink"}`}>
            {m === "All" ? "All" : `${MOODS.find((x) => x.id === m)?.emoji} ${m}`}
          </button>
        ))}
      </div>

      <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1" data-lenis-prevent>
        <button type="button" onClick={() => { stop(); onChange(""); }} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition ${!value ? "bg-[#efe9ff] ring-1 ring-lilac" : "hover:bg-white/70"}`}>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-ink/5"><VolumeX size={16} /></span>
          <span className="flex-1 text-sm font-medium">No music</span>
          {!value && <Check size={16} className="text-lilac" />}
        </button>
        {tracks.map((t) => (
          <div key={t.id} className={`flex items-center gap-3 rounded-2xl px-3 py-2 transition ${value === t.src ? "bg-[#efe9ff] ring-1 ring-lilac" : "hover:bg-white/70"}`}>
            <button type="button" onClick={() => preview(t.src)} aria-label={playing === t.src ? "Stop preview" : `Preview ${t.title}`} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-white">
              {playing === t.src ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
            </button>
            <button type="button" onClick={() => onChange(t.src)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
              <span className="text-lg">{t.emoji}</span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">{t.title}</span>
                <span className="block text-xs text-ink/45">{t.mood}{t.src.startsWith("synth:") ? " · built-in" : ""}</span>
              </span>
            </button>
            {value === t.src && <Check size={16} className="shrink-0 text-lilac" />}
          </div>
        ))}
      </div>

      <div {...getRootProps()} className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed px-4 py-3 transition ${custom ? "border-lilac bg-[#efe9ff]" : "border-ink/15 hover:border-lilac/60"}`}>
        <input {...getInputProps()} />
        <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-lilac to-blush text-white">{custom ? <Music2 size={16} /> : <Upload size={16} />}</span>
        <span className="flex-1 text-sm">
          {uploading !== null ? `Uploading… ${Math.round(uploading * 100)}%` : custom ? "Your own song is selected — drop another to replace" : "Upload your own song (mp3/m4a, up to 4 MB)"}
        </span>
        {custom && <button type="button" onClick={(e) => { e.stopPropagation(); preview(value); }} className="text-sm underline">{playing === value ? "stop" : "play"}</button>}
      </div>
      <p className="text-[11px] text-ink/40">Library tracks by Kevin MacLeod (incompetech.com), CC BY 4.0 — credited on the page. Music starts after the recipient taps to open.</p>
    </div>
  );
}
