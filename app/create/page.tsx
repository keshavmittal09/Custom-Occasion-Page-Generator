"use client";
import { useState } from "react";
import Link from "next/link";
import { draftToPage, useDraft, Draft } from "@/components/wizard/draft";
import StepOccasion from "@/components/wizard/StepOccasion";
import StepRecipient from "@/components/wizard/StepRecipient";
import StepMessages from "@/components/wizard/StepMessages";
import StepPhotos from "@/components/wizard/StepPhotos";
import StepStyle from "@/components/wizard/StepStyle";
import { getTemplate, getTheme } from "@/templates/registry";
import { addMyPage } from "@/lib/myPages";

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

export default function CreatePage() {
  const { draft, update, reset } = useDraft();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState<{ slug: string; url: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const { Comp } = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const next = () => {
    const err = validate(step, draft);
    if (err) return setError(err);
    setError("");
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const publish = async () => {
    for (let i = 0; i < STEPS.length; i++) {
      const err = validate(i, draft);
      if (err) {
        setStep(i);
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
      <main className="flex min-h-screen items-center justify-center bg-[#0B0420] p-6 text-white">
        <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <div className="text-6xl">🎉</div>
          <h1 className="mt-4 text-3xl font-bold">Your page is live!</h1>
          <p className="mt-2 text-white/60">Share this link with your special person.</p>
          <div className="mt-6 break-all rounded-xl bg-black/40 p-3 font-mono text-sm text-pink-300">{published.url}</div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(published.url);
                setCopied(true);
              }}
              className="rounded-xl border border-white/15 px-4 py-3 hover:bg-white/10"
            >
              {copied ? "Copied ✓" : "Copy link"}
            </button>
            <a href={wa} target="_blank" rel="noreferrer" className="rounded-xl bg-green-600 px-4 py-3 font-medium hover:bg-green-500">
              WhatsApp
            </a>
            <a href={`/w/${published.slug}`} target="_blank" rel="noreferrer" className="rounded-xl bg-pink-600 px-4 py-3 font-medium hover:bg-pink-500">
              Open page
            </a>
          </div>
          <div className="mt-6 flex justify-center gap-6 text-sm text-white/60">
            <Link href="/dashboard" className="hover:text-white">My pages →</Link>
            <button onClick={() => { setPublished(null); setStep(0); }} className="hover:text-white">Create another</button>
          </div>
        </div>
      </main>
    );
  }

  const previewPage = draftToPage(draft);
  const Template = getTemplate(draft.templateId);

  return (
    <main className="min-h-screen bg-[#0B0420] bg-[radial-gradient(ellipse_at_top,rgba(255,79,163,0.15),transparent_60%)] px-4 py-8 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold">🎁 Occasion<span className="text-pink-400">Pages</span></Link>
          <button onClick={() => setPreview(true)} className="rounded-xl border border-white/15 px-4 py-2 text-sm hover:bg-white/10">
            👀 Preview
          </button>
        </div>

        {/* Progress */}
        <div className="mb-8 flex gap-2">
          {STEPS.map((s, i) => (
            <button key={s.label} onClick={() => i < step && setStep(i)} className="flex-1 text-left">
              <div className={`h-1.5 rounded-full transition ${i <= step ? "bg-gradient-to-r from-pink-500 to-violet-500" : "bg-white/10"}`} />
              <div className={`mt-2 hidden text-xs sm:block ${i === step ? "text-white" : "text-white/40"}`}>{i + 1}. {s.label}</div>
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur sm:p-8">
          <Comp draft={draft} update={update} />
          {error && <p className="mt-6 rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-300">{error}</p>}
          <div className="mt-8 flex justify-between">
            <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="rounded-xl px-5 py-3 text-white/70 hover:bg-white/10 disabled:opacity-30">
              ← Back
            </button>
            {isLast ? (
              <button onClick={publish} disabled={publishing} className="rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 px-6 py-3 font-semibold shadow-lg shadow-pink-500/30 disabled:opacity-60">
                {publishing ? "Publishing…" : "🚀 Publish page"}
              </button>
            ) : (
              <button onClick={next} className="rounded-xl bg-white px-6 py-3 font-semibold text-black hover:bg-white/90">
                Next →
              </button>
            )}
          </div>
        </div>
      </div>

      {preview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black">
          <button onClick={() => setPreview(false)} className="fixed right-4 top-4 z-[60] rounded-full bg-white px-4 py-2 text-sm font-semibold text-black shadow-xl">
            ✕ Close preview
          </button>
          {previewPage.recipient.name ? (
            <Template page={{ ...previewPage, slug: undefined }} theme={getTheme(previewPage)} />
          ) : (
            <div className="flex min-h-screen items-center justify-center text-white/60">Add a recipient name to see the preview.</div>
          )}
        </div>
      )}
    </main>
  );
}
