import { Suspense } from "react";
import {
  AdminAuthShell,
  AdminLoginForm,
} from "@/components/admin/admin-login-form";

export default function AdminLoginPage() {
  return (
    <AdminAuthShell
      title="Staff sign in"
      description="Sign in with your Girls Global Initiative staff account to manage content, submissions and settings."
    >
      <Suspense fallback={<p className="text-sm text-text-muted">Loading…</p>}>
        <AdminLoginForm />
      </Suspense>
    </AdminAuthShell>
  );
}
