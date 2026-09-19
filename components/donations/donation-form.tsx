"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export function DonationForm() {
  const router = useRouter();
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

  const amountGhs = custom.trim()
    ? Number(custom)
    : amount;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!Number.isFinite(amountGhs) || amountGhs <= 0) {
      setError("Enter a valid donation amount in Ghana cedis.");
      return;
    }
    if (!isAnonymous && !donorEmail.trim()) {
      setError("Email is required unless you choose to give anonymously.");
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

  return (
    <div className="space-y-8">
      <form
        onSubmit={onSubmit}
        className="space-y-5 rounded-3xl border border-border-default bg-bg-surface p-6"
        noValidate
      >
        <div>
          <p className="text-sm font-semibold text-brand-navy">Amount (GHS)</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {PRESET_AMOUNTS_GHS.map((value) => (
              <Button
                key={value}
                type="button"
                size="sm"
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
              className="h-11 w-full rounded-xl border border-border-default px-3 outline-none focus:border-brand-sky"
            />
          </label>
        </div>

        <fieldset>
          <legend className="text-sm font-semibold text-brand-navy">
            Frequency
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant={frequency === "one_time" ? "secondary" : "outline"}
              onClick={() => setFrequency("one_time")}
            >
              One-time
            </Button>
            <Button
              type="button"
              size="sm"
              variant={frequency === "monthly_intent" ? "secondary" : "outline"}
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
              <span className="font-medium text-brand-navy">Name</span>
              <input
                value={donorName}
                onChange={(event) => setDonorName(event.target.value)}
                className="h-11 w-full rounded-xl border border-border-default px-3 outline-none focus:border-brand-sky"
              />
            </label>
            <label className="space-y-1.5 text-sm">
              <span className="font-medium text-brand-navy">Email</span>
              <input
                type="email"
                required
                value={donorEmail}
                onChange={(event) => setDonorEmail(event.target.value)}
                className="h-11 w-full rounded-xl border border-border-default px-3 outline-none focus:border-brand-sky"
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
              className="h-11 w-full rounded-xl border border-border-default px-3 outline-none focus:border-brand-sky"
            />
          </label>
        )}

        {error ? (
          <p className="text-sm text-brand-magenta" role="alert">
            {error}
          </p>
        ) : null}

        {!paystackReady && frequency === "one_time" ? (
          <p className="rounded-xl bg-bg-base p-3 text-xs text-text-muted" role="status">
            Card/mobile-money checkout via Paystack is not configured yet.
            You can still give using the organisation transfer details below.
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={
            pending || (!paystackReady && frequency === "one_time")
          }
          className="h-11 w-full rounded-xl bg-brand-magenta hover:bg-brand-magenta/90 sm:w-auto"
        >
          {pending
            ? "Working…"
            : frequency === "monthly_intent"
              ? "Share monthly interest"
              : "Continue to Paystack"}
        </Button>
      </form>

      <aside className="rounded-3xl border border-dashed border-border-default bg-bg-surface p-6">
        <h2 className="font-display text-lg font-semibold text-brand-navy">
          Prefer a direct transfer?
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          Organisation account details are shown so giving is not blocked if
          card checkout is unavailable.
        </p>
        {transfer?.configured ? (
          <dl className="mt-4 space-y-2 text-sm text-brand-navy">
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
                <dt className="font-semibold">Notes</dt>
                <dd>{transfer.notes}</dd>
              </div>
            ) : null}
          </dl>
        ) : (
          <p className="mt-4 text-sm text-text-muted">
            Transfer details will appear here once GGI supplies organisation
            account information.
          </p>
        )}
      </aside>
    </div>
  );
}
