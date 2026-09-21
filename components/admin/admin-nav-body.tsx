"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminSignOutButton } from "@/components/admin/admin-sign-out-button";
import {
  adminLinkIsActive,
  type AdminNavGroup,
} from "@/features/admin/nav";
import { cn } from "@/lib/utils";

export function AdminNavBody({
  groups,
  staffName,
  staffRole,
  onNavigate,
}: {
  groups: AdminNavGroup[];
  staffName?: string | null;
  staffRole?: string | null;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border-default px-4 py-4">
        <Link
          href="/admin"
          className="flex items-center gap-2.5"
          onClick={onNavigate}
        >
          <Image
            src="/brand/ggi-logo.png"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 rounded-full bg-brand-navy object-cover"
          />
          <span>
            <span className="block font-display text-sm font-bold text-brand-navy">
              GGI Workspace
            </span>
            <span className="text-xs text-text-muted">Staff back-office</span>
          </span>
        </Link>
      </div>

      <nav aria-label="Admin" className="flex-1 space-y-5 overflow-y-auto p-3">
        {groups.map((group) => (
          <div key={group.id}>
            <p className="px-3 pb-1.5 text-[11px] font-bold uppercase tracking-wide text-text-muted">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = adminLinkIsActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "flex min-h-10 items-center rounded-xl px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky",
                        active
                          ? "bg-blob-pink/50 text-brand-magenta"
                          : "text-brand-navy hover:bg-bg-base",
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-auto border-t border-border-default p-3">
        <div className="mb-2 rounded-xl bg-bg-base px-3 py-2.5">
          <p className="truncate text-sm font-semibold text-brand-navy">
            {staffName ?? "Staff"}
          </p>
          <p className="truncate text-xs capitalize text-text-muted">
            {staffRole ?? "editor"}
          </p>
        </div>
        <AdminSignOutButton />
      </div>
    </div>
  );
}
