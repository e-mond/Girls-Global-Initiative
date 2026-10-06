/**
 * Allow only relative admin paths for post-login redirects (blocks open redirects).
 */
export function safeAdminCallbackUrl(raw: string | null | undefined): string {
  const fallback = "/admin";
  if (!raw) return fallback;

  const value = raw.trim();
  if (!value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }
  if (value.includes("\\") || value.includes("@")) {
    return fallback;
  }
  // Reject protocol-relative and absolute URLs disguised as paths.
  try {
    const parsed = new URL(value, "https://ggi.invalid");
    if (parsed.origin !== "https://ggi.invalid") {
      return fallback;
    }
  } catch {
    return fallback;
  }

  if (!value.startsWith("/admin")) {
    return fallback;
  }

  return value;
}
