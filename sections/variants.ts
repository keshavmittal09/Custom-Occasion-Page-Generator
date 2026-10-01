import type { CSSProperties } from "react";
import type { PageData } from "@/lib/schema";
import type { ThemeTokens } from "@/templates/registry";

// Each template = shared sections + one of these style configs + its own background/decor.
export type Variant = "neon" | "pastel" | "royal" | "y2k" | "brat" | "scrapbook" | "film" | "pixel" | "chat" | "retro" | "coquette";

type Css = CSSProperties;
type T = ThemeTokens;

export type VariantConfig = {
  light: boolean; // page background is light (affects share kit + overlays)
  cardInk: (t: T) => string; // text colour inside cards
  onAccent: (t: T) => string; // text colour on accent-filled buttons
  card: (t: T) => Css;
  heading: (t: T) => Css;
  frame: (t: T) => Css; // gallery photo frame
  tilt?: boolean; // playful rotation on cards/photos
  heroShape: "circle" | "arch" | "square" | "polaroid" | "letterbox";
  intro: "gift" | "envelope" | "notification" | "press-start" | "projector" | "boot";
  gift: string;
  finale: string;
  finaleTag?: string;
  titles: { message: string; gallery: string; timeline: string; wishes?: string; video?: string };
  kicker?: (p: PageData, title: string) => string;
  divider: "glow" | "wave" | "ornament" | "stars" | "line" | "doodle" | "film" | "pixel" | "chat" | "none" | "bow";
  messages: "cards" | "chat";
  chrome?: "win98"; // draw Windows-98 title bars on cards
  tape?: string; // washi tape colour on photos
  filmstrip?: boolean;
  badge?: string; // emoji pinned to photo frames
  lowercase?: boolean;
  headingSize: string;
  heroSize: string;
  progress: (t: T) => [string, string];
};

const H = "text-4xl sm:text-6xl";
const HERO = "text-[clamp(3rem,13vw,8.5rem)]";

export const VARIANTS: Record<Variant, VariantConfig> = {
  neon: {
    light: false,
    cardInk: (t) => t.text,
    onAccent: () => "#fff",
    card: (t) => ({ background: "rgba(255,255,255,0.05)", border: `1px solid ${t.accent}55`, boxShadow: `0 0 30px ${t.accent}33, inset 0 0 20px ${t.secondary}11`, backdropFilter: "blur(10px)", borderRadius: 24 }),
    heading: (t) => ({ color: t.accent, textShadow: `0 0 12px ${t.accent}, 0 0 40px ${t.accent}88` }),
    frame: (t) => ({ borderRadius: 20, overflow: "hidden", boxShadow: `0 0 25px ${t.accent}33`, border: `1px solid ${t.accent}44` }),
    heroShape: "circle",
    intro: "gift",
    gift: "🎁",
    finale: "🎉",
    titles: { message: "From the heart", gallery: "Memories", timeline: "Memory lane", video: "Press play" },
    divider: "glow",
    messages: "cards",
    headingSize: H,
    heroSize: HERO,
    progress: (t) => [t.accent, t.secondary],
  },
  pastel: {
    light: true,
    cardInk: () => "#1A1A2E",
    onAccent: () => "#1A1A2E",
    card: () => ({ background: "#ffffffcc", boxShadow: "0 10px 30px rgba(196,181,253,0.35)", borderRadius: 28, border: "2px solid #fff" }),
    heading: () => ({ color: "#db2777" }),
    frame: () => ({ background: "#fff", padding: "10px 10px 38px", borderRadius: 8, boxShadow: "0 14px 34px rgba(124,58,237,0.15)" }),
    tilt: true,
    heroShape: "circle",
    intro: "gift",
    gift: "🎀",
    finale: "🧁",
    titles: { message: "💌 A little note", gallery: "📸 Our polaroids", timeline: "Memory lane" },
    divider: "wave",
    messages: "cards",
    headingSize: H,
    heroSize: HERO,
    progress: () => ["#F472B6", "#A78BFA"],
  },
  royal: {
    light: false,
    cardInk: (t) => t.text,
    onAccent: () => "#0e0e10",
    card: (t) => ({ background: "linear-gradient(180deg,#16161a,#0e0e10)", border: `1px solid ${t.secondary}66`, borderRadius: 4, boxShadow: `0 0 0 4px #0e0e10, 0 0 0 5px ${t.secondary}33` }),
    heading: (t) => ({ background: `linear-gradient(90deg, ${t.secondary}, #fff3c4, ${t.secondary})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", fontStyle: "italic" }),
    frame: (t) => ({ border: `1px solid ${t.secondary}`, padding: 6, background: "#0e0e10" }),
    heroShape: "arch",
    intro: "envelope",
    gift: "👑",
    finale: "🥂",
    titles: { message: "A few words", gallery: "Cherished moments", timeline: "Our journey" },
    divider: "ornament",
    messages: "cards",
    headingSize: H,
    heroSize: HERO,
    progress: (t) => [t.secondary, "#fff3c4"],
  },
  y2k: {
    light: true,
    cardInk: () => "#1b1b3a",
    onAccent: () => "#fff",
    card: () => ({ border: "2px solid transparent", borderRadius: 28, background: "linear-gradient(#ffffffd9,#ffffffd9) padding-box, linear-gradient(135deg,#7ef9ff,#c084fc,#ff4fd8,#fde68a) border-box", boxShadow: "0 18px 40px -18px rgba(108,92,255,.45)" }),
    heading: () => ({ backgroundImage: "linear-gradient(180deg,#ffffff 0%,#c7cff9 28%,#5b5fe6 50%,#ffd1f4 72%,#ffffff 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: "drop-shadow(2px 3px 0 rgba(27,27,58,.85))", fontWeight: 900 }),
    frame: () => ({ padding: 5, borderRadius: 24, background: "linear-gradient(135deg,#7ef9ff,#c084fc,#ff4fd8,#fde68a)", boxShadow: "0 16px 32px -14px rgba(108,92,255,.5)" }),
    heroShape: "circle",
    intro: "gift",
    gift: "💿",
    finale: "🦋",
    titles: { message: "✧ messages 4 u ✧", gallery: "photo dump ✦", timeline: "core memories", wishes: "sign my guestbook ✦" },
    divider: "stars",
    messages: "cards",
    headingSize: "text-3xl sm:text-5xl",
    heroSize: "text-[clamp(2.5rem,11vw,7rem)]",
    progress: () => ["#ff4fd8", "#7ef9ff"],
  },
  brat: {
    light: true,
    cardInk: () => "#000",
    onAccent: () => "#8ace00",
    card: () => ({ background: "transparent", border: "2px solid #000", borderRadius: 0 }),
    heading: () => ({ color: "#000", filter: "blur(0.7px)", fontWeight: 400, letterSpacing: "-0.05em" }),
    frame: () => ({ borderRadius: 0 }),
    heroShape: "square",
    intro: "gift",
    gift: "💚",
    finale: "💚",
    finaleTag: "brat forever",
    titles: { message: "the messages", gallery: "photo dump", timeline: "the lore", wishes: "drop a wish" },
    divider: "line",
    messages: "cards",
    lowercase: true,
    headingSize: "text-5xl sm:text-7xl",
    heroSize: "text-[clamp(3.5rem,18vw,11rem)]",
    progress: () => ["#000", "#000"],
  },
  scrapbook: {
    light: true,
    cardInk: () => "#3b2f2a",
    onAccent: () => "#fff",
    card: () => ({ background: "#fffdf7", backgroundImage: "repeating-linear-gradient(transparent 0 31px, #e9dfcf 31px 32px)", borderRadius: 4, boxShadow: "0 10px 24px -8px rgba(59,47,42,.35)" }),
    heading: (t) => ({ color: t.accent, transform: "rotate(-2deg)" }),
    frame: () => ({ background: "#fff", padding: "10px 10px 40px", boxShadow: "0 12px 26px -10px rgba(59,47,42,.5)" }),
    tilt: true,
    tape: "rgba(255,214,102,.75)",
    heroShape: "polaroid",
    intro: "envelope",
    gift: "💌",
    finale: "📸",
    titles: { message: "notes for you", gallery: "our scrapbook", timeline: "little chapters", wishes: "sign the scrapbook" },
    divider: "doodle",
    messages: "cards",
    headingSize: H,
    heroSize: HERO,
    progress: (t) => [t.accent, t.secondary],
  },
  film: {
    light: false,
    cardInk: (t) => t.text,
    onAccent: () => "#0b0b0b",
    card: () => ({ background: "#141414", border: "1px solid #2a2a2a", borderRadius: 2 }),
    heading: (t) => ({ color: t.text, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 400 }),
    frame: () => ({ background: "#000", padding: "18px 6px", borderRadius: 2 }),
    filmstrip: true,
    heroShape: "letterbox",
    intro: "projector",
    gift: "🎬",
    finale: "🎬",
    finaleTag: "THE END",
    titles: { message: "Scene 1 · The words", gallery: "Scene 2 · The moments", timeline: "Scene 3 · The story so far", wishes: "The audience speaks", video: "Scene 4 · The footage" },
    kicker: (p) => `${p.from} presents`,
    divider: "film",
    messages: "cards",
    headingSize: "text-5xl sm:text-7xl",
    heroSize: "text-[clamp(3.5rem,17vw,10rem)]",
    progress: (t) => [t.accent, "#fff"],
  },
  pixel: {
    light: false,
    cardInk: (t) => t.text,
    onAccent: () => "#fff",
    card: () => ({ background: "#1d2b53", border: "4px solid #e8e8ff", boxShadow: "6px 6px 0 #000", borderRadius: 0 }),
    heading: (t) => ({ color: "#ffec27", textShadow: `3px 3px 0 ${t.accent}`, lineHeight: 1.5 }),
    frame: (t) => ({ border: "4px solid #e8e8ff", boxShadow: `6px 6px 0 ${t.accent}`, borderRadius: 0 }),
    heroShape: "square",
    intro: "press-start",
    gift: "🕹️",
    finale: "🏆",
    finaleTag: "GAME CLEAR!",
    titles: { message: "> MESSAGES.TXT", gallery: "> SAVE FILES", timeline: "> QUEST LOG", wishes: "> GUESTBOOK", video: "> CUTSCENE" },
    kicker: (p) => (p.occasion === "BIRTHDAY" && p.recipient.age ? `LEVEL ${p.recipient.age} UNLOCKED` : "PLAYER 1 READY"),
    divider: "pixel",
    messages: "cards",
    headingSize: "text-xl sm:text-3xl",
    heroSize: "text-[clamp(1.6rem,7vw,3.75rem)]",
    progress: (t) => [t.accent, "#ffec27"],
  },
  chat: {
    light: true,
    cardInk: () => "#111",
    onAccent: () => "#fff",
    card: () => ({ background: "#fff", borderRadius: 22, boxShadow: "0 1px 2px rgba(0,0,0,.06), 0 8px 24px -12px rgba(0,0,0,.12)" }),
    heading: () => ({ color: "#111", fontWeight: 700, letterSpacing: "-0.03em" }),
    frame: () => ({ borderRadius: 18, overflow: "hidden" }),
    heroShape: "circle",
    intro: "notification",
    gift: "💬",
    finale: "🫶",
    finaleTag: "end of thread",
    titles: { message: "Messages", gallery: "Shared photos", timeline: "Pinned memories", wishes: "Group chat" },
    kicker: (p) => `new message from ${p.from}`,
    divider: "chat",
    messages: "chat",
    headingSize: "text-4xl sm:text-5xl",
    heroSize: "text-[clamp(2.5rem,11vw,6rem)]",
    progress: (t) => [t.accent, t.secondary],
  },
  retro: {
    light: false,
    cardInk: () => "#000",
    onAccent: () => "#fff",
    card: () => ({ background: "#c0c0c0", borderStyle: "solid", borderWidth: 2, borderColor: "#ffffff #808080 #808080 #ffffff", boxShadow: "1px 1px 0 #000", borderRadius: 0 }),
    heading: () => ({ color: "#fff", textShadow: "2px 2px 0 #000" }),
    frame: () => ({ background: "#c0c0c0", padding: 4, borderStyle: "solid", borderWidth: 2, borderColor: "#ffffff #808080 #808080 #ffffff", boxShadow: "1px 1px 0 #000" }),
    chrome: "win98",
    heroShape: "square",
    intro: "boot",
    gift: "💾",
    finale: "🖥️",
    finaleTag: "It is now safe to celebrate.",
    titles: { message: "My Documents", gallery: "My Pictures", timeline: "History", wishes: "Guestbook.exe", video: "Media Player" },
    divider: "none",
    messages: "cards",
    headingSize: H,
    heroSize: "text-[clamp(2.5rem,11vw,6.5rem)]",
    progress: () => ["#000080", "#ffffff"],
  },
  coquette: {
    light: true,
    cardInk: () => "#5a3a45",
    onAccent: () => "#5a3a45",
    card: () => ({ background: "#fffafb", border: "1px solid #f4c6d2", borderRadius: 28, outline: "1px dashed #f4c6d2", outlineOffset: -10, boxShadow: "0 14px 36px -18px rgba(201,123,142,.45)" }),
    heading: (t) => ({ color: t.secondary, fontWeight: 400 }),
    frame: () => ({ background: "#fff", padding: "8px 8px 34px", borderRadius: "999px 999px 18px 18px", boxShadow: "0 14px 30px -16px rgba(201,123,142,.6)" }),
    badge: "🎀",
    heroShape: "arch",
    intro: "envelope",
    gift: "🎀",
    finale: "🩷",
    titles: { message: "love notes", gallery: "little moments", timeline: "our story", wishes: "kind words" },
    divider: "bow",
    messages: "cards",
    headingSize: "text-5xl sm:text-7xl",
    heroSize: "text-[clamp(3.5rem,16vw,9rem)]",
    progress: (t) => [t.accent, t.secondary],
  },
};
