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

/** Calendar-day comparison in local time (start of day). */
export function isPastCalendarDate(
  value: string | null | undefined,
  now = new Date(),
): boolean {
  const parsed = parseFlexibleDate(value);
  if (!parsed) return false;
  const endOfEventDay = new Date(
    parsed.getFullYear(),
    parsed.getMonth(),
    parsed.getDate(),
    23,
    59,
    59,
    999,
  );
  return endOfEventDay.getTime() < now.getTime();
}
