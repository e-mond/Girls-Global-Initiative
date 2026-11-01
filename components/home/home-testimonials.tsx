import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { getPublicTestimonials } from "@/features/content/public-content";

/** Homepage quotes from published CMS testimonials (hidden when empty). */
export async function HomeTestimonials() {
  const items = await getPublicTestimonials(3);
  if (items.length === 0) return null;

  return (
    <section className="bg-bg-base px-4 py-16 lg:px-6 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-wide text-brand-magenta">
            Voices
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-brand-navy sm:text-4xl">
            Words from the circle.
          </h2>
        </Reveal>
        <Stagger className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map((item) => (
            <StaggerItem key={item.id}>
              <blockquote className="flex h-full flex-col rounded-[1.5rem] border border-border-default bg-bg-surface p-6">
                <p className="flex-1 text-sm leading-relaxed text-brand-navy">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <footer className="mt-4">
                  <p className="text-sm font-semibold text-brand-navy">
                    {item.attribution}
                  </p>
                  {item.roleLabel ? (
                    <p className="mt-0.5 text-xs text-text-muted">
                      {item.roleLabel}
                    </p>
                  ) : null}
                </footer>
              </blockquote>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
