"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { AdminAuthShell } from "@/components/admin/admin-login-form";
import { Button } from "@/components/ui/button";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/admin/password-reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Could not reset password.");
      }
      router.replace("/admin/login");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not reset password.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {!token ? (
        <p className="text-sm text-brand-magenta" role="alert">
          This reset link is missing a token. Request a new password reset.
        </p>
      ) : null}
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-brand-navy"
        >
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-11 w-full rounded-xl border border-border-default bg-bg-base px-3 text-sm text-text-primary outline-none focus:border-brand-sky"
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="confirm"
          className="text-sm font-medium text-brand-navy"
        >
          Confirm password
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          className="h-11 w-full rounded-xl border border-border-default bg-bg-base px-3 text-sm text-text-primary outline-none focus:border-brand-sky"
        />
      </div>
      {error ? (
        <p className="text-sm text-brand-magenta" role="alert">
          {error}
        </p>
      ) : null}
      <Button
        type="submit"
        className="w-full rounded-xl"
        disabled={pending || !token}
      >
        {pending ? "Updating…" : "Update password"}
      </Button>
      <p className="text-center text-xs text-text-muted">
        <Link
          href="/admin/forgot-password"
          className="font-medium text-brand-sky hover:underline"
        >
          Request a new link
        </Link>
      </p>
    </form>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <AdminAuthShell
      title="Choose a new password"
      description="Enter a new password for your staff account. The link expires after one hour."
    >
      <Suspense fallback={<p className="text-sm text-text-muted">Loading…</p>}>
        <ResetPasswordForm />
      </Suspense>
    </AdminAuthShell>
  );
}
