"use client";
import { useEffect, useState } from "react";
import { Language, MediaItem, Memory, Occasion, PageData, TemplateId } from "@/lib/schema";

export type Draft = {
  occasion: Occasion;
  customOccasionLabel: string;
  occasionDate: string;
  language: Language;
  recipient: { name: string; nickname: string; relation: string; age: string };
  from: string;
  messages: string[];
  memories: Memory[];
  images: MediaItem[];
  templateId: TemplateId;
  accent: string;
  music: string;
  revealAt: string;
  password: string;
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
  templateId: "neon-night",
  accent: "",
  music: "",
  revealAt: "",
  password: "",
  wishesWall: true,
};

export type StepProps = { draft: Draft; update: (patch: Partial<Draft>) => void };

// Converts wizard state into the PageData shape templates + API expect
export function draftToPage(d: Draft): PageData {
  const age = parseInt(d.recipient.age, 10);
  return {
    occasion: d.occasion,
    customOccasionLabel: d.occasion === "CUSTOM" ? d.customOccasionLabel || undefined : undefined,
    occasionDate: d.occasionDate || undefined,
    revealAt: d.revealAt ? new Date(d.revealAt).toISOString() : null,
    recipient: {
      name: d.recipient.name.trim(),
      nickname: d.recipient.nickname.trim() || undefined,
      relation: d.recipient.relation.trim(),
      age: Number.isFinite(age) ? age : undefined,
    },
    from: d.from.trim(),
    language: d.language,
    messages: d.messages.map((m) => m.trim()).filter(Boolean),
    memories: d.memories.filter((m) => m.title.trim()),
    media: { images: d.images.map((img, i) => ({ ...img, order: i })), videos: [] },
    theme: {
      templateId: d.templateId,
      ...(d.accent ? { accent: d.accent } : {}),
      ...(d.music ? { music: d.music } : {}),
      decorations: [],
    },
    settings: { wishesWall: d.wishesWall, showViews: true },
  };
}

const KEY = "occasion:draft";

// Draft autosaves to localStorage so a refresh doesn't lose work
export function useDraft() {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setDraft({ ...emptyDraft, ...JSON.parse(saved) });
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(draft));
    } catch {
      // quota exceeded (big photos) — save everything except images
      try {
        localStorage.setItem(KEY, JSON.stringify({ ...draft, images: [] }));
      } catch {}
    }
  }, [draft, loaded]);

  const update = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));
  const reset = () => {
    setDraft(emptyDraft);
    try {
      localStorage.removeItem(KEY);
    } catch {}
  };

  return { draft, update, reset };
}
