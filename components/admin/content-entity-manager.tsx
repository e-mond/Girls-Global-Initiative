"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MarkdownToolbar } from "@/components/admin/markdown-toolbar";
import { CmsMarkdown } from "@/components/content/cms-markdown";
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
  type?: "text" | "textarea" | "number" | "image" | "select" | "boolean";
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  description?: string;
  /** Enable Markdown formatting toolbar (body fields). */
  markdown?: boolean;
};

type StatusAction = {
  status: ContentStatus;
  label: string;
};

export function ContentEntityManager({
  entity,
  title,
  description,
  fields,
  createDefaults,
  filterItems,
  statusActions,
  createLabel = "Create draft",
  emptyMessage,
}: {
  entity: ContentEntity;
  title: string;
  description: string;
  fields: FieldDef[];
  createDefaults?: Record<string, unknown>;
  /** Optional client filter (e.g. news vs programme reports). */
  filterItems?: (item: ContentItem) => boolean;
  statusActions?: StatusAction[];
  /** Label for the create form heading / submit affordance. */
  createLabel?: string;
  /** Empty-state copy when no CMS rows exist. */
  emptyMessage?: string;
}) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>(
    {},
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<ContentItem | null>(null);
  const [previewingForm, setPreviewingForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const markdownRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

  const actions: StatusAction[] = statusActions ?? [
    { status: "draft", label: "Unpublish" },
    { status: "published", label: "Publish" },
  ];

  function primaryLabel(item: ContentItem): string {
    return String(
      item.title ?? item.label ?? item.name ?? item.attribution ?? item.id,
    );
  }

  function secondaryLabel(item: ContentItem): string | null {
    const role = item.roleTitle;
    if (typeof role === "string" && role.trim()) return role;
    const programme = item.programmeStatus;
    if (typeof programme === "string" && programme.trim()) {
      return `Programme: ${programme}`;
    }
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
      const loaded = json.data?.items ?? [];
      setItems(filterItems ? loaded.filter(filterItems) : loaded);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load content.",
      );
    } finally {
      setLoading(false);
    }
  }, [entity, filterItems]);

  useEffect(() => {
    void load();
  }, [load]);

  const visibleItems = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return items.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (!needle) return true;
      const haystack = [
        primaryLabel(item),
        String(item.slug ?? ""),
        String(item.summary ?? ""),
        String(item.programmeStatus ?? ""),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [items, search, statusFilter]);

  function startEdit(item: ContentItem) {
    const next: Record<string, string> = {};
    const nextPreviews: Record<string, string> = {};
    for (const field of fields) {
      const value = item[field.name];
      if (field.type === "boolean") {
        next[field.name] = value === true || value === "true" ? "true" : "false";
      } else {
        next[field.name] =
          value == null
            ? ""
            : typeof value === "number"
              ? String(value)
              : typeof value === "string"
                ? value
                : String(value);
      }
      if (field.type === "image") {
        if (field.name === "photoMediaId") {
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
    setSuccess(null);
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
    setSuccess(null);

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
      } else if (field.name === "publishedAt") {
        payload[field.name] = value.trim() ? value.trim() : null;
      } else if (
        field.name === "revisedStartsOn" ||
        field.name === "statusNote" ||
        field.name === "timezone"
      ) {
        payload[field.name] = value.trim() ? value.trim() : null;
      } else if (field.type === "boolean") {
        payload[field.name] = value === "true";
      } else {
        payload[field.name] =
          field.type === "number" ? Number(value || 0) : value;
      }
    }

    if (
      entity === "events" &&
      payload.programmeStatus === "cancelled" &&
      !window.confirm(
        "Mark this event as cancelled? It will stay in the archive with a clear cancelled label.",
      )
    ) {
      setSaving(false);
      return;
    }
    if (
      entity === "events" &&
      payload.programmeStatus === "postponed" &&
      !window.confirm(
        "Mark this event as postponed? Add a revised date and public note when available.",
      )
    ) {
      setSaving(false);
      return;
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
      setSuccess(
        editingId
          ? "Saved. Use Publish if you want the public site to show these changes."
          : "Draft created. Use Publish on the card below when it is ready for the public site.",
      );
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
    setSuccess(null);
    if (
      status === "archived" &&
      !window.confirm("Archive this item? It will move to the public archive.")
    ) {
      return;
    }
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
    setPreviewItem(null);
    setSuccess(
      status === "published"
        ? "Published — visible on the public site."
        : status === "draft"
          ? "Unpublished — hidden from the public site."
          : `Status updated to ${status}.`,
    );
    await load();
  }

  function previewLabel(source: Record<string, unknown>): string {
    return String(
      source.title ?? source.label ?? source.name ?? source.attribution ?? "Untitled",
    );
  }

  async function remove(id: string) {
    if (
      !window.confirm(
        "Remove this person/item from the CMS? This cannot be undone. Published pages will stop showing them.",
      )
    ) {
      return;
    }
    setError(null);
    setSuccess(null);
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
    setSuccess("Removed.");
    await load();
  }

  function statusBadgeClass(status: string): string {
    switch (status) {
      case "published":
        return "bg-state-success/15 text-state-success";
      case "scheduled":
        return "bg-brand-sky/15 text-brand-sky";
      case "archived":
        return "bg-brand-navy/10 text-brand-navy";
      default:
        return "bg-state-warning/15 text-state-warning";
    }
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
            {editingId ? "Edit item" : createLabel}
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
              {field.description ? (
                <span className="block text-xs text-text-muted">
                  {field.description}
                </span>
              ) : null}
              {field.type === "boolean" ? (
                <select
                  required={field.required}
                  value={form[field.name] ?? "false"}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [field.name]: event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-border-default bg-bg-base px-3 text-sm outline-none focus:border-brand-sky"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              ) : field.type === "textarea" ? (
                <div>
                  {field.markdown ? (
                    <MarkdownToolbar
                      value={form[field.name] ?? ""}
                      onChange={(next) =>
                        setForm((current) => ({
                          ...current,
                          [field.name]: next,
                        }))
                      }
                      textareaRef={{
                        get current() {
                          return markdownRefs.current[field.name] ?? null;
                        },
                      }}
                    />
                  ) : null}
                  <textarea
                    ref={(el) => {
                      markdownRefs.current[field.name] = el;
                    }}
                    required={field.required}
                    value={form[field.name] ?? ""}
                    placeholder={field.placeholder}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        [field.name]: event.target.value,
                      }))
                    }
                    className={`min-h-24 w-full border border-border-default bg-bg-base px-3 py-2 text-sm outline-none focus:border-brand-sky ${
                      field.markdown
                        ? "rounded-b-xl rounded-t-none font-mono text-xs leading-relaxed"
                        : "rounded-xl"
                    }`}
                  />
                </div>
              ) : field.type === "select" ? (
                <select
                  required={field.required}
                  value={form[field.name] ?? field.options?.[0]?.value ?? ""}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [field.name]: event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-border-default bg-bg-base px-3 text-sm outline-none focus:border-brand-sky"
                >
                  {(field.options ?? []).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
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
                          className="h-20 w-20 rounded-lg object-contain bg-bg-base"
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
                  placeholder={field.placeholder}
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
        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={saving || Boolean(uploadingField)}>
            {saving
              ? "Saving…"
              : editingId
                ? "Save changes"
                : "Save draft"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={saving || Boolean(uploadingField)}
            onClick={() => setPreviewingForm(true)}
          >
            Preview draft
          </Button>
        </div>
      </form>

      {previewingForm ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Draft preview"
          className="fixed inset-0 z-50 flex items-end justify-center bg-brand-navy/50 p-4 sm:items-center"
        >
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-bg-surface p-5 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-wide text-brand-magenta">
              Preview before publishing
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-brand-navy">
              {previewLabel(form)}
            </h2>
            {imagePreviews.imageUrl || form.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagePreviews.imageUrl || form.imageUrl}
                alt=""
                className="mt-4 max-h-56 w-full rounded-xl object-contain bg-bg-base"
              />
            ) : null}
            {form.summary ? (
              <p className="mt-3 text-sm text-text-muted">{form.summary}</p>
            ) : null}
            {form.body?.trim() ? (
              <div className="mt-4 text-sm text-brand-navy">
                <CmsMarkdown body={form.body} />
              </div>
            ) : null}
            <dl className="mt-4 space-y-3 text-sm">
              {fields.map((field) => {
                const value = form[field.name]?.trim();
                if (
                  !value ||
                  field.type === "image" ||
                  field.name === "summary" ||
                  field.name === "body" ||
                  field.name === "title" ||
                  field.name === "name"
                ) {
                  return null;
                }
                return (
                  <div key={field.name}>
                    <dt className="font-semibold text-brand-navy">
                      {field.label}
                    </dt>
                    <dd className="mt-1 whitespace-pre-wrap text-text-muted">
                      {value}
                    </dd>
                  </div>
                );
              })}
            </dl>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button type="button" onClick={() => setPreviewingForm(false)}>
                Close preview
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {previewItem ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Publish preview"
          className="fixed inset-0 z-50 flex items-end justify-center bg-brand-navy/50 p-4 sm:items-center"
        >
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-bg-surface p-5 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-wide text-brand-magenta">
              Review before publish
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-brand-navy">
              {previewLabel(previewItem)}
            </h2>
            {typeof previewItem.imageUrl === "string" && previewItem.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewItem.imageUrl}
                alt=""
                className="mt-4 max-h-56 w-full rounded-xl object-contain bg-bg-base"
              />
            ) : null}
            <dl className="mt-4 space-y-3 text-sm">
              {fields.map((field) => {
                const value = previewItem[field.name];
                if (value == null || value === "" || field.type === "image") {
                  return null;
                }
                return (
                  <div key={field.name}>
                    <dt className="font-semibold text-brand-navy">
                      {field.label}
                    </dt>
                    <dd className="mt-1 whitespace-pre-wrap text-text-muted">
                      {String(value)}
                    </dd>
                  </div>
                );
              })}
            </dl>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={() => void setStatus(previewItem.id, "published")}
              >
                Confirm publish
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setPreviewItem(null)}
              >
                Keep as draft
              </Button>
            </div>
          </div>
        </div>
      ) : null}

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

      <div className="flex flex-col gap-3 rounded-2xl border border-border-default bg-bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name, title, slug…"
          className="h-10 w-full rounded-xl border border-border-default bg-bg-base px-3 text-sm outline-none focus:border-brand-sky sm:max-w-xs"
          aria-label="Search content"
        />
        <div className="flex flex-wrap gap-2">
          {["all", "draft", "scheduled", "published", "archived"].map(
            (value) => (
              <button
                key={value}
                type="button"
                onClick={() => setStatusFilter(value)}
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                  statusFilter === value
                    ? "bg-brand-navy text-text-on-inverse"
                    : "bg-bg-base text-text-muted"
                }`}
              >
                {value}
              </button>
            ),
          )}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-text-muted">Loading content…</p>
      ) : visibleItems.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border-default bg-bg-surface p-6 text-sm text-text-muted">
          {items.length === 0
            ? emptyMessage ??
              "No items yet. Use the form above to add one, then Publish when ready."
            : "No items match this filter."}
        </p>
      ) : (
        <ul className="space-y-3">
          {visibleItems.map((item) => (
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
                    className="h-12 w-12 shrink-0 rounded-lg object-contain bg-bg-base"
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
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={`rounded-full px-2 py-0.5 font-bold uppercase tracking-wide ${statusBadgeClass(item.status)}`}
                    >
                      {item.status}
                    </span>
                    {typeof item.publishedOn === "string" && item.publishedOn ? (
                      <span className="text-text-muted">{item.publishedOn}</span>
                    ) : null}
                    {typeof item.startsOn === "string" && item.startsOn ? (
                      <span className="text-text-muted">{item.startsOn}</span>
                    ) : null}
                  </div>
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
                {item.status === "draft" || item.status === "scheduled" ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => setPreviewItem(item)}
                  >
                    Preview & publish
                  </Button>
                ) : null}
                {actions
                  .filter((action) => action.status !== item.status)
                  .map((action) => (
                    <Button
                      key={action.status}
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => void setStatus(item.id, action.status)}
                    >
                      {action.label}
                    </Button>
                  ))}
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => void remove(item.id)}
                >
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
