"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
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
      <AdminPageHeader
        eyebrow="Administration"
        title="Audits"
        description="Immutable record of significant back-office and public submission actions. Historical and read-only."
      />

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
        <p className="rounded-2xl border border-dashed border-border-default bg-bg-surface p-8 text-sm text-text-muted">
          No audit entries yet.
        </p>
      ) : (
        <ol className="relative space-y-3 border-l border-border-default pl-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="relative rounded-2xl border border-border-default bg-bg-surface p-4"
            >
              <span
                aria-hidden
                className="absolute -left-[1.4rem] top-5 h-2.5 w-2.5 rounded-full bg-brand-magenta"
              />
              <p className="font-medium text-brand-navy">{item.summary}</p>
              <p className="mt-2 text-xs text-text-muted">
                {item.action} · {item.entityType}
                {item.entityId ? ` · ${item.entityId}` : null}
              </p>
              <p className="mt-1 text-xs text-text-muted">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
