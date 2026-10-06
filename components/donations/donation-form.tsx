"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FormPrivacyNotice } from "@/components/forms/form-privacy-notice";
import { Button } from "@/components/ui/button";
import { PRESET_AMOUNTS_GHS } from "@/features/donations/schemas";

type TransferDetails = {
  bankName: string | null;
  accountName: string | null;
  accountNumber: string | null;
  mobileMoney: string | null;
  notes: string | null;
  configured: boolean;
};

type MethodChoice = "choose" | "paystack" | "direct";

function RequiredMark() {
  return (
    <span className="text-brand-magenta" aria-hidden>
      *
    </span>
  );
}

export function DonationForm() {
  const router = useRouter();
  const [method, setMethod] = useState<MethodChoice>("choose");
  const [amount, setAmount] = useState<number>(50);
  const [custom, setCustom] = useState("");
  const [frequency, setFrequency] = useState<"one_time" | "monthly_intent">(
    "one_time",
  );
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paystackReady, setPaystackReady] = useState(false);
  const [transfer, setTransfer] = useState<TransferDetails | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notifySuccess, setNotifySuccess] = useState<string | null>(null);
  const [transferReference, setTransferReference] = useState("");
  const [transferredOn, setTransferredOn] = useState("");
  const [donorNote, setDonorNote] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const response = await fetch("/api/donations/initialize");
        const json = await response.json();
        setPaystackReady(Boolean(json?.data?.paystackConfigured));
        setTransfer(json?.data?.transfer ?? null);
      } catch {
        setPaystackReady(false);
      }
    })();
  }, []);

  const amountGhs = custom.trim() ? Number(custom) : amount;

  async function onPaystackSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!Number.isFinite(amountGhs) || amountGhs <= 0) {
      setError("Enter a valid donation amount in Ghana cedis.");
      return;
    }
    if (!isAnonymous && !donorEmail.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/donations/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountGhs,
          frequency,
          donorName: isAnonymous ? "" : donorName,
          donorEmail: isAnonymous ? donorEmail || "" : donorEmail,
          isAnonymous,
        }),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Could not start donation.");
      }

      if (json.data.mode === "monthly_intent") {
        router.push(json.data.redirectUrl);
        return;
      }

      if (json.data.authorizationUrl) {
        window.location.href = json.data.authorizationUrl;
        return;
      }

      throw new Error("Checkout could not be started.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start donation.");
    } finally {
      setPending(false);
    }
  }

  async function onNotifySubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setNotifySuccess(null);

    if (!Number.isFinite(amountGhs) || amountGhs <= 0) {
      setError("Enter the amount you transferred in Ghana cedis.");
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/donations/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountGhs,
          donorName,
          donorEmail,
          transferReference,
          transferredOn,
          donorNote,
        }),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Could not submit notification.");
      }
      setNotifySuccess(
        json.data.message ??
          "Notification received. It remains pending verification.",
      );
      setTransferReference("");
      setDonorNote("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not submit notification.",
      );
    } finally {
      setPending(false);
    }
  }

  if (method === "choose") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-brand-navy">
            Support GGI
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Choose how you&apos;d like to make your donation. Both options are
            fully supported.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMethod("paystack")}
            className="rounded-[1.5rem] border border-border-default bg-bg-surface p-6 text-left transition hover:border-brand-sky focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-brand-magenta">
              Pay online
            </p>
            <p className="mt-2 font-display text-xl font-bold text-brand-navy">
              Pay with Paystack
            </p>
            <p className="mt-2 text-sm text-text-muted">
              Secure card or mobile-money checkout.
            </p>
            <span className="mt-4 inline-flex text-sm font-semibold text-brand-sky">
              Continue
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMethod("direct")}
            className="rounded-[1.5rem] border border-border-default bg-bg-surface p-6 text-left transition hover:border-brand-sky focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-brand-magenta">
              Bank / direct transfer
            </p>
            <p className="mt-2 font-display text-xl font-bold text-brand-navy">
              Direct payment
            </p>
            <p className="mt-2 text-sm text-text-muted">
              Use GGI&apos;s official account details, then optionally notify us.
            </p>
            <span className="mt-4 inline-flex text-sm font-semibold text-brand-sky">
              View details
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => {
          setMethod("choose");
          setError(null);
          setNotifySuccess(null);
        }}
        className="text-sm font-semibold text-brand-sky hover:underline"
      >
        ← Choose a different method
      </button>

      {method === "paystack" ? (
        <form
          onSubmit={onPaystackSubmit}
          className="space-y-5 rounded-[1.5rem] border border-border-default bg-bg-surface p-6"
          noValidate
        >
          <div>
            <p className="font-display text-xl font-bold text-brand-navy">
              Pay with Paystack
            </p>
            <p className="mt-1 text-xs text-text-muted">
              <RequiredMark /> Required field
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-brand-navy">
              Amount (GHS) <RequiredMark />
            </p>
            <div
              className="mt-3 flex flex-wrap gap-2"
              role="radiogroup"
              aria-label="Donation amount in GHS"
            >
              {PRESET_AMOUNTS_GHS.map((value) => (
                <Button
                  key={value}
                  type="button"
                  size="sm"
                  role="radio"
                  aria-checked={!custom && amount === value}
                  variant={!custom && amount === value ? "secondary" : "outline"}
                  onClick={() => {
                    setAmount(value);
                    setCustom("");
                  }}
                >
                  GHS {value}
                </Button>
              ))}
            </div>
            <label className="mt-3 block space-y-1.5 text-sm">
              <span className="font-medium text-brand-navy">Custom amount</span>
              <input
                type="number"
                min={1}
                step="1"
                value={custom}
                onChange={(event) => setCustom(event.target.value)}
                placeholder="e.g. 75"
                className="h-11 w-full rounded-xl border border-border-default px-3 outline-none focus-visible:border-brand-sky focus-visible:ring-2 focus-visible:ring-brand-sky"
              />
            </label>
          </div>

          <fieldset>
            <legend className="text-sm font-semibold text-brand-navy">
              Frequency
            </legend>
            <div
              className="mt-3 flex flex-wrap gap-2"
              role="radiogroup"
              aria-label="Donation frequency"
            >
              <Button
                type="button"
                size="sm"
                role="radio"
                aria-checked={frequency === "one_time"}
                variant={frequency === "one_time" ? "secondary" : "outline"}
                onClick={() => setFrequency("one_time")}
              >
                One-time
              </Button>
              <Button
                type="button"
                size="sm"
                role="radio"
                aria-checked={frequency === "monthly_intent"}
                variant={
                  frequency === "monthly_intent" ? "secondary" : "outline"
                }
                onClick={() => setFrequency("monthly_intent")}
              >
                Monthly
              </Button>
            </div>
            {frequency === "monthly_intent" ? (
              <p className="mt-2 text-xs text-text-muted">
                Monthly giving is captured as interest for now. Recurring billing
                ships in a later phase.
              </p>
            ) : null}
          </fieldset>

          <label className="flex items-center gap-2 text-sm text-brand-navy">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(event) => setIsAnonymous(event.target.checked)}
            />
            Give anonymously
          </label>

          {!isAnonymous ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-sm">
                <span className="font-medium text-brand-navy">
                  Name (optional)
                </span>
                <input
                  value={donorName}
                  onChange={(event) => setDonorName(event.target.value)}
                  className="h-11 w-full rounded-xl border border-border-default px-3 outline-none focus-visible:border-brand-sky focus-visible:ring-2 focus-visible:ring-brand-sky"
                />
              </label>
              <label className="space-y-1.5 text-sm">
                <span className="font-medium text-brand-navy">
                  Email <RequiredMark />
                </span>
                <input
                  type="email"
                  required
                  aria-required="true"
                  value={donorEmail}
                  onChange={(event) => setDonorEmail(event.target.value)}
                  className="h-11 w-full rounded-xl border border-border-default px-3 outline-none focus-visible:border-brand-sky focus-visible:ring-2 focus-visible:ring-brand-sky"
                />
              </label>
            </div>
          ) : (
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium text-brand-navy">
                Email for receipt (optional)
              </span>
              <input
                type="email"
                value={donorEmail}
                onChange={(event) => setDonorEmail(event.target.value)}
                className="h-11 w-full rounded-xl border border-border-default px-3 outline-none focus-visible:border-brand-sky focus-visible:ring-2 focus-visible:ring-brand-sky"
              />
            </label>
          )}

          {error ? (
            <p className="text-sm text-brand-magenta" role="alert">
              {error}
            </p>
          ) : null}

          {!paystackReady && frequency === "one_time" ? (
            <p
              className="rounded-xl bg-bg-base p-3 text-xs text-text-muted"
              role="status"
            >
              Card/mobile-money checkout via Paystack is not configured yet.
              Choose Direct payment for organisation transfer details.
            </p>
          ) : null}

          <FormPrivacyNotice />

          <Button
            type="submit"
            disabled={pending || (!paystackReady && frequency === "one_time")}
            className="h-11 w-full rounded-xl bg-brand-magenta hover:bg-brand-magenta/90 sm:w-auto"
          >
            {pending
              ? "Working…"
              : frequency === "monthly_intent"
                ? "Share monthly interest"
                : "Continue to Paystack"}
          </Button>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="rounded-[1.5rem] border border-border-default bg-bg-surface p-6">
            <h2 className="font-display text-xl font-bold text-brand-navy">
              Direct payment details
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              Make a bank or approved direct payment using GGI&apos;s official
              account details. Keep your receipt. Submitting a notification below
              does not mark the gift as successful until staff verify it.
            </p>
            {transfer?.configured ? (
              <dl className="mt-4 space-y-3 text-sm text-brand-navy">
                {transfer.bankName ? (
                  <div>
                    <dt className="font-semibold">Bank</dt>
                    <dd>{transfer.bankName}</dd>
                  </div>
                ) : null}
                {transfer.accountName ? (
                  <div>
                    <dt className="font-semibold">Account name</dt>
                    <dd>{transfer.accountName}</dd>
                  </div>
                ) : null}
                {transfer.accountNumber ? (
                  <div>
                    <dt className="font-semibold">Account number</dt>
                    <dd>{transfer.accountNumber}</dd>
                  </div>
                ) : null}
                {transfer.mobileMoney ? (
                  <div>
                    <dt className="font-semibold">Mobile money</dt>
                    <dd>{transfer.mobileMoney}</dd>
                  </div>
                ) : null}
                {transfer.notes ? (
                  <div>
                    <dt className="font-semibold">Reference / narration</dt>
                    <dd>{transfer.notes}</dd>
                  </div>
                ) : (
                  <div>
                    <dt className="font-semibold">Reference / narration</dt>
                    <dd className="text-text-muted">
                      Use your name or “GGI donation” unless GGI has published a
                      specific reference instruction.
                    </dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="mt-4 rounded-xl bg-bg-base p-4 text-sm text-text-muted">
                Awaiting official GGI account/payment information. Contact GGI
                if you need transfer details, or use Paystack when available.
              </p>
            )}
          </div>

          {transfer?.configured ? (
            <form
              onSubmit={onNotifySubmit}
              className="space-y-5 rounded-[1.5rem] border border-border-default bg-bg-surface p-6"
              noValidate
            >
              <div>
                <h3 className="font-display text-lg font-bold text-brand-navy">
                  Optional: notify GGI of your transfer
                </h3>
                <p className="mt-1 text-sm text-text-muted">
                  Status will be <strong>Pending verification</strong> until staff
                  confirm. <RequiredMark /> Required field
                </p>
              </div>

              <label className="block space-y-1.5 text-sm">
                <span className="font-medium text-brand-navy">
                  Amount transferred (GHS) <RequiredMark />
                </span>
                <input
                  type="number"
                  min={1}
                  step="1"
                  required
                  aria-required="true"
                  value={custom || amount}
                  onChange={(event) => {
                    setCustom(event.target.value);
                  }}
                  className="h-11 w-full rounded-xl border border-border-default px-3 outline-none focus-visible:border-brand-sky focus-visible:ring-2 focus-visible:ring-brand-sky"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5 text-sm">
                  <span className="font-medium text-brand-navy">
                    Name (optional)
                  </span>
                  <input
                    value={donorName}
                    onChange={(event) => setDonorName(event.target.value)}
                    className="h-11 w-full rounded-xl border border-border-default px-3 outline-none focus-visible:border-brand-sky focus-visible:ring-2 focus-visible:ring-brand-sky"
                  />
                </label>
                <label className="space-y-1.5 text-sm">
                  <span className="font-medium text-brand-navy">
                    Email (optional)
                  </span>
                  <input
                    type="email"
                    value={donorEmail}
                    onChange={(event) => setDonorEmail(event.target.value)}
                    className="h-11 w-full rounded-xl border border-border-default px-3 outline-none focus-visible:border-brand-sky focus-visible:ring-2 focus-visible:ring-brand-sky"
                  />
                </label>
              </div>

              <label className="block space-y-1.5 text-sm">
                <span className="font-medium text-brand-navy">
                  Transfer reference (optional)
                </span>
                <input
                  value={transferReference}
                  onChange={(event) => setTransferReference(event.target.value)}
                  className="h-11 w-full rounded-xl border border-border-default px-3 outline-none focus-visible:border-brand-sky focus-visible:ring-2 focus-visible:ring-brand-sky"
                />
              </label>

              <label className="block space-y-1.5 text-sm">
                <span className="font-medium text-brand-navy">
                  Transfer date (optional)
                </span>
                <input
                  type="date"
                  value={transferredOn}
                  onChange={(event) => setTransferredOn(event.target.value)}
                  className="h-11 w-full rounded-xl border border-border-default px-3 outline-none focus-visible:border-brand-sky focus-visible:ring-2 focus-visible:ring-brand-sky"
                />
              </label>

              <label className="block space-y-1.5 text-sm">
                <span className="font-medium text-brand-navy">
                  Note (optional)
                </span>
                <textarea
                  value={donorNote}
                  onChange={(event) => setDonorNote(event.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-border-default px-3 py-2 outline-none focus-visible:border-brand-sky focus-visible:ring-2 focus-visible:ring-brand-sky"
                />
              </label>

              {error ? (
                <p className="text-sm text-brand-magenta" role="alert">
                  {error}
                </p>
              ) : null}
              {notifySuccess ? (
                <p className="text-sm text-brand-navy" role="status">
                  {notifySuccess}
                </p>
              ) : null}

              <FormPrivacyNotice />

              <Button
                type="submit"
                disabled={pending}
                className="h-11 w-full rounded-xl bg-brand-magenta hover:bg-brand-magenta/90 sm:w-auto"
              >
                {pending ? "Sending…" : "Submit notification"}
              </Button>
            </form>
          ) : null}
        </div>
      )}
    </div>
  );
}
