"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormPrivacyNotice } from "@/components/forms/form-privacy-notice";

type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "textarea";
  required?: boolean;
  step?: number;
};

const FIELD_FOCUS =
  "w-full rounded-xl border border-border-default bg-bg-base px-3 outline-none focus-visible:border-brand-sky focus-visible:ring-2 focus-visible:ring-brand-sky";

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const stepFields = useMemo(
    () => fields.filter((field) => (field.step ?? 1) === step),
    [fields, step],
  );

  function validateStep(): string | null {
    const nextErrors: Record<string, string> = {};
    for (const field of stepFields) {
      if (!field.required) continue;
      const value = (values[field.name] ?? "").trim();
      if (!value) {
        nextErrors[field.name] = `Please enter your ${field.label.toLowerCase()}.`;
      } else if (
        field.type === "email" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        nextErrors[field.name] =
          "Enter a valid email address, for example name@example.com.";
      }
    }
    setFieldErrors(nextErrors);
    const first = Object.values(nextErrors)[0];
    return first ?? null;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const stepError = validateStep();
    if (stepError) {
      setError(stepError);
      return;
    }

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
        throw new Error(
          json?.error?.message ?? "Could not send. Please try again.",
        );
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
        <p
          className="text-xs font-semibold uppercase tracking-wide text-brand-magenta"
          aria-live="polite"
        >
          Step {step} of {steps}
        </p>
      ) : null}
      <p className="text-xs text-text-muted">
        <span className="text-brand-magenta" aria-hidden>
          *
        </span>{" "}
        Required field
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {stepFields.map((field) => {
          const errorId = `${field.name}-error`;
          const hasError = Boolean(fieldErrors[field.name]);
          return (
            <label
              key={field.name}
              className={`space-y-1.5 text-sm ${field.type === "textarea" ? "sm:col-span-2" : ""}`}
            >
              <span className="font-medium text-brand-navy">
                {field.label}
                {field.required ? (
                  <>
                    {" "}
                    <span className="text-brand-magenta" aria-hidden>
                      *
                    </span>
                  </>
                ) : (
                  " (optional)"
                )}
              </span>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  required={field.required}
                  aria-required={field.required || undefined}
                  aria-invalid={hasError || undefined}
                  aria-describedby={hasError ? errorId : undefined}
                  value={values[field.name] ?? ""}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      [field.name]: event.target.value,
                    }))
                  }
                  className={`min-h-28 py-2 ${FIELD_FOCUS}`}
                />
              ) : (
                <input
                  name={field.name}
                  type={field.type ?? "text"}
                  required={field.required}
                  aria-required={field.required || undefined}
                  aria-invalid={hasError || undefined}
                  aria-describedby={hasError ? errorId : undefined}
                  value={values[field.name] ?? ""}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      [field.name]: event.target.value,
                    }))
                  }
                  className={`h-11 ${FIELD_FOCUS}`}
                />
              )}
              {hasError ? (
                <span id={errorId} className="block text-xs text-brand-magenta">
                  {fieldErrors[field.name]}
                </span>
              ) : null}
            </label>
          );
        })}
      </div>

      {error ? (
        <p id="form-error-summary" className="text-sm text-brand-magenta" role="alert">
          {error}
        </p>
      ) : null}

      <FormPrivacyNotice includeTerms />

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
          {pending ? "Sending…" : step < steps ? "Continue" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
