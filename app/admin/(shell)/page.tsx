export default function AdminDashboardPage() {
  return (
    <section className="space-y-4 rounded-xl border border-border-default bg-bg-surface p-6">
      <h2 className="font-display text-xl font-semibold text-brand-navy">
        Dashboard
      </h2>
      <p className="text-sm text-text-muted">
        Submission, subscriber, and donation summaries will load independently
        here in later units. Authentication is not yet enforced.
      </p>
    </section>
  );
}
