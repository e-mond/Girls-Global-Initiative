import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { listAttentionItems } from "@/features/admin/attention";
import { listDonations } from "@/features/donations/service";
import { listSubscribers } from "@/features/newsletter/service";
import { listSubmissions } from "@/features/submissions/service";
import { auth } from "@/auth";

async function safeCount(loader: () => Promise<number>) {
  try {
    return await loader();
  } catch {
    return null;
  }
}

export default async function AdminDashboardPage() {
  const session = await auth();
  const name = session?.user?.name?.split(" ")[0] ?? "there";

  const [newVolunteer, newPartnership, newContact, donations, subscribers, attention] =
    await Promise.all([
      safeCount(async () =>
        (await listSubmissions("volunteer")).filter((i) => i.status === "new")
          .length,
      ),
      safeCount(async () =>
        (await listSubmissions("partnership")).filter((i) => i.status === "new")
          .length,
      ),
      safeCount(async () =>
        (await listSubmissions("contact")).filter((i) => i.status === "new")
          .length,
      ),
      safeCount(async () => (await listDonations()).length),
      safeCount(async () =>
        (await listSubscribers()).filter((i) => i.status === "subscribed")
          .length,
      ),
      listAttentionItems(6).catch(() => []),
    ]);

  const newSubmissions =
    newVolunteer !== null && newPartnership !== null && newContact !== null
      ? newVolunteer + newPartnership + newContact
      : null;

  const metrics = [
    {
      label: "Needs review",
      value: newSubmissions,
      href: "/admin/submissions",
      hint: "New submissions",
    },
    {
      label: "Donations logged",
      value: donations,
      href: "/admin/donations",
      hint: "All recorded gifts",
    },
    {
      label: "Active subscribers",
      value: subscribers,
      href: "/admin/subscribers",
      hint: "Confirmed list",
    },
  ] as const;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Overview"
        title={`Welcome, ${name}`}
        description="See what needs attention, recent activity, and quick paths into day-to-day work."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        {metrics.map((metric) => (
          <Link
            key={metric.label}
            href={metric.href}
            className="rounded-2xl border border-border-default bg-bg-surface p-5 transition hover:border-brand-sky/40"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-text-muted">
              {metric.label}
            </p>
            <p className="mt-3 font-display text-3xl font-bold text-brand-navy">
              {metric.value === null ? "—" : metric.value}
            </p>
            <p className="mt-1 text-sm text-text-muted">{metric.hint}</p>
          </Link>
        ))}
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-border-default bg-bg-surface p-5">
          <h3 className="font-display text-lg font-bold text-brand-navy">
            Needs attention
          </h3>
          {attention.length === 0 ? (
            <p className="mt-4 text-sm text-text-muted">
              You&apos;re all caught up. New submissions and donations will
              appear here.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {attention.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="flex items-start justify-between gap-3 rounded-xl px-3 py-2.5 hover:bg-bg-base"
                  >
                    <span className="text-sm font-medium text-brand-navy">
                      {item.title}
                    </span>
                    <span className="shrink-0 text-xs text-text-muted">
                      {item.when}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-border-default bg-bg-surface p-5">
          <h3 className="font-display text-lg font-bold text-brand-navy">
            Quick actions
          </h3>
          <ul className="mt-4 space-y-2">
            {[
              { href: "/admin/submissions", label: "Review submissions" },
              { href: "/admin/content", label: "Manage content" },
              { href: "/admin/content/media", label: "Open media library" },
              { href: "/admin/subscribers", label: "View subscribers" },
            ].map((action) => (
              <li key={action.href}>
                <Link
                  href={action.href}
                  className="flex min-h-11 items-center rounded-xl border border-border-default px-3 text-sm font-semibold text-brand-navy hover:border-brand-sky/40"
                >
                  {action.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
