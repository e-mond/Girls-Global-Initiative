"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeroCompact } from "@/components/layout/public-page-intro";
import { Button } from "@/components/ui/button";

export default function NewsletterUnsubscribeClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const auto = searchParams.get("auto") === "1";
  const [state, setState] = useState<
    "idle" | "loading" | "success" | "error"
  >(token ? "idle" : "error");
  const [message, setMessage] = useState(
    token
      ? "Confirm that you want to stop receiving Letters for her future."
      : "This unsubscribe link is missing a token.",
  );

  const unsubscribe = useCallback(async () => {
    if (!token) return;
    setState("loading");
    try {
      const response = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(
          json?.error?.message ?? "Could not unsubscribe right now.",
        );
      }
      setState("success");
      setMessage(
        "You’re unsubscribed. You will no longer receive Letters for her future.",
      );
    } catch (err) {
      setState("error");
      setMessage(
        err instanceof Error ? err.message : "Could not unsubscribe.",
      );
    }
  }, [token]);

  useEffect(() => {
    if (token && auto) {
      void unsubscribe();
    }
  }, [token, auto, unsubscribe]);

  return (
    <PageHeroCompact
      eyebrow="Newsletter"
      title="Unsubscribe"
      description="You can leave Letters for her future at any time. Unsubscribed addresses stay on record as unsubscribed."
    >
      <div className="space-y-4 rounded-3xl border border-border-default bg-bg-surface p-6">
        <p
          className={`text-sm leading-relaxed ${
            state === "error" ? "text-brand-magenta" : "text-text-muted"
          }`}
          role={state === "error" ? "alert" : "status"}
        >
          {message}
        </p>
        {state === "idle" || state === "loading" ? (
          <Button
            type="button"
            onClick={() => void unsubscribe()}
            disabled={state === "loading" || !token}
          >
            {state === "loading" ? "Unsubscribing…" : "Confirm unsubscribe"}
          </Button>
        ) : null}
      </div>
    </PageHeroCompact>
  );
}
