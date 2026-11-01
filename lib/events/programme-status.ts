import { isPastInTimezone } from "@/lib/date/parse-flexible-date";

export type ProgrammeStatus = "scheduled" | "cancelled" | "postponed";
export type EventDisplayStatus =
  | "upcoming"
  | "past"
  | "cancelled"
  | "postponed";

export function normalizeProgrammeStatus(
  value: unknown,
): ProgrammeStatus {
  const raw = String(value ?? "scheduled").toLowerCase().trim();
  if (raw === "cancelled" || raw === "postponed") return raw;
  return "scheduled";
}

/**
 * Resolve public event grouping.
 * Cancellation and postponement are always explicit admin actions.
 * Upcoming vs past is derived from the confirmed date in Africa/Accra
 * (or the event's stored timezone) only when programmeStatus is scheduled.
 */
export function resolveEventDisplayStatus(input: {
  programmeStatus?: unknown;
  startsOn?: string | null;
  revisedStartsOn?: string | null;
  timezone?: string | null;
  now?: Date;
}): EventDisplayStatus {
  const programme = normalizeProgrammeStatus(input.programmeStatus);
  if (programme === "cancelled") return "cancelled";
  if (programme === "postponed") return "postponed";

  const timezone = input.timezone?.trim() || "Africa/Accra";
  const dateLabel = input.startsOn;
  if (isPastInTimezone(dateLabel, timezone, input.now)) {
    return "past";
  }
  return "upcoming";
}

export function eventStatusLabel(status: EventDisplayStatus): string {
  switch (status) {
    case "cancelled":
      return "Cancelled";
    case "postponed":
      return "Postponed";
    case "past":
      return "Past";
    default:
      return "Upcoming";
  }
}
