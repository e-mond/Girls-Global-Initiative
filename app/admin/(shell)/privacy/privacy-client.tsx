"use client";

import { FormEvent, useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { readJsonResponse } from "@/lib/safe-json";

type RecordPayload = {
  email: string;
  donations: unknown[];
  submissions: unknown[];
  subscribers: unknown[];
};

export default function AdminPrivacyClient() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [erasing, setErasing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [record, setRecord] = useState<RecordPayload | null>(null);

  async function onLookup(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setRecord(null);
    try {
      const response = await fetch(
        `/api/admin/privacy/data-subject?email=${encodeURIComponent(email.trim())}`,
      );
      const json = await readJsonResponse<{
        data?: { record?: RecordPayload };
        error?: { message?: string };
      }>(response, "Could not look up this email.");
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Could not look up this email.");
      }
      setRecord(json.data?.record ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed.");
    } finally {
      setLoading(false);
    }
  }

  async function onErase() {
    if (
      !window.confirm(
        `Erase or anonymise personal data for ${email.trim()}? Donation amounts stay for audit; identity fields are cleared. This cannot be undone.`,
      )
    ) {
      return;
    }
    setErasing(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch("/api/admin/privacy/data-subject", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), confirm: true }),
      });
      const json = await readJsonResponse<{
        data?: {
          result?: {
            donationsAnonymised: number;
            submissionsDeleted: number;
            subscribersDeleted: number;
          };
        };
        error?: { message?: string };
      }>(response, "Could not erase records.");
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Could not erase records.");
      }
      const result = json.data?.result;
      setSuccess(
        `Done — donations anonymised: ${result?.donationsAnonymised ?? 0}, submissions deleted: ${result?.submissionsDeleted ?? 0}, subscribers deleted: ${result?.subscribersDeleted ?? 0}.`,
      );
      setRecord(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erase failed.");
    } finally {
      setErasing(false);
    }
  }

  function downloadJson() {
    if (!record) return;
    const blob = new Blob([JSON.stringify(record, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `ggi-data-subject-${record.email.replace(/[^a-z0-9@._-]/gi, "_")}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader
        eyebrow="Administration"
        title="Privacy tools"
        description="Data-subject access and erase for an email address across donations, form submissions and newsletter subscribers (BR-23)."
      />

      <form
        onSubmit={onLookup}
        className="flex flex-col gap-3 rounded-2xl border border-border-default bg-bg-surface p-5 sm:flex-row"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="person@example.com"
          className="h-11 flex-1 rounded-xl border border-border-default bg-bg-base px-3 text-sm outline-none focus:border-brand-sky"
          aria-label="Email to look up"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Looking up…" : "Look up"}
        </Button>
      </form>

      {error ? (
        <p className="text-sm text-brand-magenta" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="text-sm text-brand-navy" role="status">
          {success}
        </p>
      ) : null}

      {record ? (
        <div className="space-y-4 rounded-2xl border border-border-default bg-bg-surface p-5">
          <p className="text-sm text-text-muted">
            Found for <span className="font-medium text-brand-navy">{record.email}</span>
            : {record.donations.length} donation(s),{" "}
            {record.submissions.length} submission(s),{" "}
            {record.subscribers.length} subscriber record(s).
          </p>
          <pre className="max-h-96 overflow-auto rounded-xl bg-bg-base p-4 text-xs text-brand-navy">
            {JSON.stringify(record, null, 2)}
          </pre>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={downloadJson}>
              Download JSON
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={erasing}
              onClick={() => void onErase()}
            >
              {erasing ? "Erasing…" : "Erase / anonymise"}
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
