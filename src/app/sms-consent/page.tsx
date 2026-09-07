import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SMS consent — Mora",
  description: "How Mora sends pregnancy, labor, and birth text updates, and how to opt out.",
};

export default function SmsConsentPage() {
  return (
    <div className="flex min-h-full flex-col overflow-x-clip">
      <header className="px-5 py-4 sm:px-8">
        <div className="mx-auto flex h-10 max-w-lg items-center">
          <Link href="/" className="font-serif text-[1.45rem] leading-none tracking-tight">
            Mora
          </Link>
        </div>
      </header>
      <main className="flex flex-1 px-5 pt-6 pb-16 sm:px-8 sm:pt-10">
        <article className="mx-auto w-full max-w-lg">
          <p className="text-sm tracking-[0.14em] text-ink-muted uppercase">Text messages</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight sm:text-[2.6rem]">
            SMS consent
          </h1>
          <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-charcoal/85">
            <p>
              Mora sends pregnancy, labor, and birth updates on behalf of expecting parents to
              the people they choose.
            </p>
            <p>
              Recipients only receive texts after agreeing to receive them. A parent confirms that
              agreement before a number is added.
            </p>
            <p>Message frequency varies.</p>
            <p>Message and data rates may apply.</p>
            <p>Reply STOP to opt out.</p>
            <p>Reply HELP for help.</p>
            <p>Consent to receive SMS is not a condition of purchase.</p>
          </div>
        </article>
      </main>
    </div>
  );
}
