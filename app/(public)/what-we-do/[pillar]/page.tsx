import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicPageIntro } from "@/components/layout/public-page-intro";
import { getPillar, pillars } from "@/features/content/mock-home";

export function generateStaticParams() {
  return pillars.map((pillar) => ({ pillar: pillar.slug }));
}

export default async function PillarDetailPage({
  params,
}: {
  params: Promise<{ pillar: string }>;
}) {
  const { pillar: slug } = await params;
  const pillar = getPillar(slug);
  if (!pillar) notFound();

  return (
    <>
      <PublicPageIntro
        eyebrow="What we do"
        title={pillar.title}
        description={pillar.description}
      >
        <p className="text-base leading-relaxed text-text-muted">
          {pillar.detail}
        </p>
        <p className="mt-6 text-sm text-text-muted">
          <Link href="/what-we-do" className="text-brand-sky hover:underline">
            Back to all pillars
          </Link>
        </p>
      </PublicPageIntro>
    </>
  );
}
