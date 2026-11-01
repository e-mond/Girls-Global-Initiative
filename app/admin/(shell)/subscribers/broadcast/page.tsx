"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { readJsonResponse } from "@/lib/safe-json";

type BatchResult = {
  attempted: number;
  sent: number;
  failed: number;
  nextOffset: number;
  remaining: number;
  totalSubscribed: number;
};

export default function AdminBroadcastPage() {
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [offset, setOffset] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [last, setLast] = useState<BatchResult | null>(null);

  async function onSend(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const sendOffset =
        last && last.remaining === 0 ? 0 : offset;
      const response = await fetch("/api/admin/subscribers/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          title,
          body,
          offset: sendOffset,
        }),
      });
      const json = await readJsonResponse<{
        data?: BatchResult;
        error?: { message?: string };
      }>(response, "Could not send broadcast batch.");
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Could not send broadcast batch.");
      }
      const result = json.data!;
      setLast(result);
      setOffset(result.nextOffset);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not send broadcast batch.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader
        eyebrow="Subscribers"
        title="Broadcast"
        description="Send Letters for her future in small batches (max 20 per click) to protect Worker limits. For very large lists, use the local announce script documented in Cloudflare docs."
        actions={
          <Link
            href="/admin/subscribers"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border-default bg-bg-surface px-4 text-sm font-medium text-brand-navy"
          >
            Back to list
          </Link>
        }
      />

      <form
        onSubmit={onSend}
        className="space-y-4 rounded-2xl border border-border-default bg-bg-surface p-5"
      >
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-brand-navy">Email subject</span>
          <input
            required
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="h-11 w-full rounded-xl border border-border-default bg-bg-base px-3 text-sm outline-none focus:border-brand-sky"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-brand-navy">Title</span>
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="h-11 w-full rounded-xl border border-border-default bg-bg-base px-3 text-sm outline-none focus:border-brand-sky"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-brand-navy">Message body</span>
          <textarea
            required
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={8}
            className="w-full rounded-xl border border-border-default bg-bg-base px-3 py-2 text-sm outline-none focus:border-brand-sky"
          />
        </label>
        <p className="text-xs text-text-muted">
          Current offset: {offset}
          {last
            ? ` · last batch sent ${last.sent}/${last.attempted}, ${last.remaining} remaining of ${last.totalSubscribed}`
            : null}
        </p>
        {error ? (
          <p className="text-sm text-brand-magenta" role="alert">
            {error}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={saving}>
            {saving
              ? "Sending…"
              : last && last.remaining === 0
                ? "All caught up — send again from start"
                : "Send next batch"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={() => {
              setOffset(0);
              setLast(null);
            }}
          >
            Reset offset
          </Button>
        </div>
      </form>
    </section>
  );
}
