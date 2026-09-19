/** Admin top bar shell for title and future session actions. */
export function AdminTopbar({ title }: { title: string }) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border-default bg-bg-surface px-6">
      <h1 className="font-display text-lg font-semibold text-brand-navy">
        {title}
      </h1>
      <p className="text-xs text-text-muted">
        Authentication ships in a later unit
      </p>
    </header>
  );
}
