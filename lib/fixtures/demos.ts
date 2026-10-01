import type { MediaItem, PageData, TemplateId } from "@/lib/schema";
import { riyaFixture } from "@/lib/fixtures/riya";
import { CATALOG } from "@/templates/catalog";
import { LIBRARY } from "@/lib/music";

// Sample-data pages for every template (template gallery + landing previews). Served without a DB.

const song = (id: string) => LIBRARY.find((t) => t.id === id)?.src;

function photos(seed: string, captions: string[], memes: Record<number, [string, string]> = {}): MediaItem[] {
  return captions.map((caption, i) => {
    const portrait = i % 3 === 0;
    return {
      id: `${seed}-${i}`,
      type: "image",
      url: `https://picsum.photos/seed/${seed}${i}/${portrait ? "600/800" : "800/600"}`,
      publicId: "",
      provider: "remote",
      w: portrait ? 600 : 800,
      h: portrait ? 800 : 600,
      caption,
      memeTop: memes[i]?.[0],
      memeBottom: memes[i]?.[1],
      order: i,
    };
  });
}

const page = (templateId: TemplateId, p: Omit<PageData, "theme" | "settings"> & { music?: string; stickers?: string[] }): PageData => ({
  ...p,
  theme: { templateId, music: p.music, decorations: p.stickers ?? [] },
  settings: { wishesWall: true, showViews: false },
});

const BY_TEMPLATE: Record<TemplateId, PageData> = {
  "neon-night": { ...riyaFixture, theme: { ...riyaFixture.theme, music: song("hyperfun"), decorations: ["🎉", "🔥", "🫶"] } },
  "pastel-dream": page("pastel-dream", {
    occasion: "BIRTHDAY", language: "ENGLISH", from: "Didi", recipient: { name: "Aanya", nickname: "Aanu", relation: "Little sister", age: 18 },
    messages: ["Happy 18th to my favourite human! You're officially an adult (sort of) 🎀", "Thank you for stealing my clothes and my heart. Love you forever 💖"],
    memories: [{ title: "Your first day of school", date: "2012-06-04", description: "You cried, then made 4 friends by lunch." }, { title: "Manali trip", date: "2023-12-22", description: "Snowball fight champion 🏆" }],
    media: { images: photos("aanya", ["Tiny you 🍼", "Beach day", "Bestie energy", "Snow!", "Cake face 🎂", "Us ❤"]), videos: [] }, music: song("carefree"), stickers: ["🎀", "💖", "🧁"],
  }),
  "royal-gold": page("royal-gold", {
    occasion: "ANNIVERSARY", language: "ENGLISH", from: "Your kids", recipient: { name: "Mom & Dad", relation: "Parents" },
    messages: ["25 years of love, laughter and patience. You two are our favourite love story.", "Here's to many more decades of holding hands. Happy Silver Jubilee! 🥂"],
    memories: [{ title: "The wedding", date: "2001-02-14", description: "Dad was 2 hours late. Mom still said yes." }, { title: "First home", date: "2005-08-01", description: "A tiny flat full of very big dreams." }, { title: "25 years", date: "2026-02-14", description: "Still dancing in the kitchen." }],
    media: { images: photos("parents", ["The beginning", "First home", "Family trip", "Still in love", "Diwali 2019"]), videos: [] }, music: song("gymnopedie-no-1"),
  }),
  "y2k-chrome": page("y2k-chrome", {
    occasion: "BIRTHDAY", language: "ENGLISH", from: "ur girls 💅", recipient: { name: "Zoya", nickname: "Zoyaaa", relation: "Bestie", age: 20 },
    messages: ["happy bday to the main character fr ✧ 20 looks insanely good on u", "thank u for being my 3am call, my fit check and my emotional support human 💿"],
    memories: [{ title: "the concert", date: "2024-11-09", description: "lost our voices, found our people" }],
    media: { images: photos("zoya", ["photo dump pt 1", "the fit 💅", "mirror selfie era", "concert!!", "us at 3am"], { 1: ["when she said", "she's 'not dressing up'"] }), videos: [] }, music: song("wallpaper"), stickers: ["🦋", "💿", "✨", "💅"],
  }),
  brat: page("brat", {
    occasion: "BIRTHDAY", language: "ENGLISH", from: "the group chat", recipient: { name: "Aarav", relation: "friend", age: 23 },
    messages: ["happy birthday aarav. you're so annoying and we love you", "23 is your brat era. no notes"],
    memories: [{ title: "the night we got lost in goa", date: "2025-01-12", description: "google maps was not on our side" }],
    media: { images: photos("aarav", ["him", "him again", "chaos", "the squad"], { 0: ["me pretending", "to be productive"], 2: ["", "brat behaviour"] }), videos: [] }, music: song("hyperfun"), stickers: ["💚", "🫶", "💀"],
  }),
  scrapbook: page("scrapbook", {
    occasion: "FAREWELL", language: "HINGLISH", from: "Team Sunshine", recipient: { name: "Meera", relation: "Teammate" },
    messages: ["Meera, tere bina office bilkul boring ho jayega 🥹 Nayi journey ke liye dher saari shubhkamnayein!", "Chai breaks, deadlines aur bakwaas jokes — sab yaad aayenge. Keep shining! ✨"],
    memories: [{ title: "Pehla din", date: "2022-07-11", description: "Galat floor pe pahunch gayi thi 😂" }, { title: "Diwali party", date: "2024-10-30", description: "Best dancer award 💃" }],
    media: { images: photos("meera", ["Desk vibes", "Team lunch", "Diwali 🪔", "Offsite", "Last day 💛"]), videos: [] }, music: song("life-of-riley"), stickers: ["🌼", "💛"],
  }),
  "film-reel": page("film-reel", {
    occasion: "WEDDING", language: "HINDI", from: "दोस्तों की टोली", recipient: { name: "कबीर & इशिता", relation: "दोस्त" },
    messages: ["तुम दोनों की कहानी किसी फ़िल्म से कम नहीं। शादी मुबारक हो! 🎬", "हमेशा ऐसे ही हँसते रहो, लड़ते रहो और एक-दूसरे का साथ निभाते रहो।"],
    memories: [{ title: "पहली मुलाक़ात", date: "2019-03-15", description: "कॉलेज की कैंटीन, एक समोसा और दो दिल।" }, { title: "प्रपोज़ल", date: "2025-06-20", description: "बारिश, घुटने और 'हाँ'।" }],
    media: { images: photos("wedding", ["पहली मुलाक़ात", "रोड ट्रिप", "सगाई", "संगीत की रात", "हमेशा के लिए"]), videos: [] }, music: song("bossa-antigua"),
  }),
  "pixel-quest": page("pixel-quest", {
    occasion: "BIRTHDAY", language: "ENGLISH", from: "Player 2 (Kunal)", recipient: { name: "Rohan", relation: "Co-op partner", age: 21 },
    messages: ["Achievement unlocked: 21 years of being legendary. +1000 XP 🎮", "Thanks for carrying me in every game AND in life. GG forever."],
    memories: [{ title: "First LAN party", date: "2018-05-02", description: "Lost every match. Had the best time." }, { title: "Ranked grind", date: "2024-02-10", description: "We finally hit Diamond 💎" }],
    media: { images: photos("rohan", ["Boss fight", "Victory royale", "Snack break", "Squad", "Level up"], { 1: ["one more game", "it's 4am"] }), videos: [] }, music: song("8bit-birthday"), stickers: ["🎮", "👾", "🏆"],
  }),
  "group-chat": page("group-chat", {
    occasion: "CONGRATS", language: "HINGLISH", from: "Besties 4 Life", recipient: { name: "Priya", relation: "Best friend" },
    messages: ["PRIYA NEW JOB?!?! 😭😭 so so proud of you", "Treat kab de rahi hai? Pizza > speech, bata dena", "Tu deserve karti hai sab kuch. Ab office mein bhi sabko pagal karna 💅"],
    memories: [{ title: "Interview day", date: "2026-08-12", description: "Nervous calls at 7am 📞" }],
    media: { images: photos("priya", ["offer letter day", "celebration", "us", "first day fit"], { 0: ["hr: you're hired", "priya:"] }), videos: [] }, music: song("fluffing-a-duck"), stickers: ["😭", "🫶", "🔥"],
  }),
  "retro-desktop": page("retro-desktop", {
    occasion: "FAREWELL", language: "ENGLISH", from: "IT Department", recipient: { name: "Dev", relation: "Colleague" },
    messages: ["Dev.exe has stopped working here… and started somewhere awesome. Good luck! 💾", "Thanks for fixing our printers, our code and occasionally our moods."],
    memories: [{ title: "Server crash of 2023", date: "2023-04-01", description: "You saved the day (and the database)." }],
    media: { images: photos("dev", ["Desk setup", "Hackathon", "Team pizza", "Farewell cake"]), videos: [] }, music: song("local-forecast-elevator"), stickers: ["💾", "🖥️"],
  }),
  coquette: page("coquette", {
    occasion: "ANNIVERSARY", language: "ENGLISH", from: "Yours, always — Vihaan", recipient: { name: "Ananya", nickname: "Annie", relation: "My love" },
    messages: ["Two years of you, and I still get butterflies every single time you laugh. 🎀", "Thank you for making ordinary days feel like little love letters."],
    memories: [{ title: "Our first date", date: "2024-09-14", description: "Coffee that turned into a five-hour walk." }, { title: "Paris, almost", date: "2025-12-24", description: "Okay it was Pondicherry. Still magic." }],
    media: { images: photos("annie", ["first date ☕", "golden hour", "pondicherry", "us 🩷", "forever"]), videos: [] }, music: song("bossa-antigua"), stickers: ["🎀", "🩷", "🤍"],
  }),
};

export const demoPages: Record<string, PageData> = Object.fromEntries(CATALOG.map((t) => [t.demo, BY_TEMPLATE[t.id]]));
export const demoFor = (id: TemplateId) => BY_TEMPLATE[id];
