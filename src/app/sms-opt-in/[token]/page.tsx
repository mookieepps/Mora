import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SmsOptInForm } from "@/components/sms/SmsOptInForm";
import { SetupMissing } from "@/components/setup/SetupMissing";
import { loadSmsOptIn } from "@/app/actions/sms-opt-in";
import { MoraConfigError } from "@/lib/data/errors";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mora SMS Family Updates",
  description: "Choose whether to receive pregnancy, labor, and birth text updates from Mora.",
};

export default async function SmsOptInPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  if (!isSupabaseConfigured()) return <SetupMissing />;

  let view;
  try {
    view = await loadSmsOptIn(token);
  } catch (error) {
    if (error instanceof MoraConfigError) return <SetupMissing />;
    throw error;
  }
  if (!view) notFound();

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
            Mora SMS Family Updates
          </h1>
          <p className="mt-4 text-sm text-ink-muted">Mora is operated by {"Papa J's & Company LLC"}.</p>
          <div className="mt-8">
            <SmsOptInForm view={view} />
          </div>
        </article>
      </main>
    </div>
  );
}
