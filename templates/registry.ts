import React from "react";
import dynamic from "next/dynamic";
import { PageData, TemplateId } from "@/lib/schema";

export type ThemeTokens = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  font: string;
  easing: string;
  decorations: string[];
};

export type TemplateProps = { page: PageData; theme: ThemeTokens };

const THEME_DEFAULTS: Record<TemplateId, ThemeTokens> = {
  "neon-night": {
    primary: "#0B0420",
    secondary: "#22D3EE",
    accent: "#FF4FA3",
    background: "#0B0420",
    text: "#F8FAFC",
    font: "Space Grotesk",
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    decorations: ["stars", "glow"],
  },
  "pastel-dream": {
    primary: "#FFF1F5",
    secondary: "#C4B5FD",
    accent: "#FBCFE8",
    background: "#FFF1F5",
    text: "#1A1A2E",
    font: "Fredoka",
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    decorations: ["balloons", "polaroids", "doodles"],
  },
  "royal-gold": {
    primary: "#0E0E10",
    secondary: "#D4AF37",
    accent: "#F5E6C8",
    background: "#0E0E10",
    text: "#F5E6C8",
    font: "Playfair Display",
    easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    decorations: ["gold-shimmer", "petals"],
  },
};

// Dynamically imported — each template is code-split
const templateComponents: Record<TemplateId, React.ComponentType<TemplateProps>> = {
  "neon-night": dynamic(() => import("@/templates/neon-night/index"), { ssr: false }) as any,
  "pastel-dream": dynamic(() => import("@/templates/pastel-dream/index"), { ssr: false }) as any,
  "royal-gold": dynamic(() => import("@/templates/royal-gold/index"), { ssr: false }) as any,
};

export function getTemplate(templateId: TemplateId): React.ComponentType<TemplateProps> {
  return templateComponents[templateId] ?? templateComponents["neon-night"];
}

export function getTheme(page: PageData): ThemeTokens {
  const base = THEME_DEFAULTS[page.theme.templateId] ?? THEME_DEFAULTS["neon-night"];
  return {
    ...base,
    ...(page.theme.accent && { accent: page.theme.accent }),
    ...(page.theme.font && { font: page.theme.font }),
    decorations: page.theme.decorations?.length ? page.theme.decorations : base.decorations,
  };
}
