"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const path = usePathname();
  const link = (href: string, label: string, extra = "") => (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-sm transition ${extra} ${path === href ? "bg-white/10 text-white" : "text-white/60 hover:text-white"}`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-[#0B0420]/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-pink-500 to-violet-600 text-base shadow-lg shadow-pink-500/30">🎁</span>
          <span>
            Occasion<span className="text-pink-400">Pages</span>
          </span>
        </Link>
        <div className="flex items-center gap-1">
          {link("/w/demo", "Demo", "hidden sm:inline-flex")}
          {link("/dashboard", "My pages")}
          <Link href="/create" className="ml-1 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-pink-100">
            Create ✨
          </Link>
        </div>
      </nav>
    </header>
  );
}
