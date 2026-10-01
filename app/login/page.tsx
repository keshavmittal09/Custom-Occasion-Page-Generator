"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import {
  Heart, Mail, Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft, Check, Sparkles, Loader2, Link2, Star,
} from "lucide-react";

/* One file for both screens. Use it as app/login/page.tsx and app/signup/page.tsx:
   in signup/page.tsx write:  export { default } from "../login/page";  (and read ?mode=signup, see useEffect).
   Needs: framer-motion, lucide-react, Tailwind, next/link. Fonts load from Google Fonts below. */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..600,0..100,0..1;1,9..144,300..600,0..100,0..1&family=Plus+Jakarta+Sans:wght@300..700&display=swap');
.wf-display{font-family:'Fraunces',Georgia,serif;font-variation-settings:'SOFT' 100,'WONK' 0;letter-spacing:-0.03em;font-weight:300}
.wf-body{font-family:'Plus Jakarta Sans',system-ui,sans-serif}
.wf-shine{background-image:linear-gradient(100deg,#8b7cf6,#f59ec0,#ffb48a,#8b7cf6);background-size:220% auto;-webkit-background-clip:text;background-clip:text;color:transparent;animation:wf-shine 8s linear infinite}
@keyframes wf-shine{to{background-position:220% center}}
`;

const glass = "border border-white/80 bg-white/65 backdrop-blur-xl shadow-[0_24px_60px_-28px_rgba(70,50,140,0.35)] ring-1 ring-[#1e1b3a]/5";
const petals = ["#c9bdff", "#ffc4d6", "#ffd9c2", "#b9e6d2", "#cfe3ff", "#f3d68f"];
const copy = {
  login: { title: "Welcome back", sub: "Log in to keep creating surprises.", cta: "Log in", panel: "from-[#ffe3cf] via-[#ffc7b0] to-[#f9a8c4]", emoji: "🎂", page: "Happy birthday, Ananya" },
  signup: { title: "Create your account", sub: "Free to start. Your first surprise takes about three minutes.", cta: "Create account", panel: "from-[#f1eaff] via-[#cbbdff] to-[#b6d4ff]", emoji: "💜", page: "Our 2 years together" },
};

function Field({ icon: Icon, label, type = "text", value, onChange, error, right, auto, shake }: {
  icon: typeof Mail; label: string; type?: string; value: string; onChange: (v: string) => void; error?: string; right?: React.ReactNode; auto?: string; shake: number;
}) {
  const [focus, setFocus] = useState(false);
  const up = focus || value.length > 0;
  return (
    <div>
      <motion.div key={error ? shake : "ok"} animate={error ? { x: [0, -7, 7, -4, 4, 0] } : { x: 0 }} transition={{ duration: 0.4 }}
        className={`relative flex items-center rounded-2xl border bg-white/80 px-4 transition-all duration-300 ${error ? "border-rose-300 ring-4 ring-rose-100" : focus ? "border-[#8b7cf6]/60 ring-4 ring-[#8b7cf6]/15" : "border-[#1e1b3a]/10"}`}>
        <Icon size={17} className={`transition-colors ${focus ? "text-[#8b7cf6]" : "text-[#6b6884]"}`} />
        <div className="relative flex-1">
          <motion.label animate={{ y: up ? -17 : 0, scale: up ? 0.78 : 1 }} transition={{ duration: 0.2 }} className="pointer-events-none absolute left-3 top-1/2 origin-left -translate-y-1/2 text-sm text-[#6b6884]">{label}</motion.label>
          <input type={type} value={value} autoComplete={auto} onChange={(e) => onChange(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
            className="h-14 w-full bg-transparent px-3 pt-3 text-sm outline-none" />
        </div>
        {right}
      </motion.div>
      <AnimatePresence>
        {error && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden pl-2 pt-1.5 text-xs text-rose-500">{error}</motion.p>}
      </AnimatePresence>
    </div>
  );
}

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState(""), [email, setEmail] = useState(""), [pw, setPw] = useState("");
  const [show, setShow] = useState(false), [remember, setRemember] = useState(true), [agree, setAgree] = useState(false);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [shake, setShake] = useState(0), [loading, setLoading] = useState(false), [done, setDone] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("mode") === "signup" || window.location.pathname.includes("signup")) setMode("signup");
  }, []);

  const c = copy[mode];
  const score = [pw.length >= 8, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length;
  const strength = ["Too short", "Weak", "Okay", "Good", "Strong"][pw.length < 8 ? 0 : score];
  const strengthLevel = pw.length < 8 ? (pw ? 1 : 0) : score;
  const barColor = ["", "bg-rose-300", "bg-amber-300", "bg-[#8b7cf6]", "bg-emerald-400"][Math.max(strengthLevel, pw ? 1 : 0)];

  const switchMode = (m: "login" | "signup") => { setMode(m); setErrs({}); };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n: Record<string, string> = {};
    if (mode === "signup" && name.trim().length < 2) n.name = "Tell us what to call you.";
    if (!/^\S+@\S+\.\S+$/.test(email)) n.email = "Enter a valid email address.";
    if (pw.length < 8) n.pw = "Use at least 8 characters.";
    if (mode === "signup" && !agree) n.agree = "Please accept the terms to continue.";
    setErrs(n);
    if (Object.keys(n).length) { setShake((s) => s + 1); return; }
    setLoading(true);
    // TODO: replace with your real auth call (NextAuth, Supabase, Firebase...)
    setTimeout(() => { setLoading(false); setDone(true); }, 1500);
  };

  return (
    <MotionConfig reducedMotion="user">
      <style>{CSS}</style>
      <main className="wf-body relative min-h-screen overflow-hidden bg-[#f8f7fc] text-[#1e1b3a] antialiased">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_10%_10%,#ffe1d0_0%,transparent_70%),radial-gradient(45%_45%_at_90%_20%,#dcd3ff_0%,transparent_70%),radial-gradient(50%_45%_at_50%_100%,#cdeee0_0%,transparent_70%)]" />
        <motion.div animate={{ x: [0, 40, 0], y: [0, 30, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} className="pointer-events-none absolute -left-20 top-40 h-72 w-72 rounded-full bg-[#ffc4d6]/40 blur-[90px]" />

        <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1fr_1.05fr]">
          {/* FORM SIDE */}
          <section className="flex flex-col px-5 py-6 sm:px-10 lg:px-14">
            <header className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <span className="wf-display text-3xl italic">Wishly</span>
                <motion.span animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 1.8, repeat: Infinity }}><Heart size={15} fill="#f59ec0" className="text-[#f59ec0]" /></motion.span>
              </Link>
              <Link href="/" className="flex items-center gap-1.5 text-sm text-[#6b6884] transition hover:text-[#1e1b3a]"><ArrowLeft size={15} /> Back to home</Link>
            </header>

            <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
              <AnimatePresence mode="wait">
                {done ? (
                  <motion.div key="done" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className={`relative rounded-[36px] p-10 text-center ${glass}`}>
                    {petals.concat(petals, petals).map((p, i) => {
                      const a = (i / 18) * Math.PI * 2, d = 120 + (i % 4) * 40;
                      return <motion.span key={i} initial={{ x: 0, y: 0, opacity: 1, scale: 1 }} animate={{ x: Math.cos(a) * d, y: Math.sin(a) * d + 60, opacity: 0, rotate: i * 40, scale: 0.5 }} transition={{ duration: 1.8, ease: [0.1, 0.7, 0.3, 1] }}
                        className="pointer-events-none absolute left-1/2 top-24 rounded-full" style={{ width: 9, height: 14, background: p }} />;
                    })}
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }} className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#c9f1e3] to-[#cfe3ff] shadow-lg">
                      <motion.svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="#1e1b3a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35, duration: 0.6 }} /></motion.svg>
                    </motion.div>
                    <h2 className="wf-display mt-6 text-4xl">{mode === "login" ? "You're back in." : `Welcome${name ? `, ${name.split(" ")[0]}` : ""}.`}</h2>
                    <p className="mt-2 text-sm text-[#6b6884]">{mode === "login" ? "Your surprise pages are waiting." : "Your account is ready. Let's make something lovely."}</p>
                    <Link href="/dashboard" className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#1e1b3a] px-8 py-3.5 text-sm font-medium text-white shadow-[0_14px_30px_-10px_rgba(30,27,58,0.55)] transition hover:-translate-y-0.5">Go to dashboard <ArrowRight size={16} className="transition group-hover:translate-x-1" /></Link>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className={`relative mb-10 grid w-full grid-cols-2 rounded-full p-1 ${glass}`}>
                      {(["login", "signup"] as const).map((m) => (
                        <button key={m} type="button" onClick={() => switchMode(m)} className={`relative rounded-full py-2.5 text-sm font-medium transition ${mode === m ? "text-white" : "text-[#6b6884]"}`}>
                          {mode === m && <motion.span layoutId="seg" className="absolute inset-0 rounded-full bg-[#1e1b3a]" transition={{ type: "spring", stiffness: 300, damping: 28 }} />}
                          <span className="relative">{m === "login" ? "Log in" : "Sign up"}</span>
                        </button>
                      ))}
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div key={mode} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.3 }}>
                        <h1 className="wf-display text-5xl leading-[1.05]">{c.title}<span className="wf-shine italic">.</span></h1>
                        <p className="mt-3 text-[#6b6884]">{c.sub}</p>
                      </motion.div>
                    </AnimatePresence>

                    <button type="button" className={`mt-8 flex w-full items-center justify-center gap-3 rounded-2xl py-3.5 text-sm font-medium transition hover:bg-white ${glass}`}>
                      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="#1e1b3a"><path d="M21.35 11.1H12v2.9h5.35c-.23 1.4-1.6 4.1-5.35 4.1a6 6 0 1 1 0-12c1.9 0 3.1.8 3.8 1.5l2.6-2.5C17.8 3.5 15.1 2 12 2a10 10 0 1 0 0 20c5.8 0 9.6-4.1 9.6-9.8 0-.7-.1-1.1-.25-1.1z" /></svg>
                      Continue with Google
                    </button>
                    <div className="my-6 flex items-center gap-4 text-xs text-[#6b6884]"><span className="h-px flex-1 bg-[#1e1b3a]/10" />or use your email<span className="h-px flex-1 bg-[#1e1b3a]/10" /></div>

                    <form onSubmit={submit} noValidate className="space-y-4">
                      <AnimatePresence initial={false}>
                        {mode === "signup" && (
                          <motion.div key="name" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden p-1 -m-1">
                            <Field icon={User} label="Your name" value={name} onChange={setName} error={errs.name} auto="name" shake={shake} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <Field icon={Mail} label="Email address" type="email" value={email} onChange={setEmail} error={errs.email} auto="email" shake={shake} />
                      <Field icon={Lock} label="Password" type={show ? "text" : "password"} value={pw} onChange={setPw} error={errs.pw} auto={mode === "login" ? "current-password" : "new-password"} shake={shake}
                        right={<button type="button" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow(!show)} className="text-[#6b6884] transition hover:text-[#1e1b3a]">{show ? <EyeOff size={17} /> : <Eye size={17} />}</button>} />

                      <AnimatePresence initial={false}>
                        {mode === "signup" && pw && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                            <div className="flex gap-1.5 pt-1">{[1, 2, 3, 4].map((n) => <span key={n} className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#1e1b3a]/8"><motion.span className={`block h-full rounded-full ${barColor}`} animate={{ width: strengthLevel >= n ? "100%" : "0%" }} /></span>)}</div>
                            <p className="mt-1.5 pl-1 text-xs text-[#6b6884]">Password strength: {strength}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {mode === "login" ? (
                        <div className="flex items-center justify-between text-sm">
                          <label className="flex cursor-pointer items-center gap-2.5">
                            <span onClick={() => setRemember(!remember)} className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${remember ? "border-[#1e1b3a] bg-[#1e1b3a]" : "border-[#1e1b3a]/20 bg-white"}`}>{remember && <Check size={13} className="text-white" />}</span>
                            <span onClick={() => setRemember(!remember)} className="text-[#6b6884]">Remember me</span>
                          </label>
                          <Link href="#" className="font-medium text-[#8b7cf6] transition hover:text-[#6c5ce0]">Forgot password?</Link>
                        </div>
                      ) : (
                        <div>
                          <label className="flex cursor-pointer items-start gap-2.5 text-sm" onClick={() => setAgree(!agree)}>
                            <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${agree ? "border-[#1e1b3a] bg-[#1e1b3a]" : errs.agree ? "border-rose-300 bg-white" : "border-[#1e1b3a]/20 bg-white"}`}>{agree && <Check size={13} className="text-white" />}</span>
                            <span className="text-[#6b6884]">I agree to the <Link href="#" className="font-medium text-[#1e1b3a] underline-offset-2 hover:underline">Terms</Link> and <Link href="#" className="font-medium text-[#1e1b3a] underline-offset-2 hover:underline">Privacy Policy</Link>.</span>
                          </label>
                          {errs.agree && <p className="pl-7 pt-1 text-xs text-rose-500">{errs.agree}</p>}
                        </div>
                      )}

                      <button type="submit" disabled={loading} className="group relative mt-2 flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[#1e1b3a] font-medium text-white shadow-[0_14px_30px_-10px_rgba(30,27,58,0.55)] transition hover:-translate-y-0.5 disabled:opacity-80">
                        <span className="pointer-events-none absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-700 group-hover:left-[150%]" />
                        {loading ? <><Loader2 size={18} className="animate-spin" /> {mode === "login" ? "Logging in" : "Creating your account"}</> : <>{c.cta} <ArrowRight size={17} className="transition group-hover:translate-x-1" /></>}
                      </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-[#6b6884]">
                      {mode === "login" ? "New to Wishly?" : "Already have an account?"}{" "}
                      <button type="button" onClick={() => switchMode(mode === "login" ? "signup" : "login")} className="font-medium text-[#1e1b3a] underline underline-offset-4 decoration-[#8b7cf6]/50 transition hover:decoration-[#8b7cf6]">{mode === "login" ? "Create an account" : "Log in"}</button>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* SHOWCASE SIDE */}
          <section className="relative hidden p-6 lg:block">
            <div className="relative h-full overflow-hidden rounded-[44px] ring-1 ring-white/80 shadow-[0_50px_100px_-40px_rgba(70,50,140,0.5)]">
              <AnimatePresence>
                <motion.div key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }} className={`absolute inset-0 bg-gradient-to-br ${c.panel}`} />
              </AnimatePresence>
              <motion.div animate={{ x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 14, repeat: Infinity }} className="absolute -left-10 top-10 h-72 w-72 rounded-full bg-white/50 blur-3xl" />
              <motion.div animate={{ x: [0, -40, 0], y: [0, -40, 0] }} transition={{ duration: 17, repeat: Infinity }} className="absolute -right-10 bottom-10 h-80 w-80 rounded-full bg-white/35 blur-3xl" />
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className="absolute left-1/2 top-[44%] h-[470px] w-[470px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/70" />

              <div className="relative flex h-full flex-col items-center justify-between px-10 py-12">
                <h2 className="wf-display max-w-md text-center text-4xl leading-tight">Every memory deserves <span className="italic">a beautiful home.</span></h2>

                <div className="relative">
                  <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="relative h-[400px] w-[205px] rounded-[38px] bg-[#1e1b3a] p-[7px] shadow-[0_50px_80px_-20px_rgba(30,27,58,0.55)]">
                    <div className="absolute left-1/2 top-3 z-30 h-5 w-16 -translate-x-1/2 rounded-full bg-[#1e1b3a]" />
                    <div className="flex h-full flex-col items-center justify-center overflow-hidden rounded-[32px] bg-gradient-to-b from-[#fff3ea] via-[#f4efff] to-[#e6f6ef] px-4 text-center">
                      <AnimatePresence mode="wait">
                        <motion.div key={mode} initial={{ opacity: 0, y: 16, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}>
                          <motion.div animate={{ y: [0, -8, 0], rotate: [-4, 4, -4] }} transition={{ duration: 3, repeat: Infinity }} className="text-6xl">{c.emoji}</motion.div>
                          <p className="mt-5 text-[10px] text-[#6b6884]">a little something for you</p>
                          <h3 className="wf-display mt-1 text-2xl italic leading-tight">{c.page}</h3>
                          <div className="mt-4 flex justify-center gap-1.5">{petals.slice(0, 3).map((p, i) => <span key={p} style={{ background: p, rotate: `${(i - 1) * 7}deg` }} className="h-10 w-8 rounded-md border-2 border-white shadow" />)}</div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0, y: [0, 8, 0] }} transition={{ opacity: { delay: 0.6 }, x: { delay: 0.6 }, y: { duration: 5, repeat: Infinity } }} className={`absolute -left-24 top-16 flex items-center gap-2 rounded-2xl px-4 py-3 text-xs font-medium ${glass}`}><Eye size={14} className="text-[#8b7cf6]" /> 124 views today</motion.div>
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0, y: [0, -8, 0] }} transition={{ opacity: { delay: 0.9 }, x: { delay: 0.9 }, y: { duration: 6, repeat: Infinity } }} className={`absolute -right-24 bottom-24 flex items-center gap-2 rounded-2xl px-4 py-3 text-xs font-medium ${glass}`}><Link2 size={14} className="text-emerald-500" /> Link copied</motion.div>
                  <motion.span animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity }} className="absolute -right-6 -top-6"><Sparkles size={26} className="text-white" /></motion.span>
                </div>

                <figure className={`max-w-sm rounded-3xl p-5 ${glass}`}>
                  <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} fill="#f3c969" stroke="none" />)}</div>
                  <blockquote className="wf-display mt-2 text-lg leading-snug">&ldquo;Took ten minutes and felt like I&apos;d hired a designer.&rdquo;</blockquote>
                  <figcaption className="mt-3 flex items-center gap-2 text-xs text-[#1e1b3a]/70"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#cfe3ff] to-[#d9d2ff] font-semibold">M</span>Meera</figcaption>
                </figure>
              </div>
            </div>
          </section>
        </div>
      </main>
    </MotionConfig>
  );
}