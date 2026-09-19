import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { canManageSettings } from "@/features/governance/rbac";
import AdminAuditPageClient from "./audit-client";

export default async function AdminAuditPage() {
  const session = await auth();
  // Audit UI is Administrator-only (same gate as settings).
  if (!canManageSettings(session?.user?.role)) {
    redirect("/admin");
  }

  return <AdminAuditPageClient />;
}
