"use client";

import { FormEvent, useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { readJsonResponse } from "@/lib/safe-json";

type RecordPayload = {
  email: string;
  donations: Array<{
    id: string;
    reference: string;
    status: string;
    amountMinor: number;
    currency: string;
    createdAt: string;
    isAnonymous: boolean;
  }>;
  submissions: Array<{
    id: string;
    kind: string;
    status: string;
    summary: string;
    createdAt: string;
  }>;
  subscribers: Array<{
    id: string;
    status: string;
    createdAt: string;
    confirmedAt: string | null;
    unsubscribedAt: string | null;
  }>;
};

function formatMoney(amountMinor: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: currency || "GHS",
    }).format(amountMinor / 100);
  } catch {
    return `${(amountMinor / 100).toFixed(2)} ${currency}`;
  }
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function kindLabel(kind: string) {
  switch (kind) {
    case "volunteer":
      return "Volunteer application";
    case "partnership":
      return "Partnership request";
    case "contact":
      return "Contact message";
    default:
      return kind;
  }
}

function statusLabel(status: string) {
  return status.replace(/_/g, " ");
}

export default function AdminPrivacyClient() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [erasing, setErasing] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [record, setRecord] = useState<RecordPayload | null>(null);

  async function onLookup(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setRecord(null);
    try {
      const response = await fetch(
        `/api/admin/privacy/data-subject?email=${encodeURIComponent(email.trim())}`,
      );
      const json = await readJsonResponse<{
        data?: { record?: RecordPayload };
        error?: { message?: string };
      }>(response, "Could not look up this email.");
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Could not look up this email.");
      }
      setRecord(json.data?.record ?? null);
      if (
        json.data?.record &&
        json.data.record.donations.length === 0 &&
        json.data.record.submissions.length === 0 &&
        json.data.record.subscribers.length === 0
      ) {
        setSuccess(
          "No personal records were found for that email in donations, form submissions or the newsletter list.",
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed.");
    } finally {
      setLoading(false);
    }
  }

  async function onErase() {
    if (
      !window.confirm(
        `Remove personal details for ${email.trim()}?\n\n• Donation amounts are kept for accounts, but the person's name and email are cleared.\n• Form messages and newsletter sign-ups for this email are deleted.\n\nThis cannot be undone.`,
      )
    ) {
      return;
    }
    setErasing(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch("/api/admin/privacy/data-subject", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), confirm: true }),
      });
      const json = await readJsonResponse<{
        data?: {
          result?: {
            donationsAnonymised: number;
            submissionsDeleted: number;
            subscribersDeleted: number;
          };
        };
        error?: { message?: string };
      }>(response, "Could not erase records.");
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Could not erase records.");
      }
      const result = json.data?.result;
      setSuccess(
        `Personal details cleared. Donations anonymised: ${result?.donationsAnonymised ?? 0}. Form messages removed: ${result?.submissionsDeleted ?? 0}. Newsletter records removed: ${result?.subscribersDeleted ?? 0}.`,
      );
      setRecord(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erase failed.");
    } finally {
      setErasing(false);
    }
  }

  async function downloadPdf() {
    if (!record) return;
    setPdfBusy(true);
    setError(null);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 48;
      const maxWidth = pageWidth - margin * 2;
      let y = 0;

      const navy: [number, number, number] = [4, 27, 75];
      const magenta: [number, number, number] = [224, 2, 134];
      const sky: [number, number, number] = [0, 176, 242];
      const cream: [number, number, number] = [253, 246, 236];

      const ensureSpace = (needed: number) => {
        if (y + needed > pageHeight - 56) {
          doc.addPage();
          doc.setFillColor(...cream);
          doc.rect(0, 0, pageWidth, pageHeight, "F");
          y = margin;
        }
      };

      const writeWrapped = (
        text: string,
        size: number,
        style: "normal" | "bold" = "normal",
        color: [number, number, number] = navy,
      ) => {
        doc.setFont("helvetica", style);
        doc.setFontSize(size);
        doc.setTextColor(...color);
        const lines = doc.splitTextToSize(text, maxWidth) as string[];
        for (const line of lines) {
          ensureSpace(size + 8);
          doc.text(line, margin, y);
          y += size + 6;
        }
      };

      // Cover strip
      doc.setFillColor(...navy);
      doc.rect(0, 0, pageWidth, 110, "F");
      doc.setFillColor(...magenta);
      doc.rect(0, 0, 12, 110, "F");
      doc.setFillColor(...sky);
      doc.rect(12, 0, 5, 110, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("GIRLS GLOBAL INITIATIVE", margin, 42);
      doc.setFontSize(20);
      doc.text("Personal data summary", margin, 70);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Prepared for privacy request · ${formatDate(new Date().toISOString())}`, margin, 92);

      doc.setFillColor(...cream);
      doc.rect(0, 110, pageWidth, pageHeight - 110, "F");
      y = 140;

      writeWrapped(`Email looked up: ${record.email}`, 12, "bold");
      y += 8;
      writeWrapped(
        "This summary shows what Girls Global Initiative holds for this email across donations, form messages and the newsletter list. Share it only with the person who asked, or with authorised staff handling their request.",
        10,
        "normal",
        [70, 70, 90],
      );
      y += 12;

      writeWrapped(
        `Donations (${record.donations.length})`,
        13,
        "bold",
        magenta,
      );
      if (record.donations.length === 0) {
        writeWrapped("No donation records found for this email.", 10);
      } else {
        for (const item of record.donations) {
          writeWrapped(
            `${formatDate(item.createdAt)} · ${formatMoney(item.amountMinor, item.currency)} · ${statusLabel(item.status)} · Ref ${item.reference}${item.isAnonymous ? " · marked anonymous" : ""}`,
            10,
          );
        }
      }
      y += 10;

      writeWrapped(
        `Form messages (${record.submissions.length})`,
        13,
        "bold",
        magenta,
      );
      if (record.submissions.length === 0) {
        writeWrapped("No form submissions found for this email.", 10);
      } else {
        for (const item of record.submissions) {
          writeWrapped(
            `${formatDate(item.createdAt)} · ${kindLabel(item.kind)} · ${statusLabel(item.status)} · ${item.summary || "No summary"}`,
            10,
          );
        }
      }
      y += 10;

      writeWrapped(
        `Newsletter (${record.subscribers.length})`,
        13,
        "bold",
        magenta,
      );
      if (record.subscribers.length === 0) {
        writeWrapped("No newsletter sign-up found for this email.", 10);
      } else {
        for (const item of record.subscribers) {
          writeWrapped(
            `Status: ${statusLabel(item.status)} · Signed up ${formatDate(item.createdAt)} · Confirmed ${formatDate(item.confirmedAt)} · Unsubscribed ${formatDate(item.unsubscribedAt)}`,
            10,
          );
        }
      }

      y += 16;
      writeWrapped(
        "Girls Global Initiative · girlsglobalinitiative.org · Confidential when it includes personal details",
        9,
        "normal",
        [90, 90, 110],
      );

      const safeEmail = record.email.replace(/[^a-z0-9@._-]/gi, "_");
      doc.save(`ggi-privacy-summary-${safeEmail}.pdf`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not create the PDF. Try again.",
      );
    } finally {
      setPdfBusy(false);
    }
  }

  const hasHits =
    !!record &&
    (record.donations.length > 0 ||
      record.submissions.length > 0 ||
      record.subscribers.length > 0);

  return (
    <section className="space-y-6">
      <AdminPageHeader
        eyebrow="Administration"
        title="Privacy look-up"
        description="When someone asks what information we hold about them — or asks us to remove it — look up their email here. Results are written in plain language for staff who are not technical specialists."
      />

      <div className="rounded-2xl border border-border-default bg-bg-surface p-5">
        <h2 className="font-display text-lg font-bold text-brand-navy">
          How this works
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-text-muted">
          <li>Enter the email address the person used with GGI.</li>
          <li>
            Review donations, form messages and newsletter sign-ups linked to
            that email.
          </li>
          <li>
            Download a branded PDF summary to share securely, or erase personal
            details when the request is confirmed.
          </li>
        </ol>
      </div>

      <form
        onSubmit={onLookup}
        className="flex flex-col gap-3 rounded-2xl border border-border-default bg-bg-surface p-5 sm:flex-row sm:items-end"
      >
        <label className="flex-1 space-y-1 text-sm">
          <span className="font-medium text-brand-navy">Email to look up</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="person@example.com"
            className="h-11 w-full rounded-xl border border-border-default bg-bg-base px-3 text-sm outline-none focus:border-brand-sky"
          />
        </label>
        <Button type="submit" disabled={loading}>
          {loading ? "Searching…" : "Search records"}
        </Button>
      </form>

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

      {record ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border-default bg-bg-surface p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-brand-magenta">
              Search result
            </p>
            <h2 className="mt-1 font-display text-xl font-bold text-brand-navy">
              {record.email}
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              {hasHits
                ? "Here is what we found. Amounts on donations stay for financial records even after an erase; names and emails on those donations are cleared."
                : "Nothing personal was found for this email in the areas we check."}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-bg-base p-4">
                <p className="text-2xl font-bold text-brand-navy">
                  {record.donations.length}
                </p>
                <p className="text-sm text-text-muted">Donations</p>
              </div>
              <div className="rounded-xl bg-bg-base p-4">
                <p className="text-2xl font-bold text-brand-navy">
                  {record.submissions.length}
                </p>
                <p className="text-sm text-text-muted">Form messages</p>
              </div>
              <div className="rounded-xl bg-bg-base p-4">
                <p className="text-2xl font-bold text-brand-navy">
                  {record.subscribers.length}
                </p>
                <p className="text-sm text-text-muted">Newsletter</p>
              </div>
            </div>
          </div>

          {record.donations.length > 0 ? (
            <section className="rounded-2xl border border-border-default bg-bg-surface p-5">
              <h3 className="font-display text-lg font-bold text-brand-navy">
                Donations
              </h3>
              <ul className="mt-3 space-y-2">
                {record.donations.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-xl border border-border-default bg-bg-base px-4 py-3 text-sm"
                  >
                    <p className="font-medium text-brand-navy">
                      {formatMoney(item.amountMinor, item.currency)} ·{" "}
                      {statusLabel(item.status)}
                    </p>
                    <p className="text-text-muted">
                      {formatDate(item.createdAt)} · Reference {item.reference}
                      {item.isAnonymous ? " · Marked anonymous" : ""}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {record.submissions.length > 0 ? (
            <section className="rounded-2xl border border-border-default bg-bg-surface p-5">
              <h3 className="font-display text-lg font-bold text-brand-navy">
                Form messages
              </h3>
              <ul className="mt-3 space-y-2">
                {record.submissions.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-xl border border-border-default bg-bg-base px-4 py-3 text-sm"
                  >
                    <p className="font-medium text-brand-navy">
                      {kindLabel(item.kind)} · {statusLabel(item.status)}
                    </p>
                    <p className="text-text-muted">
                      {formatDate(item.createdAt)} · {item.summary || "No summary"}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {record.subscribers.length > 0 ? (
            <section className="rounded-2xl border border-border-default bg-bg-surface p-5">
              <h3 className="font-display text-lg font-bold text-brand-navy">
                Newsletter
              </h3>
              <ul className="mt-3 space-y-2">
                {record.subscribers.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-xl border border-border-default bg-bg-base px-4 py-3 text-sm"
                  >
                    <p className="font-medium text-brand-navy capitalize">
                      {statusLabel(item.status)}
                    </p>
                    <p className="text-text-muted">
                      Signed up {formatDate(item.createdAt)}
                      {item.confirmedAt
                        ? ` · Confirmed ${formatDate(item.confirmedAt)}`
                        : ""}
                      {item.unsubscribedAt
                        ? ` · Left ${formatDate(item.unsubscribedAt)}`
                        : ""}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={pdfBusy || !hasHits}
              onClick={() => void downloadPdf()}
            >
              {pdfBusy ? "Preparing PDF…" : "Download branded PDF"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={erasing || !hasHits}
              onClick={() => void onErase()}
            >
              {erasing ? "Removing…" : "Erase personal details"}
            </Button>
          </div>
          <p className="text-xs text-text-muted">
            Erase keeps donation amounts for accounts but clears the person&apos;s
            name and email on those records. Form messages and newsletter
            sign-ups for this email are deleted.
          </p>
        </div>
      ) : null}
    </section>
  );
}
