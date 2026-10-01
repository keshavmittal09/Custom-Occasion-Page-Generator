"use client";
import { useEffect, useState } from "react";
import type { TemplateProps } from "@/templates/registry";
import type { SectionProps } from "@/sections/types";
import Shell from "@/templates/Shell";

const bevel = { borderStyle: "solid", borderWidth: 2, borderColor: "#ffffff #808080 #808080 #ffffff" } as const;

// Retro Desktop — Windows 98 desktop icons and a working taskbar clock
function Decor({ page, mode }: SectionProps) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  const name = page.recipient.nickname || page.recipient.name;
  const icons = [["🖥️", "My Computer"], ["🗑️", "Recycle Bin"], ["🎂", `${name}.exe`], ["📁", "Memories"]];

  return (
    <div className="pointer-events-none fixed inset-0 z-20" aria-hidden style={{ fontFamily: "Tahoma, Verdana, sans-serif", textTransform: "none" }}>
      <div className="absolute left-3 top-6 hidden flex-col gap-5 lg:flex">
        {icons.map(([ic, label]) => (
          <div key={label} className="flex w-20 flex-col items-center gap-1 text-center text-xs text-white" style={{ textShadow: "1px 1px 0 #000" }}>
            <span className="text-3xl">{ic}</span>
            <span className="leading-tight">{label}</span>
          </div>
        ))}
      </div>
      {mode !== "pane" && (
        <div className="absolute inset-x-0 bottom-0 flex h-10 items-center gap-2 bg-[#c0c0c0] px-1.5 text-sm text-black" style={{ borderTop: "2px solid #fff" }}>
          <span className="flex items-center gap-1 px-2 py-0.5 font-bold" style={bevel}>🪟 Start</span>
          <span className="hidden truncate px-3 py-0.5 sm:block" style={{ ...bevel, borderColor: "#808080 #ffffff #ffffff #808080" }}>🎂 {name}.exe</span>
          <span className="ml-auto px-3 py-0.5" style={{ ...bevel, borderColor: "#808080 #ffffff #ffffff #808080" }}>🔊 {time}</span>
        </div>
      )}
    </div>
  );
}

export default function RetroDesktop(props: TemplateProps) {
  return <Shell {...props} variant="retro" background="#008080" Decor={Decor} />;
}
