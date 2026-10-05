import { redirect } from "next/navigation";
import { getStaffSession } from "@/features/governance/session";
import { canManageSettings } from "@/features/governance/rbac";
import AdminSettingsPageClient from "./settings-client";

export default async function AdminSettingsPage() {
  const session = await getStaffSession();
  if (!canManageSettings(session?.user?.role)) {
    redirect("/admin");
  }

  return <AdminSettingsPageClient />;
}
