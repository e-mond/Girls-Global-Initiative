import { redirect } from "next/navigation";
import { getStaffSession } from "@/features/governance/session";
import { canManageSettings } from "@/features/governance/rbac";
import AdminPrivacyClient from "./privacy-client";

export default async function AdminPrivacyPage() {
  const session = await getStaffSession();
  if (!canManageSettings(session?.user?.role)) {
    redirect("/admin");
  }
  return <AdminPrivacyClient />;
}
