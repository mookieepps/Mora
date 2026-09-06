import { cookies } from "next/headers";

export const ONBOARDING_COOKIE = "mora_onboarding";

export type OnboardingDraft = {
  motherName: string;
  partnerName: string | null;
  dueDate: string;
};

export async function readOnboardingDraft(): Promise<OnboardingDraft | null> {
  const store = await cookies();
  const raw = store.get(ONBOARDING_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<OnboardingDraft>;
    if (!parsed.motherName || !parsed.dueDate) return null;
    return {
      motherName: parsed.motherName,
      partnerName: parsed.partnerName ?? null,
      dueDate: parsed.dueDate,
    };
  } catch {
    return null;
  }
}

export async function writeOnboardingDraft(draft: OnboardingDraft): Promise<void> {
  const store = await cookies();
  store.set(ONBOARDING_COOKIE, JSON.stringify(draft), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60,
  });
}

export async function clearOnboardingDraft(): Promise<void> {
  const store = await cookies();
  store.delete(ONBOARDING_COOKIE);
}
