async function DashboardCard({
  title,
  empty,
}: {
  title: string;
  empty: string;
}) {
  return (
    <section className="rounded-xl border border-border-default bg-bg-surface p-5">
      <h3 className="font-display text-base font-semibold text-brand-navy">
        {title}
      </h3>
      <p className="mt-3 text-sm text-text-muted">{empty}</p>
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
          Each summary loads independently. Submission, subscriber and donation
          counts will populate when those units ship.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <DashboardCard
          title="Recent submissions"
          empty="No submissions yet. Volunteer, partnership and contact workflows arrive in a later unit."
        />
        <DashboardCard
          title="New subscribers"
          empty="No newsletter activity yet. Subscriber management arrives in a later unit."
        />
        <DashboardCard
          title="Recent donations"
          empty="No donation records yet. Paystack sync arrives in a later unit."
        />
      </div>
    </div>
  );
}
