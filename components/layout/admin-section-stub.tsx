/** Reusable empty admin section placeholder. */
export function AdminSectionStub({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <section className="space-y-2 rounded-xl border border-border-default bg-bg-surface p-6">
      <h2 className="font-display text-lg font-semibold text-brand-navy">
        {title}
      </h2>
      <p className="text-sm text-text-muted">
        {description ??
          "This admin section is scaffolded and will expand in a later unit."}
      </p>
    </section>
  );
}
