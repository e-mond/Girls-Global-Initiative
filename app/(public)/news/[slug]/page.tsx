import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ContentSection,
  CtaBand,
  Prose,
} from "@/components/layout/content-section";
import { PageHeroEditorial } from "@/components/layout/public-page-intro";
import { ShareButtons } from "@/components/news/share-buttons";
import {
  getPublicNews,
  getPublicNewsBySlug,
} from "@/features/content/public-content";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

type PageParams = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const items = await getPublicNews();
  return items
    .filter((item) => !item.isPlaceholder)
    .map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublicNewsBySlug(slug);
  if (!post) {
    return buildPageMetadata({
      title: "News",
      description: "Girls Global Initiative news.",
      path: "/news",
    });
  }
  return buildPageMetadata({
    title: post.title,
    description: post.summary,
    path: `/news/${post.slug}`,
  });
}

function renderBlocks(body: string) {
  return body
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean);
}

export default async function NewsDetailPage({ params }: PageParams) {
  const { slug } = await params;
  const post = await getPublicNewsBySlug(slug);
  if (!post) notFound();

  const blocks = renderBlocks(post.body);

  return (
    <>
      <PageHeroEditorial
        breadcrumb="News"
        badge="Update"
        meta={post.publishedOn ?? "GGI news"}
        title={post.title}
        description={post.summary}
        tone="sky"
        ctas={[
          { href: "/news", label: "All news", variant: "secondary" },
          { href: "/#newsletter", label: "Subscribe" },
        ]}
      />

      {post.imageSrc ? (
        <div className="bg-bg-surface px-4 pb-4 lg:px-6">
          <div className="relative mx-auto aspect-[21/9] max-w-6xl overflow-hidden rounded-[1.75rem]">
            <Image
              src={post.imageSrc}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1100px"
            />
          </div>
        </div>
      ) : null}

      <ContentSection tone="surface" narrow>
        <Prose>
          {blocks.length > 0 ? (
            blocks.map((block) => {
              if (block.startsWith("## ")) {
                return (
                  <h2
                    key={block.slice(0, 48)}
                    className="font-display text-2xl font-bold text-brand-navy"
                  >
                    {block.replace(/^##\s+/, "")}
                  </h2>
                );
              }
              const linkMatch = block.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
              if (linkMatch) {
                return (
                  <p key={block.slice(0, 48)}>
                    <Link
                      href={linkMatch[2]}
                      className="font-semibold text-brand-sky hover:underline"
                    >
                      {linkMatch[1]}
                    </Link>
                  </p>
                );
              }
              return (
                <p key={block.slice(0, 48)} className="whitespace-pre-line">
                  {block}
                </p>
              );
            })
          ) : (
            <p>{post.summary}</p>
          )}
        </Prose>

        <ShareButtons
          className="mt-8"
          title={post.title}
          summary={post.summary}
          url={`/news/${post.slug}`}
        />

        <p className="mt-8">
          <Link
            href="/news"
            className="text-sm font-semibold text-brand-sky hover:underline"
          >
            ← Back to all news
          </Link>
        </p>
      </ContentSection>

      <CtaBand
        title="Stay closer to the work."
        primary={{ href: "/#newsletter", label: "Newsletter" }}
        secondary={{ href: "/events", label: "See events" }}
      />
    </>
  );
}
