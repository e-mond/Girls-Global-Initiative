import { isScheduleDue } from "@/lib/date/parse-flexible-date";

/** News/content rows that visitors may see in the live feed. */
export function isLivePublicContent(input: {
  status: string;
  publishedAt?: string | Date | null;
  now?: Date;
}): boolean {
  if (input.status === "published") return true;
  if (input.status === "scheduled") {
    return isScheduleDue(input.publishedAt ?? null, input.now);
  }
  return false;
}

export function isArchivedPublicContent(status: string): boolean {
  return status === "archived";
}
