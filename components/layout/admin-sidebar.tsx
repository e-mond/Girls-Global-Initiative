import { auth } from "@/auth";
import { AdminNavBody } from "@/components/admin/admin-nav-body";
import { buildAdminNavGroups } from "@/features/admin/nav";
import {
  canManageSettings,
  canManageUsers,
} from "@/features/governance/rbac";

/** Desktop sidebar — role-filtered IA with visible Log out. */
export async function AdminSidebar() {
  const session = await auth();
  const role = session?.user?.role;
  const groups = buildAdminNavGroups({
    canManageUsers: canManageUsers(role),
    canManageSettings: canManageSettings(role),
  });

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border-default bg-bg-surface md:flex md:flex-col">
      <AdminNavBody
        groups={groups}
        staffName={session?.user?.name}
        staffRole={session?.user?.role}
      />
    </aside>
  );
}
