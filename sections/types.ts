"use client";
import { createContext, useContext, type CSSProperties } from "react";
import type { PageData } from "@/lib/schema";
import type { TemplateMode, TemplateProps, ThemeTokens } from "@/templates/registry";
import { VARIANTS, type Variant, type VariantConfig } from "./variants";
import en from "@/locales/en.json";
import hi from "@/locales/hi.json";
import hinglish from "@/locales/hinglish.json";

export type { Variant };
export type SectionProps = TemplateProps & { variant: Variant };

// live = public page · preview = full-screen wizard preview · pane = small side preview (no intro/confetti)
export const ModeContext = createContext<TemplateMode>("live");
export const useMode = () => useContext(ModeContext);

const dicts: Record<string, Record<string, string>> = { ENGLISH: en, HINDI: hi, HINGLISH: hinglish };

export function t(page: PageData, key: string, vars?: Record<string, string>): string {
  let s = dicts[page.language]?.[key] ?? (en as Record<string, string>)[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, v);
  return s;
}

export function occasionTitle(page: PageData): string {
  if (page.occasion === "CUSTOM") return page.customOccasionLabel || t(page, "hero.custom");
  return t(page, `hero.${page.occasion.toLowerCase()}`);
}

// English pages get each template's own flavour of section titles; Hindi/Hinglish get translated ones
export function sectionTitle(page: PageData, variant: Variant, key: "message" | "gallery" | "timeline" | "wishes" | "video") {
  const flavour = VARIANTS[variant].titles[key];
  if (page.language === "ENGLISH" && flavour) return flavour;
  return t(page, key === "wishes" ? "wishes.title" : `section.${key}`);
}

// Full CSS stack with Mukta as a Devanagari fallback so Hindi always renders properly
export function stack(f: string) {
  const base = f.includes(",") ? f : `'${f}'`;
  return `${base}, 'Mukta', ui-sans-serif, system-ui, sans-serif`;
}
export const fontStack = (t: ThemeTokens) => stack(t.font);
export const displayStack = (t: ThemeTokens) => stack(t.display ?? t.font);

export const cfgOf = (v: Variant): VariantConfig => VARIANTS[v];

export function cardStyle(v: Variant, t: ThemeTokens): CSSProperties {
  return { ...VARIANTS[v].card(t), color: VARIANTS[v].cardInk(t) };
}

export function headingStyle(v: Variant, t: ThemeTokens): CSSProperties {
  return { fontFamily: displayStack(t), ...VARIANTS[v].heading(t) };
}

// Cloudinary delivery optimisation: f_auto,q_auto + width cap (no-op for other URLs)
export function optimized(url: string, width = 1200) {
  return url.includes("res.cloudinary.com") && url.includes("/upload/") ? url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`) : url;
}
