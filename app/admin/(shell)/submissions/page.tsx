"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import {
  STATUS_LABELS,
  type SubmissionKind,
  type SubmissionStatus,
} from "@/features/submissions/schemas";
import { cn } from "@/lib/utils";

type Item = {
  id: string;
  status: SubmissionStatus;
  email: string;
  summary: string;
  createdAt: string;
};

const KINDS: { id: SubmissionKind; label: string }[] = [
  { id: "volunteer", label: "Volunteer" },
  { id: "partnership", label: "Partnerships" },
  { id: "contact", label: "Contact" },
];

const STATUSES: SubmissionStatus[] = [
  "new",
  "in_review",
  "accepted",
  "declined",
];

export default function AdminSubmissionsPage() {
  const [kind, setKind] = useState<SubmissionKind>("volunteer");
  const [items, setItems] = useState<Item[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (status) params.set("status", status);
    try {
      const response = await fetch(
        `/api/admin/submissions/${kind}?${params.toString()}`,
      );
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Could not load submissions.");
      }
      setItems(json.data.items);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load submissions.",
      );
    } finally {
      setLoading(false);
    }
  }, [kind, q, status]);

  useEffect(() => {
    void load();
  }, [load]);

  async function setItemStatus(id: string, next: SubmissionStatus) {
    setError(null);
    const response = await fetch(`/api/admin/submissions/${kind}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: next }),
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json?.error?.message ?? "Could not update status.");
      return;
    }
    await load();
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader
        eyebrow="Manage"
        title="Submissions"
        description="Review volunteer applications, partnership requests and contact messages."
        actions={
          <a
            href={`/api/admin/submissions/${kind}?format=csv`}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border-default bg-bg-surface px-4 text-sm font-medium text-brand-navy hover:border-brand-navy/40"
          >
            Export CSV
          </a>
        }
      />

      <div className="flex flex-wrap gap-2">
        {KINDS.map((item) => (
          <Button
            key={item.id}
            type="button"
            size="sm"
            variant={kind === item.id ? "secondary" : "outline"}
            onClick={() => setKind(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Search name, email or summary"
          className="h-11 flex-1 rounded-xl border border-border-default bg-bg-surface px-3 text-sm outline-none focus:border-brand-sky"
          aria-label="Search submissions"
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
      </div>

      {error ? (
        <p className="text-sm text-brand-magenta" role="alert">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-text-muted">Loading submissions…</p>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border-default bg-bg-surface p-8 text-sm text-text-muted">
          No submissions in this view yet.
        </p>
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-2xl border border-border-default md:block">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-bg-base text-xs uppercase tracking-wide text-text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Submission</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-border-default bg-bg-surface"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-brand-navy">
                        {item.summary}
                      </p>
                      <p className="text-text-muted">{item.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                          item.status === "new" &&
                            "bg-blob-pink/60 text-brand-magenta",
                          item.status === "in_review" &&
                            "bg-blob-sky/60 text-brand-navy",
                          item.status === "accepted" &&
                            "bg-brand-navy/10 text-brand-navy",
                          item.status === "declined" &&
                            "bg-bg-base text-text-muted",
                        )}
                      >
                        {STATUS_LABELS[item.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {STATUSES.map((value) => (
                          <Button
                            key={value}
                            type="button"
                            size="sm"
                            variant={
                              item.status === value ? "secondary" : "outline"
                            }
                            disabled={item.status === value}
                            onClick={() => void setItemStatus(item.id, value)}
                          >
                            {STATUS_LABELS[value]}
                          </Button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="space-y-3 md:hidden">
            {items.map((item) => (
              <li
                key={item.id}
                className="rounded-2xl border border-border-default bg-bg-surface p-4"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-brand-magenta">
                  {KINDS.find((entry) => entry.id === kind)?.label}
                </p>
                <p className="mt-1 font-display text-lg font-bold text-brand-navy">
                  {item.summary}
                </p>
                <p className="mt-1 text-sm text-text-muted">{item.email}</p>
                <p className="mt-2 text-xs text-text-muted">
                  {STATUS_LABELS[item.status]} ·{" "}
                  {new Date(item.createdAt).toLocaleString()}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
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
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
