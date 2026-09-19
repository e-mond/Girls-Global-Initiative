"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PublicPageIntro } from "@/components/layout/public-page-intro";

export default function DonateThanksClient() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") ?? "";
  const mode = searchParams.get("mode");
  const [status, setStatus] = useState<"loading" | "success" | "pending" | "error">(
    "loading",
  );
  const [amountLabel, setAmountLabel] = useState<string | null>(null);
  const [message, setMessage] = useState("Confirming your donation…");

  useEffect(() => {
    if (!reference) {
      setStatus("error");
      setMessage("Missing donation reference.");
      return;
    }

    if (mode === "monthly") {
      setStatus("success");
      setMessage(
        "Thank you. We’ve recorded your interest in monthly giving and will follow up when recurring billing is available.",
      );
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch(`/api/donations/${reference}`);
        const json = await response.json();
        if (cancelled) return;
        if (!response.ok) {
          throw new Error(json?.error?.message ?? "Could not confirm donation.");
        }
        const amount = (json.data.amountMinor / 100).toFixed(2);
        setAmountLabel(`${json.data.currency} ${amount}`);
        if (json.data.status === "success") {
          setStatus("success");
          setMessage(
            "Thank you. Your donation was successful. A receipt email will follow when email is configured.",
          );
        } else {
          setStatus("pending");
          setMessage(
            "We’re still confirming this payment. If you completed checkout, it may take a moment — refresh shortly or check your email.",
          );
        }
      } catch (err) {
        if (cancelled) return;
        setStatus("error");
        setMessage(
          err instanceof Error ? err.message : "Could not confirm donation.",
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reference, mode]);

  return (
    <PublicPageIntro
      eyebrow="Donate"
      title="Donation status"
      description="We confirm outcomes from Paystack securely — never from the browser alone."
    >
      <div
        className="space-y-4 rounded-3xl border border-border-default bg-bg-surface p-6"
        role={status === "error" ? "alert" : "status"}
      >
        <p
          className={`text-sm leading-relaxed ${
            status === "error" ? "text-brand-magenta" : "text-text-muted"
          }`}
        >
          {message}
        </p>
        {amountLabel ? (
          <p className="text-sm font-semibold text-brand-navy">{amountLabel}</p>
        ) : null}
        {reference ? (
          <p className="text-xs text-text-muted">Reference: {reference}</p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Link
            href="/get-involved/donate"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border-default px-4 text-sm font-medium text-brand-navy hover:border-brand-navy/40"
          >
            Donate again
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-magenta px-4 text-sm font-medium text-text-on-inverse hover:bg-brand-magenta/90"
          >
            Back home
          </Link>
        </div>
      </div>
    </PublicPageIntro>
  );
}
