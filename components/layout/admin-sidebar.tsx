import Link from "next/link";
import {
  FileText,
  Inbox,
  LayoutDashboard,
  Settings,
  Users,
  HeartHandshake,
  Mail,
  Images,
} from "lucide-react";
import { auth } from "@/auth";
import { canManageSettings, canManageUsers } from "@/features/governance/rbac";

const BASE_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/content/media", label: "Media", icon: Images },
  { href: "/admin/submissions", label: "Submissions", icon: Inbox },
  { href: "/admin/donations", label: "Donations", icon: HeartHandshake },
  { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
] as const;

/** Admin sidebar — Users/Settings visible to Administrators only. */
export async function AdminSidebar() {
  const session = await auth();
  const role = session?.user?.role;
  const nav = [
    ...BASE_NAV,
    ...(canManageUsers(role)
      ? ([{ href: "/admin/users", label: "Users", icon: Users }] as const)
      : []),
    ...(canManageSettings(role)
      ? ([{ href: "/admin/settings", label: "Settings", icon: Settings }] as const)
      : []),
  ];

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border-default bg-bg-surface">
      <div className="border-b border-border-default px-4 py-5">
        <p className="font-display text-sm font-semibold text-brand-navy">
          GGI Admin
        </p>
        <p className="text-xs text-text-muted">Back-office</p>
      </div>
      <nav aria-label="Admin" className="flex flex-1 flex-col gap-1 p-3">
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-primary hover:bg-bg-base"
            >
              <Icon className="h-4 w-4" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
