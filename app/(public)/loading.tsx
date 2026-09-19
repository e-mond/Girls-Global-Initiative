/** Public segment loading skeleton. */
export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse space-y-4 px-4 py-16">
      <div className="h-4 w-24 rounded bg-border-default" />
      <div className="h-10 w-2/3 rounded bg-border-default" />
      <div className="h-4 w-full rounded bg-border-default" />
      <div className="h-4 w-5/6 rounded bg-border-default" />
    </div>
  );
}
