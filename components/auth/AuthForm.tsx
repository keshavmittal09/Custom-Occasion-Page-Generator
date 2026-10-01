"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});
const signupSchema = loginSchema.extend({
  name: z.string().trim().min(2, "At least 2 characters").max(50),
  password: z.string().min(8, "At least 8 characters").max(72),
});

type Values = { name?: string; email: string; password: string };

// Login + signup form: client validation (zod) mirrors the server, inline errors, redirect to ?next
export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const [serverError, setServerError] = useState("");
  const isSignup = mode === "signup";

  const { register, handleSubmit, formState, setValue } = useForm<Values>({ resolver: zodResolver(isSignup ? signupSchema : loginSchema) as any });
  const { errors, isSubmitting } = formState;

  const onSubmit = async (values: Values) => {
    setServerError("");
    const res = await fetch(`/api/v1/auth/${isSignup ? "signup" : "login"}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    const json = await res.json().catch(() => null);
    if (!json?.success) return setServerError(json?.error?.message || "Something went wrong");
    router.replace(next.startsWith("/") ? next : "/dashboard");
    router.refresh();
  };

  const field = "w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3.5 text-base text-ink outline-none transition placeholder:text-ink/30 focus:border-lilac focus:ring-4 focus:ring-lilac/15";

  return (
    <main className="bg-aurora relative flex min-h-[100svh] items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 120 }} className="glass w-full max-w-md rounded-[36px] p-8 sm:p-10">
        <Link href="/" className="mb-8 flex items-center justify-center gap-1.5 text-ink">
          <span className="font-display text-3xl italic">Wishly</span>
          <Heart size={16} fill="#f59ec0" className="text-blush" />
        </Link>
        <h1 className="font-display text-center text-4xl">{isSignup ? "Make someone's day" : "Welcome back"}</h1>
        <p className="mt-2 text-center text-muted">{isSignup ? "Create a free account to start your first surprise." : "Log in to your surprises."}</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
          {isSignup && (
            <div>
              <input {...register("name")} placeholder="Your name" autoComplete="name" className={field} />
              {errors.name && <p className="mt-1.5 pl-2 text-sm text-[#b4235a]">{errors.name.message}</p>}
            </div>
          )}
          <div>
            <input {...register("email")} type="email" placeholder="Email" autoComplete="email" className={field} />
            {errors.email && <p className="mt-1.5 pl-2 text-sm text-[#b4235a]">{errors.email.message}</p>}
          </div>
          <div>
            <input {...register("password")} type="password" placeholder={isSignup ? "Password (8+ characters)" : "Password"} autoComplete={isSignup ? "new-password" : "current-password"} className={field} />
            {errors.password && <p className="mt-1.5 pl-2 text-sm text-[#b4235a]">{errors.password.message}</p>}
          </div>
          {serverError && <p className="rounded-2xl bg-[#ffe4ec] px-4 py-3 text-sm text-[#b4235a]">{serverError}</p>}
          <button type="submit" disabled={isSubmitting} className="btn-ink group flex w-full items-center justify-center gap-2 py-4 disabled:opacity-60">
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <>{isSignup ? "Create account" : "Log in"} <ArrowRight size={17} className="transition group-hover:translate-x-1" /></>}
          </button>
        </form>

        {!isSignup && (
          <button type="button" onClick={() => { setValue("email", "demo@demo.com"); setValue("password", "Demo@1234"); }} className="mt-4 w-full rounded-2xl border border-dashed border-ink/15 py-3 text-sm text-muted transition hover:bg-white/60">
            ✨ Use demo account (demo@demo.com)
          </button>
        )}

        <p className="mt-8 text-center text-sm text-muted">
          {isSignup ? "Already have an account? " : "New here? "}
          <Link href={`/${isSignup ? "login" : "signup"}${next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-medium text-ink underline underline-offset-4">
            {isSignup ? "Log in" : "Create an account"}
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
