"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, LogOut, Menu, Shield, X } from "lucide-react";
import { useSession } from "./useSession";

const LINKS = [
  ["How it works", "/#how"],
  ["Templates", "/templates"],
  ["Live demo", "/w/demo"],
] as const;

// Floating glass pill nav — auth aware
export default function Navbar() {
  const path = usePathname();
  const { user, logout } = useSession();
  const [open, setOpen] = useState(false);
  const links = user ? [...LINKS, ["My pages", "/dashboard"] as const, ...(user.role === "ADMIN" ? [["Admin", "/admin"] as const] : [])] : LINKS;

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-4">
      <div className="glass mx-auto mt-4 flex h-14 max-w-6xl items-center justify-between rounded-full pl-6 pr-2">
        <Link href="/" className="flex items-center gap-1.5 text-ink">
          <span className="font-display text-2xl italic">Wishly</span>
          <motion.span animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 1.8, repeat: Infinity }}>
            <Heart size={14} fill="#f59ec0" className="text-blush" />
          </motion.span>
        </Link>

        <div className="hidden items-center gap-7 text-sm md:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className={`relative transition ${path === href ? "text-ink" : "text-ink/60 hover:text-ink"}`}>
              {label}
              {path === href && <motion.span layoutId="nav-dot" className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-blush" />}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1">
          {user === null && (
            <Link href="/login" className="hidden px-4 py-2 text-sm text-ink/70 hover:text-ink md:inline-block">
              Log in
            </Link>
          )}
          {user && (
            <button onClick={logout} className="hidden items-center gap-1.5 px-3 py-2 text-sm text-ink/60 hover:text-ink md:inline-flex" title={user.email}>
              <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-lilac to-blush text-xs font-semibold text-white">{user.name[0]?.toUpperCase()}</span>
              <LogOut size={15} />
            </button>
          )}
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
              {links.map(([label, href]) => (
                <Link key={href} href={href} onClick={() => setOpen(false)} className="flex items-center gap-2">
                  {href === "/admin" && <Shield size={15} />} {label}
                </Link>
              ))}
              {user === null && <Link href="/login" onClick={() => setOpen(false)}>Log in</Link>}
              {user && <button onClick={logout} className="text-left text-ink/70">Log out ({user.email})</button>}
              <Link href="/create" className="btn-ink py-3 text-center">Create a surprise</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
