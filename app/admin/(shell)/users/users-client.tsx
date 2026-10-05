"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
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
      body: JSON.stringify({ name, email, role }),
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json?.error?.message ?? "Could not invite user.");
      return;
    }
    setName("");
    setEmail("");
    setRole("editor");
    setSuccess(`Invitation sent to ${json.data.item.email}.`);
    await load();
  }

  async function setUserRole(id: string, next: "administrator" | "editor") {
    if (
      !window.confirm(
        `Change this staff account to ${next === "administrator" ? "Administrator" : "Editor"}?`,
      )
    ) {
      return;
    }
    setError(null);
    setSuccess(null);
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
    await load();
  }

  async function setUserStatus(id: string, status: "active" | "disabled") {
    const label = status === "disabled" ? "disable" : "re-enable";
    if (!window.confirm(`Are you sure you want to ${label} this staff account?`)) {
      return;
    }
    setError(null);
    setSuccess(null);
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
  }

  async function resendInvite(id: string) {
    setError(null);
    setSuccess(null);
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
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader
        eyebrow="Administration"
        title="Users"
        description="Invite staff by email. They choose their own password from the invitation link."
      />

      <form
        onSubmit={onCreate}
        className="grid gap-3 rounded-2xl border border-border-default bg-bg-surface p-4 sm:grid-cols-2"
      >
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
        <select
          value={role}
          onChange={(event) =>
            setRole(event.target.value as "administrator" | "editor")
          }
          className="h-11 rounded-xl border border-border-default px-3 text-sm sm:col-span-2"
          aria-label="Role"
        >
          <option value="editor">Editor</option>
          <option value="administrator">Administrator</option>
        </select>
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
          {items.map((item) => (
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
                      {item.role}
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
                      onClick={() => void resendInvite(item.id)}
                    >
                      Resend invite
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    size="sm"
                    variant={item.role === "editor" ? "secondary" : "outline"}
                    disabled={item.role === "editor" || item.status === "disabled"}
                    onClick={() => void setUserRole(item.id, "editor")}
                  >
                    Editor
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={
                      item.role === "administrator" ? "secondary" : "outline"
                    }
                    disabled={
                      item.role === "administrator" || item.status === "disabled"
                    }
                    onClick={() => void setUserRole(item.id, "administrator")}
                  >
                    Administrator
                  </Button>
                  {item.status === "disabled" ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => void setUserStatus(item.id, "active")}
                    >
                      Re-enable
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={item.id === currentUserId}
                      onClick={() => void setUserStatus(item.id, "disabled")}
                    >
                      Disable
                    </Button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
