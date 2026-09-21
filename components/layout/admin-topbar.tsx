"use client";

import { Menu } from "lucide-react";
import { AdminNotifications } from "@/components/admin/admin-notifications";
import { useAdminShell } from "@/components/admin/admin-shell-provider";
import { adminPageTitle } from "@/features/admin/nav";
import { usePathname } from "next/navigation";

/** Admin top bar: context, mobile menu, notifications, account chip. */
export function AdminTopbar({
  staffName,
  staffRole,
}: {
  staffName?: string | null;
  staffRole?: string | null;
}) {
  const pathname = usePathname();
  const { toggleMobileNav } = useAdminShell();
  const title = adminPageTitle(pathname);

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
        <div className="hidden rounded-xl bg-bg-base px-3 py-1.5 text-right sm:block">
          <p className="max-w-[10rem] truncate text-xs font-semibold text-brand-navy">
            {staffName ?? "Staff"}
          </p>
          <p className="text-[10px] capitalize text-text-muted">
            {staffRole ?? "editor"}
          </p>
        </div>
      </div>
    </header>
  );
}
