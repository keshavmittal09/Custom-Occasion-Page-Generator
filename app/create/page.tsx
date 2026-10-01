"use client";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Eye, Heart, RotateCcw, Rocket, X, Copy, ExternalLink, MessageCircle } from "lucide-react";
import { draftToPage, useDraft, Draft } from "@/components/wizard/draft";
import StepOccasion from "@/components/wizard/StepOccasion";
import StepRecipient from "@/components/wizard/StepRecipient";
import StepMessages from "@/components/wizard/StepMessages";
import StepPhotos from "@/components/wizard/StepPhotos";
import StepStyle from "@/components/wizard/StepStyle";
import SummaryCard from "@/components/wizard/SummaryCard";
import { getTemplate, getTheme } from "@/templates/registry";
import { addMyPage } from "@/lib/myPages";
import { toast } from "@/components/ui/Toast";

const STEPS = [
  { label: "Occasion", Comp: StepOccasion },
  { label: "Recipient", Comp: StepRecipient },
  { label: "Messages", Comp: StepMessages },
  { label: "Photos", Comp: StepPhotos },
  { label: "Style", Comp: StepStyle },
];

function validate(step: number, d: Draft): string | null {
  if (step === 0 && d.occasion === "CUSTOM" && !d.customOccasionLabel.trim()) return "Give your custom occasion a name.";
  if (step === 1) {
    if (!d.recipient.name.trim()) return "Recipient name is required.";
    if (!d.recipient.relation.trim()) return "Relation is required.";
    if (!d.from.trim()) return "Tell us who it's from.";
  }
  if (step === 2 && !d.messages.some((m) => m.trim())) return "Write at least one message.";
  return null;
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-1.5 text-ink">
      <span className="font-display text-2xl italic">Wishly</span>
      <Heart size={14} fill="#f59ec0" className="text-blush" />
    </Link>
  );
}

export default function CreatePage() {
  const { draft, update, reset } = useDraft();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState<{ slug: string; url: string } | null>(null);

  const { Comp } = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const go = (to: number) => {
    setDir(to > step ? 1 : -1);
    setStep(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const next = () => {
    const err = validate(step, draft);
    if (err) return setError(err);
    setError("");
    go(Math.min(step + 1, STEPS.length - 1));
  };

  const publish = async () => {
    for (let i = 0; i < STEPS.length; i++) {
      const err = validate(i, draft);
      if (err) {
        go(i);
        return setError(err);
      }
    }
    setError("");
    setPublishing(true);
    try {
      const res = await fetch("/api/v1/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draftToPage(draft), ...(draft.password ? { password: draft.password } : {}) }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || "Publish failed");
      addMyPage({
        slug: json.data.slug,
        url: json.data.url,
        title: `${draft.occasion === "CUSTOM" ? draft.customOccasionLabel : draft.occasion.toLowerCase()} for ${draft.recipient.name}`,
        occasion: draft.occasion,
        templateId: draft.templateId,
        createdAt: new Date().toISOString(),
      });
      setPublished(json.data);
      reset();
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setPublishing(false);
    }
  };

  if (published) {
    const wa = `https://wa.me/?text=${encodeURIComponent("I made something special for you 🎉 " + published.url)}`;
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream p-6 text-ink">
        <div className="bg-aurora pointer-events-none absolute inset-0" />
        <motion.div initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 120 }} className="glass relative w-full max-w-lg rounded-[36px] p-10 text-center">
          <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.2, type: "spring" }} className="text-7xl">🎉</motion.div>
          <h1 className="font-display mt-5 text-5xl">It&apos;s live.</h1>
          <p className="mt-2 text-muted">Send this link to your special person.</p>
          <div className="mt-7 break-all rounded-2xl bg-white px-4 py-3 font-mono text-sm text-lilac ring-1 ring-ink/5">{published.url}</div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <button onClick={() => { navigator.clipboard.writeText(published.url); toast("🔗 Link copied"); }} className="btn-ghost inline-flex items-center justify-center gap-2 px-4 py-3 text-sm">
              <Copy size={15} /> Copy
            </button>
            <a href={wa} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-medium text-white transition hover:brightness-105">
              <MessageCircle size={15} /> WhatsApp
            </a>
            <a href={`/w/${published.slug}`} target="_blank" rel="noreferrer" className="btn-ink inline-flex items-center justify-center gap-2 px-4 py-3 text-sm">
              <ExternalLink size={15} /> Open
            </a>
          </div>
          <div className="mt-8 flex justify-center gap-6 text-sm text-muted">
            <Link href="/dashboard" className="hover:text-ink">My pages →</Link>
            <button onClick={() => { setPublished(null); setStep(0); }} className="hover:text-ink">Create another</button>
          </div>
        </motion.div>
      </main>
    );
  }

  const previewPage = draftToPage(draft);
  const Template = getTemplate(draft.templateId);

  return (
    <main className="relative min-h-screen bg-cream text-ink">
      <div className="bg-aurora pointer-events-none fixed inset-0" />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
        <Logo />
        <div className="flex items-center gap-2">
          <button onClick={() => { if (confirm("Start over? Your draft will be cleared.")) { reset(); go(0); } }} className="hidden items-center gap-1.5 rounded-full px-4 py-2 text-sm text-muted transition hover:text-ink sm:inline-flex">
            <RotateCcw size={14} /> Start over
          </button>
          <button onClick={() => setPreview(true)} className="btn-ghost inline-flex items-center gap-2 px-4 py-2 text-sm">
            <Eye size={15} /> Preview
          </button>
        </div>
      </header>

      <div className="relative mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        {/* Step rail */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-1">
          {STEPS.map((s, i) => (
            <button key={s.label} onClick={() => i < step && go(i)} disabled={i > step} className={`flex shrink-0 items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4 text-sm transition ${i === step ? "glass text-ink" : i < step ? "text-ink/70 hover:text-ink" : "text-ink/35"}`}>
              <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-semibold ${i < step ? "bg-ink text-white" : i === step ? "bg-gradient-to-br from-lilac to-blush text-white" : "bg-ink/5"}`}>
                {i < step ? "✓" : i + 1}
              </span>
              {s.label}
            </button>
          ))}
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_300px]">
          <div className="glass rounded-[32px] p-6 sm:p-10">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div key={step} custom={dir} initial={{ opacity: 0, x: dir * 30, filter: "blur(4px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={{ opacity: 0, x: dir * -30, filter: "blur(4px)" }} transition={{ duration: 0.3 }}>
                <Comp draft={draft} update={update} />
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 rounded-2xl bg-[#ffe4ec] px-4 py-3 text-sm text-[#b4235a]">
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="mt-10 flex items-center justify-between border-t border-ink/5 pt-6">
              <button onClick={() => go(Math.max(0, step - 1))} disabled={step === 0} className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-muted transition hover:text-ink disabled:opacity-30">
                <ArrowLeft size={16} /> Back
              </button>
              <span className="hidden text-xs text-muted sm:block">Step {step + 1} of {STEPS.length} · autosaved</span>
              {isLast ? (
                <button onClick={publish} disabled={publishing} className="btn-ink inline-flex items-center gap-2 px-7 py-3.5 disabled:opacity-60">
                  <Rocket size={16} /> {publishing ? "Publishing…" : "Publish page"}
                </button>
              ) : (
                <button onClick={next} className="btn-ink group inline-flex items-center gap-2 px-7 py-3.5">
                  Continue <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                </button>
              )}
            </div>
          </div>

          <div className="hidden lg:block">
            <SummaryCard draft={draft} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {preview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 overflow-y-auto bg-black">
            <button onClick={() => setPreview(false)} className="fixed right-4 top-4 z-[60] inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-xl">
              <X size={15} /> Close preview
            </button>
            {previewPage.recipient.name ? (
              <Template page={{ ...previewPage, slug: undefined }} theme={getTheme(previewPage)} />
            ) : (
              <div className="flex min-h-screen items-center justify-center text-white/60">Add a recipient name to see the preview.</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
