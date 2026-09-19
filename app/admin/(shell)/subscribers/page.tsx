"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  STATUS_LABELS,
  type SubscriberStatus,
} from "@/features/newsletter/schemas";

type Item = {
  id: string;
  email: string;
  status: SubscriberStatus;
  source: string;
  createdAt: string;
  confirmedAt: string | null;
  unsubscribedAt: string | null;
};

const STATUSES: SubscriberStatus[] = [
  "pending",
  "subscribed",
  "unsubscribed",
];

export default function AdminSubscribersPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (status) params.set("status", status);
    try {
      const response = await fetch(`/api/admin/subscribers?${params}`);
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Could not load subscribers.");
      }
      setItems(json.data.items);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load subscribers.",
      );
    } finally {
      setLoading(false);
    }
  }, [q, status]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onAdd(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const response = await fetch("/api/admin/subscribers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, status: "subscribed" }),
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json?.error?.message ?? "Could not add subscriber.");
      return;
    }
    setEmail("");
    await load();
  }

  async function setItemStatus(id: string, next: SubscriberStatus) {
    setError(null);
    const response = await fetch("/api/admin/subscribers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: next }),
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json?.error?.message ?? "Could not update subscriber.");
      return;
    }
    await load();
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-brand-navy">
          Subscribers
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          Manage Letters for her future. Unsubscribed addresses stay flagged —
          they are never silently deleted.
        </p>
      </div>

      <form
        onSubmit={onAdd}
        className="flex flex-col gap-3 rounded-xl border border-border-default bg-bg-surface p-4 sm:flex-row"
      >
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          required
          placeholder="Add subscriber email"
          className="h-11 flex-1 rounded-xl border border-border-default px-3 text-sm outline-none focus:border-brand-sky"
          aria-label="Subscriber email"
        />
        <Button type="submit">Add subscribed</Button>
      </form>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Search email"
          className="h-11 flex-1 rounded-xl border border-border-default bg-bg-surface px-3 text-sm outline-none focus:border-brand-sky"
          aria-label="Search subscribers"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="h-11 rounded-xl border border-border-default bg-bg-surface px-3 text-sm"
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          {STATUSES.map((value) => (
            <option key={value} value={value}>
              {STATUS_LABELS[value]}
            </option>
          ))}
        </select>
        <Button type="button" variant="outline" onClick={() => void load()}>
          Refresh
        </Button>
        <a
          href="/api/admin/subscribers?format=csv"
          className="inline-flex h-11 items-center justify-center rounded-xl border border-border-default bg-bg-surface px-4 text-sm font-medium text-brand-navy hover:border-brand-navy/40"
        >
          Export CSV
        </a>
      </div>

      {error ? (
        <p className="text-sm text-brand-magenta" role="alert">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-text-muted">Loading subscribers…</p>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border-default bg-bg-surface p-6 text-sm text-text-muted">
          No subscribers in this view yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-border-default bg-bg-surface p-4"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="font-medium text-brand-navy">{item.email}</p>
                  <p className="mt-1 text-xs text-text-muted">
                    {STATUS_LABELS[item.status]} · {item.source} ·{" "}
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((value) => (
                    <Button
                      key={value}
                      type="button"
                      size="sm"
                      variant={item.status === value ? "secondary" : "outline"}
                      disabled={item.status === value}
                      onClick={() => void setItemStatus(item.id, value)}
                    >
                      {STATUS_LABELS[value]}
                    </Button>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
