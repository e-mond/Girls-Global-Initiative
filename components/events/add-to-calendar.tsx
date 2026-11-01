"use client";

import { CalendarPlus } from "lucide-react";

type AddToCalendarProps = {
  title: string;
  summary: string;
  location?: string | null;
  startsOn?: string | null;
  endsOn?: string | null;
  url: string;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

/** Best-effort parse of human CMS dates like "23 October 2026". */
function parseFlexibleDate(value: string | null | undefined): Date | null {
  if (!value?.trim()) return null;
  const direct = Date.parse(value);
  if (!Number.isNaN(direct)) return new Date(direct);
  const match = value
    .trim()
    .match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (!match) return null;
  const trial = Date.parse(`${match[2]} ${match[1]}, ${match[3]}`);
  return Number.isNaN(trial) ? null : new Date(trial);
}

function toIcsDate(date: Date) {
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  );
}

function escapeIcs(text: string) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

export function AddToCalendar({
  title,
  summary,
  location,
  startsOn,
  endsOn,
  url,
}: AddToCalendarProps) {
  const start = parseFlexibleDate(startsOn) ?? new Date();
  const endCandidate = parseFlexibleDate(endsOn);
  const end =
    endCandidate && endCandidate > start
      ? endCandidate
      : new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const absoluteUrl =
    typeof window !== "undefined"
      ? new URL(url, window.location.origin).toString()
      : url;

  function downloadIcs() {
    const stamp = toIcsDate(new Date());
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Girls Global Initiative//Events//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:ggi-${stamp}@girlsglobalinitiative.org`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${toIcsDate(start)}`,
      `DTEND:${toIcsDate(end)}`,
      `SUMMARY:${escapeIcs(title)}`,
      `DESCRIPTION:${escapeIcs(`${summary}\n\n${absoluteUrl}`)}`,
      location ? `LOCATION:${escapeIcs(location)}` : null,
      `URL:${absoluteUrl}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .filter(Boolean)
      .join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = `${title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "ggi-event"}.ics`;
    anchor.click();
    URL.revokeObjectURL(href);
  }

  const googleDates = `${toIcsDate(start).replace(/[-:]/g, "")}/${toIcsDate(end).replace(/[-:]/g, "")}`;
  const googleUrl = new URL("https://calendar.google.com/calendar/render");
  googleUrl.searchParams.set("action", "TEMPLATE");
  googleUrl.searchParams.set("text", title);
  googleUrl.searchParams.set("dates", googleDates);
  googleUrl.searchParams.set("details", `${summary}\n\n${absoluteUrl}`);
  if (location) googleUrl.searchParams.set("location", location);

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={downloadIcs}
        className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-navy px-5 text-sm font-semibold text-text-on-inverse hover:bg-brand-navy/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky"
      >
        <CalendarPlus className="h-4 w-4" aria-hidden />
        Add to calendar
      </button>
      <a
        href={googleUrl.toString()}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-11 items-center gap-2 rounded-full border border-border-default bg-bg-surface px-5 text-sm font-semibold text-brand-navy hover:border-brand-sky focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky"
      >
        Google Calendar
      </a>
    </div>
  );
}
