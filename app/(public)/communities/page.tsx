import { HomeCommunities } from "@/components/home/home-communities";
import { PublicPageIntro } from "@/components/layout/public-page-intro";

export default function CommunitiesPage() {
  return (
    <>
      <PublicPageIntro
        eyebrow="Communities"
        title="Rural, remote & underserved — first, not last."
        description="GGI prioritises communities that are often reached last. Gallery captions and locations will be CMS-managed."
      />
      <HomeCommunities showIntro={false} />
    </>
  );
}
