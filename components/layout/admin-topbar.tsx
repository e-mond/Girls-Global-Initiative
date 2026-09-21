"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Menu, Settings, UserCircle } from "lucide-react";
import { AdminNotifications } from "@/components/admin/admin-notifications";
import { AdminSignOutButton } from "@/components/admin/admin-sign-out-button";
import { useAdminShell } from "@/components/admin/admin-shell-provider";
import { adminPageTitle } from "@/features/admin/nav";
import { cn } from "@/lib/utils";

/** Admin top bar: context, mobile menu, notifications, account menu. */
export function AdminTopbar({
  staffName,
  staffRole,
  canManageSettings = false,
}: {
  staffName?: string | null;
  staffRole?: string | null;
  canManageSettings?: boolean;
}) {
  const pathname = usePathname();
  const { toggleMobileNav } = useAdminShell();
  const title = adminPageTitle(pathname);
  const [accountOpen, setAccountOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!accountOpen) return;
    const onPointer = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAccountOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [accountOpen]);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border-default bg-bg-surface/95 px-4 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border-default text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky md:hidden"
          aria-label="Open menu"
          onClick={toggleMobileNav}
        >
          <Menu className="h-5 w-5" aria-hidden />
        </button>
        <div className="min-w-0">
          <p className="truncate font-display text-base font-semibold text-brand-navy sm:text-lg">
            {title}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <AdminNotifications />
        <div className="relative" ref={rootRef}>
          <button
            type="button"
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-xl border border-border-default bg-bg-base px-2.5 text-brand-navy hover:bg-bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky sm:px-3",
              accountOpen && "border-brand-sky/40",
            )}
            aria-expanded={accountOpen}
            aria-controls={menuId}
            aria-haspopup="menu"
            aria-label="Staff account menu"
            onClick={() => setAccountOpen((value) => !value)}
          >
            <UserCircle className="h-4 w-4 shrink-0" aria-hidden />
            <span className="hidden max-w-[8rem] truncate text-left text-xs sm:block">
              <span className="block font-semibold">{staffName ?? "Staff"}</span>
              <span className="capitalize text-text-muted">
                {staffRole ?? "editor"}
              </span>
            </span>
            <ChevronDown
              className={cn(
                "hidden h-3.5 w-3.5 sm:block",
                accountOpen && "rotate-180",
              )}
              aria-hidden
            />
          </button>
          {accountOpen ? (
            <div
              id={menuId}
              role="menu"
              aria-label="Account"
              className="absolute right-0 top-full z-40 mt-2 w-52 rounded-2xl border border-border-default bg-bg-surface p-1.5 shadow-md"
            >
              <div className="border-b border-border-default px-3 py-2 sm:hidden">
                <p className="truncate text-sm font-semibold text-brand-navy">
                  {staffName ?? "Staff"}
                </p>
                <p className="truncate text-xs capitalize text-text-muted">
                  {staffRole ?? "editor"}
                </p>
              </div>
              {canManageSettings ? (
                <Link
                  role="menuitem"
                  href="/admin/settings"
                  className="flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-brand-navy hover:bg-bg-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky"
                  onClick={() => setAccountOpen(false)}
                >
                  <Settings className="h-4 w-4" aria-hidden />
                  Settings
                </Link>
              ) : null}
              <div role="none" className="mt-0.5 border-t border-border-default pt-0.5">
                <AdminSignOutButton variant="menu" />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
