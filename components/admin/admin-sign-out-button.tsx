"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

/** Auth.js sign-out control for sidebar and mobile account menus. */
export function AdminSignOutButton({
  className,
  variant = "sidebar",
}: {
  className?: string;
  variant?: "sidebar" | "menu";
}) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className={cn(
        "inline-flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky",
        variant === "sidebar"
          ? "text-brand-navy hover:bg-bg-base"
          : "text-brand-magenta hover:bg-bg-base",
        className,
      )}
    >
      <LogOut className="h-4 w-4 shrink-0" aria-hidden />
      Log out
    </button>
  );
}
