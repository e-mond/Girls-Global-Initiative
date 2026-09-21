"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { AdminNavBody } from "@/components/admin/admin-nav-body";
import { useAdminShell } from "@/components/admin/admin-shell-provider";
import type { AdminNavGroup } from "@/features/admin/nav";

/** Accessible mobile navigation drawer. */
export function AdminMobileNav({
  groups,
  staffName,
  staffRole,
}: {
  groups: AdminNavGroup[];
  staffName?: string | null;
  staffRole?: string | null;
}) {
  const { mobileNavOpen, closeMobileNav } = useAdminShell();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (mobileNavOpen) {
      closeRef.current?.focus();
    }
  }, [mobileNavOpen]);

  if (!mobileNavOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-brand-navy/40"
        aria-label="Close menu"
        onClick={closeMobileNav}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-y-0 left-0 flex w-[min(100vw-3rem,18rem)] flex-col bg-bg-surface shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-border-default px-3 py-3">
          <p id={titleId} className="font-display text-sm font-bold text-brand-navy">
            Menu
          </p>
          <button
            ref={closeRef}
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border-default text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky"
            aria-label="Close menu"
            onClick={closeMobileNav}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <AdminNavBody
          groups={groups}
          staffName={staffName}
          staffRole={staffRole}
          onNavigate={closeMobileNav}
        />
      </div>
    </div>
  );
}
