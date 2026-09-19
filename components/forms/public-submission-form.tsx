"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "textarea";
  required?: boolean;
  step?: number;
};

export function PublicSubmissionForm({
  kind,
  fields,
  steps = 1,
  successTitle,
  successBody,
}: {
  kind: "volunteer" | "partnership" | "contact";
  fields: Field[];
  steps?: number;
  successTitle: string;
  successBody: string;
}) {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const stepFields = useMemo(
    () => fields.filter((field) => (field.step ?? 1) === step),
    [fields, step],
  );

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (step < steps) {
      setStep((current) => current + 1);
      return;
    }

    setPending(true);
    try {
      const response = await fetch(`/api/submissions/${kind}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Could not send. Please try again.");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send.");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div
        className="rounded-3xl border border-border-default bg-bg-surface p-6"
        role="status"
      >
        <h2 className="font-display text-xl font-bold text-brand-navy">
          {successTitle}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          {successBody}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-3xl border border-border-default bg-bg-surface p-6"
      noValidate
    >
      {steps > 1 ? (
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-magenta">
          Step {step} of {steps}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {stepFields.map((field) => (
          <label
            key={field.name}
            className={`space-y-1.5 text-sm ${field.type === "textarea" ? "sm:col-span-2" : ""}`}
          >
            <span className="font-medium text-brand-navy">{field.label}</span>
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                required={field.required}
                value={values[field.name] ?? ""}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    [field.name]: event.target.value,
                  }))
                }
                className="min-h-28 w-full rounded-xl border border-border-default bg-bg-base px-3 py-2 outline-none focus:border-brand-sky"
              />
            ) : (
              <input
                name={field.name}
                type={field.type ?? "text"}
                required={field.required}
                value={values[field.name] ?? ""}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    [field.name]: event.target.value,
                  }))
                }
                className="h-11 w-full rounded-xl border border-border-default bg-bg-base px-3 outline-none focus:border-brand-sky"
              />
            )}
          </label>
        ))}
      </div>

      {error ? (
        <p className="text-sm text-brand-magenta" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {step > 1 ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep((current) => current - 1)}
          >
            Back
          </Button>
        ) : null}
        <Button type="submit" disabled={pending}>
          {pending
            ? "Sending…"
            : step < steps
              ? "Continue"
              : "Submit"}
        </Button>
      </div>
    </form>
  );
}
