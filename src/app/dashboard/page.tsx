import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { SetupMissing } from "@/components/setup/SetupMissing";
import { loadDashboardData } from "@/app/actions/mora";
import { MoraConfigError } from "@/lib/data/errors";
import { isAuthConfigured } from "@/lib/supabase/env";
import { getAuthUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Your family page — Mora",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!isAuthConfigured()) {
    return <SetupMissing />;
  }

  const user = await getAuthUser();
  if (!user) redirect("/login");

  let data;
  try {
    data = await loadDashboardData();
  } catch (error) {
    if (error instanceof MoraConfigError) return <SetupMissing />;
    throw error;
  }

  if (!data) redirect("/signup");

  return (
    <div className="flex min-h-full flex-col overflow-x-clip">
      <DashboardHeader familySlug={data.family.slug} />
      <main className="flex-1 px-5 py-8 sm:px-8 sm:py-10">
        <DashboardShell data={data} />
      </main>
    </div>
  );
}
