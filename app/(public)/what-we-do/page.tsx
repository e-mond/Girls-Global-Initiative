import { HomePillars } from "@/components/home/home-pillars";
import { PublicPageIntro } from "@/components/layout/public-page-intro";

export default function WhatWeDoPage() {
  return (
    <>
      <PublicPageIntro
        eyebrow="What we do"
        title="Four ways we walk alongside girls."
        description="GGI organises its work around rights and dignity, health and wellbeing, confidence and growth, and mentorship and opportunity."
      />
      <HomePillars showIntro={false} />
    </>
  );
}
