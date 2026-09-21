/**
 * Public site copy from content-reference.md (extracted from GGI.pdf).
 * Use verbatim or lightly edited. Do not invent claims or impact numbers.
 */

export const TAGLINE =
  "We Do It Because We Can. Creating opportunities. Shaping futures.";

export const FOUNDER_MESSAGE = {
  paragraphs: [
    "Girls Global Initiative was born from a simple conviction: every girl deserves the opportunity to dream, learn, grow, lead and build a meaningful future, regardless of where she is born.",
    "Our work is inspired by the realities facing girls in rural, remote and underserved communities, where poverty, limited educational opportunities, inadequate health and menstrual support, poor parental guidance, harmful social norms, early pregnancy and marriage, abuse, school dropout and geographical isolation can limit a girl's potential.",
    "These challenges often create a gap between girls in rural communities and their peers in urban areas, leaving rural girls with fewer opportunities, resources, guidance and support.",
    "With purpose and commitment, Girls Global Initiative exists to help close this gap. We are committed to reaching girls where the barriers are greatest and equipping them with the knowledge, confidence and support to shape their own futures.",
    "Through girls' rights, health and wellbeing, menstrual health education, physical education, advocacy, mentorship and guidance, we work to help girls stay in school, understand their rights, make informed decisions, develop confidence and pursue their aspirations.",
    "We believe that no girl should be left behind because of poverty, geography or circumstance. Every girl deserves the opportunity to grow with dignity, discover her potential and become all she is capable of becoming.",
  ],
  signatureName: "Philomena Ofori Larbi",
  signatureRole: "Founder & Executive Director, Girls Global Initiative",
} as const;

export const OUR_STORY = {
  intro: [
    "Girls Global Initiative (GGI) is a youth-led organisation focused exclusively on advancing the rights, dignity, health, wellbeing and potential of girls, particularly girls living in rural, remote and underserved communities. The organisation was born from a heartfelt conversation between two young women who recognised the challenges confronting girls in their communities, including poverty, early pregnancy, school dropout, limited opportunities, menstrual health challenges and the absence of adequate guidance and support systems. That conversation gave birth to an initiative centred on girls' empowerment, education and advocacy.",
    "GGI began as YMK Foundation (You Must Know Foundation), where the founders conducted school tours, engaged girls in conversations around self-worth and confidence, provided sanitary items and created safe spaces for girls to speak openly about their experiences. In December 2024, the organisation evolved into Girls Global Initiative, reflecting a clearer and more focused commitment to girls and to communities where girls face significant barriers.",
    "Today, GGI works to create meaningful opportunities for girls through education, girls' rights awareness, health and wellbeing, menstrual health education, physical education, mentorship, guidance, advocacy and community-based initiatives. Our work is especially directed toward rural and underserved communities, where structural and social barriers can limit a girl's ability to access the same opportunities available to girls in urban areas.",
  ],
  belief: "When girls are empowered, communities thrive and nations transform.",
  vision:
    "A world where every girl, regardless of her location or background, has the rights, knowledge, health, support and opportunities to reach her full potential and make informed decisions about her life.",
  mission:
    "To educate, empower and support girls in rural, remote and underserved communities by advancing their rights, promoting their health and wellbeing, strengthening their confidence and physical development, and connecting them to mentorship, guidance and opportunities that can shape better futures.",
  purpose:
    "GGI exists to ensure that girls are not limited by poverty, geography, gender-based barriers, early pregnancy or marriage, poor support systems, or lack of opportunity. Our purpose is to provide girls with the knowledge, resources, support and opportunities necessary to become confident, informed, healthy and capable young women who can determine the direction of their own lives.",
  values: [
    {
      name: "Empowerment",
      description:
        "We believe every girl and woman has the capacity to shape her own future.",
    },
    {
      name: "Inclusion",
      description:
        "We are committed to reaching girls who are most likely to be left behind because of poverty, geography, disability, social circumstances or limited access to opportunity.",
    },
    {
      name: "Equality",
      description:
        "We advocate for equal opportunities for girls to learn, participate, lead, develop their talents and pursue their aspirations.",
    },
    {
      name: "Dignity",
      description:
        "We treat every girl with respect, compassion and humanity, while protecting her dignity, voice and right to be heard.",
    },
    {
      name: "Integrity",
      description:
        "We are committed to honesty, transparency, accountability and responsible leadership in everything we do for girls and the communities we serve.",
    },
    {
      name: "Collaboration",
      description:
        "We believe lasting change for girls requires meaningful collaboration with families, schools, communities, institutions and partners.",
    },
    {
      name: "Courage",
      description:
        "We encourage girls to speak up, know their rights, challenge harmful practices and confidently pursue their aspirations.",
    },
  ],
} as const;

export const APPROACH_STEPS = [
  "Education and educational support",
  "Mentorship and career guidance",
  "Health and general wellbeing education",
  "Menstrual hygiene interventions",
  "Girls' rights education and awareness",
  "Economic empowerment",
  "Community outreach and engagement",
  "Advocacy and girls' voice",
  "Partnerships and collaboration",
  "Physical education and development",
] as const;

export const FOCUS_AREAS = [
  {
    title: "Girls' Education",
    body: "We support girls facing financial, geographical and social barriers through educational resources, school engagement, learning support, mentorship and partnerships that help girls remain in school and pursue their educational goals.",
  },
  {
    title: "Girls' Rights, Leadership & Empowerment",
    body: "We equip girls with knowledge of their rights, confidence, leadership skills and the ability to speak up, make informed decisions and participate meaningfully in their communities.",
  },
  {
    title: "Girls' Health, Menstrual Health & Wellbeing",
    body: "We promote health information, menstrual health education, personal hygiene awareness and practical support that helps girls understand and care for their bodies and general wellbeing.",
  },
  {
    title: "Physical Education & Development",
    body: "We encourage girls' participation in physical education and healthy physical development as part of confidence, wellbeing, discipline, teamwork and overall personal development.",
  },
  {
    title: "Mentorship, Guidance & Life Skills",
    body: "We connect girls with mentors, professionals and positive role models who can provide guidance, encouragement, career awareness, decision-making support and practical life skills.",
  },
  {
    title: "Advocacy & Community Engagement",
    body: "We advocate for safer, more supportive environments for girls and engage communities on issues affecting girls, including barriers to education, abuse, harmful practices, early pregnancy and limited opportunities.",
  },
] as const;

/** Focus areas mapped into the four approved pillars (content-reference resolution). */
export const PILLAR_FOCUS: Record<
  string,
  { focusTitles: string[]; body: string[] }
> = {
  "rights-dignity": {
    focusTitles: [
      "Girls' Rights, Leadership & Empowerment",
      "Advocacy & Community Engagement",
    ],
    body: [
      "We equip girls with knowledge of their rights, confidence, leadership skills and the ability to speak up, make informed decisions and participate meaningfully in their communities.",
      "We advocate for safer, more supportive environments for girls and engage communities on issues affecting girls, including barriers to education, abuse, harmful practices, early pregnancy and limited opportunities.",
    ],
  },
  "health-wellbeing": {
    focusTitles: ["Girls' Health, Menstrual Health & Wellbeing"],
    body: [
      "We promote health information, menstrual health education, personal hygiene awareness and practical support that helps girls understand and care for their bodies and general wellbeing.",
    ],
  },
  "confidence-growth": {
    focusTitles: ["Physical Education & Development", "Girls' Education"],
    body: [
      "We encourage girls' participation in physical education and healthy physical development as part of confidence, wellbeing, discipline, teamwork and overall personal development.",
      "We support girls facing financial, geographical and social barriers through educational resources, school engagement, learning support, mentorship and partnerships that help girls remain in school and pursue their educational goals.",
    ],
  },
  "mentorship-opportunity": {
    focusTitles: ["Mentorship, Guidance & Life Skills", "Girls' Education"],
    body: [
      "We connect girls with mentors, professionals and positive role models who can provide guidance, encouragement, career awareness, decision-making support and practical life skills.",
      "We support girls facing financial, geographical and social barriers through educational resources, school engagement, learning support, mentorship and partnerships that help girls remain in school and pursue their educational goals.",
    ],
  },
};

export const PROGRAMMES = [
  {
    title: "Educational Support Initiative",
    body: "Supporting girls facing educational and financial barriers with learning resources, school engagement and appropriate assistance to remain in school and pursue their educational goals.",
  },
  {
    title: "Mentorship & Guidance Initiative",
    body: "Connecting girls with mentors, professionals and positive role models who provide guidance, encouragement, career awareness and practical life skills.",
  },
  {
    title: "Girls' Health & Menstrual Health Initiative",
    body: "Providing health education, menstrual health and hygiene education, wellbeing information and appropriate personal hygiene support.",
  },
  {
    title: "Physical Education & Development Initiative",
    body: "Creating opportunities for girls to participate in physical education and activities that support wellbeing, confidence, discipline, teamwork and healthy development.",
  },
  {
    title: "Girls' Rights & Advocacy Initiative",
    body: "Building girls' awareness of their rights and strengthening their ability to speak up, seek support and advocate for safer and more equitable environments.",
  },
  {
    title: "Rural Girl Empowerment Initiative",
    body: "A targeted initiative addressing the barriers faced by girls in rural, remote and underserved communities, with emphasis on education, rights, health, mentorship, physical development, advocacy and access to opportunities.",
  },
] as const;

export const PROJECTS = [
  {
    title: "School Tours",
    summary:
      "GGI conducts educational school tours to engage young girls, promote the organisation's mission and provide resources and information that support their wellbeing and development.",
    points: [
      "School engagement",
      "Girls' empowerment conversations",
      "Educational support",
      "Menstrual hygiene education",
      "Distribution of sanitary products",
    ],
  },
  {
    title: "Support a Young Girl",
    summary:
      "A comprehensive support programme providing appropriate educational, emotional and practical support to girls facing difficult circumstances. The project seeks to help girls overcome barriers and reach their full potential.",
    points: [
      "Individual support",
      "Educational assistance",
      "Mentorship and guidance",
      "Wellbeing support",
      "Pathways to opportunity",
    ],
  },
  {
    title: "Mentorship Initiative",
    summary:
      "The Mentorship Initiative connects young girls with experienced mentors who provide guidance, support and valuable life skills.",
    points: [
      "Increased confidence",
      "Guidance in decision-making",
      "Career awareness",
      "Life skills development",
      "Positive role modelling",
    ],
  },
  {
    title: "Rural Girl Empowerment",
    summary:
      "A targeted initiative designed to address the barriers faced by girls in rural and remote communities. The programme focuses on education, girls' rights, health and menstrual wellbeing, physical education, mentorship, advocacy and access to opportunities while helping to bridge the gap between rural and urban girls.",
    points: [
      "Education and school retention",
      "Girls' rights awareness",
      "Menstrual health and wellbeing",
      "Physical education",
      "Mentorship and guidance",
      "Advocacy and community engagement",
    ],
  },
] as const;

export const IMPACT = {
  achievements: [
    "Conducted educational school tours and community outreach focused on girls.",
    "Provided sanitary towels and personal hygiene materials to girls.",
    "Created safe spaces for girls to discuss challenges and seek support.",
    "Developed mentorship and educational support initiatives.",
    "Developed initiatives focused on girls in rural and underserved communities.",
  ],
  /** Labels only. No invented numeric counts (data honesty). */
  categories: [
    "Schools Reached",
    "Girls Supported",
    "Communities Served",
    "Girls Reached",
    "Impact Highlights",
  ],
} as const;

export const COMMUNITIES_COPY = {
  lead: "GGI prioritises rural, remote and underserved communities: places where barriers to education, health support and guidance are often greatest, and where girls are too often reached last.",
  points: [
    "We work where poverty, geography and limited services can leave girls with fewer opportunities than their urban peers.",
    "Our programmes combine school engagement, community outreach and partnership so support stays close to where girls live and learn.",
    "Gallery stories and locations continue to grow as GGI documents visits and partnerships across communities.",
  ],
} as const;

export const ADVOCATE_COPY = {
  lead: "Raising your voice with GGI means standing with girls for safer schools, stronger rights awareness and communities that listen.",
  actions: [
    {
      title: "Share girls' stories responsibly",
      body: "Amplify GGI's mission and community updates on your channels, always with dignity, never sensationalising hardship.",
    },
    {
      title: "Speak up for girls' rights",
      body: "Join conversations about education, menstrual health, protection from harmful practices and equal opportunity for girls.",
    },
    {
      title: "Invite GGI into your community",
      body: "Schools, families and local leaders can request partnership conversations so girls nearby can access support.",
    },
  ],
} as const;
