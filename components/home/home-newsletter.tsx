"use client";

import { FormEvent, useState } from "react";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

/**
 * Homepage newsletter band , Letters for her future (double opt-in).
 */
export function HomeNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "invalid" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (!valid) {
      setStatus("invalid");
      setMessage("Enter a valid email address to continue.");
      return;
    }

    setStatus("loading");
    setMessage(null);
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(
          json?.error?.message ?? "Could not subscribe. Please try again.",
        );
      }
      setStatus("success");
      setMessage(
        json?.data?.message ??
          "Check your inbox for a confirmation link to finish subscribing.",
      );
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error ? err.message : "Could not subscribe right now.",
      );
    }
  }

  return (
    <section
      id="newsletter"
      className="bg-brand-navy px-4 py-10 text-text-on-inverse lg:px-6"
    >
      <Reveal className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Letters for her future, monthly
          </h2>
          <p className="mt-2 text-sm text-white/75">
            Subscribe for updates from Girls Global Initiative. We’ll email a
            confirmation link to finish signup.
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
                if (status !== "idle" && status !== "loading") {
                  setStatus("idle");
                  setMessage(null);
                }
              }}
              placeholder="Enter your email"
              disabled={status === "loading"}
              className="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-text-on-inverse placeholder:text-white/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-sky disabled:opacity-60"
            />
            {message ? (
              <p
                className={`mt-2 text-xs ${
                  status === "error" || status === "invalid"
                    ? "text-blob-pink"
                    : "text-white/80"
                }`}
                role={
                  status === "error" || status === "invalid"
                    ? "alert"
                    : "status"
                }
              >
                {message}
              </p>
            ) : null}
          </div>
          <Button
            type="submit"
            disabled={status === "loading"}
            className="h-11 shrink-0 rounded-xl bg-brand-magenta px-6 hover:bg-brand-magenta/90"
          >
            {status === "loading" ? "Sending…" : "Subscribe"}
          </Button>
        </form>
      </Reveal>
    </section>
  );
}
