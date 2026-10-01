import Link from "next/link";
import Navbar from "@/components/ui/Navbar";

const FEATURES = [
  { emoji: "🎨", title: "3 animated templates", desc: "Neon Night, Pastel Dream and Royal Gold, each with its own motion style." },
  { emoji: "📸", title: "Photos & memories", desc: "Gallery with lightbox plus a memory-lane timeline of your moments." },
  { emoji: "🔒", title: "Surprise locks", desc: "Schedule a reveal with a live countdown, or protect it with a password." },
  { emoji: "💬", title: "Wishes wall", desc: "Friends can drop their own wishes right on the page." },
  { emoji: "🌐", title: "English, Hinglish, हिंदी", desc: "The page speaks their language." },
  { emoji: "📲", title: "Share anywhere", desc: "Copy link, WhatsApp, or a downloadable QR code." },
];

const TEMPLATES = [
  { slug: "demo", name: "Neon Night", vibe: "Glowing · cinematic · party", bg: "linear-gradient(160deg,#0B0420 10%,#3b0764 55%,#FF4FA3)", emoji: "🎁" },
  { slug: "demo-pastel", name: "Pastel Dream", vibe: "Soft · cute · polaroids", bg: "linear-gradient(160deg,#FFF1F5 10%,#FBCFE8 50%,#C4B5FD)", emoji: "🎀" },
  { slug: "demo-royal", name: "Royal Gold", vibe: "Elegant · black & gold", bg: "linear-gradient(160deg,#0E0E10 10%,#3a2f12 55%,#D4AF37)", emoji: "👑" },
];

const STEPS = [
  ["1", "Pick the occasion", "Birthday, anniversary, farewell or your own."],
  ["2", "Add the love", "Messages, photos and memories, with suggestions if you're stuck."],
  ["3", "Share the link", "Publish in one click and send it on WhatsApp."],
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0B0420] text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(236,72,153,0.35),rgba(139,92,246,0.15),transparent)] blur-2xl" />
        <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-20 text-center sm:pt-28">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-pink-400/30 bg-pink-500/10 px-4 py-1.5 text-sm text-pink-200">
            <span className="h-2 w-2 animate-pulse rounded-full bg-pink-400" /> Birthdays · Anniversaries · Farewells · Weddings
          </p>
          <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">
            Turn your wishes into a<br />
            <span className="animate-gradient bg-gradient-to-r from-pink-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">magical page</span> ✨
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60">
            Add photos, messages and memories. Get a beautiful animated page with a shareable link in under 2 minutes. No signup needed.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/create" className="rounded-full bg-gradient-to-r from-pink-500 to-violet-500 px-8 py-4 text-lg font-semibold shadow-xl shadow-pink-500/30 transition hover:scale-105 hover:shadow-pink-500/50">
              Create a page →
            </Link>
            <Link href="/w/demo" className="rounded-full border border-white/15 bg-white/5 px-8 py-4 text-lg backdrop-blur transition hover:bg-white/10">
              ▶ Watch a demo
            </Link>
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="mb-2 text-center text-3xl font-bold tracking-tight sm:text-4xl">Pick a vibe</h2>
        <p className="mb-10 text-center text-white/50">Tap any template to open a live demo</p>
        <div className="grid gap-6 sm:grid-cols-3">
          {TEMPLATES.map((t, i) => (
            <Link key={t.slug} href={`/w/${t.slug}`} className="group relative block overflow-hidden rounded-3xl border border-white/10 transition duration-300 hover:-translate-y-2 hover:border-pink-400/50 hover:shadow-2xl hover:shadow-pink-500/20">
              <div className="relative flex h-64 flex-col items-center justify-center" style={{ background: t.bg }}>
                <span className="animate-float text-6xl" style={{ animationDelay: `${i * 0.6}s` }}>{t.emoji}</span>
                <span className="mt-4 h-2 w-24 rounded-full bg-white/50" />
                <span className="mt-2 h-2 w-16 rounded-full bg-white/30" />
                <span className="absolute right-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs opacity-0 backdrop-blur transition group-hover:opacity-100">Live demo ↗</span>
              </div>
              <div className="bg-white/[0.04] p-5">
                <h3 className="text-lg font-semibold">{t.name}</h3>
                <p className="text-sm text-white/50">{t.vibe}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <h2 className="mb-10 text-center text-3xl font-bold tracking-tight sm:text-4xl">Three steps. Two minutes.</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {STEPS.map(([n, title, desc]) => (
            <div key={n} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-pink-500 to-violet-600 font-bold">{n}</span>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-white/55">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.01] p-6 transition hover:border-white/20">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-pink-500/25 to-violet-500/25 text-2xl ring-1 ring-white/10">{f.emoji}</div>
            <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-white/55">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-pink-600 via-fuchsia-600 to-violet-700 p-10 text-center shadow-2xl shadow-pink-500/20 sm:p-14">
          <h2 className="text-3xl font-bold sm:text-5xl">Make someone&apos;s day today 🎉</h2>
          <p className="mx-auto mt-3 max-w-lg text-white/80">It&apos;s free, takes two minutes and they&apos;ll remember it forever.</p>
          <Link href="/create" className="mt-8 inline-block rounded-full bg-white px-8 py-4 font-semibold text-black transition hover:scale-105">
            Start creating ✨
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-sm text-white/40">Made with ❤️ by Team Occasion</footer>
    </main>
  );
}
