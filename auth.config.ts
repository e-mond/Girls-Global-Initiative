import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { StaffRole } from "@/features/governance/rbac";

/** Staff session lifetime — 24 hours (JWT and session cookie). */
export const STAFF_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24;

function secureAuthCookiesEnabled() {
  const authUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "";
  return (
    authUrl.startsWith("https://") || process.env.NODE_ENV === "production"
  );
}

function isStaffRole(value: unknown): value is StaffRole {
  return value === "administrator" || value === "editor";
}

/**
 * Edge-safe Auth.js config (no Node crypto / bcrypt).
 * Credential verification is implemented in auth.ts authorize().
 */
export const authConfig = {
  providers: [
    Credentials({
      name: "Staff credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: STAFF_SESSION_MAX_AGE_SECONDS,
  },
  jwt: {
    maxAge: STAFF_SESSION_MAX_AGE_SECONDS,
  },
  cookies: {
    sessionToken: {
      name: secureAuthCookiesEnabled()
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: secureAuthCookiesEnabled(),
      },
    },
    callbackUrl: {
      name: secureAuthCookiesEnabled()
        ? "__Secure-authjs.callback-url"
        : "authjs.callback-url",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: secureAuthCookiesEnabled(),
      },
    },
    csrfToken: {
      name: secureAuthCookiesEnabled()
        ? "__Host-authjs.csrf-token"
        : "authjs.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: secureAuthCookiesEnabled(),
      },
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isPublicAdminPage =
        pathname.startsWith("/admin/login") ||
        pathname.startsWith("/admin/forgot-password") ||
        pathname.startsWith("/admin/reset-password");
      const isPublicAdminApi = pathname.startsWith(
        "/api/admin/password-reset/",
      );
      const isAdmin = pathname.startsWith("/admin");
      const isAdminApi = pathname.startsWith("/api/admin");
      const signedIn = Boolean(auth?.user);

      if (
        (isAdmin && !isPublicAdminPage) ||
        (isAdminApi && !isPublicAdminApi)
      ) {
        return signedIn;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        const role = (user as { role?: StaffRole }).role;
        token.role = isStaffRole(role) ? role : undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const role = token.role;
        if (!isStaffRole(role) || !token.id) {
          // Do not default unknown roles to administrator.
          session.user.id = "";
          session.user.email = "";
          session.user.name = "";
          session.user.role = "editor";
          return session;
        }
        session.user.id = String(token.id);
        session.user.email = token.email ?? "";
        session.user.name = token.name ?? "";
        session.user.role = role;
      }
      return session;
    },
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;
