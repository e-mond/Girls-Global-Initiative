/**
 * Mock-backed homepage / public content for Unit 2.
 * Copy aligned to approved section screenshots / GGIHomepage.png.
 * Replace with CMS-published entities when Unit 3 writes ship.
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
  { label: "Poverty", icon: "calendar" as const },
  { label: "Early pregnancy", icon: "globe" as const },
  { label: "School dropout", icon: "book" as const },
  { label: "Menstrual health", icon: "droplet" as const },
  { label: "Lack of guidance", icon: "check" as const },
  { label: "Limited opportunities", icon: "briefcase" as const },
] as const;

export const pillars: Pillar[] = [
  {
    slug: "rights-dignity",
    title: "Rights & dignity",
    shortTitle: "Rights & dignity",
    description:
      "Helping girls understand their rights and speak up for dignity in their homes, schools and communities.",
    detail:
      "We equip girls with knowledge of their rights, confidence, leadership skills and the ability to speak up, make informed decisions and participate meaningfully in their communities. We also advocate for safer, more supportive environments and engage communities on barriers to education, abuse, harmful practices, early pregnancy and limited opportunities.",
    tone: "navy",
  },
  {
    slug: "health-wellbeing",
    title: "Health & wellbeing",
    shortTitle: "Health & wellbeing",
    description:
      "Opening space for menstrual health, reproductive knowledge and emotional wellbeing without shame.",
    detail:
      "We promote health information, menstrual health education, personal hygiene awareness and practical support that helps girls understand and care for their bodies and general wellbeing, with conversations that are practical, respectful and grounded in community trust.",
    tone: "magenta",
  },
  {
    slug: "confidence-growth",
    title: "Confidence & growth",
    shortTitle: "Confidence & growth",
    description:
      "Building confidence through learning, leadership practice, physical development and safe spaces to grow.",
    detail:
      "We encourage girls' participation in physical education and healthy physical development as part of confidence, wellbeing, discipline and teamwork. We also support girls facing educational barriers with learning resources, school engagement and partnerships that help them remain in school.",
    tone: "sky",
  },
  {
    slug: "mentorship-opportunity",
    title: "Mentorship & opportunity",
    shortTitle: "Mentorship & opportunity",
    description:
      "Connecting girls with mentors and pathways toward education and opportunity.",
    detail:
      "We connect girls with mentors, professionals and positive role models who can provide guidance, encouragement, career awareness, decision-making support and practical life skills while strengthening educational pathways that keep opportunity within reach.",
    tone: "cream",
  },
];

export const founderSpotlight = {
  name: "Philomena Ofori Larbi",
  role: "Founder & Executive Director",
  badge: "Leadership with lived understanding",
  quote: "We started GGI so no girl has to figure it all out alone.",
  body: "Philomena leads Girls Global Initiative as a youth-led movement rooted in community. Under her direction, GGI centres girls' voices, pairing rights education and health support with the mentorship, guidance and encouragement every girl deserves.",
  imageSrc: "/home/founder.jpg",
  callouts: [
    {
      title: "Advocacy first",
      body: "Girls' rights at the centre",
      icon: "megaphone" as const,
    },
    {
      title: "Stay in school",
      body: "Support to keep learning",
      icon: "graduation" as const,
    },
    {
      title: "Community-led",
      body: "Built with local voices",
      icon: "users" as const,
    },
  ],
};

/**
 * Public team roster from owner-supplied assets (names/roles as provided).
 * Eugenia photo pending. Placeholder used until the real image arrives.
 * Display spellings follow BRD/PRD (Philomena) even where filenames differ.
 */
export const teamMembers = [
  {
    id: "philomena-ofori-larbi",
    name: "Philomena Ofori Larbi",
    role: "Founder & Executive Director",
    imageSrc: "/team/philomena-ofori-larbi.jpg",
    isFounder: true,
    photoPending: false,
  },
  {
    id: "godwin-ntaah",
    name: "Godwin Ntaah",
    role: "Vice President",
    imageSrc: "/team/godwin-ntaah.jpg",
    isFounder: false,
    photoPending: false,
  },
  {
    id: "myriam-akushieka-abiwu",
    name: "Myriam Akushieka Abiwu",
    role: "Programs Coordinator",
    imageSrc: "/team/myriam-akushieka-abiwu.jpg",
    isFounder: false,
    photoPending: false,
  },
  {
    id: "angela-selasi-amekuedi",
    name: "Angela Selasi Amekuedi",
    role: "Rural Girls Outreach Officer",
    imageSrc: "/team/angela-selasi-amekuedi.jpg",
    isFounder: false,
    photoPending: false,
  },
  {
    id: "benewa-osmani",
    name: "Benewa Osmani",
    role: "Secretary",
    imageSrc: "/team/benewa-osmani.jpg",
    isFounder: false,
    photoPending: false,
  },
  {
    id: "eugenia-yaa-nkebuare",
    name: "Eugenia Yaa Nkebuare",
    role: "Executive Secretary",
    imageSrc: "/team/eugenia-yaa-nkebuare-placeholder.jpg",
    isFounder: false,
    photoPending: true,
  },
] as const;

export const communityStories = [
  {
    id: "school",
    title: "Staying in school",
    caption: "Encouragement to keep learning",
    imageSrc: "/home/community-1.jpg",
    badge: null as string | null,
  },
  {
    id: "circles",
    title: "Circles of support",
    caption: "Guidance, mentorship & friendship",
    imageSrc: "/home/community-2.jpg",
    badge: null as string | null,
  },
  {
    id: "health",
    title: "Health & confidence",
    caption: "Knowledge for body and mind",
    imageSrc: "/home/community-3.jpg",
    badge: "her future matters",
  },
] as const;

export const originCopy = {
  eyebrow: "Our origin",
  title: "Born from listening. Built around girls.",
  body: "GGI was born from a conversation between two young women who recognised the challenges affecting girls in their communities and decided to act. The initiative was created around girls' empowerment, education and advocacy.",
  facingLabel: "What girls told us they were facing:",
  howItStarted:
    "A conversation between two young women who saw girls in their communities being left behind.",
  vision:
    "A world where every girl, regardless of location or background, has the rights, knowledge, health, support and opportunities to reach her full potential.",
  mission:
    "To educate, empower and support girls in rural, remote and underserved communities and connect them to mentorship, guidance and opportunities.",
};

export const communitiesCopy = {
  eyebrow: "Where we work",
  title: "Rural, remote & underserved: first, not last.",
  body: "We go where guidance is thinnest and potential is greatest: the villages, towns and neighbourhoods where a mentor, a health lesson or a listening ear can change a girl's trajectory.",
  ctaTitle: "Is your community next?",
  ctaBody:
    "We partner with schools, families and local leaders to bring GGI conversations and support to girls who need it most. Tell us about your community.",
};

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
