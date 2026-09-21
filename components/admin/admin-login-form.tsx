"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormEvent, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";

/** Staff credentials sign-in with forgotten-password link. */
export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";
  const reduceMotion = useReducedMotion();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setPending(false);

    if (result?.error) {
      setError("Email or password is incorrect. Please try again.");
      return;
    }

    router.replace(callbackUrl);
    router.refresh();
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      className="space-y-4"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.08 }}
    >
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-brand-navy">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-11 w-full rounded-xl border border-border-default bg-bg-base px-3 text-sm text-text-primary outline-none focus:border-brand-sky"
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-brand-navy"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-11 w-full rounded-xl border border-border-default bg-bg-base px-3 text-sm text-text-primary outline-none focus:border-brand-sky"
        />
      </div>
      {error ? (
        <p className="text-sm text-brand-magenta" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="w-full rounded-xl" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
      <p className="text-center text-sm">
        <Link
          href="/admin/forgot-password"
          className="font-semibold text-brand-magenta hover:underline"
        >
          Forgot password?
        </Link>
      </p>
      <p className="text-center text-xs text-text-muted">
        <Link href="/" className="font-medium text-brand-sky hover:underline">
          Back to public site
        </Link>
      </p>
    </motion.form>
  );
}

/** Split brand + form shell for staff auth pages. */
export function AdminAuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-bg-base lg:grid lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-brand-navy text-text-on-inverse lg:flex lg:flex-col lg:justify-between lg:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 top-20 h-72 w-72 rounded-full bg-brand-magenta/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 bottom-10 h-80 w-80 rounded-full bg-brand-sky/20 blur-3xl"
        />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <Image
              src="/brand/ggi-logo.png"
              alt="Girls Global Initiative"
              width={48}
              height={48}
              className="h-12 w-12 rounded-full bg-white/10 object-cover"
              priority
            />
            <div>
              <p className="font-display text-base font-bold">
                Girls Global Initiative
              </p>
              <p className="text-xs text-white/70">Staff access</p>
            </div>
          </div>
          <p className="mt-10 max-w-sm font-display text-3xl font-bold leading-snug">
            Secure workspace for GGI programme and communications staff.
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/75">
            Manage content, review submissions, and keep donor and subscriber
            records in one calm operational space.
          </p>
        </div>
        <div className="relative z-10 mt-12 overflow-hidden rounded-[1.75rem] ring-1 ring-white/15">
          <div className="relative aspect-[4/3]">
            <Image
              src="/home/hero-main.jpg"
              alt=""
              fill
              className="object-cover"
              sizes="40vw"
              priority
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 to-transparent"
            />
          </div>
        </div>
      </aside>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 -top-16 h-64 w-64 rounded-full bg-blob-pink/70 blur-2xl lg:hidden"
        />
        <motion.section
          className="relative w-full max-w-md space-y-6 rounded-[1.75rem] border border-border-default/80 bg-bg-surface p-7 shadow-sm sm:p-8"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3 lg:hidden">
            <Image
              src="/brand/ggi-logo.png"
              alt="Girls Global Initiative"
              width={44}
              height={44}
              className="h-11 w-11 rounded-full bg-brand-navy object-cover"
              priority
            />
            <div>
              <p className="font-display text-sm font-bold text-brand-navy">
                Girls Global Initiative
              </p>
              <p className="text-xs text-text-muted">Staff access</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brand-magenta">
              Staff workspace
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold text-brand-navy">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              {description}
            </p>
          </div>
          {children}
        </motion.section>
      </div>
    </div>
  );
}
