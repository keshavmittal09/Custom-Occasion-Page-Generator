// Built-in music library.
// - synth:* tracks are generated live with the Web Audio API (no files, no licensing, work offline)
// - the rest are royalty-free tracks by Kevin MacLeod (incompetech.com), CC BY 4.0 — credited on the page

export type Track = { id: string; title: string; mood: Mood; emoji: string; src: string; credit?: string };
export type Mood = "Birthday" | "Happy" | "Chill" | "Emotional" | "Party" | "Meme";

export const MOODS: { id: Mood; emoji: string }[] = [
  { id: "Birthday", emoji: "🎂" },
  { id: "Happy", emoji: "😊" },
  { id: "Chill", emoji: "🌙" },
  { id: "Emotional", emoji: "🥹" },
  { id: "Party", emoji: "🪩" },
  { id: "Meme", emoji: "💀" },
];

const kevin = (file: string, title: string, mood: Mood, emoji: string): Track => ({
  id: file.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  title,
  mood,
  emoji,
  src: `https://incompetech.com/music/royalty-free/mp3-royaltyfree/${encodeURIComponent(file)}.mp3`,
  credit: `"${title}" by Kevin MacLeod (incompetech.com) · CC BY 4.0`,
});

export const LIBRARY: Track[] = [
  { id: "music-box-birthday", title: "Happy Birthday · music box", mood: "Birthday", emoji: "🎶", src: "synth:music-box-birthday" },
  { id: "8bit-birthday", title: "Happy Birthday · 8-bit", mood: "Birthday", emoji: "👾", src: "synth:8bit-birthday" },
  { id: "soft-piano", title: "Soft piano", mood: "Emotional", emoji: "🎹", src: "synth:soft-piano" },
  kevin("Carefree", "Carefree", "Happy", "🌼"),
  kevin("Life of Riley", "Life of Riley", "Happy", "☀️"),
  kevin("Happy Bee", "Happy Bee", "Happy", "🐝"),
  kevin("Easy Lemon", "Easy Lemon", "Chill", "🍋"),
  kevin("Wallpaper", "Wallpaper", "Chill", "🌙"),
  kevin("Bossa Antigua", "Bossa Antigua", "Chill", "☕"),
  kevin("Dreamer", "Dreamer", "Emotional", "💭"),
  kevin("Gymnopedie No 1", "Gymnopédie No. 1", "Emotional", "🕊️"),
  kevin("Hyperfun", "Hyperfun", "Party", "🪩"),
  kevin("Merry Go", "Merry Go", "Party", "🎠"),
  kevin("Fluffing a Duck", "Fluffing a Duck", "Meme", "🦆"),
  kevin("Monkeys Spinning Monkeys", "Monkeys Spinning Monkeys", "Meme", "🐒"),
  kevin("Local Forecast - Elevator", "Local Forecast (elevator)", "Meme", "🛗"),
  kevin("Pixel Peeker Polka - faster", "Pixel Peeker Polka", "Meme", "🕹️"),
];

export const trackBySrc = (src?: string) => (src ? LIBRARY.find((t) => t.src === src) : undefined);
