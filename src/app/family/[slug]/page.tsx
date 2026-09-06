import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FamilyPageView } from "@/components/family/FamilyPageView";
import { SetupMissing } from "@/components/setup/SetupMissing";
import { loadPublicFamily } from "@/app/actions/mora";
import { MoraConfigError } from "@/lib/data/errors";
import { coupleDisplayName } from "@/lib/domain/pregnancy";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/family/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (!isSupabaseConfigured()) {
    return { title: "Family page — Mora" };
  }
  try {
    const data = await loadPublicFamily(slug);
    if (!data) return { title: "Family page — Mora" };
    const names = coupleDisplayName(data.family.motherName, data.family.partnerName);
    return {
      title: `${names} — Mora`,
      description: `Private updates from ${names}.`,
    };
  } catch {
    return { title: "Family page — Mora" };
  }
}

export default async function FamilyPage({ params }: PageProps<"/family/[slug]">) {
  const { slug } = await params;
  if (!isSupabaseConfigured()) return <SetupMissing />;

  let data;
  try {
    data = await loadPublicFamily(slug);
  } catch (error) {
    if (error instanceof MoraConfigError) return <SetupMissing />;
    throw error;
  }

  if (!data) notFound();
  return <FamilyPageView data={data} />;
}
