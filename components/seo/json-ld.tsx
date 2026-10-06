import { getSiteOrigin } from "@/lib/seo/site-origin";

type JsonLdProps = {
  sameAs?: string[];
};

/**
 * Organization + WebSite structured data for the homepage.
 * Does not invent address, phone, or unverified org facts.
 */
export function HomeJsonLd({ sameAs = [] }: JsonLdProps) {
  const origin = getSiteOrigin();
  const filteredSameAs = sameAs.filter((url) => url.trim().length > 0);

  const graph = [
    {
      "@type": "Organization",
      "@id": `${origin}/#organization`,
      name: "Girls Global Initiative",
      url: origin,
      logo: `${origin}/brand/ggi-logo.png`,
      ...(filteredSameAs.length > 0 ? { sameAs: filteredSameAs } : {}),
    },
    {
      "@type": "WebSite",
      "@id": `${origin}/#website`,
      url: origin,
      name: "Girls Global Initiative",
      publisher: { "@id": `${origin}/#organization` },
    },
  ];

  const payload = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
