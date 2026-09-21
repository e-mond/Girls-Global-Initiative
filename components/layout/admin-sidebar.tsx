"use client";

import { AdminNavBody } from "@/components/admin/admin-nav-body";
import { useAdminShell } from "@/components/admin/admin-shell-provider";
import type { AdminNavGroup } from "@/features/admin/nav";
import { cn } from "@/lib/utils";

/** Desktop sidebar — role-filtered IA with icons, collapse, and Log out. */
export function AdminSidebar({
  groups,
  staffName,
  staffRole,
}: {
  groups: AdminNavGroup[];
  staffName?: string | null;
  staffRole?: string | null;
}) {
  const { sidebarCollapsed } = useAdminShell();

  return (
    <aside
      className={cn(
        "hidden shrink-0 border-r border-border-default bg-bg-surface md:flex md:flex-col",
        sidebarCollapsed ? "w-[4.5rem]" : "w-64",
      )}
    >
      <AdminNavBody
        groups={groups}
        staffName={staffName}
        staffRole={staffRole}
        collapsible
      />
    </aside>
  );
}
