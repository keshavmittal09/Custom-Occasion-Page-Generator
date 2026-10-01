"use client";
import { TemplateProps } from "@/templates/registry";

// Neon Night Template — stub for motion dev C to flesh out
export default function NeonNight({ page, theme }: TemplateProps) {
  return (
    <div
      style={{
        background: theme.background,
        color: theme.text,
        fontFamily: theme.font,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <h1 style={{ color: theme.accent, fontSize: "3rem", fontWeight: 700 }}>
        Happy Birthday, {page.recipient.name}! 🎉
      </h1>
      <p style={{ color: theme.secondary, marginTop: "1rem" }}>
        From: {page.from}
      </p>
      <p style={{ marginTop: "2rem", maxWidth: 600, textAlign: "center", opacity: 0.8 }}>
        {page.messages[0]}
      </p>
      <p style={{ marginTop: "3rem", opacity: 0.4, fontSize: "0.8rem" }}>
        [Neon Night Template — Motion dev C: build your sections here]
      </p>
    </div>
  );
}
