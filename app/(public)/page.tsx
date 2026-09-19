import { HomeCommunities } from "@/components/home/home-communities";
import { HomeFounder } from "@/components/home/home-founder";
import { HomeGetInvolved } from "@/components/home/home-get-involved";
import { HomeHero } from "@/components/home/home-hero";
import { HomeNewsletter } from "@/components/home/home-newsletter";
import { HomeOrigin } from "@/components/home/home-origin";
import { HomePillars } from "@/components/home/home-pillars";

/** Full homepage composition aligned to GGIHomepage.png. */
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeOrigin />
      <HomePillars />
      <HomeFounder />
      <HomeCommunities />
      <HomeGetInvolved />
      <HomeNewsletter />
    </>
  );
}
