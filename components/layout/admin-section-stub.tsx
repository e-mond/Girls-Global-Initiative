/** Reusable empty admin section placeholder for Foundations. */
export function AdminSectionStub({ title }: { title: string }) {
  return (
    <section className="space-y-2 rounded-xl border border-border-default bg-bg-surface p-6">
      <h2 className="font-display text-lg font-semibold text-brand-navy">
        {title}
      </h2>
      <p className="text-sm text-text-muted">
        This admin section is a layout shell placeholder for Foundations.
      </p>
    </section>
  );
}
