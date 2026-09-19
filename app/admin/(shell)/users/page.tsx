import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { canManageUsers } from "@/features/governance/rbac";
import AdminUsersPageClient from "./users-client";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!canManageUsers(session?.user?.role)) {
    redirect("/admin");
  }

  return <AdminUsersPageClient />;
}
