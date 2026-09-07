"use client";

import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type ModalProps = {
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  className?: string;
};

export function Modal({ title, children, onClose, footer, className }: ModalProps) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-center">
        <button
          type="button"
          aria-label="Close"
          className="fixed inset-0 bg-charcoal/30"
          onClick={onClose}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className={cn(
            "relative z-10 my-4 w-full max-w-md max-h-[min(92dvh,44rem)] overflow-y-auto rounded-3xl border border-charcoal/10 bg-paper px-5 py-6 shadow-[0_24px_60px_-28px_rgb(42_36_33_/_0.45)]",
            className,
          )}
        >
          <h2 id="modal-title" className="font-serif text-[1.65rem] leading-tight">
            {title}
          </h2>
          <div className="mt-3 text-[15px] leading-relaxed text-ink-muted">{children}</div>
          {footer !== undefined ? (
            footer
          ) : (
            <button
              type="button"
              className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-charcoal text-sm font-medium text-cream"
              onClick={onClose}
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
