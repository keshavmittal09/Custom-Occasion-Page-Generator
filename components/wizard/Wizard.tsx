"use client";
import { useDeferredValue, useEffect, useMemo, useState, type ComponentType } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { ArrowLeft, ArrowRight, Cloud, CloudOff, Download, Eye, ExternalLink, Heart, LayoutDashboard, Loader2, RotateCcw, Rocket, X } from "lucide-react";
import { draftToPage, useWizardDraft, validateStep } from "./draft";
import StepOccasion from "./StepOccasion";
import StepRecipient from "./StepRecipient";
import StepWords from "./StepWords";
import StepMedia from "./StepMedia";
import StepStyle from "./StepStyle";
import StepReview from "./StepReview";
import PhonePreview from "./PhonePreview";
import SummaryCard from "./SummaryCard";
import ShareKit from "@/components/ui/ShareKit";
import { getTemplate, getTheme } from "@/templates/registry";

const STEPS: { label: string; Comp: ComponentType<any> }[] = [
  { label: "Occasion", Comp: StepOccasion },
  { label: "Recipient", Comp: StepRecipient },
  { label: "Words", Comp: StepWords },
  { label: "Media", Comp: StepMedia },
  { label: "Style", Comp: StepStyle },
  { label: "Review", Comp: StepReview },
];

type Published = { id: string; slug: string; url: string; status: string; qrCode: string };

export default function Wizard({ pageId, initialStep = 0 }: { pageId?: string; initialStep?: number }) {
  const { draft, update, mutate, reset, loaded, loadError, saveState, saveNow } = useWizardDraft(pageId);
  const [step, setStep] = useState(initialStep);
  const [dir, setDir] = useState(1);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState<Published | null>(null);

  const deferred = useDeferredValue(draft);
  const previewPage = useMemo(() => draftToPage(deferred), [deferred]);
  const { Comp } = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const isLive = draft.status === "PUBLISHED" || draft.status === "SCHEDULED";

  const go = (to: number) => {
    setError("");
    setDir(to > step ? 1 : -1);
    setStep(Math.max(0, Math.min(STEPS.length - 1, to)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const next = () => {
    const err = validateStep(step, draft);
    if (err) return setError(err);
    go(step + 1);
  };

  // Ctrl/Cmd + Enter moves forward (keyboard friendly)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && !isLast) next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const publish = async () => {
    for (let i = 0; i < STEPS.length - 1; i++) {
      const err = validateStep(i, draft);
      if (err) {
        go(i);
        return setError(err);
      }
    }
    setError("");
    setPublishing(true);
    try {
      const id = await saveNow();
      if (!id) throw new Error("Couldn't save your page — check your connection and try again");
      const res = await fetch(`/api/v1/pages/${id}/publish`, { method: "POST" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || "Couldn't publish");
      setPublished(json.data);
      update({ status: json.data.status, slug: json.data.slug, pageId: id });
      if (!pageId) {
        try {
          localStorage.removeItem("wishly:draft:new");
        } catch {}
      }
      confetti({ particleCount: 180, spread: 110, origin: { y: 0.6 }, colors: ["#8b7cf6", "#f59ec0", "#ffb48a", "#ffffff"] });
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setPublishing(false);
    }
  };

  if (loadError)
    return (
      <main className="bg-aurora flex min-h-[100svh] flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-display text-4xl">Can&apos;t open this page</p>
        <p className="text-muted">{loadError}</p>
        <Link href="/dashboard" className="btn-ink px-6 py-3">Back to dashboard</Link>
      </main>
    );

  if (!loaded)
    return (
      <main className="bg-aurora flex min-h-[100svh] items-center justify-center">
        <Loader2 className="animate-spin text-lilac" size={32} />
      </main>
    );

  const Template = getTemplate(draft.templateId);

  return (
    <main className="relative min-h-[100svh] bg-cream text-ink">
      <div className="bg-aurora pointer-events-none fixed inset-0" />

      <header className="relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-5 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-1.5">
          <span className="font-display text-2xl italic">Wishly</span>
          <Heart size={14} fill="#f59ec0" className="text-blush" />
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="hidden items-center gap-1.5 text-xs text-muted sm:inline-flex" aria-live="polite">
            {saveState === "saving" ? <><Loader2 size={13} className="animate-spin" /> Saving…</> : saveState === "saved" ? <><Cloud size={13} /> Saved</> : saveState === "error" ? <><CloudOff size={13} /> Saved on this device</> : null}
          </span>
          {!pageId && (
            <button onClick={() => { if (confirm("Start over? This clears the current draft on this device.")) { reset(); go(0); } }} className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm text-muted transition hover:text-ink sm:inline-flex">
              <RotateCcw size={14} /> Start over
            </button>
          )}
          <button onClick={() => setPreview(true)} className="btn-ghost inline-flex items-center gap-2 px-4 py-2 text-sm">
            <Eye size={15} /> <span className="hidden sm:inline">Full</span> preview
          </button>
        </div>
      </header>

      <div className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        {/* progress rail */}
        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-ink/5">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-lilac via-blush to-peach" animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
        <div className="mb-8 flex items-center gap-1.5 overflow-x-auto pb-1">
          {STEPS.map((s, i) => (
            <button key={s.label} onClick={() => i <= step && go(i)} disabled={i > step} className={`flex shrink-0 items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3.5 text-sm transition ${i === step ? "glass text-ink" : i < step ? "text-ink/70 hover:text-ink" : "text-ink/35"}`}>
              <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-semibold ${i < step ? "bg-ink text-white" : i === step ? "bg-gradient-to-br from-lilac to-blush text-white" : "bg-ink/5"}`}>{i < step ? "✓" : i + 1}</span>
              {s.label}
            </button>
          ))}
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_330px]">
          <div className="glass rounded-[32px] p-5 sm:p-10">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div key={step} initial={{ opacity: 0, x: dir * 30, filter: "blur(4px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={{ opacity: 0, x: dir * -30, filter: "blur(4px)" }} transition={{ duration: 0.28 }}>
                <Comp draft={draft} update={update} mutate={mutate} goTo={go} />
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.p role="alert" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 rounded-2xl bg-[#ffe4ec] px-4 py-3 text-sm text-[#b4235a]">
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="mt-10 flex items-center justify-between gap-3 border-t border-ink/5 pt-6">
              <button onClick={() => go(step - 1)} disabled={step === 0} className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-muted transition hover:text-ink disabled:opacity-30">
                <ArrowLeft size={16} /> Back
              </button>
              <span className="hidden text-xs text-muted sm:block">Step {step + 1} of {STEPS.length}</span>
              {isLast ? (
                <button onClick={publish} disabled={publishing} className="btn-ink inline-flex items-center gap-2 px-6 py-3.5 disabled:opacity-60">
                  {publishing ? <Loader2 size={16} className="animate-spin" /> : <Rocket size={16} />} {isLive ? "Update page" : "Generate my page"}
                </button>
              ) : (
                <button onClick={next} className="btn-ink group inline-flex items-center gap-2 px-6 py-3.5">
                  Continue <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                </button>
              )}
            </div>
          </div>

          <aside className="sticky top-6 hidden space-y-4 lg:block">
            <PhonePreview page={previewPage} scale={0.74} />
            <p className="text-center text-xs text-muted">Live preview · updates as you type</p>
            <SummaryCard draft={draft} />
          </aside>
        </div>
      </div>

      {/* full-screen preview (also the mobile preview) */}
      <AnimatePresence>
        {preview && (
          <motion.div data-lenis-prevent initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 overflow-y-auto bg-black">
            <button onClick={() => setPreview(false)} className="fixed right-4 top-4 z-[60] inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-xl">
              <X size={15} /> Close preview
            </button>
            <Template page={previewPage} theme={getTheme(previewPage)} mode="preview" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* success modal */}
      <AnimatePresence>
        {published && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-ink/40 p-4 backdrop-blur-md">
            <motion.div initial={{ y: 40, scale: 0.95 }} animate={{ y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 140 }} className="glass relative my-8 w-full max-w-lg rounded-[36px] p-7 text-center sm:p-10">
              <button onClick={() => setPublished(null)} aria-label="Close" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/80"><X size={16} /></button>
              <div className="text-6xl">{published.status === "SCHEDULED" ? "⏳" : "🎉"}</div>
              <h2 className="font-display mt-4 text-5xl">{published.status === "SCHEDULED" ? "Scheduled." : "It's live."}</h2>
              <p className="mt-2 text-muted">{published.status === "SCHEDULED" ? "The link shows a countdown until the reveal time." : "Send this link to your special person."}</p>
              <div className="mt-6 break-all rounded-2xl bg-white px-4 py-3 font-mono text-sm text-lilac ring-1 ring-ink/5">{published.url}</div>
              <div className="mt-5 flex flex-col items-center gap-3">
                <img src={published.qrCode} alt="QR code for the page" className="h-36 w-36 rounded-2xl bg-white p-2 ring-1 ring-ink/5" />
                <a href={published.qrCode} download={`wishly-${published.slug}.png`} className="inline-flex items-center gap-1.5 text-sm text-ink/70 underline-offset-4 hover:underline">
                  <Download size={14} /> Download QR (PNG)
                </a>
              </div>
              <div className="mt-6">
                <ShareKit url={published.url} dark={false} />
              </div>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <a href={`/w/${published.slug}`} target="_blank" rel="noreferrer" className="btn-ink inline-flex items-center gap-2 px-6 py-3 text-sm"><ExternalLink size={15} /> Open page</a>
                <Link href="/dashboard" className="btn-ghost inline-flex items-center gap-2 px-6 py-3 text-sm"><LayoutDashboard size={15} /> Dashboard</Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* mobile preview button */}
      <button onClick={() => setPreview(true)} className="btn-ink fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 px-5 py-3 text-sm shadow-2xl lg:hidden">
        <Eye size={16} /> Preview
      </button>
    </main>
  );
}
