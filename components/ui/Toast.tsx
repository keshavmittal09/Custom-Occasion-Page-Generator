"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Item = { id: number; msg: string };

// Fire-and-forget toast: toast("Link copied")
export function toast(msg: string) {
  window.dispatchEvent(new CustomEvent("app:toast", { detail: msg }));
}

export default function Toaster() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const onToast = (e: Event) => {
      const id = Date.now() + Math.random();
      setItems((s) => [...s.slice(-2), { id, msg: (e as CustomEvent<string>).detail }]);
      setTimeout(() => setItems((s) => s.filter((x) => x.id !== id)), 2400);
    };
    window.addEventListener("app:toast", onToast);
    return () => window.removeEventListener("app:toast", onToast);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {items.map((x) => (
          <motion.div
            key={x.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black shadow-2xl shadow-black/40"
          >
            {x.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
