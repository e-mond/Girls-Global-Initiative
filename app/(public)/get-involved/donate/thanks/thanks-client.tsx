"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PageHeroCompact } from "@/components/layout/public-page-intro";

type ConfirmStatus = "loading" | "success" | "pending" | "error";

const TERMINAL_FAILURE = new Set(["failed", "abandoned", "rejected"]);

export default function DonateThanksClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference =
    searchParams.get("reference") ?? searchParams.get("trxref") ?? "";
  const mode = searchParams.get("mode");
  const [status, setStatus] = useState<ConfirmStatus>("loading");
  const [amountLabel, setAmountLabel] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [message, setMessage] = useState("Confirming your donation…");

  useEffect(() => {
    if (!reference) {
      setStatus("error");
      setMessage(
        "Missing donation reference. If you completed payment, check your email or contact GGI with your receipt.",
      );
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
    let attempts = 0;

    async function confirmOnce(): Promise<"done" | "retry"> {
      const response = await fetch(`/api/donations/${reference}`);
      const json = await response.json();
      if (cancelled) return "done";

      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Could not confirm donation.");
      }

      const amount = (json.data.amountMinor / 100).toFixed(2);
      setAmountLabel(`${json.data.currency} ${amount}`);
      setEmailSent(Boolean(json.data.emailSent));

      if (TERMINAL_FAILURE.has(json.data.status)) {
        router.replace(
          `/get-involved/donate/failed?reference=${encodeURIComponent(reference)}`,
        );
        return "done";
      }

      if (json.data.status === "success") {
        setStatus("success");
        setMessage(
          json.data.emailSent
            ? "Thank you. Your donation was successful. A confirmation email is on its way."
            : "Thank you. Your donation was successful. A confirmation email will follow when email delivery is available.",
        );
        return "done";
      }

      setStatus("pending");
      setMessage(
        "We’re still confirming this payment with Paystack. If you completed checkout, this usually updates within a few moments.",
      );
      return "retry";
    }

    void (async () => {
      try {
        while (!cancelled && attempts < 4) {
          attempts += 1;
          const result = await confirmOnce();
          if (result === "done") return;
          await new Promise((resolve) => setTimeout(resolve, 2500));
        }
        if (!cancelled) {
          setStatus("pending");
          setMessage(
            "We’re still confirming this payment. You can refresh this page shortly, try again, or use mobile money if checkout did not complete.",
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
  }, [reference, mode, router]);

  return (
    <PageHeroCompact
      eyebrow="Donate"
      title={
        status === "success"
          ? "Donation confirmed"
          : status === "pending"
            ? "Confirming your payment"
            : "Donation status"
      }
      description="We confirm Paystack outcomes on the server — never from the browser alone."
    >
      <div
        className="space-y-4 rounded-3xl border border-border-default bg-bg-surface p-6"
        role={status === "error" ? "alert" : "status"}
        aria-live="polite"
      >
        {status === "success" ? (
          <p className="text-sm font-semibold text-brand-navy">
            Payment successful
          </p>
        ) : null}
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
        {status === "success" && emailSent ? (
          <p className="text-xs text-text-muted">
            Check your inbox for the confirmation email.
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {status === "pending" || status === "error" ? (
            <>
              <Link
                href="/get-involved/donate"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-magenta px-4 text-sm font-medium text-text-on-inverse hover:bg-brand-magenta/90"
              >
                Try again
              </Link>
              <Link
                href="/get-involved/donate?method=direct"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border-default px-4 text-sm font-medium text-brand-navy hover:border-brand-navy/40"
              >
                Pay with MoMo
              </Link>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </PageHeroCompact>
  );
}
