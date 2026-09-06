import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";
import { SetupMissing } from "@/components/setup/SetupMissing";
import { getOwnFamily } from "@/lib/data/family-repo";
import { isAuthConfigured } from "@/lib/supabase/env";
import { getAuthUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Sign in — Mora",
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (!isAuthConfigured()) return <SetupMissing />;

  const user = await getAuthUser();
  if (user) {
    const family = await getOwnFamily();
    redirect(family ? "/dashboard" : "/signup");
  }

  return (
    <AuthShell>
      <LoginForm />
    </AuthShell>
  );
}
