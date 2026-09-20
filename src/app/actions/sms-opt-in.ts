"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { userFacingError } from "@/lib/data/errors";
import { getSmsOptInByToken, recordRecipientSmsOptIn } from "@/lib/data/sms-opt-in";

type ActionResult = { ok: true; familySlug?: string } | { ok: false; error: string };

export async function loadSmsOptIn(token: string) {
  return getSmsOptInByToken(token);
}

export async function submitSmsOptInAction(
  token: string,
  phone: string,
  agreed: boolean,
): Promise<ActionResult> {
  try {
    if (!agreed) return { ok: false, error: userFacingError(new Error("opt_in_not_checked")) };
    const requestHeaders = await headers();
    const forwarded = requestHeaders.get("x-forwarded-for");
    const ip =
      forwarded?.split(",")[0]?.trim() ||
      requestHeaders.get("x-real-ip")?.trim() ||
      null;
    const userAgent = requestHeaders.get("user-agent")?.slice(0, 500) || null;
    const slug = await recordRecipientSmsOptIn({
      token,
      phone,
      ip: ip?.slice(0, 64) ?? null,
      userAgent,
    });
    revalidatePath("/dashboard");
    revalidatePath(`/family/${slug}`);
    revalidatePath(`/sms-opt-in/${token}`);
    return { ok: true, familySlug: slug };
  } catch (error) {
    return { ok: false, error: userFacingError(error) };
  }
}
