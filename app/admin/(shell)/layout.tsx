import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminTopbar } from "@/components/layout/admin-topbar";

/** Authenticated admin chrome — route protection is enforced in middleware. */
export default function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-bg-base">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar title="Administration" />
        <div className="flex-1 p-6">{children}</div>
      </div>
    </div>
  );
}
