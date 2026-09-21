"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { AdminSignOutButton } from "@/components/admin/admin-sign-out-button";
import { useAdminShell } from "@/components/admin/admin-shell-provider";
import {
  adminLinkIsActive,
  type AdminNavGroup,
} from "@/features/admin/nav";
import { ADMIN_NAV_ICONS } from "@/features/admin/nav-icons";
import { cn } from "@/lib/utils";

export function AdminNavBody({
  groups,
  staffName,
  staffRole,
  onNavigate,
  collapsible = false,
}: {
  groups: AdminNavGroup[];
  staffName?: string | null;
  staffRole?: string | null;
  onNavigate?: () => void;
  /** Desktop sidebar may collapse to icons. */
  collapsible?: boolean;
}) {
  const pathname = usePathname();
  const shell = useAdminShell();
  const collapsed = collapsible && shell.sidebarCollapsed;

  return (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "border-b border-border-default py-4",
          collapsed ? "px-2" : "px-4",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2.5",
            collapsed ? "flex-col" : "justify-between",
          )}
        >
          <Link
            href="/admin"
            className={cn(
              "flex min-w-0 items-center gap-2.5",
              collapsed && "justify-center",
            )}
            onClick={onNavigate}
            title={collapsed ? "GGI Workspace" : undefined}
          >
            <Image
              src="/brand/ggi-logo.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 rounded-full bg-brand-navy object-cover"
            />
            {collapsed ? null : (
              <span className="min-w-0">
                <span className="block truncate font-display text-sm font-bold text-brand-navy">
                  GGI Workspace
                </span>
                <span className="text-xs text-text-muted">Staff back-office</span>
              </span>
            )}
          </Link>
          {collapsible ? (
            <button
              type="button"
              onClick={shell.toggleSidebarCollapsed}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-brand-navy hover:bg-bg-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky"
              aria-label={
                collapsed ? "Expand sidebar" : "Collapse sidebar"
              }
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <PanelLeftOpen className="h-4 w-4" aria-hidden />
              ) : (
                <PanelLeftClose className="h-4 w-4" aria-hidden />
              )}
            </button>
          ) : null}
        </div>
      </div>

      <nav aria-label="Admin" className="flex-1 space-y-5 overflow-y-auto p-3">
        {groups.map((group) => (
          <div key={group.id}>
            {collapsed ? null : (
              <p className="px-3 pb-1.5 text-[11px] font-bold uppercase tracking-wide text-text-muted">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = adminLinkIsActive(pathname, item.href);
                const Icon = ADMIN_NAV_ICONS[item.icon];
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "flex min-h-10 items-center gap-2.5 rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky",
                        collapsed ? "justify-center px-0" : "px-3",
                        active
                          ? "border border-brand-magenta/20 bg-blob-pink/55 text-brand-magenta"
                          : "border border-transparent text-brand-navy hover:bg-bg-base",
                      )}
                      aria-current={active ? "page" : undefined}
                      aria-label={item.label}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          active ? "text-brand-magenta" : "text-brand-navy/80",
                        )}
                        aria-hidden
                      />
                      {collapsed ? null : item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div
        className={cn(
          "mt-auto border-t border-border-default p-3",
          collapsed && "px-2",
        )}
      >
        {collapsed ? null : (
          <div className="mb-2 rounded-xl bg-bg-base px-3 py-2.5">
            <p className="truncate text-sm font-semibold text-brand-navy">
              {staffName ?? "Staff"}
            </p>
            <p className="truncate text-xs capitalize text-text-muted">
              {staffRole ?? "editor"}
            </p>
          </div>
        )}
        <AdminSignOutButton collapsed={collapsed} />
      </div>
    </div>
  );
}
