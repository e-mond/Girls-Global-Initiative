import Link from "next/link";

/** Shared stub page body for public routes until Unit 2 content lands. */
export function PageStub({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <p className="mb-2 text-sm font-medium text-brand-sky">Placeholder</p>
      <h1 className="font-display text-3xl font-bold text-brand-navy sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 text-text-muted">{description}</p>
      <p className="mt-8 text-sm text-text-muted">
        Full content arrives in a later roadmap unit.{" "}
        <Link href="/" className="text-brand-sky hover:underline">
          Return home
        </Link>
      </p>
    </section>
  );
}
