// Every user string is cleaned on write and React escapes on render (no dangerouslySetInnerHTML anywhere).
// We strip tags instead of HTML-encoding so "Tom & Jerry" is stored as-is rather than "Tom &amp; Jerry".

export function sanitize(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
}

// Recursively clean every string in a JSON-like value (page payloads)
export function sanitizeDeep<T>(value: T): T {
  if (typeof value === "string") return sanitize(value) as T;
  if (Array.isArray(value)) return value.map(sanitizeDeep) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, k === "url" || k === "music" ? v : sanitizeDeep(v)])) as T;
  }
  return value;
}

// Basic profanity filter for the public wishes wall (English + common Hinglish)
const BAD_WORDS = ["fuck", "shit", "bitch", "bastard", "asshole", "dick", "cunt", "slut", "whore", "chutiya", "madarchod", "bhenchod", "behenchod", "bhosdi", "gandu", "randi", "harami", "lavde", "lodu"];
const BAD_RE = new RegExp(`\\b(${BAD_WORDS.join("|")})\\w*`, "gi");

export function maskProfanity(input: string): string {
  return input.replace(BAD_RE, (w) => w[0] + "*".repeat(Math.max(w.length - 1, 2)));
}
