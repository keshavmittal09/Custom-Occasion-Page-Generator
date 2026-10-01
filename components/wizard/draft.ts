"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { DraftPage, Language, MediaItem, Memory, Occasion, PageData, TemplateId } from "@/lib/schema";

export type Draft = {
  pageId?: string;
  slug?: string;
  status?: string;
  occasion: Occasion;
  customOccasionLabel: string;
  occasionDate: string;
  language: Language;
  recipient: { name: string; nickname: string; relation: string; age: string };
  from: string;
  messages: string[];
  memories: Memory[];
  images: MediaItem[];
  videos: MediaItem[];
  templateId: TemplateId;
  accent: string;
  music: string;
  stickers: string[];
  revealAt: string; // datetime-local value
  password: string; // only sent when the creator types a new one
  clearPassword: boolean;
  hasPassword: boolean;
  wishesWall: boolean;
};

export const emptyDraft: Draft = {
  occasion: "BIRTHDAY",
  customOccasionLabel: "",
  occasionDate: "",
  language: "ENGLISH",
  recipient: { name: "", nickname: "", relation: "", age: "" },
  from: "",
  messages: [""],
  memories: [],
  images: [],
  videos: [],
  templateId: "neon-night",
  accent: "",
  music: "",
  stickers: [],
  revealAt: "",
  password: "",
  clearPassword: false,
  hasPassword: false,
  wishesWall: true,
};

export type StepProps = { draft: Draft; update: (patch: Partial<Draft>) => void; mutate: (fn: (d: Draft) => Partial<Draft>) => void };

const toLocalInput = (iso: string) => {
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
};

// What templates render (live preview + review)
export function draftToPage(d: Draft): PageData {
  const age = parseInt(d.recipient.age, 10);
  return {
    slug: undefined,
    occasion: d.occasion,
    customOccasionLabel: d.customOccasionLabel || undefined,
    occasionDate: d.occasionDate || undefined,
    revealAt: null,
    recipient: { name: d.recipient.name.trim() || "Your favourite person", nickname: d.recipient.nickname.trim() || undefined, relation: d.recipient.relation.trim(), age: Number.isFinite(age) ? age : undefined },
    from: d.from.trim() || "You",
    language: d.language,
    messages: d.messages.map((m) => m.trim()).filter(Boolean).length ? d.messages.map((m) => m.trim()).filter(Boolean) : ["Your message will appear here ✨"],
    memories: d.memories.filter((m) => m.title.trim()),
    media: { images: d.images.map((m, i) => ({ ...m, order: i })), videos: d.videos },
    theme: { templateId: d.templateId, accent: d.accent || undefined, music: d.music || undefined, decorations: d.stickers },
    settings: { wishesWall: d.wishesWall, showViews: true },
  };
}

// What the server stores (PATCH /pages/:id)
export function draftToPayload(d: Draft): DraftPage {
  const age = parseInt(d.recipient.age, 10);
  return {
    occasion: d.occasion,
    customOccasionLabel: d.occasion === "CUSTOM" ? d.customOccasionLabel.trim() : "",
    occasionDate: d.occasionDate,
    revealAt: d.revealAt ? new Date(d.revealAt).toISOString() : null,
    recipient: { name: d.recipient.name.trim(), nickname: d.recipient.nickname.trim(), relation: d.recipient.relation.trim(), ...(Number.isFinite(age) ? { age } : {}) },
    from: d.from.trim(),
    language: d.language,
    messages: d.messages.map((m) => m.trim()).filter(Boolean),
    memories: d.memories.filter((m) => m.title.trim()),
    media: { images: d.images.map((m, i) => ({ ...m, order: i })), videos: d.videos.map((m, i) => ({ ...m, order: i })) },
    theme: { templateId: d.templateId, ...(d.accent && { accent: d.accent }), ...(d.music && { music: d.music }), decorations: d.stickers },
    settings: { wishesWall: d.wishesWall },
    ...(d.password ? { password: d.password } : d.clearPassword ? { password: "" } : {}),
  };
}

export function pageToDraft(p: any): Draft {
  return {
    ...emptyDraft,
    pageId: p.id,
    slug: p.slug,
    status: p.status,
    occasion: p.occasion ?? "BIRTHDAY",
    customOccasionLabel: p.customOccasionLabel ?? "",
    occasionDate: p.occasionDate ?? "",
    language: p.language ?? "ENGLISH",
    recipient: { name: p.recipient?.name ?? "", nickname: p.recipient?.nickname ?? "", relation: p.recipient?.relation ?? "", age: p.recipient?.age != null ? String(p.recipient.age) : "" },
    from: p.from ?? "",
    messages: p.messages?.length ? p.messages : [""],
    memories: p.memories ?? [],
    images: p.media?.images ?? [],
    videos: p.media?.videos ?? [],
    templateId: p.theme?.templateId ?? "neon-night",
    accent: p.theme?.accent ?? "",
    music: p.theme?.music ?? "",
    stickers: p.theme?.decorations ?? [],
    revealAt: p.revealAt ? toLocalInput(p.revealAt) : "",
    hasPassword: !!p.hasPassword,
    wishesWall: p.settings?.wishesWall ?? true,
  };
}

// Per-step validation (mirrors the server's publish rules)
export function validateStep(step: number, d: Draft): string | null {
  if (step === 0 && d.occasion === "CUSTOM" && !d.customOccasionLabel.trim()) return "Give your custom occasion a name.";
  if (step === 1) {
    if (!d.recipient.name.trim()) return "Recipient name is required.";
    if (d.recipient.name.trim().length > 40) return "Name must be 40 characters or fewer.";
    if (!d.recipient.relation.trim()) return "How are you related? (e.g. Best friend)";
    if (!d.from.trim()) return "Tell us who it's from.";
  }
  if (step === 2 && !d.messages.some((m) => m.trim())) return "Write at least one message.";
  if (step === 3 && !d.images.length) return "Add at least 1 photo.";
  if (step === 4 && d.revealAt && new Date(d.revealAt).getTime() < Date.now()) return "The reveal time must be in the future.";
  return null;
}

const hasContent = (d: Draft) => !!(d.recipient.name.trim() || d.messages.some((m) => m.trim()) || d.images.length);

// Draft state with autosave: localStorage on every change + server (create draft once, then PATCH, debounced)
export function useWizardDraft(pageId?: string) {
  const key = `wishly:draft:${pageId ?? "new"}`;
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const latest = useRef(draft);
  const dirty = useRef(false);
  const creating = useRef<Promise<string> | null>(null);
  latest.current = draft;

  useEffect(() => {
    (async () => {
      if (pageId) {
        const res = await fetch(`/api/v1/pages/${pageId}`).catch(() => null);
        const json = await res?.json().catch(() => null);
        if (json?.success) setDraft(pageToDraft(json.data));
        else setLoadError(json?.error?.message || "Couldn't load this page");
      } else {
        try {
          const saved = localStorage.getItem(key);
          if (saved) setDraft({ ...emptyDraft, ...JSON.parse(saved), password: "" });
        } catch {}
      }
      setLoaded(true);
    })();
  }, [pageId, key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(key, JSON.stringify({ ...draft, password: "" }));
    } catch {}
  }, [draft, loaded, key]);

  const saveNow = useCallback(async (): Promise<string | null> => {
    const d = latest.current;
    if (!d.pageId && !hasContent(d) && !creating.current) return null;
    setSaveState("saving");
    try {
      let id = d.pageId ?? (creating.current ? await creating.current : undefined);
      const body = JSON.stringify(draftToPayload(d));
      if (!id) {
        creating.current = fetch("/api/v1/pages", { method: "POST", headers: { "Content-Type": "application/json" }, body })
          .then((r) => r.json())
          .then((j) => {
            if (!j.success) throw new Error(j.error?.message);
            return j.data.id as string;
          });
        id = await creating.current;
        setDraft((x) => ({ ...x, pageId: id }));
      } else {
        const res = await fetch(`/api/v1/pages/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body });
        const j = await res.json();
        if (!j.success) throw new Error(j.error?.message);
      }
      if (d.password || d.clearPassword) setDraft((x) => ({ ...x, password: "", clearPassword: false, hasPassword: !!d.password }));
      dirty.current = false;
      setSaveState("saved");
      return id!;
    } catch {
      setSaveState("error");
      return null;
    }
  }, []);

  useEffect(() => {
    if (!loaded || !dirty.current) return;
    const id = setTimeout(saveNow, 1200);
    return () => clearTimeout(id);
  }, [draft, loaded, saveNow]);

  const update = useCallback((patch: Partial<Draft>) => {
    dirty.current = true;
    setDraft((d) => ({ ...d, ...patch }));
  }, []);
  const mutate = useCallback((fn: (d: Draft) => Partial<Draft>) => {
    dirty.current = true;
    setDraft((d) => ({ ...d, ...fn(d) }));
  }, []);
  const reset = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch {}
    creating.current = null;
    dirty.current = false;
    setDraft(emptyDraft);
  }, [key]);

  return { draft, update, mutate, reset, loaded, loadError, saveState, saveNow };
}
