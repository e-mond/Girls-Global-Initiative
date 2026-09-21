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
  createdAt: string;
  lastLoginAt: string | null;
};

export default function AdminUsersPageClient() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"administrator" | "editor">("editor");
  const [password, setPassword] = useState("");

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
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, role, password }),
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json?.error?.message ?? "Could not create user.");
      return;
    }
    setName("");
    setEmail("");
    setPassword("");
    setRole("editor");
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

  return (
    <section className="space-y-6">
      <AdminPageHeader
        eyebrow="Administration"
        title="Users"
        description="Invite and manage staff accounts. Roles are Administrator or Editor only."
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
          className="h-11 rounded-xl border border-border-default px-3 text-sm"
          aria-label="Role"
        >
          <option value="editor">Editor</option>
          <option value="administrator">Administrator</option>
        </select>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          required
          minLength={8}
          placeholder="Temporary password (min 8)"
          className="h-11 rounded-xl border border-border-default px-3 text-sm"
          aria-label="Temporary password"
        />
        <div className="sm:col-span-2">
          <Button type="submit">Add staff user</Button>
        </div>
      </form>

      {error ? (
        <p className="text-sm text-brand-magenta" role="alert">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-text-muted">Loading users…</p>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border-default bg-bg-surface p-8 text-sm text-text-muted">
          No staff users in the database yet. Seed an administrator or add one
          above.
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
                    created {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={item.role === "editor" ? "secondary" : "outline"}
                    disabled={item.role === "editor"}
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
                    disabled={item.role === "administrator"}
                    onClick={() => void setUserRole(item.id, "administrator")}
                  >
                    Administrator
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
