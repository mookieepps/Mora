import type { ReactNode } from "react";
import Link from "next/link";

export function LegalShell({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col overflow-x-clip">
      <header className="px-5 py-4 sm:px-8">
        <div className="mx-auto flex h-10 max-w-2xl items-center">
          <Link href="/" className="font-serif text-[1.45rem] leading-none tracking-tight">
            Mora
          </Link>
        </div>
      </header>
      <main className="flex flex-1 px-5 pt-6 pb-16 sm:px-8 sm:pt-10">
        <article className="mx-auto w-full max-w-2xl">
          <p className="text-sm tracking-[0.14em] text-ink-muted uppercase">{kicker}</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight sm:text-[2.6rem]">
            {title}
          </h1>
          <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-charcoal/85">
            {children}
          </div>
          <p className="mt-10 text-sm text-ink-muted">
            <Link href="/privacy" className="underline underline-offset-4 hover:text-charcoal">
              Privacy Policy
            </Link>
            <span aria-hidden className="px-2">
              ·
            </span>
            <Link href="/terms" className="underline underline-offset-4 hover:text-charcoal">
              Terms of Service
            </Link>
            <span aria-hidden className="px-2">
              ·
            </span>
            <Link href="/sms-consent" className="underline underline-offset-4 hover:text-charcoal">
              SMS
            </Link>
          </p>
        </article>
      </main>
    </div>
  );
}
