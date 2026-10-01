"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Mail,
  Lock,
  User,
  Sparkles,
  Check,
} from "lucide-react";

export default function SignupPage() {
  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#fffaf8]">
      {/* Background blobs */}
      <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-purple-200/50 blur-[100px]" />
      <div className="absolute -right-32 bottom-10 h-[450px] w-[450px] rounded-full bg-pink-200/50 blur-[110px]" />

      {/* LEFT SIDE */}
      <section className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100 lg:flex">
        <div className="relative z-10 flex w-full flex-col justify-between p-12">

          {/* Logo */}
          <Link href="/" className="flex w-fit items-center gap-2">
            <span className="font-serif text-3xl italic font-semibold text-slate-900">
              Wishly
            </span>
            <Heart size={18} fill="currentColor" className="text-pink-400" />
          </Link>

          {/* Center */}
          <div className="mx-auto max-w-md">

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="mb-8 text-center text-7xl"
            >
              ✨
            </motion.div>

            <h2 className="font-serif text-4xl font-semibold leading-tight text-slate-900">
              Start creating
              <br />
              moments they&apos;ll{" "}
              <span className="text-pink-500">treasure.</span>
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              Join Wishly and turn your favorite memories into beautiful
              interactive surprises.
            </p>

            {/* Benefits */}
            <div className="mt-8 space-y-4">
              <Benefit text="Create personalized occasion pages" />
              <Benefit text="Add photos, videos and memories" />
              <Benefit text="Choose from beautiful templates" />
              <Benefit text="Share your surprise with one link" />
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-slate-500">
            Made for moments that matter. ♥
          </div>
        </div>
      </section>

      {/* RIGHT SIDE */}
      <section className="relative z-10 flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <Link
            href="/"
            className="mb-10 flex items-center justify-center gap-2 lg:hidden"
          >
            <span className="font-serif text-3xl italic font-semibold text-slate-900">
              Wishly
            </span>

            <Heart
              size={18}
              fill="currentColor"
              className="text-pink-400"
            />
          </Link>

          {/* Back */}
          <Link
            href="/"
            className="mb-7 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-pink-500"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

          {/* Heading */}
          <div className="mb-7">
            <div className="mb-4 flex items-center gap-2 text-purple-500">
              <Sparkles size={17} />
              Let&apos;s get started
            </div>

            <h1 className="font-serif text-4xl font-semibold text-slate-900">
              Create your account
            </h1>

            <p className="mt-3 text-slate-500">
              Your next beautiful surprise starts here.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-4"
          >

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Your name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Enter your name"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white/80 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  placeholder="you@example.com"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white/80 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="password"
                  placeholder="Create a password"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white/80 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
                />
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-slate-300 accent-pink-500"
              />

              <p className="text-xs leading-5 text-slate-500">
                I agree to the{" "}
                <button
                  type="button"
                  className="font-medium text-pink-500"
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  className="font-medium text-pink-500"
                >
                  Privacy Policy
                </button>
                .
              </p>
            </div>

            {/* Create Account */}
            <button
              type="submit"
              className="mt-2 h-14 w-full rounded-2xl bg-gradient-to-r from-pink-400 to-rose-500 font-semibold text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Create Account
              <ArrowRight size={17} className="ml-2 inline" />
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />

            <span className="text-xs text-slate-400">
              OR
            </span>

            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Google */}
          <button className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white font-medium text-slate-800 transition hover:bg-slate-50">
            <span className="text-lg font-bold">G</span>
            Continue with Google
          </button>

          {/* Login */}
          <p className="mt-7 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-pink-500 hover:text-pink-600"
            >
              Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

/* Benefit Component */
function Benefit({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm">
        <Check size={15} className="text-pink-500" />
      </div>

      <span className="text-sm text-slate-600">
        {text}
      </span>
    </div>
  );
}