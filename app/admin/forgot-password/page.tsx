"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AdminAuthShell } from "@/components/admin/admin-login-form";
import { Button } from "@/components/ui/button";

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(
          json?.error?.message ?? "Could not start password reset.",
        );
      }
      setMessage(json.data.message);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not start password reset.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <AdminAuthShell
      title="Forgot password"
      description="Enter your staff email. If it matches an account, we will send a reset link."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-brand-navy">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-11 w-full rounded-xl border border-border-default bg-bg-base px-3 text-sm text-text-primary outline-none focus:border-brand-sky"
          />
        </div>
        {error ? (
          <p className="text-sm text-brand-magenta" role="alert">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="text-sm text-brand-navy" role="status">
            {message}
          </p>
        ) : null}
        <Button type="submit" className="w-full rounded-xl" disabled={pending}>
          {pending ? "Sending…" : "Send reset link"}
        </Button>
        <p className="text-center text-xs text-text-muted">
          <Link
            href="/admin/login"
            className="font-medium text-brand-sky hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </form>
    </AdminAuthShell>
  );
}
