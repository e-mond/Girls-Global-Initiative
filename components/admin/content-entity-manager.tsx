"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { ContentEntity, ContentStatus } from "@/features/governance/rbac";

type ContentItem = {
  id: string;
  status: ContentStatus;
  [key: string]: unknown;
};

type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number";
  required?: boolean;
};

export function ContentEntityManager({
  entity,
  title,
  description,
  fields,
  createDefaults,
}: {
  entity: ContentEntity;
  title: string;
  description: string;
  fields: FieldDef[];
  createDefaults?: Record<string, unknown>;
}) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  function primaryLabel(item: ContentItem): string {
    return String(
      item.title ?? item.label ?? item.name ?? item.attribution ?? item.id,
    );
  }

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/content/${entity}`);
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Could not load content.");
      }
      setItems(json.data.items);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load content.",
      );
    } finally {
      setLoading(false);
    }
  }, [entity]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onCreate(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload: Record<string, unknown> = {
      ...(createDefaults ?? {}),
      status: "draft",
    };
    for (const field of fields) {
      const value = form[field.name] ?? "";
      payload[field.name] =
        field.type === "number" ? Number(value || 0) : value;
    }

    try {
      const response = await fetch(`/api/admin/content/${entity}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Could not create item.");
      }
      setForm({});
      await load();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not create item.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function setStatus(id: string, status: ContentStatus) {
    setError(null);
    const response = await fetch(`/api/admin/content/${entity}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json?.error?.message ?? "Could not update status.");
      return;
    }
    await load();
  }

  async function remove(id: string) {
    setError(null);
    const response = await fetch(
      `/api/admin/content/${entity}?id=${encodeURIComponent(id)}`,
      { method: "DELETE" },
    );
    const json = await response.json();
    if (!response.ok) {
      setError(json?.error?.message ?? "Could not delete item.");
      return;
    }
    await load();
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-brand-navy">
          {title}
        </h2>
        <p className="mt-2 text-sm text-text-muted">{description}</p>
      </div>

      <form
        onSubmit={onCreate}
        className="space-y-4 rounded-xl border border-border-default bg-bg-surface p-5"
      >
        <p className="text-sm font-semibold text-brand-navy">Create draft</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <label key={field.name} className="space-y-1 text-sm">
              <span className="font-medium text-brand-navy">{field.label}</span>
              {field.type === "textarea" ? (
                <textarea
                  required={field.required}
                  value={form[field.name] ?? ""}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [field.name]: event.target.value,
                    }))
                  }
                  className="min-h-24 w-full rounded-xl border border-border-default bg-bg-base px-3 py-2 text-sm outline-none focus:border-brand-sky"
                />
              ) : (
                <input
                  type={field.type === "number" ? "number" : "text"}
                  required={field.required}
                  value={form[field.name] ?? ""}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [field.name]: event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-border-default bg-bg-base px-3 text-sm outline-none focus:border-brand-sky"
                />
              )}
            </label>
          ))}
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save draft"}
        </Button>
      </form>

      {error ? (
        <p className="text-sm text-brand-magenta" role="alert">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-text-muted">Loading content…</p>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border-default bg-bg-surface p-6 text-sm text-text-muted">
          No items yet. Create a draft to get started.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-3 rounded-xl border border-border-default bg-bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-brand-navy">
                  {primaryLabel(item)}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wide text-text-muted">
                  {item.status}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.status === "draft" ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => void setStatus(item.id, "published")}
                  >
                    Publish
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => void setStatus(item.id, "draft")}
                  >
                    Unpublish
                  </Button>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => void remove(item.id)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
