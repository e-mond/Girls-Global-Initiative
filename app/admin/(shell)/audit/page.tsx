import { redirect } from "next/navigation";
import { getStaffSession } from "@/features/governance/session";
import { canManageSettings } from "@/features/governance/rbac";
import AdminAuditPageClient from "./audit-client";

export default async function AdminAuditPage() {
  const session = await getStaffSession();
  if (!canManageSettings(session?.user?.role)) {
    redirect("/admin");
  }

  return <AdminAuditPageClient />;
}
