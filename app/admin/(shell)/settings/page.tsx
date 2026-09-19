import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminSectionStub } from "@/components/layout/admin-section-stub";
import { canManageSettings } from "@/features/governance/rbac";

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!canManageSettings(session?.user?.role)) {
    redirect("/admin");
  }

  return (
    <AdminSectionStub
      title="Settings"
      description="Global site settings expand here. Administrator-only."
    />
  );
}
