import React from "react";
import dynamic from "next/dynamic";
import { PageData, TemplateId } from "@/lib/schema";

export type ThemeTokens = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  font: string; // body font (name or full CSS stack)
  display?: string; // heading font
  easing: string;
  decorations: string[];
};

// "live" = real public page · "preview" = full-screen preview in the wizard · "pane" = small live preview
export type TemplateMode = "live" | "preview" | "pane";
export type TemplateProps = { page: PageData; theme: ThemeTokens; mode?: TemplateMode };

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const THEME_DEFAULTS: Record<TemplateId, ThemeTokens> = {
  "neon-night": { primary: "#0B0420", secondary: "#22D3EE", accent: "#FF4FA3", background: "#0B0420", text: "#F8FAFC", font: "Space Grotesk", easing: EASE, decorations: [] },
  "pastel-dream": { primary: "#FFF1F5", secondary: "#C4B5FD", accent: "#FBCFE8", background: "#FFF1F5", text: "#1A1A2E", font: "Fredoka", display: "Fredoka", easing: EASE, decorations: [] },
  "royal-gold": { primary: "#0E0E10", secondary: "#D4AF37", accent: "#F5E6C8", background: "#0E0E10", text: "#F5E6C8", font: "Cormorant Garamond", display: "Playfair Display", easing: EASE, decorations: [] },
  "y2k-chrome": { primary: "#efe8ff", secondary: "#6c5cff", accent: "#ff4fd8", background: "#f3efff", text: "#1b1b3a", font: "Space Grotesk", display: "Unbounded", easing: EASE, decorations: [] },
  brat: { primary: "#8ace00", secondary: "#000000", accent: "#000000", background: "#8ace00", text: "#000000", font: "'Arial Narrow', 'Archivo Narrow', Arial, sans-serif", easing: EASE, decorations: [] },
  scrapbook: { primary: "#f3e9dc", secondary: "#2a9d8f", accent: "#e76f51", background: "#f3e9dc", text: "#3b2f2a", font: "Caveat", display: "Permanent Marker", easing: EASE, decorations: [] },
  "film-reel": { primary: "#0b0b0b", secondary: "#bdbdbd", accent: "#e9c46a", background: "#0b0b0b", text: "#f2efe9", font: "Courier Prime", display: "Bebas Neue", easing: EASE, decorations: [] },
  "pixel-quest": { primary: "#0f0f23", secondary: "#00e436", accent: "#ff004d", background: "#0f0f23", text: "#e8e8ff", font: "Pixelify Sans", display: "Press Start 2P", easing: EASE, decorations: [] },
  "group-chat": { primary: "#f2f2f7", secondary: "#34c759", accent: "#0a84ff", background: "#f2f2f7", text: "#111111", font: "Inter", easing: EASE, decorations: [] },
  "retro-desktop": { primary: "#008080", secondary: "#c0c0c0", accent: "#000080", background: "#008080", text: "#ffffff", font: "Tahoma, Verdana, 'Segoe UI', sans-serif", display: "Pixelify Sans", easing: EASE, decorations: [] },
  coquette: { primary: "#fff5f7", secondary: "#c97b8e", accent: "#f4a7b9", background: "#fff5f7", text: "#5a3a45", font: "Cormorant Garamond", display: "Pinyon Script", easing: EASE, decorations: [] },
};

// Code-split: each template is its own chunk, fetched only when that template renders.
// (next/dynamic must be called at module top level.)
const TEMPLATES: Record<TemplateId, React.ComponentType<TemplateProps>> = {
  "neon-night": dynamic(() => import("@/templates/neon-night/index"), { ssr: false }),
  "pastel-dream": dynamic(() => import("@/templates/pastel-dream/index"), { ssr: false }),
  "royal-gold": dynamic(() => import("@/templates/royal-gold/index"), { ssr: false }),
  "y2k-chrome": dynamic(() => import("@/templates/y2k-chrome/index"), { ssr: false }),
  brat: dynamic(() => import("@/templates/brat/index"), { ssr: false }),
  scrapbook: dynamic(() => import("@/templates/scrapbook/index"), { ssr: false }),
  "film-reel": dynamic(() => import("@/templates/film-reel/index"), { ssr: false }),
  "pixel-quest": dynamic(() => import("@/templates/pixel-quest/index"), { ssr: false }),
  "group-chat": dynamic(() => import("@/templates/group-chat/index"), { ssr: false }),
  "retro-desktop": dynamic(() => import("@/templates/retro-desktop/index"), { ssr: false }),
  coquette: dynamic(() => import("@/templates/coquette/index"), { ssr: false }),
};

export function getTemplate(templateId: TemplateId): React.ComponentType<TemplateProps> {
  return TEMPLATES[templateId] ?? TEMPLATES["neon-night"];
}

export function getTheme(page: PageData): ThemeTokens {
  const base = THEME_DEFAULTS[page.theme.templateId] ?? THEME_DEFAULTS["neon-night"];
  return {
    ...base,
    ...(page.theme.accent && { accent: page.theme.accent }),
    ...(page.theme.font && { font: page.theme.font }),
    decorations: page.theme.decorations ?? [],
  };
}
