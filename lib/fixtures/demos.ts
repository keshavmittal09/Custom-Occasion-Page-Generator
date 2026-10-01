import { PageData } from "@/lib/schema";
import { riyaFixture } from "@/lib/fixtures/riya";

// One demo page per template, served at /w/demo, /w/demo-pastel, /w/demo-royal
export const demoPages: Record<string, PageData> = {
  demo: riyaFixture,
  "demo-pastel": {
    ...riyaFixture,
    language: "ENGLISH",
    recipient: { name: "Aanya", nickname: "Aanu", relation: "Little Sister", age: 18 },
    from: "Didi",
    messages: [
      "Happy 18th, my favourite human! 🎀 You're officially an adult (sort of).",
      "Thank you for stealing my clothes and my heart. Love you forever 💖",
    ],
    theme: { templateId: "pastel-dream", decorations: [] },
  },
  "demo-royal": {
    ...riyaFixture,
    occasion: "ANNIVERSARY",
    language: "ENGLISH",
    recipient: { name: "Mom & Dad", relation: "Parents" },
    from: "Your kids",
    messages: [
      "25 years of love, laughter and patience. You two are our favourite love story.",
      "Here's to many more decades of holding hands. Happy Silver Jubilee! 🥂",
    ],
    theme: { templateId: "royal-gold", decorations: [] },
  },
};
