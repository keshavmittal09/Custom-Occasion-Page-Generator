import type { CSSProperties } from "react";
import type { PageData } from "@/lib/schema";
import type { TemplateProps } from "@/templates/registry";
import en from "@/locales/en.json";
import hi from "@/locales/hi.json";
import hinglish from "@/locales/hinglish.json";

export type Variant = "neon" | "pastel" | "royal";
export type SectionProps = TemplateProps & { variant: Variant };

const dicts: Record<string, Record<string, string>> = {
  ENGLISH: Object.values(en)[0] as Record<string, string>,
  HINDI: Object.values(hi)[0] as Record<string, string>,
  HINGLISH: Object.values(hinglish)[0] as Record<string, string>,
};

export function t(page: PageData, key: string): string {
  return dicts[page.language]?.[key] ?? dicts.ENGLISH[key] ?? key;
}

export function occasionTitle(page: PageData): string {
  if (page.occasion === "CUSTOM") return page.customOccasionLabel || t(page, "hero.custom");
  return t(page, `hero.${page.occasion.toLowerCase()}`);
}

export function fontStack(theme: TemplateProps["theme"]) {
  return `'${theme.font}', ui-sans-serif, system-ui, sans-serif`;
}

// Per-template card look, shared by every section
export function cardStyle(variant: Variant, theme: TemplateProps["theme"]): CSSProperties {
  if (variant === "neon")
    return {
      background: "rgba(255,255,255,0.05)",
      border: `1px solid ${theme.accent}55`,
      boxShadow: `0 0 30px ${theme.accent}33, inset 0 0 20px ${theme.secondary}11`,
      backdropFilter: "blur(10px)",
      borderRadius: 24,
    };
  if (variant === "pastel")
    return { background: "#ffffffcc", boxShadow: "0 10px 30px rgba(196,181,253,0.35)", borderRadius: 28, border: "2px solid #fff" };
  return { background: "linear-gradient(180deg,#16161a,#0e0e10)", border: `1px solid ${theme.secondary}66`, borderRadius: 4, boxShadow: `0 0 0 4px #0e0e10, 0 0 0 5px ${theme.secondary}33` };
}

export function headingStyle(variant: Variant, theme: TemplateProps["theme"]): CSSProperties {
  if (variant === "neon") return { color: theme.accent, textShadow: `0 0 12px ${theme.accent}, 0 0 40px ${theme.accent}88` };
  if (variant === "pastel") return { color: "#db2777" };
  return {
    background: `linear-gradient(90deg, ${theme.secondary}, #fff3c4, ${theme.secondary})`,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    fontStyle: "italic",
  };
}
