import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: ReactNode;
  hint?: string;
  error?: string;
};

export function Field({
  id,
  label,
  hint,
  error,
  className,
  ...props
}: FieldProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-[15px] font-medium text-charcoal">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={cn(
          "mt-2 h-12 w-full min-w-0 rounded-2xl border bg-paper px-4 text-base text-charcoal transition-colors [color-scheme:light]",
          "placeholder:text-charcoal/35",
          "focus-visible:border-charcoal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal",
          error ? "border-[#b45c4c]" : "border-charcoal/12",
          className,
        )}
        {...props}
      />
      {hint && !error ? (
        <p id={`${id}-hint`} className="mt-2 text-sm text-ink-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-[#9a4f40]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
