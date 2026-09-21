"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";

type MediaItem = {
  id: string;
  filename: string;
  altText: string;
  url: string;
  mimeType: string;
  byteSize: number;
};

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [altText, setAltText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/media");
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Could not load media.");
      }
      setItems(json.data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load media.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter(
      (item) =>
        item.filename.toLowerCase().includes(needle) ||
        item.altText.toLowerCase().includes(needle),
    );
  }, [items, q]);

  async function onUpload(event: FormEvent) {
    event.preventDefault();
    if (!file) {
      setError("Please choose an image to upload.");
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);
    const body = new FormData();
    body.append("file", file);
    body.append("altText", altText);
    try {
      const response = await fetch("/api/admin/media", {
        method: "POST",
        body,
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Upload failed.");
      }
      setFile(null);
      setAltText("");
      setSuccess("Media uploaded successfully.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this media asset? This cannot be undone.")) {
      return;
    }
    setError(null);
    setSuccess(null);
    const response = await fetch(
      `/api/admin/media?id=${encodeURIComponent(id)}`,
      { method: "DELETE" },
    );
    const json = await response.json();
    if (!response.ok) {
      setError(json?.error?.message ?? "Could not delete media.");
      return;
    }
    setSuccess("Media deleted.");
    await load();
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader
        eyebrow="Manage"
        title="Media"
        description="Upload and manage images used across team, gallery and advocacy content. Alt text is required."
      />

      <form
        onSubmit={onUpload}
        className="space-y-4 rounded-2xl border border-border-default bg-bg-surface p-5"
      >
        <p className="text-sm font-semibold text-brand-navy">Upload media</p>
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-brand-navy">Image file</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="block w-full text-sm"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-brand-navy">Alt text</span>
          <input
            required
            value={altText}
            onChange={(event) => setAltText(event.target.value)}
            className="h-11 w-full rounded-xl border border-border-default bg-bg-base px-3 text-sm outline-none focus:border-brand-sky"
          />
        </label>
        <Button type="submit" disabled={saving}>
          {saving ? "Uploading…" : "Upload media"}
        </Button>
      </form>

      <div>
        <label className="sr-only" htmlFor="media-search">
          Search media
        </label>
        <input
          id="media-search"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Search by filename or alt text"
          className="h-11 w-full rounded-xl border border-border-default bg-bg-surface px-3 text-sm outline-none focus:border-brand-sky"
        />
      </div>

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

      {loading ? (
        <p className="text-sm text-text-muted">Loading media…</p>
      ) : filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border-default bg-bg-surface p-8 text-sm text-text-muted">
          {items.length === 0
            ? "No media yet. Upload an image with alt text to get started."
            : "No media matches your search."}
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <li
              key={item.id}
              className="overflow-hidden rounded-2xl border border-border-default bg-bg-surface"
            >
              <div className="relative aspect-video bg-bg-base">
                <Image
                  src={item.url}
                  alt={item.altText}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="space-y-2 p-4">
                <p className="truncate text-sm font-medium text-brand-navy">
                  {item.filename}
                </p>
                <p className="line-clamp-2 text-xs text-text-muted">
                  {item.altText}
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
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
