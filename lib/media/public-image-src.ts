/**
 * Normalise CMS / static image paths for `next/image`.
 *
 * Query-string cache busters (`?v=…`) are useful for raw asset URLs, but the
 * Cloudflare OpenNext image optimizer has intermittently 404'd when the
 * encoded `url` param includes a search string. Strip search/hash for local
 * public paths; keep remote absolute URLs intact (including their query).
 */
export function normalizePublicImageSrc(
  value: string | null | undefined,
): string | null {
  if (!value?.trim()) return null;
  const raw = value.trim();
  if (/^https?:\/\//i.test(raw) || raw.startsWith("//")) {
    return raw;
  }
  const pathOnly = raw.split(/[?#]/, 1)[0] ?? raw;
  if (!pathOnly.startsWith("/")) {
    return `/${pathOnly.replace(/^\/+/, "")}`;
  }
  return pathOnly;
}
