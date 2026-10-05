import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

/**
 * Session-only Auth.js instance for SSR/API gates.
 * Does not import bcrypt / credential verification — keeps admin pages
 * off the heavy credentials chunk (Cloudflare Worker CPU limits).
 */
export const { auth: getStaffSession } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
});
