import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { ReportDetailView } from "@/components/reports/report-detail-view";
import {
  getPublicNewsBySlug,
  getPublicReports,
} from "@/features/content/public-content";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

type PageParams = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const items = await getPublicReports();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const report = await getPublicNewsBySlug(slug);
  if (!report || report.kind !== "report") {
    return buildPageMetadata({
      title: "Report",
      description: "Girls Global Initiative programme reports.",
      path: "/reports",
    });
  }
  return buildPageMetadata({
    title: report.title,
    description: report.summary,
    path: `/reports/${report.slug}`,
  });
}

export default async function ReportDetailPage({ params }: PageParams) {
  const { slug } = await params;
  const item = await getPublicNewsBySlug(slug);
  if (!item) notFound();
  if (item.kind !== "report") {
    redirect(`/news/${item.slug}`);
  }
  return <ReportDetailView report={item} />;
}
