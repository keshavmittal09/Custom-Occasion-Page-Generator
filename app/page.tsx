import Link from "next/link";

const FEATURES = [
  { emoji: "🎨", title: "3 animated templates", desc: "Neon Night, Pastel Dream and Royal Gold — each with its own motion style." },
  { emoji: "📸", title: "Photos & memories", desc: "Gallery with lightbox plus a memory-lane timeline of your moments together." },
  { emoji: "🔒", title: "Surprise locks", desc: "Schedule a reveal time with a live countdown, or protect with a password." },
  { emoji: "💬", title: "Wishes wall", desc: "Friends can drop their own wishes right on the page." },
  { emoji: "🌐", title: "English, Hinglish, हिंदी", desc: "The page speaks their language." },
  { emoji: "📲", title: "Share anywhere", desc: "Copy link, WhatsApp or a downloadable QR code." },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0420] bg-[radial-gradient(ellipse_at_top,rgba(255,79,163,0.25),transparent_60%)] text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="text-xl font-bold">🎁 Occasion<span className="text-pink-400">Pages</span></span>
        <div className="flex gap-4 text-sm">
          <Link href="/dashboard" className="rounded-lg px-3 py-2 text-white/70 hover:text-white">My pages</Link>
          <Link href="/create" className="rounded-lg bg-white px-4 py-2 font-semibold text-black">Create</Link>
        </div>
      </nav>

      <section className="mx-auto max-w-4xl px-6 pb-20 pt-16 text-center sm:pt-24">
        <p className="mb-4 inline-block rounded-full border border-pink-400/40 bg-pink-500/10 px-4 py-1 text-sm text-pink-200">
          Birthdays · Anniversaries · Farewells · Weddings
        </p>
        <h1 className="text-5xl font-extrabold leading-tight sm:text-7xl">
          Turn your wishes into a{" "}
          <span className="bg-gradient-to-r from-pink-400 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">magical page</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60">
          Add photos, messages and memories — get a beautiful animated page with a shareable link in under 2 minutes. No signup needed.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/create" className="rounded-2xl bg-gradient-to-r from-pink-500 to-violet-500 px-8 py-4 text-lg font-semibold shadow-xl shadow-pink-500/30 transition hover:scale-105">
            Create a page ✨
          </Link>
          <Link href="/w/demo" className="rounded-2xl border border-white/20 px-8 py-4 text-lg transition hover:bg-white/10">
            See live demo →
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="text-3xl">{f.emoji}</div>
            <h3 className="mt-3 text-lg font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-white/60">{f.desc}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-sm text-white/40">Made with ❤️ by Team Occasion</footer>
    </main>
  );
}
