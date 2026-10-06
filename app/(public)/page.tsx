import { HomeCommunities } from "@/components/home/home-communities";
import { HomeEvents } from "@/components/home/home-events";
import { HomeFounder } from "@/components/home/home-founder";
import { HomeGetInvolved } from "@/components/home/home-get-involved";
import { HomeHero } from "@/components/home/home-hero";
import { HomeNews } from "@/components/home/home-news";
import { HomeNewsletter } from "@/components/home/home-newsletter";
import { HomeOrigin } from "@/components/home/home-origin";
import { HomePillars } from "@/components/home/home-pillars";
import { HomeJsonLd } from "@/components/seo/json-ld";
import { PAGE_SEO } from "@/content/page-seo";
import { getSiteSettings } from "@/features/settings/service";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export async function generateMetadata() {
  return buildPageMetadata({
    title: PAGE_SEO.home.title,
    description: PAGE_SEO.home.description,
    path: "/",
  });
}

/** Full homepage composition aligned to GGIHomepage.png, plus news/events bands. */
export default async function HomePage() {
  const settings = await getSiteSettings();
  const sameAs = [
    settings.socialFacebook,
    settings.socialInstagram,
    settings.socialTiktok,
    settings.socialLinkedin,
  ].filter(Boolean);

  return (
    <>
      <HomeJsonLd sameAs={sameAs} />
      <HomeHero />
      <HomeOrigin />
      <HomePillars />
      <HomeFounder />
      <HomeCommunities />
      <HomeNews />
      <HomeEvents />
      <HomeGetInvolved />
      <HomeNewsletter />
    </>
  );
}
