"use client";
import type { TemplateProps } from "@/templates/registry";
import Shell from "@/templates/Shell";

const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>\")";

// Film Reel — moving grain, projector flicker, vignette, scratches and letterbox bars
function Decor() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      <div className="anim-grain absolute -inset-[10%] opacity-[0.12]" style={{ backgroundImage: GRAIN }} />
      <div className="anim-flicker absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,.75) 100%)" }} />
      <div className="anim-twinkle absolute top-0 h-full w-px bg-white/20" style={{ left: "22%", ["--d" as string]: "0.8s" }} />
      <div className="anim-twinkle absolute top-0 h-full w-px bg-white/10" style={{ left: "71%", ["--d" as string]: "1.3s", ["--delay" as string]: "0.4s" }} />
      <div className="absolute inset-x-0 top-0 h-[3vh] bg-black" />
      <div className="absolute inset-x-0 bottom-0 h-[3vh] bg-black" />
    </div>
  );
}

export default function FilmReel(props: TemplateProps) {
  return <Shell {...props} variant="film" background="linear-gradient(180deg,#0b0b0b,#141414 50%,#0b0b0b)" Decor={Decor} />;
}
