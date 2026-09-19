/**
 * Mock-backed homepage / public content for Unit 2.
 * Replace with CMS-published entities when Unit 3 writes ship.
 * Copy follows GGIHomepage.png / BRD pillar names — no fabricated impact stats.
 */

export type PillarSlug =
  | "rights-dignity"
  | "health-wellbeing"
  | "confidence-growth"
  | "mentorship-opportunity";

export type Pillar = {
  slug: PillarSlug;
  title: string;
  shortTitle: string;
  description: string;
  detail: string;
  tone: "navy" | "magenta" | "sky" | "cream";
};

export const challengeTags = [
  "Poverty",
  "Early pregnancy",
  "School dropout",
  "Menstrual health",
  "Lack of guidance",
  "Limited opportunities",
] as const;

export const pillars: Pillar[] = [
  {
    slug: "rights-dignity",
    title: "Rights & dignity",
    shortTitle: "Rights & dignity",
    description:
      "Helping girls understand their rights and speak up for dignity in their homes, schools and communities.",
    detail:
      "We walk alongside girls so they know their rights, recognise harm, and find trusted adults and peers who will stand with them. Content on this page will expand as CMS-managed pillar copy is published.",
    tone: "navy",
  },
  {
    slug: "health-wellbeing",
    title: "Health & wellbeing",
    shortTitle: "Health & wellbeing",
    description:
      "Opening space for menstrual health, reproductive knowledge and emotional wellbeing without shame.",
    detail:
      "Health conversations start where girls are — practical, respectful and grounded in community trust. Expanded programme detail will be managed through the back-office CMS.",
    tone: "magenta",
  },
  {
    slug: "confidence-growth",
    title: "Confidence & growth",
    shortTitle: "Confidence & growth",
    description:
      "Building confidence through learning, leadership practice and safe spaces to grow.",
    detail:
      "Confidence grows when girls are seen, heard and trusted with responsibility. This pillar’s fuller narrative will be CMS-editable after Unit 3.",
    tone: "sky",
  },
  {
    slug: "mentorship-opportunity",
    title: "Mentorship & opportunity",
    shortTitle: "Mentorship & opportunity",
    description:
      "Connecting girls with mentors and pathways toward education and opportunity.",
    detail:
      "Mentorship and opportunity keep girls from navigating hard choices alone. Detailed mentor pathways will be published from the CMS.",
    tone: "cream",
  },
];

export const founderSpotlight = {
  name: "Philomena Ofori Larbi",
  role: "Founder & Executive Director",
  quote: "We started GGI so no girl has to figure it all out alone.",
  callouts: [
    {
      title: "Advocacy first",
      body: "We centre girls’ voices when shaping programmes and partnerships.",
    },
    {
      title: "Stay involved",
      body: "Support continues beyond a single workshop or conversation.",
    },
    {
      title: "Community-led",
      body: "Rural and underserved communities are first, not last.",
    },
  ],
};

export const communityStories = [
  {
    id: "school",
    title: "Staying in school",
    caption: "Supporting girls to remain in learning pathways.",
    imageSrc: "/home/community-1.jpg",
  },
  {
    id: "circles",
    title: "Circles of support",
    caption: "Peer spaces where girls can speak and be heard.",
    imageSrc: "/home/community-2.jpg",
  },
  {
    id: "health",
    title: "Health & confidence",
    caption: "Practical wellbeing conversations without stigma.",
    imageSrc: "/home/community-3.jpg",
  },
] as const;

export const getInvolvedCards = [
  {
    href: "/get-involved/donate",
    title: "Donate & support",
    body: "Fuel programmes that keep girls seen, supported and thriving.",
    cta: "Give today",
    tone: "magenta" as const,
  },
  {
    href: "/get-involved/volunteer",
    title: "Volunteer & mentor",
    body: "Share time and skills with girls who need a steady guide.",
    cta: "Become a mentor",
    tone: "navy" as const,
  },
  {
    href: "/get-involved/advocate",
    title: "Raise your voice",
    body: "Help carry girls’ stories into rooms where decisions are made.",
    cta: "Spread the word",
    tone: "sky" as const,
  },
];

export function getPillar(slug: string): Pillar | undefined {
  return pillars.find((pillar) => pillar.slug === slug);
}
