"use client";

import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/** Accessible password input with show/hide control. */
export function PasswordField({
  id,
  name,
  label,
  value,
  onChange,
  autoComplete = "current-password",
  required = true,
  minLength = 8,
  describedBy,
  invalid,
}: {
  id?: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  describedBy?: string;
  invalid?: boolean;
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-visibility-hint`;
  const [showPassword, setShowPassword] = useState(false);
  const describedByIds = [hintId, describedBy].filter(Boolean).join(" ");

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="text-sm font-medium text-brand-navy">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          name={name}
          type={showPassword ? "text" : "password"}
          autoComplete={autoComplete}
          required={required}
          aria-required={required ? true : undefined}
          minLength={minLength}
          aria-invalid={invalid ? true : undefined}
          aria-describedby={describedByIds || undefined}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full rounded-xl border border-border-default bg-bg-base py-2 pl-3 pr-12 text-sm text-text-primary outline-none focus-visible:border-brand-sky focus-visible:ring-2 focus-visible:ring-brand-sky"
        />
        <button
          type="button"
          onClick={() => setShowPassword((current) => !current)}
          className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center rounded-r-xl text-brand-navy hover:bg-bg-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-sky"
          aria-pressed={showPassword}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" aria-hidden />
          ) : (
            <Eye className="h-4 w-4" aria-hidden />
          )}
        </button>
      </div>
      <p id={hintId} className="sr-only">
        Use the show password button to toggle whether your password is visible
        on screen.
      </p>
    </div>
  );
}
