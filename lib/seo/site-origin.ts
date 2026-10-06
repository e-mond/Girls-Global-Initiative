/**
 * Absolute public site origin for metadata, sitemap, robots, and emails.
 * Prefers the public marketing URL over Auth.js URL when both are set.
 */
export function getSiteOrigin(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.AUTH_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000";
  return raw.replace(/\/$/, "");
}
