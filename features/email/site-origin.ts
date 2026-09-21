/**
 * Shared absolute origin for email links and branded assets.
 */
export function emailSiteOrigin() {
  return (
    process.env.AUTH_URL?.replace(/\/$/, "") ||
    process.env.NEXTAUTH_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}
