/**
 * Canonical contact details from content-reference.md.
 * Do not invent street addresses or extra channels.
 */
export const CONTACT_PHONES = [
  "+233 20 388 3012",
  "+233 54 620 1243",
  "+233 55 880 4750",
] as const;

export const CONTACT_EMAIL = "girlsglobalinitiative@yahoo.com";

/** tel: href without spaces. */
export function phoneTelHref(display: string): string {
  return `tel:${display.replace(/\s+/g, "")}`;
}
