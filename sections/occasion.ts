import type { Occasion } from "@/lib/schema";

// Occasion-aware decoration: birthday → cake/balloons, anniversary → hearts/petals, custom → sparkles
export const OCCASION_ICONS: Record<Occasion, string[]> = {
  BIRTHDAY: ["🎂", "🎈", "🎉", "🎁", "🧁", "🎈"],
  ANNIVERSARY: ["💕", "🌹", "💞", "❤️", "🥂", "🌸"],
  WEDDING: ["💍", "🕊️", "💐", "🤍", "🥂", "🌸"],
  FAREWELL: ["✈️", "🌅", "👋", "💫", "🎒", "🌟"],
  CONGRATS: ["🏆", "🎓", "🌟", "🍾", "🎊", "⭐"],
  FRIENDSHIP: ["🤝", "🫶", "🌻", "😂", "✨", "💛"],
  CUSTOM: ["✨", "⭐", "💫", "🌟", "✨", "💖"],
};

export const CONFETTI_SHAPES: Record<Occasion, string[]> = {
  BIRTHDAY: ["🎈", "🎉"],
  ANNIVERSARY: ["❤️", "🌹"],
  WEDDING: ["🤍", "💐"],
  FAREWELL: ["✨", "🌟"],
  CONGRATS: ["🏆", "⭐"],
  FRIENDSHIP: ["💛", "🫶"],
  CUSTOM: ["✨", "💖"],
};
