import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, MessageCircle, Phone } from "lucide-react";
import { ContentSection, CtaBand } from "@/components/layout/content-section";
import { PageHeroEditorial } from "@/components/layout/public-page-intro";
import { SocialLinks } from "@/components/layout/social-links";
import { PublicSubmissionForm } from "@/components/forms/public-submission-form";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import {
  CONTACT_EMAIL,
  CONTACT_PHONES,
  phoneTelHref,
} from "@/content/contact-details";
import { cn } from "@/lib/utils";

const reachCards = [
  {
    id: "call",
    title: "Call",
    body: CONTACT_PHONES.join(" · "),
    icon: Phone,
    href: phoneTelHref(CONTACT_PHONES[0] ?? ""),
    tone: "bg-blob-sky/55 border-brand-sky/25 text-brand-navy",
    iconTone: "bg-brand-sky/20 text-brand-sky",
  },
  {
    id: "email",
    title: "Email",
    body: CONTACT_EMAIL,
    icon: Mail,
    href: `mailto:${CONTACT_EMAIL}`,
    tone: "bg-blob-pink/55 border-brand-magenta/20 text-brand-navy",
    iconTone: "bg-brand-magenta/15 text-brand-magenta",
  },
  {
    id: "write",
    title: "Write here",
    body: "Jump to the form for introductions, invitations and questions.",
    icon: MessageCircle,
    href: "#contact-form",
    tone: "bg-brand-navy border-transparent text-text-on-inverse",
    iconTone: "bg-white/10 text-blob-pink",
  },
] as const;

export default function ContactPage() {
  return (
    <>
      <PageHeroEditorial
        breadcrumb="Contact"
        badge="Contact"
        meta="Questions · Introductions · Invitations"
        title="Let's connect."
        description="Send a message to Girls Global Initiative. We will get back to you as soon as we can."
        tone="sky"
        ctas={[
          { href: "#contact-form", label: "Write a message" },
          { href: "/partner", label: "Partner with us", variant: "secondary" },
        ]}
      />

      <ContentSection
        eyebrow="Reach us"
        title="Choose the channel that fits."
        tone="cream"
      >
        <Stagger className="grid gap-4 md:grid-cols-3">
          {reachCards.map((card) => {
            const Icon = card.icon;
            const onDark = card.id === "write";
            return (
              <StaggerItem key={card.id}>
                <Link
                  href={card.href}
                  className={cn(
                    "flex h-full flex-col rounded-[1.75rem] border p-6 transition-transform hover:-translate-y-0.5",
                    card.tone,
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex h-11 w-11 items-center justify-center rounded-xl",
                      card.iconTone,
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h2
                    className={cn(
                      "mt-4 font-display text-xl font-bold",
                      onDark ? "text-text-on-inverse" : "text-brand-navy",
                    )}
                  >
                    {card.title}
                  </h2>
                  <p
                    className={cn(
                      "mt-2 flex-1 text-sm leading-relaxed",
                      onDark ? "text-white/80" : "text-text-muted",
                    )}
                  >
                    {card.body}
                  </p>
                  <span
                    className={cn(
                      "mt-5 inline-flex items-center gap-2 text-sm font-semibold",
                      onDark ? "text-blob-pink" : "text-brand-magenta",
                    )}
                  >
                    {card.id === "write" ? "Go to form" : "Open"}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </ContentSection>

      <ContentSection tone="surface">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <Reveal>
            <aside className="space-y-6 overflow-hidden rounded-[1.75rem] bg-brand-navy text-text-on-inverse">
              <div className="relative h-44">
                <Image
                  src="/home/hero-little-girl.jpg"
                  alt=""
                  fill
                  className="object-cover object-top opacity-80"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent"
                />
              </div>
              <div className="space-y-6 px-6 pb-8 sm:px-8">
                <div>
                  <h2 className="font-display text-xl font-bold">
                    Reach us directly
                  </h2>
                  <ul className="mt-4 space-y-3 text-sm text-white/85">
                    {CONTACT_PHONES.map((phone) => (
                      <li key={phone}>
                        <a
                          href={phoneTelHref(phone)}
                          className="hover:text-brand-sky"
                        >
                          {phone}
                        </a>
                      </li>
                    ))}
                    <li>
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="hover:text-brand-sky"
                      >
                        {CONTACT_EMAIL}
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Follow GGI</p>
                  <SocialLinks variant="onDark" className="mt-3" />
                </div>
                <p className="text-xs leading-relaxed text-white/60">
                  GGI does not publish a public street address on this site.
                </p>
              </div>
            </aside>
          </Reveal>

          <Reveal delay={0.08}>
            <div
              id="contact-form"
              className="scroll-mt-28 rounded-[1.75rem] border border-border-default bg-bg-base p-6 sm:p-8"
            >
              <h2 className="font-display text-xl font-bold text-brand-navy">
                Send a message
              </h2>
              <p className="mt-2 text-sm text-text-muted">
                Tell us how we can help: introductions, invitations and
                questions are all welcome.
              </p>
              <div className="mt-6">
                <PublicSubmissionForm
                  kind="contact"
                  successTitle="Message sent"
                  successBody="Thank you for writing to us. Your message is with the team."
                  fields={[
                    { name: "fullName", label: "Name", required: true },
                    {
                      name: "email",
                      label: "Email",
                      type: "email",
                      required: true,
                    },
                    { name: "subject", label: "Subject", required: true },
                    {
                      name: "message",
                      label: "Message",
                      type: "textarea",
                      required: true,
                    },
                  ]}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </ContentSection>

      <CtaBand
        title="Looking for a specific path?"
        primary={{ href: "/partner", label: "Partner with us" }}
        secondary={{ href: "/get-involved", label: "Get involved" }}
      />
    </>
  );
}
