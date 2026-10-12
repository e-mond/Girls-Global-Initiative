"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import type { ContentEntity, ContentStatus } from "@/features/governance/rbac";
import { readJsonResponse } from "@/lib/safe-json";

type ContentItem = {
  id: string;
  status: ContentStatus;
  [key: string]: unknown;
};

type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "image";
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
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>(
    {},
  );
  const [editingId, setEditingId] = useState<string | null>(null);

  function primaryLabel(item: ContentItem): string {
    return String(
      item.title ?? item.label ?? item.name ?? item.attribution ?? item.id,
    );
  }

  function secondaryLabel(item: ContentItem): string | null {
    const role = item.roleTitle;
    if (typeof role === "string" && role.trim()) return role;
    return null;
  }

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/content/${entity}`);
      const json = await readJsonResponse<{
        data?: { items?: ContentItem[] };
        error?: { message?: string };
      }>(response, "Could not load content.");
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Could not load content.");
      }
      setItems(json.data?.items ?? []);
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

  function startEdit(item: ContentItem) {
    const next: Record<string, string> = {};
    const nextPreviews: Record<string, string> = {};
    for (const field of fields) {
      const value = item[field.name];
      next[field.name] =
        value == null
          ? ""
          : typeof value === "number"
            ? String(value)
            : String(value);
      if (field.type === "image") {
        if (field.name === "photoMediaId") {
          // Resolved preview URL is not stored on the row; clear until re-upload.
          nextPreviews[field.name] = "";
        } else if (typeof value === "string" && value) {
          nextPreviews[field.name] = value;
        }
      }
    }
    setForm(next);
    setImagePreviews(nextPreviews);
    setEditingId(item.id);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({});
    setImagePreviews({});
    setError(null);
  }

  async function uploadImage(fieldName: string, file: File) {
    setUploadingField(fieldName);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append(
        "altText",
        form.title?.trim() ||
          form.name?.trim() ||
          file.name.replace(/\.[^.]+$/, "") ||
          "Uploaded image",
      );
      if (entity === "team_members" || fieldName === "photoMediaId") {
        body.append("folder", "ggi/team");
      } else if (entity === "gallery_items") {
        body.append("folder", "ggi/gallery");
      } else if (entity === "news_posts") {
        body.append("folder", "ggi/news");
      } else if (entity === "events") {
        body.append("folder", "ggi/events");
      }
      const response = await fetch("/api/admin/media", {
        method: "POST",
        body,
      });
      const json = await readJsonResponse<{
        data?: { item?: { id?: string; url?: string } };
        error?: { message?: string };
      }>(response, "Upload failed.");
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Upload failed.");
      }
      const uploadedUrl = String(json.data?.item?.url ?? "");
      const uploadedId = String(json.data?.item?.id ?? "");
      setForm((current) => ({
        ...current,
        [fieldName]:
          fieldName === "photoMediaId" ? uploadedId : uploadedUrl,
      }));
      setImagePreviews((current) => ({
        ...current,
        [fieldName]: uploadedUrl,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploadingField(null);
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload: Record<string, unknown> = editingId
      ? { id: editingId }
      : { ...(createDefaults ?? {}), status: "draft" };

    for (const field of fields) {
      const value = form[field.name] ?? "";
      if (field.type === "image" && field.required && !value) {
        setError(`Please upload an image for ${field.label}.`);
        setSaving(false);
        return;
      }
      if (field.name === "photoMediaId") {
        payload[field.name] = value.trim() ? value.trim() : null;
      } else {
        payload[field.name] =
          field.type === "number" ? Number(value || 0) : value;
      }
    }

    try {
      const response = await fetch(`/api/admin/content/${entity}`, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await readJsonResponse<{ error?: { message?: string } }>(
        response,
        editingId ? "Could not update item." : "Could not create item.",
      );
      if (!response.ok) {
        throw new Error(
          json?.error?.message ??
            (editingId ? "Could not update item." : "Could not create item."),
        );
      }
      setForm({});
      setImagePreviews({});
      setEditingId(null);
      await load();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : editingId
            ? "Could not update item."
            : "Could not create item.",
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
    const json = await readJsonResponse<{ error?: { message?: string } }>(
      response,
      "Could not update status.",
    );
    if (!response.ok) {
      setError(json?.error?.message ?? "Could not update status.");
      return;
    }
    await load();
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this content item? This cannot be undone.")) {
      return;
    }
    setError(null);
    const response = await fetch(
      `/api/admin/content/${entity}?id=${encodeURIComponent(id)}`,
      { method: "DELETE" },
    );
    const json = await readJsonResponse<{ error?: { message?: string } }>(
      response,
      "Could not delete item.",
    );
    if (!response.ok) {
      setError(json?.error?.message ?? "Could not delete item.");
      return;
    }
    if (editingId === id) cancelEdit();
    await load();
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader
        eyebrow="Content"
        title={title}
        description={description}
      />

      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-border-default bg-bg-surface p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-brand-navy">
            {editingId ? "Edit item" : "Create draft"}
          </p>
          {editingId ? (
            <Button type="button" size="sm" variant="ghost" onClick={cancelEdit}>
              Cancel edit
            </Button>
          ) : null}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <label
              key={field.name}
              className={`space-y-1 text-sm ${
                field.type === "image" || field.type === "textarea"
                  ? "sm:col-span-2"
                  : ""
              }`}
            >
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
              ) : field.type === "image" ? (
                <div className="space-y-3 rounded-xl border border-border-default bg-bg-base p-3">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    required={field.required && !form[field.name]}
                    disabled={uploadingField === field.name || saving}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void uploadImage(field.name, file);
                    }}
                    className="block w-full text-sm text-text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-brand-sky/15 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand-navy"
                  />
                  {uploadingField === field.name ? (
                    <p className="text-xs text-text-muted">Uploading…</p>
                  ) : null}
                  {form[field.name] || imagePreviews[field.name] ? (
                    <div className="flex flex-wrap items-center gap-3">
                      {imagePreviews[field.name] ||
                      (field.name !== "photoMediaId" && form[field.name]) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={
                            imagePreviews[field.name] || form[field.name]
                          }
                          alt="Upload preview"
                          className="h-20 w-20 rounded-lg object-cover"
                        />
                      ) : null}
                      <p className="text-xs text-text-muted break-all">
                        Image ready
                      </p>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setForm((current) => ({
                            ...current,
                            [field.name]: "",
                          }));
                          setImagePreviews((current) => ({
                            ...current,
                            [field.name]: "",
                          }));
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <p className="text-xs text-text-muted">
                      Choose an image file (JPEG, PNG, WebP or GIF, max 5MB).
                    </p>
                  )}
                </div>
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
        <Button type="submit" disabled={saving || Boolean(uploadingField)}>
          {saving
            ? "Saving…"
            : editingId
              ? "Save changes"
              : "Save draft"}
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
              <div className="flex min-w-0 items-start gap-3">
                {typeof item.imageUrl === "string" && item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-lg object-cover"
                  />
                ) : null}
                <div className="min-w-0">
                  <p className="font-medium text-brand-navy">
                    {primaryLabel(item)}
                    {editingId === item.id ? (
                      <span className="ml-2 text-xs font-semibold text-brand-magenta">
                        Editing
                      </span>
                    ) : null}
                  </p>
                  {secondaryLabel(item) ? (
                    <p className="mt-0.5 text-sm text-text-muted">
                      {secondaryLabel(item)}
                    </p>
                  ) : null}
                  <p className="mt-1 text-xs uppercase tracking-wide text-text-muted">
                    {item.status}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => startEdit(item)}
                >
                  Edit
                </Button>
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
