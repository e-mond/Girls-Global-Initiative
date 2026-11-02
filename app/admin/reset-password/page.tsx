"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { AdminAuthShell } from "@/components/admin/admin-login-form";
import { PasswordField } from "@/components/admin/password-field";
import { Button } from "@/components/ui/button";
import { readJsonResponse } from "@/lib/safe-json";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const isInviteParam = searchParams.get("invite") === "1";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [checking, setChecking] = useState(Boolean(token));
  const [linkKind, setLinkKind] = useState<"invite" | "reset" | null>(
    isInviteParam ? "invite" : null,
  );
  const [linkError, setLinkError] = useState<string | null>(
    token ? null : "This link is missing a token. Request a new invitation or password reset.",
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setChecking(false);
      return;
    }

    let cancelled = false;
    setChecking(true);
    setLinkError(null);

    void (async () => {
      try {
        const response = await fetch(
          `/api/admin/password-reset/confirm?token=${encodeURIComponent(token)}`,
        );
        const json = await readJsonResponse<{
          data?: {
            valid?: boolean;
            kind?: "invite" | "reset";
            message?: string;
          };
          error?: { message?: string };
        }>(response, "Could not check this link.");
        if (cancelled) return;
        if (!response.ok) {
          setLinkError(
            json?.error?.message ?? "Could not check this link. Try again.",
          );
          return;
        }
        if (!json.data?.valid) {
          setLinkError(
            json.data?.message ??
              "This link is invalid or has expired. Request a new one.",
          );
          return;
        }
        setLinkKind(json.data.kind ?? (isInviteParam ? "invite" : "reset"));
      } catch (err) {
        if (!cancelled) {
          setLinkError(
            err instanceof Error ? err.message : "Could not check this link.",
          );
        }
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, isInviteParam]);

  const isInvite = linkKind === "invite" || (linkKind === null && isInviteParam);

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
      const json = await readJsonResponse<{
        error?: { message?: string };
      }>(response, "Could not set password.");
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Could not set password.");
      }
      router.replace(
        isInvite ? "/admin/login?activated=1" : "/admin/login?reset=1",
      );
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not set password.",
      );
    } finally {
      setPending(false);
    }
  }

  if (checking) {
    return <p className="text-sm text-text-muted">Checking your link…</p>;
  }

  if (linkError) {
    return (
      <div className="space-y-4">
        <p className="rounded-xl bg-brand-magenta/10 px-4 py-3 text-sm text-brand-magenta" role="alert">
          {linkError}
        </p>
        <Link
          href="/admin/forgot-password"
          className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-brand-magenta px-4 text-sm font-medium text-text-on-inverse hover:bg-brand-magenta/90"
        >
          Request a new link
        </Link>
        <p className="text-center text-xs text-text-muted">
          Already activated?{" "}
          <Link
            href="/admin/login"
            className="font-medium text-brand-sky hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <PasswordField
        id="password"
        name="password"
        label={isInvite ? "Choose a password" : "New password"}
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
        invalid={Boolean(error)}
      />
      <PasswordField
        id="confirm"
        name="confirm"
        label="Confirm password"
        value={confirm}
        onChange={setConfirm}
        autoComplete="new-password"
        invalid={Boolean(error)}
      />
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
        {pending
          ? "Saving…"
          : isInvite
            ? "Activate account"
            : "Update password"}
      </Button>
      <p className="text-center text-xs text-text-muted">
        Link not working?{" "}
        <Link
          href="/admin/forgot-password"
          className="font-medium text-brand-sky hover:underline"
        >
          Request a new one
        </Link>
      </p>
    </form>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <AdminAuthShell title="Set your password" description="Loading…">
          <p className="text-sm text-text-muted">Loading…</p>
        </AdminAuthShell>
      }
    >
      <ResetPasswordPageInner />
    </Suspense>
  );
}

function ResetPasswordPageInner() {
  const searchParams = useSearchParams();
  const isInvite = searchParams.get("invite") === "1";

  return (
    <AdminAuthShell
      title={isInvite ? "Accept your invitation" : "Choose a new password"}
      description={
        isInvite
          ? "Create a password to activate your GGI staff account. Invitation links expire after 72 hours."
          : "Enter a new password for your staff account. Reset links expire after one hour."
      }
    >
      <ResetPasswordForm />
    </AdminAuthShell>
  );
}
