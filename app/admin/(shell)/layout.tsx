import { auth } from "@/auth";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { AdminShellProvider } from "@/components/admin/admin-shell-provider";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminTopbar } from "@/components/layout/admin-topbar";
import { buildAdminNavGroups } from "@/features/admin/nav";
import {
  canManageSettings,
  canManageUsers,
} from "@/features/governance/rbac";

/** Authenticated admin chrome — route protection is enforced in middleware. */
export default async function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const role = session?.user?.role;
  const groups = buildAdminNavGroups({
    canManageUsers: canManageUsers(role),
    canManageSettings: canManageSettings(role),
  });

  return (
    <AdminShellProvider>
      <div className="flex min-h-screen bg-bg-base">
        <AdminSidebar
          groups={groups}
          staffName={session?.user?.name}
          staffRole={session?.user?.role}
        />
        <AdminMobileNav
          groups={groups}
          staffName={session?.user?.name}
          staffRole={session?.user?.role}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar
            staffName={session?.user?.name}
            staffRole={session?.user?.role}
            canManageSettings={canManageSettings(role)}
          />
          <div className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
            {children}
          </div>
        </div>
      </div>
    </AdminShellProvider>
  );
}
