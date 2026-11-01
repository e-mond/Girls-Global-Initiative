/** Best-effort parse of human CMS dates like "23 October 2026". */
export function parseFlexibleDate(value: string | null | undefined): Date | null {
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

function calendarDayKey(
  date: Date,
  timeZone: string,
): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/**
 * Calendar-day comparison in Africa/Accra by default (GGI events).
 * Same-day events remain current until the calendar day ends in that zone.
 */
export function isPastInTimezone(
  value: string | null | undefined,
  timeZone = "Africa/Accra",
  now = new Date(),
): boolean {
  const parsed = parseFlexibleDate(value);
  if (!parsed) return false;
  const eventDay = calendarDayKey(parsed, timeZone);
  const today = calendarDayKey(now, timeZone);
  return eventDay < today;
}

/** @deprecated Prefer isPastInTimezone with Africa/Accra. */
export function isPastCalendarDate(
  value: string | null | undefined,
  now = new Date(),
): boolean {
  return isPastInTimezone(value, "Africa/Accra", now);
}

/** Whether a scheduled item's go-live timestamp has arrived. */
export function isScheduleDue(
  publishedAt: string | Date | null | undefined,
  now = new Date(),
): boolean {
  if (!publishedAt) return false;
  const at =
    publishedAt instanceof Date ? publishedAt : new Date(publishedAt);
  if (Number.isNaN(at.getTime())) return false;
  return at.getTime() <= now.getTime();
}
