import { PageData } from "@/lib/schema";

export const riyaFixture: PageData = {
  occasion: "BIRTHDAY",
  occasionDate: "2004-07-15",
  revealAt: null,
  recipient: { name: "Riya", nickname: "Riya jaan", relation: "Best Friend", age: 22 },
  from: "Arjun & gang",
  language: "HINGLISH",
  messages: [
    "Tu best hai yaar, har din tere bina boring hai ❤",
    "Tere jaisi dost milna bohot mushkil hai. Hamesha khush reh! 🎉",
    "22 saal ki ho gayi, phir bhi utni hi pagal hai 😂",
  ],
  memories: [
    { title: "Goa trip 2023", date: "2023-05-10", description: "Woh beach wali raat kabhi nahi bhulengi 🌊", mediaId: "img-1" },
    { title: "Farewell night", date: "2024-03-22", description: "Sab ro rahe the, Riya khaa rahi thi biryani 😂", mediaId: "img-2" },
    { title: "College first day", date: "2021-08-02", description: "Orientation mein mili thi, tab se dost hain ❤", mediaId: "img-3" },
  ],
  media: {
    images: [
      { id: "img-1", type: "image", url: "https://picsum.photos/seed/riya1/800/600", publicId: "demo/riya1", w: 800, h: 600, caption: "Goa 🌊", order: 0 },
      { id: "img-2", type: "image", url: "https://picsum.photos/seed/riya2/800/600", publicId: "demo/riya2", w: 800, h: 600, caption: "Farewell ✨", order: 1 },
      { id: "img-3", type: "image", url: "https://picsum.photos/seed/riya3/800/600", publicId: "demo/riya3", w: 800, h: 600, caption: "First day", order: 2 },
      { id: "img-4", type: "image", url: "https://picsum.photos/seed/riya4/600/800", publicId: "demo/riya4", w: 600, h: 800, caption: "Bestie ❤", order: 3 },
      { id: "img-5", type: "image", url: "https://picsum.photos/seed/riya5/800/600", publicId: "demo/riya5", w: 800, h: 600, caption: "Birthday 🎂", order: 4 },
      { id: "img-6", type: "image", url: "https://picsum.photos/seed/riya6/800/600", publicId: "demo/riya6", w: 800, h: 600, caption: "Road trip", order: 5 },
      { id: "img-7", type: "image", url: "https://picsum.photos/seed/riya7/600/800", publicId: "demo/riya7", w: 600, h: 800, caption: "Cafe ☕", order: 6 },
      { id: "img-8", type: "image", url: "https://picsum.photos/seed/riya8/800/600", publicId: "demo/riya8", w: 800, h: 600, caption: "Movie night 🎬", order: 7 },
      { id: "img-9", type: "image", url: "https://picsum.photos/seed/riya9/800/600", publicId: "demo/riya9", w: 800, h: 600, caption: "Last day 💜", order: 8 },
    ],
    videos: [],
  },
  theme: { templateId: "neon-night", accent: "#FF4FA3", font: "Space Grotesk", decorations: ["stars", "glow"] },
  settings: { wishesWall: true, showViews: true },
};
