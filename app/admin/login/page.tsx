import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-base px-4">
      <section className="w-full max-w-md space-y-4 rounded-xl border border-border-default bg-bg-surface p-8">
        <div>
          <h1 className="font-display text-xl font-semibold text-brand-navy">
            Staff sign in
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Sign in with your Girls Global Initiative staff account.
          </p>
        </div>
        <Suspense fallback={<p className="text-sm text-text-muted">Loading…</p>}>
          <AdminLoginForm />
        </Suspense>
      </section>
    </div>
  );
}
