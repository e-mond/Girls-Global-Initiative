import Link from "next/link";
import { ArrowRight, Heart, Megaphone, Users } from "lucide-react";
import {
  IconFeatureGrid,
  ProcessBand,
} from "@/components/layout/editorial";
import {
  ContentSection,
  CtaBand,
} from "@/components/layout/content-section";
import { PageHeroEditorial } from "@/components/layout/public-page-intro";
import { TAGLINE } from "@/content/site-copy";
import { getInvolvedCards } from "@/features/content/mock-home";
import { cn } from "@/lib/utils";

const cardTones = [
  "bg-blob-pink/50 border-brand-magenta/20",
  "bg-brand-navy text-text-on-inverse border-transparent",
  "bg-blob-sky/50 border-brand-sky/30",
  "bg-bg-surface border-border-default",
] as const;

export default function GetInvolvedPage() {
  const paths = [
    ...getInvolvedCards.map((card) => ({
      href: card.href,
      title: card.title,
      body: card.body,
      cta: card.cta,
    })),
    {
      href: "/partner",
      title: "Partner with us",
      body: "Invite GGI into your school, family network or community.",
      cta: "Request a conversation",
    },
    {
      href: "/contact",
      title: "Contact GGI",
      body: "Write to the team with a question, introduction or invitation.",
      cta: "Say hello",
    },
  ];

  return (
    <>
      <PageHeroEditorial
        breadcrumb="Get involved"
        badge="Get involved"
        meta="Give · Serve · Speak · Partner"
        title="There's a place for you in her story."
        description={`${TAGLINE} Choose how you want to support girls: donate, volunteer, raise your voice, or partner with GGI.`}
        tone="cream"
        ctas={[
          { href: "/get-involved/donate", label: "Donate" },
          {
            href: "/get-involved/volunteer",
            label: "Volunteer",
            variant: "secondary",
          },
        ]}
      />

      <ContentSection
        eyebrow="Ways to show up"
        title="Participation should feel inviting, not transactional."
        tone="surface"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paths.map((card, index) => {
            const tone = cardTones[index % cardTones.length];
            const onDark = tone.includes("bg-brand-navy");
            return (
              <Link
                key={card.href}
                href={card.href}
                className={cn(
                  "flex min-h-[220px] flex-col rounded-[1.75rem] border p-6 transition-transform hover:-translate-y-0.5",
                  tone,
                )}
              >
                <p
                  className={cn(
                    "font-display text-xl font-bold",
                    onDark ? "text-text-on-inverse" : "text-brand-navy",
                  )}
                >
                  {card.title}
                </p>
                <p
                  className={cn(
                    "mt-3 flex-1 text-sm leading-relaxed",
                    onDark ? "text-white/80" : "text-text-muted",
                  )}
                >
                  {card.body}
                </p>
                <p
                  className={cn(
                    "mt-5 inline-flex items-center gap-2 text-sm font-semibold",
                    onDark ? "text-blob-pink" : "text-brand-magenta",
                  )}
                >
                  {card.cta}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </p>
              </Link>
            );
          })}
        </div>
      </ContentSection>

      <ProcessBand
        eyebrow="A simple path"
        title="Start where you are. Stay as long as you can."
        steps={[
          {
            step: "01",
            title: "Choose a lane",
            body: "Give, volunteer, advocate or open a community door.",
          },
          {
            step: "02",
            title: "Tell us a little",
            body: "Forms and conversations help GGI match your offer to real needs.",
          },
          {
            step: "03",
            title: "Walk with girls",
            body: "Support that reaches rural and underserved communities first.",
          },
        ]}
      />

      <ContentSection
        eyebrow="Why it matters"
        title="Support that reaches girls where barriers are greatest."
        tone="sky"
      >
        <IconFeatureGrid
          items={[
            {
              title: "Your gift",
              body: "Funds education, health support and rural outreach.",
              icon: Heart,
            },
            {
              title: "Your time",
              body: "Mentorship and volunteering steady girls who need a guide.",
              icon: Users,
            },
            {
              title: "Your voice",
              body: "Advocacy amplifies rights, safety and school belonging.",
              icon: Megaphone,
            },
          ]}
        />
      </ContentSection>

      <CtaBand
        title="Start with the path that fits you today."
        primary={{ href: "/get-involved/donate", label: "Donate" }}
        secondary={{ href: "/get-involved/volunteer", label: "Volunteer" }}
      />
    </>
  );
}
