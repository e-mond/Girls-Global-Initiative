"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

/** Auth.js sign-out — single source of truth for admin logout. */
export function AdminSignOutButton({
  className,
  variant = "sidebar",
  collapsed = false,
}: {
  className?: string;
  variant?: "sidebar" | "menu";
  collapsed?: boolean;
}) {
  const [pending, setPending] = useState(false);

  async function onLogout() {
    if (pending) return;
    setPending(true);
    try {
      await signOut({ callbackUrl: "/admin/login" });
    } catch {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void onLogout()}
      disabled={pending}
      title={collapsed ? "Log out" : undefined}
      aria-label="Log out"
      className={cn(
        "inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky disabled:opacity-60",
        collapsed ? "w-full justify-center px-0" : "w-full",
        variant === "sidebar"
          ? "text-brand-navy hover:bg-bg-base"
          : "text-brand-magenta hover:bg-bg-base",
        className,
      )}
    >
      <LogOut className="h-4 w-4 shrink-0" aria-hidden />
      {collapsed ? null : pending ? "Signing out…" : "Log out"}
    </button>
  );
}
