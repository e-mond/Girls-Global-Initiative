import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ContentSection,
  CtaBand,
  Prose,
} from "@/components/layout/content-section";
import { PageHeroEditorial } from "@/components/layout/public-page-intro";
import { ContainImage } from "@/components/media/contain-image";
import { CmsMarkdown } from "@/components/content/cms-markdown";
import { ShareButtons } from "@/components/news/share-buttons";
import {
  getPublicNewsBySlug,
  getPublicNewsFeed,
} from "@/features/content/public-content";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

type PageParams = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const items = await getPublicNewsFeed();
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
  if (post.kind === "report") {
    return buildPageMetadata({
      title: post.title,
      description: post.summary,
      path: `/reports/${post.slug}`,
    });
  }
  return buildPageMetadata({
    title: post.title,
    description: post.summary,
    path: `/news/${post.slug}`,
  });
}

export default async function NewsDetailPage({ params }: PageParams) {
  const { slug } = await params;
  const post = await getPublicNewsBySlug(slug);
  if (!post) notFound();
  if (post.kind === "report") {
    redirect(`/reports/${post.slug}`);
  }

  return (
    <>
      <PageHeroEditorial
        breadcrumb="News"
        badge={
          post.contentStatus === "archived"
            ? "Archive"
            : post.kind === "newsletter"
              ? "Newsletter"
              : "Update"
        }
        meta={post.publishedOn ?? "GGI news"}
        title={post.title}
        description={post.summary}
        tone="sky"
        ctas={[
          { href: "/news", label: "All news", variant: "secondary" },
          { href: "/reports", label: "Reports" },
        ]}
      />

      {post.imageSrc ? (
        <div className="bg-bg-surface px-4 pb-6 lg:px-6">
          <ContainImage
            src={post.imageSrc}
            alt={post.title}
            variant="detail"
            priority
          />
        </div>
      ) : null}

      <ContentSection tone="surface" narrow>
        <Prose>
          {post.body.trim() ? (
            <CmsMarkdown body={post.body} />
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
        secondary={{ href: "/reports", label: "Programme reports" }}
      />
    </>
  );
}
