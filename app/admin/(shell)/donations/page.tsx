"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Item = {
  id: string;
  reference: string;
  statusLabel: string;
  frequencyLabel: string;
  amountMinor: number;
  currency: string;
  donorName: string | null;
  donorEmail: string | null;
  isAnonymous: boolean;
  paidAt: string | null;
  createdAt: string;
};

export default function AdminDonationsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    try {
      const response = await fetch(`/api/admin/donations?${params}`);
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Could not load donations.");
      }
      setItems(json.data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load donations.");
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-brand-navy">
          Donations
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          Read-only records synced from Paystack (and monthly intents). No card
          data is stored.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Search reference, name or email"
          className="h-11 flex-1 rounded-xl border border-border-default bg-bg-surface px-3 text-sm outline-none focus:border-brand-sky"
          aria-label="Search donations"
        />
        <Button type="button" variant="outline" onClick={() => void load()}>
          Refresh
        </Button>
        <a
          href="/api/admin/donations?format=csv"
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
        <p className="text-sm text-text-muted">Loading donations…</p>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border-default bg-bg-surface p-6 text-sm text-text-muted">
          No donation records yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-border-default bg-bg-surface p-4"
            >
              <p className="font-medium text-brand-navy">
                {item.currency} {(item.amountMinor / 100).toFixed(2)} ·{" "}
                {item.statusLabel}
              </p>
              <p className="mt-1 text-sm text-text-muted">
                {item.frequencyLabel}
                {item.isAnonymous
                  ? " · Anonymous"
                  : item.donorName || item.donorEmail
                    ? ` · ${item.donorName ?? item.donorEmail}`
                    : ""}
              </p>
              <p className="mt-1 text-xs text-text-muted">
                {item.reference} ·{" "}
                {new Date(item.paidAt ?? item.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
