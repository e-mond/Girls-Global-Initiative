"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { STAFF_ROLE_GUIDE } from "@/features/governance/rbac";
import { cn } from "@/lib/utils";

type Item = {
  id: string;
  email: string;
  name: string;
  role: "administrator" | "editor";
  status: "active" | "invited" | "disabled";
  createdAt: string;
  lastLoginAt: string | null;
};

export default function AdminUsersPageClient({
  currentUserId,
}: {
  currentUserId: string;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"administrator" | "editor">("editor");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/users");
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Could not load users.");
      }
      setItems(json.data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onCreate(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        role,
      }),
    });
    let json: {
      data?: { item?: { email?: string } };
      error?: { message?: string };
    } | null = null;
    try {
      json = await response.json();
    } catch {
      json = null;
    }
    if (!response.ok) {
      setError(json?.error?.message ?? "Could not invite user.");
      return;
    }
    const invitedEmail = json?.data?.item?.email?.trim() || email.trim();
    setName("");
    setEmail("");
    setRole("editor");
    setSuccess(
      `Invitation sent to ${invitedEmail} as ${STAFF_ROLE_GUIDE[role].label}.`,
    );
    await load();
  }

  async function setUserRole(id: string, next: "administrator" | "editor") {
    const guide = STAFF_ROLE_GUIDE[next];
    if (
      !window.confirm(
        `Change this person to ${guide.label}?\n\nThey will be able to:\n- ${guide.can.slice(0, 3).join("\n- ")}${guide.can.length > 3 ? "\n- …" : ""}`,
      )
    ) {
      return;
    }
    setError(null);
    setSuccess(null);
    setBusyId(id);
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role: next }),
      });
      const json = await response.json();
      if (!response.ok) {
        setError(json?.error?.message ?? "Could not update role.");
        return;
      }
      setSuccess(`Role updated to ${guide.label}.`);
      await load();
    } finally {
      setBusyId(null);
    }
  }

  async function setUserStatus(id: string, status: "active" | "disabled") {
    const label = status === "disabled" ? "disable" : "re-enable";
    if (!window.confirm(`Are you sure you want to ${label} this staff account?`)) {
      return;
    }
    setError(null);
    setSuccess(null);
    setBusyId(id);
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const json = await response.json();
      if (!response.ok) {
        setError(json?.error?.message ?? "Could not update access.");
        return;
      }
      setSuccess(
        status === "disabled"
          ? "Staff access disabled."
          : "Staff access re-enabled.",
      );
      await load();
    } finally {
      setBusyId(null);
    }
  }

  async function resendInvite(id: string) {
    setError(null);
    setSuccess(null);
    setBusyId(id);
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, resendInvite: true }),
      });
      const json = await response.json();
      if (!response.ok) {
        setError(json?.error?.message ?? "Could not resend invitation.");
        return;
      }
      setSuccess("Invitation email resent.");
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader
        eyebrow="Administration"
        title="Users & permissions"
        description="Invite staff by email and choose what they can do. Editors handle day-to-day content; Administrators also manage people, settings and privacy tools."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {(["editor", "administrator"] as const).map((key) => {
          const guide = STAFF_ROLE_GUIDE[key];
          return (
            <article
              key={key}
              className="rounded-2xl border border-border-default bg-bg-surface p-5"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-brand-magenta">
                {guide.label}
              </p>
              <p className="mt-1 text-sm text-text-muted">{guide.summary}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-brand-navy">
                {guide.can.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-state-success" aria-hidden>
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {guide.cannot.length ? (
                <ul className="mt-3 space-y-1.5 text-sm text-text-muted">
                  {guide.cannot.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden>×</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          );
        })}
      </div>

      <form
        onSubmit={onCreate}
        className="grid gap-3 rounded-2xl border border-border-default bg-bg-surface p-4 sm:grid-cols-2"
      >
        <p className="sm:col-span-2 text-sm font-semibold text-brand-navy">
          Invite someone new
        </p>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          placeholder="Full name"
          className="h-11 rounded-xl border border-border-default px-3 text-sm"
          aria-label="Full name"
        />
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          required
          placeholder="Email"
          className="h-11 rounded-xl border border-border-default px-3 text-sm"
          aria-label="Email"
        />
        <label className="sm:col-span-2 space-y-1 text-sm">
          <span className="font-medium text-brand-navy">Starting role</span>
          <select
            value={role}
            onChange={(event) =>
              setRole(event.target.value as "administrator" | "editor")
            }
            className="h-11 w-full rounded-xl border border-border-default px-3 text-sm"
            aria-label="Role"
          >
            <option value="editor">Editor — content and inbox</option>
            <option value="administrator">
              Administrator — full control including users & privacy
            </option>
          </select>
        </label>
        <div className="sm:col-span-2">
          <Button type="submit">Send invitation</Button>
        </div>
      </form>

      {error ? (
        <p className="text-sm text-brand-magenta" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="text-sm text-state-success" role="status">
          {success}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-text-muted">Loading users…</p>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border-default bg-bg-surface p-8 text-sm text-text-muted">
          No staff users in the database yet. Seed an administrator or invite
          one above.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            const busy = busyId === item.id;
            const canChangeRole = item.status !== "disabled" && !busy;
            return (
              <li
                key={item.id}
                className="rounded-2xl border border-border-default bg-bg-surface p-4"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="font-medium text-brand-navy">{item.name}</p>
                    <p className="text-sm text-text-muted">{item.email}</p>
                    <p className="mt-1 text-xs text-text-muted">
                      <span
                        className={cn(
                          "mr-2 inline-flex rounded-full px-2 py-0.5 font-semibold capitalize",
                          item.role === "administrator"
                            ? "bg-brand-navy text-text-on-inverse"
                            : "bg-blob-sky/50 text-brand-navy",
                        )}
                      >
                        {STAFF_ROLE_GUIDE[item.role].label}
                      </span>
                      <span
                        className={cn(
                          "mr-2 inline-flex rounded-full px-2 py-0.5 font-semibold capitalize",
                          item.status === "active" &&
                            "bg-state-success/15 text-state-success",
                          item.status === "invited" &&
                            "bg-state-warning/20 text-brand-navy",
                          item.status === "disabled" &&
                            "bg-state-error/15 text-state-error",
                        )}
                      >
                        {item.status}
                      </span>
                      created {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.status === "invited" ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={busy}
                        onClick={() => void resendInvite(item.id)}
                      >
                        Resend invite
                      </Button>
                    ) : null}
                    <Button
                      type="button"
                      size="sm"
                      variant={item.role === "editor" ? "secondary" : "outline"}
                      disabled={!canChangeRole || item.role === "editor"}
                      onClick={() => void setUserRole(item.id, "editor")}
                    >
                      Make Editor
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={
                        item.role === "administrator" ? "secondary" : "outline"
                      }
                      disabled={
                        !canChangeRole || item.role === "administrator"
                      }
                      onClick={() => void setUserRole(item.id, "administrator")}
                    >
                      Make Administrator
                    </Button>
                    {item.status === "disabled" ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={busy}
                        onClick={() => void setUserStatus(item.id, "active")}
                      >
                        Re-enable
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={busy || item.id === currentUserId}
                        onClick={() => void setUserStatus(item.id, "disabled")}
                      >
                        Disable
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
