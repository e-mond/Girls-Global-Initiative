"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
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
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
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
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor="password"
            className="text-sm font-medium text-brand-navy"
          >
            Password
          </label>
          <Link
            href="/admin/forgot-password"
            className="text-xs font-semibold text-brand-magenta hover:underline"
          >
            Forgot password?
          </Link>
        </div>
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
      <p className="text-center text-xs text-text-muted">
        <Link href="/" className="font-medium text-brand-sky hover:underline">
          Back to public site
        </Link>
      </p>
    </motion.form>
  );
}

export function AdminAuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-base px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-20 h-80 w-80 rounded-full bg-blob-pink/80 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-0 h-96 w-96 rounded-full bg-blob-sky/80 blur-2xl"
      />
      <motion.section
        className="relative w-full max-w-md space-y-6 rounded-[1.75rem] border border-border-default/80 bg-bg-surface/95 p-8 shadow-sm backdrop-blur-md"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-3">
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
            <p className="text-xs text-text-muted">Staff back-office</p>
          </div>
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-navy">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            {description}
          </p>
        </div>
        {children}
      </motion.section>
    </div>
  );
}
