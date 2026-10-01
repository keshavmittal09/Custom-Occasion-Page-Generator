"use client";
import type { TemplateProps } from "@/templates/registry";
import type { SectionProps } from "@/sections/types";
import Shell from "@/templates/Shell";

// brat — lime green, lowercase, blurry narrow type and a looping marquee
function Decor({ page }: SectionProps) {
  const name = (page.recipient.nickname || page.recipient.name).toLowerCase();
  const line = Array.from({ length: 8 }, () => `${name} ${name} it's ${name}'s day`).join("  ·  ");
  return (
    <div className="pointer-events-none fixed inset-x-0 top-1 z-20 overflow-hidden bg-black py-1.5" aria-hidden>
      <div className="marquee flex w-max whitespace-nowrap text-sm text-[#8ace00]" style={{ filter: "blur(0.4px)", animationDuration: "40s" }}>
        <span className="pr-8">{line}</span>
        <span className="pr-8">{line}</span>
      </div>
    </div>
  );
}

export default function Brat(props: TemplateProps) {
  return <Shell {...props} variant="brat" background="#8ace00" Decor={Decor} />;
}
