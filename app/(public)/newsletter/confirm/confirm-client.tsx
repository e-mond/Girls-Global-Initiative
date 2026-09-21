"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeroCompact } from "@/components/layout/public-page-intro";

export default function NewsletterConfirmClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [state, setState] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Confirming your subscription…");

  useEffect(() => {
    if (!token) {
      setState("error");
      setMessage("This confirmation link is missing a token.");
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch("/api/newsletter/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const json = await response.json();
        if (cancelled) return;
        if (!response.ok) {
          throw new Error(
            json?.error?.message ?? "Could not confirm this subscription.",
          );
        }
        setState("success");
        setMessage(
          "You’re subscribed to Letters for her future. Thank you for joining us.",
        );
      } catch (err) {
        if (cancelled) return;
        setState("error");
        setMessage(
          err instanceof Error
            ? err.message
            : "Could not confirm this subscription.",
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <PageHeroCompact
      eyebrow="Newsletter"
      title="Confirm subscription"
      description="Double opt-in keeps Letters for her future consent clear and deliverable."
    >
      <div
        className="rounded-3xl border border-border-default bg-bg-surface p-6"
        role={state === "error" ? "alert" : "status"}
      >
        <p
          className={`text-sm leading-relaxed ${
            state === "error" ? "text-brand-magenta" : "text-text-muted"
          }`}
        >
          {message}
        </p>
      </div>
    </PageHeroCompact>
  );
}
