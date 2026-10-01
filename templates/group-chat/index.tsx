"use client";
import type { TemplateProps } from "@/templates/registry";
import type { SectionProps } from "@/sections/types";
import Shell from "@/templates/Shell";

// Group Chat — the whole page reads like an iMessage thread, with a sticky chat header
function Decor({ page, theme, mode }: SectionProps) {
  if (mode === "pane") return null;
  const name = page.recipient.nickname || page.recipient.name;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-1 z-20 border-b border-black/5 bg-[#f6f6f8]/80 backdrop-blur-xl" aria-hidden>
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 text-[#0a84ff]">
        <span className="text-2xl">‹</span>
        <div className="flex flex-col items-center">
          <span className="grid h-7 w-7 place-items-center rounded-full text-xs font-semibold text-white" style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.secondary})` }}>{name[0]?.toUpperCase()}</span>
          <span className="text-[11px] font-medium text-black">{name} 🎂 + friends ›</span>
        </div>
        <span className="text-xl">📹</span>
      </div>
    </div>
  );
}

export default function GroupChat(props: TemplateProps) {
  return <Shell {...props} variant="chat" background="linear-gradient(180deg,#f2f2f7,#ffffff 40%,#f2f2f7)" Decor={Decor} />;
}
