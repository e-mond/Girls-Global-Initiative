"use client";

import { useEffect } from "react";

/**
 * Starts the MSW browser worker in development when mock mode is enabled
 * or DATABASE_URL is unset. Excluded from production behaviour via env checks.
 */
export function MswProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    async function enableMocking() {
      if (process.env.NODE_ENV === "production") {
        return;
      }

      const mockMode = process.env.NEXT_PUBLIC_MOCK_API === "true";
      const noDatabaseHint =
        process.env.NEXT_PUBLIC_ENABLE_MSW === "true" || mockMode;

      if (!noDatabaseHint) {
        return;
      }

      const { worker } = await import("@/mocks/browser");
      await worker.start({
        onUnhandledRequest: "bypass",
        quiet: true,
      });
    }

    void enableMocking();
  }, []);

  return <>{children}</>;
}
