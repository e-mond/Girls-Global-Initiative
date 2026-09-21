import { Clock, HeartHandshake, Sparkles } from "lucide-react";
import {
  IconFeatureGrid,
  ProcessBand,
} from "@/components/layout/editorial";
import { ContentSection, CtaBand } from "@/components/layout/content-section";
import { PageHeroCompact } from "@/components/layout/public-page-intro";
import { PublicSubmissionForm } from "@/components/forms/public-submission-form";

export default function VolunteerPage() {
  return (
    <>
      <PageHeroCompact
        breadcrumb="Volunteer"
        badge="Volunteer"
        meta="Time · Skills · Mentorship"
        title="Volunteer & mentor"
        description="Share your time and skills with girls who need a steady guide. Tell us a little about yourself — we'll follow up."
        ctas={[
          { href: "/get-involved", label: "Other ways to help", variant: "secondary" },
        ]}
      />

      <ContentSection
        eyebrow="Where help lands"
        title="Steady presence for girls who need it."
        tone="surface"
      >
        <IconFeatureGrid
          items={[
            {
              title: "Mentorship",
              body: "Guidance, encouragement and practical life skills.",
              icon: HeartHandshake,
            },
            {
              title: "Programme support",
              body: "Help with outreach, education moments and safe spaces.",
              icon: Sparkles,
            },
            {
              title: "Flexible time",
              body: "Share availability so GGI can match real community needs.",
              icon: Clock,
            },
          ]}
        />
      </ContentSection>

      <ProcessBand
        eyebrow="Application path"
        title="Three short steps. One honest conversation."
        steps={[
          {
            step: "01",
            title: "About you",
            body: "Name, contact and where you are based.",
          },
          {
            step: "02",
            title: "What you offer",
            body: "Interest area, skills and availability.",
          },
          {
            step: "03",
            title: "Anything else",
            body: "Context that helps GGI respond thoughtfully.",
          },
        ]}
      />

      <ContentSection tone="sky" narrow>
        <PublicSubmissionForm
          kind="volunteer"
          steps={3}
          successTitle="Application received"
          successBody="Thank you. We've saved your volunteer application and will be in touch. If email is configured, you'll also receive an acknowledgement."
          fields={[
            { name: "fullName", label: "Full name", required: true, step: 1 },
            {
              name: "email",
              label: "Email",
              type: "email",
              required: true,
              step: 1,
            },
            { name: "phone", label: "Phone", type: "tel", step: 1 },
            { name: "city", label: "City / community", step: 1 },
            {
              name: "interestArea",
              label: "Interest area",
              required: true,
              step: 2,
            },
            {
              name: "skills",
              label: "Skills you can share",
              type: "textarea",
              required: true,
              step: 2,
            },
            {
              name: "availability",
              label: "Availability",
              type: "textarea",
              required: true,
              step: 2,
            },
            {
              name: "message",
              label: "Anything else we should know?",
              type: "textarea",
              step: 3,
            },
          ]}
        />
      </ContentSection>

      <CtaBand
        title="Prefer to give or partner instead?"
        primary={{ href: "/get-involved/donate", label: "Donate" }}
        secondary={{ href: "/partner", label: "Partner with us" }}
      />
    </>
  );
}
