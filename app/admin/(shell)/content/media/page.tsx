"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useState } from "react";
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
  const [altText, setAltText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

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

  async function onUpload(event: FormEvent) {
    event.preventDefault();
    if (!file) {
      setError("Please choose an image to upload.");
      return;
    }
    setSaving(true);
    setError(null);
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
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    const response = await fetch(
      `/api/admin/media?id=${encodeURIComponent(id)}`,
      { method: "DELETE" },
    );
    const json = await response.json();
    if (!response.ok) {
      setError(json?.error?.message ?? "Could not delete media.");
      return;
    }
    await load();
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-brand-navy">
          Media library
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          Upload images for team, gallery and advocacy content. Alt text is
          required. Binaries are stored outside the web root.
        </p>
      </div>

      <form
        onSubmit={onUpload}
        className="space-y-4 rounded-xl border border-border-default bg-bg-surface p-5"
      >
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
          {saving ? "Uploading…" : "Upload"}
        </Button>
      </form>

      {error ? (
        <p className="text-sm text-brand-magenta" role="alert">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-text-muted">Loading media…</p>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border-default bg-bg-surface p-6 text-sm text-text-muted">
          No media yet. Upload an image with alt text to get started.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="overflow-hidden rounded-xl border border-border-default bg-bg-surface"
            >
              <div className="relative aspect-video bg-bg-base">
                <Image
                  src={item.url}
                  alt={item.altText}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="space-y-2 p-4">
                <p className="truncate text-sm font-medium text-brand-navy">
                  {item.filename}
                </p>
                <p className="text-xs text-text-muted">{item.altText}</p>
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
