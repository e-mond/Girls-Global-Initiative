import Image from "next/image";
import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { getPublicEvents } from "@/features/content/public-content";

/** Homepage events strip. Uses CMS when published; otherwise clear placeholders. */
export async function HomeEvents() {
  const items = await getPublicEvents(2);

  return (
    <section className="bg-blob-sky/30 px-4 py-16 lg:px-6 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brand-magenta">
              Events
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-brand-navy sm:text-4xl">
              Invitations and outreach.
            </h2>
          </div>
          <Link
            href="/events"
            className="text-sm font-semibold text-brand-sky hover:underline"
          >
            All events
          </Link>
        </Reveal>
        <Stagger className="mt-10 grid gap-5 lg:grid-cols-2">
          {items.map((item) => (
            <StaggerItem key={item.id}>
              <article className="grid overflow-hidden rounded-[1.5rem] border border-border-default bg-bg-surface sm:grid-cols-[160px_1fr]">
                <div className="relative min-h-[140px] bg-blob-pink/30">
                  {item.imageSrc ? (
                    <Image
                      src={item.imageSrc}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  ) : null}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl font-bold text-brand-navy">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">
                    {item.summary}
                  </p>
                  <Link
                    href="/partner"
                    className="mt-4 inline-flex text-sm font-semibold text-brand-magenta hover:underline"
                  >
                    Invite GGI
                  </Link>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
