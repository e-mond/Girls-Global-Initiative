import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Login placeholder — Auth.js session flow is Unit 3. */
export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-base px-4">
      <section className="w-full max-w-md space-y-4 rounded-xl border border-border-default bg-bg-surface p-8">
        <h1 className="font-display text-xl font-semibold text-brand-navy">
          Staff sign in
        </h1>
        <p className="text-sm text-text-muted">
          Secure session-based login with Auth.js will be implemented in the
          Admin Back-Office unit.
        </p>
        <Button type="button" disabled>
          Sign in unavailable
        </Button>
        <p className="text-xs text-text-muted">
          <Link href="/" className="text-brand-sky hover:underline">
            Back to public site
          </Link>
        </p>
      </section>
    </div>
  );
}
