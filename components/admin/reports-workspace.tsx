"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { readJsonResponse } from "@/lib/safe-json";

type ReportItem = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  publishedOn?: string | null;
  attachmentUrl?: string | null;
  extractionStatus?: string | null;
  extractionNotes?: string | null;
  status: string;
  imageUrl?: string | null;
};

export function ReportsWorkspace() {
  const [items, setItems] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sourceUrl, setSourceUrl] = useState(
    "/reports/breast-cancer-awareness-2026.pdf",
  );
  const [extracting, setExtracting] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    summary: "",
    body: "",
    publishedOn: "",
    attachmentUrl: "",
  });
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/content/news_posts");
      const json = await readJsonResponse<{
        data?: { items?: ReportItem[] };
        error?: { message?: string };
      }>(response, "Could not load reports.");
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Could not load reports.");
      }
      const reports = (json.data?.items ?? []).filter(
        (item) => String((item as { kind?: string }).kind ?? "") === "report",
      );
      setItems(reports);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load reports.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function selectItem(item: ReportItem) {
    setSelectedId(item.id);
    setForm({
      title: item.title ?? "",
      slug: item.slug ?? "",
      summary: item.summary ?? "",
      body: item.body ?? "",
      publishedOn: item.publishedOn ?? "",
      attachmentUrl: item.attachmentUrl ?? "",
    });
    setSourceUrl(item.attachmentUrl || sourceUrl);
    setError(null);
  }

  async function runExtract(event: FormEvent) {
    event.preventDefault();
    setExtracting(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/reports/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceUrl,
          id: selectedId ?? undefined,
          slug: form.slug || undefined,
        }),
      });
      const json = await readJsonResponse<{
        data?: { item?: ReportItem; pageCount?: number };
        error?: { message?: string };
      }>(response, "Extraction failed.");
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Extraction failed.");
      }
      const item = json.data?.item;
      if (item) {
        selectItem(item);
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Extraction failed.");
    } finally {
      setExtracting(false);
    }
  }

  async function saveDraft() {
    if (!selectedId) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/content/news_posts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedId,
          kind: "report",
          title: form.title,
          slug: form.slug,
          summary: form.summary,
          body: form.body,
          publishedOn: form.publishedOn,
          attachmentUrl: form.attachmentUrl || sourceUrl,
          status: "draft",
        }),
      });
      const json = await readJsonResponse<{ error?: { message?: string } }>(
        response,
        "Could not save draft.",
      );
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Could not save draft.");
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save draft.");
    } finally {
      setBusy(false);
    }
  }

  async function approve(publish: boolean) {
    if (!selectedId) return;
    setBusy(true);
    setError(null);
    try {
      const saveResponse = await fetch("/api/admin/content/news_posts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedId,
          kind: "report",
          title: form.title,
          slug: form.slug,
          summary: form.summary,
          body: form.body,
          publishedOn: form.publishedOn,
          attachmentUrl: form.attachmentUrl || sourceUrl,
          status: "draft",
        }),
      });
      const saveJson = await readJsonResponse<{ error?: { message?: string } }>(
        saveResponse,
        "Could not save draft.",
      );
      if (!saveResponse.ok) {
        throw new Error(saveJson?.error?.message ?? "Could not save draft.");
      }

      const response = await fetch("/api/admin/reports/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedId, publish }),
      });
      const json = await readJsonResponse<{ error?: { message?: string } }>(
        response,
        "Could not approve report.",
      );
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Could not approve report.");
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not approve report.");
    } finally {
      setBusy(false);
    }
  }

  const selected = items.find((item) => item.id === selectedId) ?? null;

  return (
    <section className="space-y-6">
      <AdminPageHeader
        eyebrow="Content"
        title="Reports"
        description="Upload or link a source PDF, extract every page into a GGI-branded draft, review carefully, then approve before publishing. The original PDF stays available as the source record."
      />

      <form
        onSubmit={runExtract}
        className="space-y-3 rounded-2xl border border-border-default bg-bg-surface p-5"
      >
        <p className="text-sm font-semibold text-brand-navy">
          1. Extract from source PDF
        </p>
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-brand-navy">
            Source PDF URL or public path
          </span>
          <input
            value={sourceUrl}
            onChange={(event) => setSourceUrl(event.target.value)}
            className="h-11 w-full rounded-xl border border-border-default bg-bg-base px-3 text-sm outline-none focus:border-brand-sky"
            placeholder="/reports/breast-cancer-awareness-2026.pdf"
            required
          />
        </label>
        <p className="text-xs text-text-muted">
          Processes the full PDF text layer. Scanned PDFs without text are
          flagged for OCR/manual entry — they are never published automatically.
        </p>
        <Button type="submit" disabled={extracting || busy}>
          {extracting
            ? "Extracting…"
            : selectedId
              ? "Re-extract into selected draft"
              : "Extract new draft"}
        </Button>
      </form>

      {error ? (
        <p className="text-sm text-brand-magenta" role="alert">
          {error}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-border-default bg-bg-surface p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-magenta">
            Drafts & published
          </p>
          {loading ? (
            <p className="mt-3 text-sm text-text-muted">Loading…</p>
          ) : items.length === 0 ? (
            <p className="mt-3 text-sm text-text-muted">
              No reports yet. Extract a PDF to begin.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => selectItem(item)}
                    className={`w-full rounded-xl px-3 py-2 text-left text-sm ${
                      selectedId === item.id
                        ? "bg-brand-navy text-text-on-inverse"
                        : "hover:bg-bg-base"
                    }`}
                  >
                    <span className="block font-semibold">{item.title}</span>
                    <span className="mt-1 block text-xs opacity-80">
                      {item.status} · {item.extractionStatus ?? "none"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-4 rounded-2xl border border-border-default bg-bg-surface p-5">
          <p className="text-sm font-semibold text-brand-navy">
            2. Review & correct extracted content
          </p>
          {!selected ? (
            <p className="text-sm text-text-muted">
              Select a report draft or extract a PDF to review.
            </p>
          ) : (
            <>
              {selected.extractionNotes ? (
                <div className="rounded-xl border border-brand-magenta/30 bg-brand-magenta/5 p-3 text-sm text-brand-navy">
                  <p className="font-semibold">Review flags</p>
                  <p className="mt-1 text-text-muted">
                    {selected.extractionNotes}
                  </p>
                </div>
              ) : null}

              <div className="grid gap-3">
                {(
                  [
                    ["title", "Title"],
                    ["slug", "Slug"],
                    ["publishedOn", "Display date"],
                    ["attachmentUrl", "Source PDF URL"],
                  ] as const
                ).map(([name, label]) => (
                  <label key={name} className="space-y-1 text-sm">
                    <span className="font-medium text-brand-navy">{label}</span>
                    <input
                      value={form[name]}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          [name]: event.target.value,
                        }))
                      }
                      className="h-11 w-full rounded-xl border border-border-default bg-bg-base px-3 text-sm outline-none focus:border-brand-sky"
                    />
                  </label>
                ))}
                <label className="space-y-1 text-sm">
                  <span className="font-medium text-brand-navy">Summary</span>
                  <textarea
                    value={form.summary}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        summary: event.target.value,
                      }))
                    }
                    className="min-h-24 w-full rounded-xl border border-border-default bg-bg-base px-3 py-2 text-sm outline-none focus:border-brand-sky"
                  />
                </label>
                <label className="space-y-1 text-sm">
                  <span className="font-medium text-brand-navy">
                    Full report body (## headings)
                  </span>
                  <textarea
                    value={form.body}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        body: event.target.value,
                      }))
                    }
                    className="min-h-72 w-full rounded-xl border border-border-default bg-bg-base px-3 py-2 font-mono text-xs leading-relaxed outline-none focus:border-brand-sky"
                  />
                </label>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="button" disabled={busy} onClick={() => void saveDraft()}>
                  Save corrections
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={busy}
                  onClick={() => void approve(false)}
                >
                  Approve extraction
                </Button>
                <Button
                  type="button"
                  disabled={busy}
                  onClick={() => void approve(true)}
                >
                  Approve & publish
                </Button>
                <Link
                  href={`/reports/${form.slug}`}
                  target="_blank"
                  className="inline-flex h-11 items-center rounded-xl border border-border-default px-4 text-sm font-semibold text-brand-navy hover:border-brand-sky"
                >
                  Preview online
                </Link>
              </div>
              <p className="text-xs text-text-muted">
                Publishing is blocked until extraction is approved. The branded
                downloadable PDF is generated from this reviewed body — not from
                the original PDF layout.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
