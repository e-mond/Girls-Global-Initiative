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
  const origin = raw.replace(/\/$/, "");

  if (
    process.env.NODE_ENV === "production" &&
    /localhost|127\.0\.0\.1/i.test(origin)
  ) {
    // Fail closed to the known production host rather than publishing localhost
    // URLs in sitemap/robots/canonicals when env vars were omitted at build.
    return "https://girlsglobalinitiative.org";
  }

  return origin;
}
