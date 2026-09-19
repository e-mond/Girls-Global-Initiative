import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminSectionStub } from "@/components/layout/admin-section-stub";
import { canManageUsers } from "@/features/governance/rbac";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!canManageUsers(session?.user?.role)) {
    redirect("/admin");
  }

  return (
    <AdminSectionStub
      title="Users"
      description="Staff invite and role management expands here. Administrator-only."
    />
  );
}
