"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Item = {
  id: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  summary: string;
  createdAt: string;
};

export default function AdminAuditPageClient() {
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
      const response = await fetch(`/api/admin/audit?${params}`);
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Could not load audit log.");
      }
      setItems(json.data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load audit log.");
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
          Audit log
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          Immutable record of significant back-office and public submission
          actions. Administrator-only.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Search action, entity or summary"
          className="h-11 flex-1 rounded-xl border border-border-default bg-bg-surface px-3 text-sm outline-none focus:border-brand-sky"
          aria-label="Search audit log"
        />
        <Button type="button" variant="outline" onClick={() => void load()}>
          Refresh
        </Button>
      </div>

      {error ? (
        <p className="text-sm text-brand-magenta" role="alert">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-text-muted">Loading audit log…</p>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border-default bg-bg-surface p-6 text-sm text-text-muted">
          No audit entries yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-border-default bg-bg-surface p-4"
            >
              <p className="font-medium text-brand-navy">{item.summary}</p>
              <p className="mt-1 text-xs text-text-muted">
                {item.action} · {item.entityType}
                {item.entityId ? ` · ${item.entityId}` : ""} ·{" "}
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
