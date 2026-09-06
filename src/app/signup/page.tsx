import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SignupFlow } from "@/components/signup/SignupFlow";
import { SetupMissing } from "@/components/setup/SetupMissing";
import { createFamilyForUser, getOwnFamily } from "@/lib/data/family-repo";
import { clearOnboardingDraft, readOnboardingDraft } from "@/lib/data/onboarding-draft";
import { isAuthConfigured } from "@/lib/supabase/env";
import { getAuthUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Create your family page — Mora",
  description: "Set up a private family page for pregnancy updates.",
};

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  if (!isAuthConfigured()) return <SetupMissing />;

  const user = await getAuthUser();
  if (user) {
    const family = await getOwnFamily();
    if (family) redirect("/dashboard");
    const draft = await readOnboardingDraft();
    if (draft) {
      try {
        await createFamilyForUser(draft);
        await clearOnboardingDraft();
      } catch {
        // Fall through to the form if the family could not be created yet.
      }
      const created = await getOwnFamily();
      if (created) redirect("/dashboard");
    }
  }

  return (
    <div className="flex min-h-full flex-col overflow-x-clip">
      <header className="px-5 py-4 sm:px-8">
        <div className="mx-auto flex h-10 max-w-md items-center">
          <Link href="/" className="font-serif text-[1.45rem] leading-none tracking-tight">
            Mora
          </Link>
        </div>
      </header>
      <main className="flex flex-1 px-5 pt-6 pb-12 sm:px-8 sm:pt-10">
        <SignupFlow />
      </main>
    </div>
  );
}
