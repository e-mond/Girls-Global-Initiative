"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Homepage newsletter band from GGIHomepage.png.
 * Full double opt-in / SMTP flow ships in the Newsletter unit —
 * this shell validates email and shows a clear next-step message.
 */
export function HomeNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "invalid" | "pending">("idle");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (!valid) {
      setStatus("invalid");
      return;
    }
    setStatus("pending");
  }

  return (
    <section className="bg-brand-navy px-4 py-10 text-text-on-inverse lg:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Letters for her future — monthly
          </h2>
          <p className="mt-2 text-sm text-white/75">
            Subscribe for updates from Girls Global Initiative.
          </p>
        </div>
        <form
          onSubmit={onSubmit}
          className="flex w-full max-w-xl flex-col gap-2 sm:flex-row sm:items-start"
          noValidate
        >
          <div className="flex-1">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              placeholder="Enter your email"
              className="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-text-on-inverse placeholder:text-white/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-sky"
            />
            {status === "invalid" ? (
              <p className="mt-2 text-xs text-blob-pink" role="alert">
                Enter a valid email address to continue.
              </p>
            ) : null}
            {status === "pending" ? (
              <p className="mt-2 text-xs text-white/80" role="status">
                Newsletter confirmation will go live when SMTP signup is
                enabled. Your address was not stored yet.
              </p>
            ) : null}
          </div>
          <Button
            type="submit"
            className="h-11 shrink-0 rounded-xl bg-brand-magenta px-6 hover:bg-brand-magenta/90"
          >
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}
