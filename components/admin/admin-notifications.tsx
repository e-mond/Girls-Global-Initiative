"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

type AttentionItem = {
  id: string;
  title: string;
  href: string;
  when: string;
};

/** Topbar notifications panel fed by real attention items (no fake badges). */
export function AdminNotifications() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AttentionItem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/attention");
      const json = await response.json();
      if (!response.ok) {
        throw new Error(
          json?.error?.message ?? "Could not load notifications.",
        );
      }
      const next = (json.data.items ?? []) as AttentionItem[];
      setItems(next);
      setCount(next.length);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load notifications.",
      );
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!open) return;
    void load();
  }, [open, load]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const ariaLabel =
    count > 0
      ? `Notifications — ${count} needing attention`
      : "Notifications";

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className={cn(
          "relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border-default bg-bg-base text-brand-navy hover:bg-bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky",
          open && "border-brand-sky/40",
        )}
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        aria-label={ariaLabel}
        onClick={() => setOpen((value) => !value)}
      >
        <Bell className="h-4 w-4" aria-hidden />
        {count > 0 ? (
          <span
            aria-hidden
            className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-magenta"
          />
        ) : null}
      </button>
      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 top-full z-40 mt-2 w-[min(100vw-2rem,22rem)] rounded-2xl border border-border-default bg-bg-surface p-3 shadow-md"
        >
          <p className="px-2 pb-2 text-xs font-bold uppercase tracking-wide text-text-muted">
            Notifications
          </p>
          {loading ? (
            <p className="px-2 py-4 text-sm text-text-muted">Loading…</p>
          ) : error ? (
            <p className="px-2 py-4 text-sm text-brand-magenta" role="alert">
              {error}
            </p>
          ) : items.length === 0 ? (
            <p className="px-2 py-6 text-sm text-text-muted">
              You&apos;re all caught up.
            </p>
          ) : (
            <ul className="max-h-80 space-y-1 overflow-y-auto">
              {items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="block rounded-xl px-3 py-2.5 hover:bg-bg-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky"
                    onClick={() => setOpen(false)}
                  >
                    <p className="text-sm font-medium text-brand-navy">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-xs text-text-muted">{item.when}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
