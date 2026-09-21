import Image from "next/image";
import Link from "next/link";
import { getPublicNews } from "@/features/content/public-content";

/** Homepage news strip. Uses CMS when published; otherwise clear placeholders. */
export async function HomeNews() {
  const items = await getPublicNews(2);

  return (
    <section className="bg-bg-surface px-4 py-16 lg:px-6 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brand-magenta">
              News
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-brand-navy sm:text-4xl">
              Updates from the field.
            </h2>
          </div>
          <Link
            href="/news"
            className="text-sm font-semibold text-brand-sky hover:underline"
          >
            All news
          </Link>
        </div>
        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          {items.map((item) => (
            <li key={item.id}>
              <article className="flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-border-default bg-bg-base">
                {item.imageSrc ? (
                  <div className="relative h-44">
                    <Image
                      src={item.imageSrc}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-xl font-bold text-brand-navy">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">
                    {item.summary}
                  </p>
                  {item.isPlaceholder ? (
                    <p className="mt-3 text-xs text-text-muted">Placeholder</p>
                  ) : null}
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
