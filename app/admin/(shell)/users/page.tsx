import { redirect } from "next/navigation";
import { getStaffSession } from "@/features/governance/session";
import { canManageUsers } from "@/features/governance/rbac";
import AdminUsersPageClient from "./users-client";

export default async function AdminUsersPage() {
  const session = await getStaffSession();
  if (!canManageUsers(session?.user?.role)) {
    redirect("/admin");
  }

  return <AdminUsersPageClient currentUserId={session?.user?.id ?? ""} />;
}
