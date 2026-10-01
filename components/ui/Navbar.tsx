"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, X } from "lucide-react";

const LINKS = [
  ["How it works", "/#how"],
  ["Templates", "/templates"],
  ["Live demo", "/w/demo"],
  ["My pages", "/dashboard"],
] as const;

// Floating glass pill nav (Wishly)
export default function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-4">
      <div className="glass mx-auto mt-4 flex h-14 max-w-6xl items-center justify-between rounded-full pl-6 pr-2">
        <Link href="/" className="flex items-center gap-1.5 text-ink">
          <span className="font-display text-2xl italic">Wishly</span>
          <motion.span animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 1.8, repeat: Infinity }}>
            <Heart size={14} fill="#f59ec0" className="text-blush" />
          </motion.span>
        </Link>

        <div className="hidden items-center gap-8 text-sm md:flex">
          {LINKS.map(([label, href]) => (
            <Link key={href} href={href} className={`relative transition ${path === href ? "text-ink" : "text-ink/60 hover:text-ink"}`}>
              {label}
              {path === href && <motion.span layoutId="nav-dot" className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-blush" />}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <Link href="/create" className="btn-ink hidden px-5 py-2.5 text-sm md:inline-block">
            Create a surprise
          </Link>
          <button aria-label="Menu" className="rounded-full p-2.5 text-ink md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass mx-auto mt-2 max-w-6xl rounded-3xl p-5 md:hidden">
            <div className="flex flex-col gap-4 text-ink">
              {LINKS.map(([label, href]) => (
                <Link key={href} href={href} onClick={() => setOpen(false)}>
                  {label}
                </Link>
              ))}
              <Link href="/create" className="btn-ink py-3 text-center">
                Create a surprise
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
