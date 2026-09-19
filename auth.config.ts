import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { StaffRole } from "@/features/governance/rbac";

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
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLogin = pathname.startsWith("/admin/login");
      const isAdmin = pathname.startsWith("/admin");
      const isAdminApi = pathname.startsWith("/api/admin");
      const signedIn = Boolean(auth?.user);

      if ((isAdmin && !isLogin) || isAdminApi) {
        return signedIn;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: StaffRole }).role;
      }
      return token;
    },
    async session({ session, token }) {
      const role = token.role as StaffRole | undefined;
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.email = token.email ?? "";
        session.user.name = token.name ?? "";
        session.user.role =
          role === "editor" ? "editor" : "administrator";
      }
      return session;
    },
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;
