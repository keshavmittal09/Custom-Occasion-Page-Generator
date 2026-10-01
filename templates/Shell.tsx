"use client";
import type { ComponentType } from "react";
import { MotionConfig } from "framer-motion";
import type { TemplateProps } from "@/templates/registry";
import { fontsHref } from "@/templates/catalog";
import { trackBySrc } from "@/lib/music";
import { ModeContext, fontStack, t, type SectionProps } from "@/sections/types";
import { VARIANTS, type Variant } from "@/sections/variants";
import ScrollProgress from "@/sections/ScrollProgress";
import Intro from "@/sections/Intro";
import Hero from "@/sections/Hero";
import Message from "@/sections/Message";
import Gallery from "@/sections/Gallery";
import Video from "@/sections/Video";
import Timeline from "@/sections/Timeline";
import WishesWall from "@/sections/WishesWall";
import Finale from "@/sections/Finale";
import Divider from "@/sections/Divider";
import Stickers from "@/sections/Stickers";
import ShareKit from "@/components/ui/ShareKit";

type ShellProps = TemplateProps & { variant: Variant; background: string; Decor?: ComponentType<SectionProps> };

// Every template = this shell (shared animated sections) + a style variant + its own decor layer
export default function TemplateShell({ page, theme, mode = "live", variant, background, Decor }: ShellProps) {
  const cfg = VARIANTS[variant];
  const props: SectionProps = { page, theme, variant, mode };
  const [p1, p2] = cfg.progress(theme);
  const credit = trackBySrc(page.theme.music)?.credit;

  return (
    <ModeContext.Provider value={mode}>
      <MotionConfig reducedMotion="user">
        <link rel="stylesheet" href={fontsHref([theme.font, theme.display])} precedence="default" />
        <div className="relative min-h-[100svh] overflow-x-clip" style={{ background, color: theme.text, fontFamily: fontStack(theme), textTransform: cfg.lowercase ? "lowercase" : undefined }}>
          {mode !== "pane" && <ScrollProgress color={p1} color2={p2} />}
          {Decor && <Decor {...props} />}
          <Stickers stickers={page.theme.decorations ?? []} />
          <Intro {...props} />
          <main className="relative">
            <Hero {...props} />
            <Message {...props} />
            <Divider variant={variant} theme={theme} />
            <Gallery {...props} />
            <Video {...props} />
            <Divider variant={variant} theme={theme} />
            <Timeline {...props} />
            <Divider variant={variant} theme={theme} />
            <WishesWall {...props} />
            <Finale {...props} />
            <footer id="share-kit" className="relative px-4 pb-20 pt-4 text-center">
              {page.slug && mode === "live" && (
                <ShareKit
                  url={`${window.location.origin}/w/${page.slug}`}
                  dark={!cfg.light}
                  labels={{ title: t(page, "share.title"), copy: t(page, "share.copy"), whatsapp: t(page, "share.whatsapp"), instagram: t(page, "share.instagram"), qr: t(page, "share.qr"), native: t(page, "share.native") }}
                />
              )}
              <a href="/" className="mt-10 inline-block text-sm opacity-70 transition hover:opacity-100" style={{ textTransform: "none" }}>
                {t(page, "footer.made")} · <span className="underline underline-offset-4">make your own ✨</span>
              </a>
              {credit && <p className="mt-2 text-[11px] opacity-40" style={{ textTransform: "none" }}>♪ {credit}</p>}
            </footer>
          </main>
        </div>
      </MotionConfig>
    </ModeContext.Provider>
  );
}
