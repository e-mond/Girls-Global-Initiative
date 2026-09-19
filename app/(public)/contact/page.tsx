"use client";

import { FormEvent, useState } from "react";
import { PublicPageIntro } from "@/components/layout/public-page-intro";
import { Button } from "@/components/ui/button";

/**
 * Contact page shell for Unit 2.
 * Full rate-limited persistence + SMTP acknowledgement lands in Unit 4.
 */
export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "ready">("idle");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("ready");
  }

  return (
    <PublicPageIntro
      eyebrow="Contact"
      title="Say hello"
      description="Use this form to reach Girls Global Initiative. Submission processing and acknowledgement email ship in a later unit."
    >
      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-3xl border border-border-default bg-bg-surface p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" id="name" required />
          <Field label="Email" id="email" type="email" required />
        </div>
        <Field label="Subject" id="subject" required />
        <div>
          <label
            htmlFor="message"
            className="mb-1.5 block text-sm font-medium text-brand-navy"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="w-full rounded-xl border border-border-default bg-bg-base px-3 py-2 text-sm text-text-primary"
          />
        </div>
        <Button type="submit" className="rounded-xl">
          Send message
        </Button>
        {status === "ready" ? (
          <p className="text-sm text-text-muted" role="status">
            Thanks — your message was not stored yet. Contact delivery will be
            enabled with the submission workflows unit.
          </p>
        ) : null}
      </form>
    </PublicPageIntro>
  );
}

function Field({
  label,
  id,
  type = "text",
  required,
}: {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-brand-navy"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        className="h-11 w-full rounded-xl border border-border-default bg-bg-base px-3 text-sm text-text-primary"
      />
    </div>
  );
}
