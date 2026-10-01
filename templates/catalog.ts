import type { Occasion, TemplateId } from "@/lib/schema";

// Single source of truth for template metadata (gallery, wizard, landing, API, seed)
export type CatalogEntry = {
  id: TemplateId;
  name: string;
  note: string;
  vibe: "Gen Z" | "Aesthetic" | "Classic";
  occasions: Occasion[];
  gradient: string; // tailwind gradient classes for cards
  bg: string; // raw CSS background for inline previews
  emoji: string;
  dark: boolean;
  font: string; // display font shown in previews
  motion: string;
  palette: [string, string, string];
  demo: string; // slug of the sample-data demo page
};

export const CATALOG: CatalogEntry[] = [
  { id: "neon-night", name: "Neon Night", note: "Starfield, neon glow and party energy", vibe: "Gen Z", occasions: ["BIRTHDAY", "FRIENDSHIP", "CONGRATS", "CUSTOM"], gradient: "from-[#1b1250] via-[#4a2fb0] to-[#e85fa8]", bg: "linear-gradient(160deg,#0B0420 10%,#3b0764 55%,#FF4FA3)", emoji: "🎁", dark: true, font: "Space Grotesk", motion: "Twinkling starfield", palette: ["#FF4FA3", "#22D3EE", "#A78BFA"], demo: "demo" },
  { id: "pastel-dream", name: "Pastel Dream", note: "Balloons, polaroids and soft pinks", vibe: "Aesthetic", occasions: ["BIRTHDAY", "ANNIVERSARY", "FRIENDSHIP"], gradient: "from-[#fde2f0] via-[#e8dcff] to-[#cfe3ff]", bg: "linear-gradient(160deg,#FFF1F5 10%,#FBCFE8 50%,#C4B5FD)", emoji: "🎀", dark: false, font: "Fredoka", motion: "Floating balloons", palette: ["#FBCFE8", "#C4B5FD", "#FDE68A"], demo: "demo-pastel" },
  { id: "royal-gold", name: "Royal Gold", note: "Black velvet, gold petals, elegant serif", vibe: "Classic", occasions: ["ANNIVERSARY", "WEDDING", "FAREWELL", "CONGRATS"], gradient: "from-[#1a140a] via-[#5a4318] to-[#e8c27a]", bg: "linear-gradient(160deg,#0E0E10 10%,#3a2f12 55%,#D4AF37)", emoji: "👑", dark: true, font: "Playfair Display", motion: "Falling gold petals", palette: ["#D4AF37", "#F5E6C8", "#7F1D1D"], demo: "demo-royal" },
  { id: "y2k-chrome", name: "Y2K Chrome", note: "Holographic chrome, butterflies and sparkles", vibe: "Gen Z", occasions: ["BIRTHDAY", "FRIENDSHIP", "CUSTOM"], gradient: "from-[#c7f9ff] via-[#e9d5ff] to-[#ffc8ef]", bg: "linear-gradient(135deg,#d7fbff 0%,#efe2ff 40%,#ffd3f1 75%,#e2fff3 100%)", emoji: "💿", dark: false, font: "Unbounded", motion: "Holo shimmer", palette: ["#ff4fd8", "#6c5cff", "#7ef9ff"], demo: "demo-y2k-chrome" },
  { id: "brat", name: "brat", note: "lime green, lowercase, zero effort (all effort)", vibe: "Gen Z", occasions: ["BIRTHDAY", "FRIENDSHIP", "CONGRATS", "CUSTOM"], gradient: "from-[#8ace00] via-[#8ace00] to-[#7bb800]", bg: "#8ace00", emoji: "💚", dark: false, font: "Arial Narrow", motion: "Blurry marquee", palette: ["#8ace00", "#000000", "#ffffff"], demo: "demo-brat" },
  { id: "scrapbook", name: "Scrapbook", note: "Kraft paper, washi tape, handwritten notes", vibe: "Aesthetic", occasions: ["BIRTHDAY", "ANNIVERSARY", "FRIENDSHIP", "FAREWELL"], gradient: "from-[#f3e9dc] via-[#efe0c9] to-[#e7d3b5]", bg: "linear-gradient(160deg,#f6eee2,#ead9bf)", emoji: "📒", dark: false, font: "Caveat", motion: "Envelope opening", palette: ["#e76f51", "#2a9d8f", "#f4a261"], demo: "demo-scrapbook" },
  { id: "film-reel", name: "Film Reel", note: "Black & white cinema, grain and credits", vibe: "Aesthetic", occasions: ["ANNIVERSARY", "WEDDING", "FAREWELL", "BIRTHDAY"], gradient: "from-[#0b0b0b] via-[#2b2b2b] to-[#6b6b6b]", bg: "linear-gradient(160deg,#050505,#2a2a2a)", emoji: "🎬", dark: true, font: "Bebas Neue", motion: "Projector countdown", palette: ["#e9c46a", "#f2efe9", "#2a2a2a"], demo: "demo-film-reel" },
  { id: "pixel-quest", name: "Pixel Quest", note: "8-bit game, level up, achievements", vibe: "Gen Z", occasions: ["BIRTHDAY", "CONGRATS", "FRIENDSHIP"], gradient: "from-[#0f0f23] via-[#1d2b53] to-[#7e2553]", bg: "linear-gradient(160deg,#0f0f23,#1d2b53 60%,#7e2553)", emoji: "🕹️", dark: true, font: "Press Start 2P", motion: "Press start + scanlines", palette: ["#ff004d", "#ffec27", "#00e436"], demo: "demo-pixel-quest" },
  { id: "group-chat", name: "Group Chat", note: "Your wishes as an iMessage thread", vibe: "Gen Z", occasions: ["BIRTHDAY", "FRIENDSHIP", "CONGRATS", "FAREWELL"], gradient: "from-[#e5f0ff] via-[#f2f2f7] to-[#dff7e6]", bg: "linear-gradient(160deg,#eef4ff,#f2f2f7 60%,#e3f8ea)", emoji: "💬", dark: false, font: "Inter", motion: "Typing bubbles", palette: ["#0a84ff", "#34c759", "#e9e9eb"], demo: "demo-group-chat" },
  { id: "retro-desktop", name: "Retro Desktop", note: "Windows 98 nostalgia, pop-ups and a taskbar", vibe: "Gen Z", occasions: ["BIRTHDAY", "CONGRATS", "FRIENDSHIP", "FAREWELL"], gradient: "from-[#008080] via-[#007070] to-[#005f5f]", bg: "#008080", emoji: "💾", dark: true, font: "Pixelify Sans", motion: "Boot-up dialog", palette: ["#008080", "#c0c0c0", "#000080"], demo: "demo-retro-desktop" },
  { id: "coquette", name: "Coquette", note: "Bows, lace, pearls and love letters", vibe: "Aesthetic", occasions: ["ANNIVERSARY", "BIRTHDAY", "WEDDING", "FRIENDSHIP"], gradient: "from-[#fff5f7] via-[#ffe1ea] to-[#f9c9d6]", bg: "linear-gradient(160deg,#fff7f9,#ffe3eb)", emoji: "🎀", dark: false, font: "Pinyon Script", motion: "Envelope + floating bows", palette: ["#f4a7b9", "#c97b8e", "#fffafb"], demo: "demo-coquette" },
];

export const catalogById = Object.fromEntries(CATALOG.map((t) => [t.id, t])) as Record<TemplateId, CatalogEntry>;

// Google Fonts families per font name (loaded only by the template that uses them)
export const FONT_PARAMS: Record<string, string> = {
  "Space Grotesk": "Space+Grotesk:wght@400;600;700",
  Fredoka: "Fredoka:wght@400;600;700",
  "Playfair Display": "Playfair+Display:ital,wght@0,400;0,700;1,400;1,700",
  Unbounded: "Unbounded:wght@400;700;900",
  "Archivo Narrow": "Archivo+Narrow:wght@400;700",
  Caveat: "Caveat:wght@400;700",
  "Permanent Marker": "Permanent+Marker",
  "Courier Prime": "Courier+Prime:ital,wght@0,400;0,700;1,400",
  "Bebas Neue": "Bebas+Neue",
  "Press Start 2P": "Press+Start+2P",
  "Pixelify Sans": "Pixelify+Sans:wght@400;700",
  Inter: "Inter:wght@400;500;600;700",
  "Pinyon Script": "Pinyon+Script",
  "Cormorant Garamond": "Cormorant+Garamond:ital,wght@0,400;0,600;1,400",
  Anton: "Anton",
  Mukta: "Mukta:wght@400;600;700",
};

export function fontsHref(families: (string | undefined)[]) {
  const names = new Set<string>(["Anton", "Mukta"]); // meme captions + Devanagari for Hindi
  for (const f of families) f?.split(",").forEach((n) => names.add(n.trim().replace(/^['"]|['"]$/g, "")));
  const params = [...names].map((n) => FONT_PARAMS[n]).filter(Boolean).map((p) => `family=${p}`);
  return `https://fonts.googleapis.com/css2?${params.join("&")}&display=swap`;
}
