import { auth } from "@/auth";
import { AdminSignOutButton } from "@/components/admin/admin-sign-out-button";

/** Admin top bar with session identity and sign-out. */
export async function AdminTopbar({ title }: { title: string }) {
  const session = await auth();

  return (
    <header className="flex h-14 items-center justify-between border-b border-border-default bg-bg-surface px-6">
      <h1 className="font-display text-lg font-semibold text-brand-navy">
        {title}
      </h1>
      <div className="flex items-center gap-3">
        {session?.user ? (
          <p className="text-xs text-text-muted">
            {session.user.name} · {session.user.role}
          </p>
        ) : null}
        <AdminSignOutButton />
      </div>
    </header>
  );
}
