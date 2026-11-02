"use client";

import { SessionProvider } from "next-auth/react";

/**
 * Optional client session context for admin-only trees that need useSession.
 * Not mounted on the public site — polling /api/auth/session on every public
 * page inflated Worker load and surfaced HTML 503 bodies as Auth.js JSON errors.
 */
export function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider refetchOnWindowFocus={false} refetchWhenOffline={false}>
      {children}
    </SessionProvider>
  );
}
