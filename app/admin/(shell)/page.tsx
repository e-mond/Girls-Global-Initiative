import Link from "next/link";

async function DashboardCard({
  title,
  empty,
  href,
}: {
  title: string;
  empty: string;
  href?: string;
}) {
  return (
    <section className="rounded-xl border border-border-default bg-bg-surface p-5">
      <h3 className="font-display text-base font-semibold text-brand-navy">
        {title}
      </h3>
      <p className="mt-3 text-sm text-text-muted">{empty}</p>
      {href ? (
        <Link
          href={href}
          className="mt-4 inline-flex text-sm font-semibold text-brand-sky hover:underline"
        >
          Open
        </Link>
      ) : null}
    </section>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-brand-navy">
          Dashboard
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          Each summary loads independently so one failing source cannot blank
          the page.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <DashboardCard
          title="Recent submissions"
          empty="Review volunteer, partnership and contact submissions as they arrive."
          href="/admin/submissions"
        />
        <DashboardCard
          title="New subscribers"
          empty="Review pending and confirmed Letters for her future subscribers."
          href="/admin/subscribers"
        />
        <DashboardCard
          title="Recent donations"
          empty="Paystack donation records will appear here after the Donations unit."
          href="/admin/donations"
        />
      </div>
    </div>
  );
}
