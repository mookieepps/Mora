"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authFacingError } from "@/lib/auth/messages";
import { userFacingError } from "@/lib/data/errors";
import {
  clearOnboardingDraft,
  readOnboardingDraft,
  writeOnboardingDraft,
} from "@/lib/data/onboarding-draft";
import {
  announceBirthRecord,
  createFamilyForUser,
  deleteRecipient,
  getDashboardForUser,
  getOwnFamily,
  getPublicFamilyBySlug,
  getVisitorReactions,
  insertRecipient,
  insertUpdate,
  insertWeightGuess,
  listOwnedRecipients,
  startLabor,
  toggleReactionForVisitor,
  uploadOwnedFamilyPhoto,
} from "@/lib/data/family-repo";
import { createUserClient, getAuthUser } from "@/lib/supabase/server";
import {
  notifyRecipientsOfLaborStarted,
  notifyRecipientsOfNormalUpdate,
} from "@/lib/sms/notify-update";
import type { ReactionKind } from "@/lib/mock/family";

type ActionResult = { ok: true; next?: string; notice?: string } | { ok: false; error: string };

function revalidateFamily(slug: string) {
  revalidatePath("/dashboard");
  revalidatePath(`/family/${slug}`);
}

function parentAuthError(): ActionResult {
  return { ok: false, error: "Please sign in to continue." };
}

export async function loadDashboardData() {
  return getDashboardForUser();
}

export async function loadPublicFamily(slug: string) {
  return getPublicFamilyBySlug(slug);
}

export async function loadMyReactions(slug: string, visitorId: string) {
  return getVisitorReactions(slug, visitorId);
}

export async function createFamilyAction(input: {
  motherName: string;
  partnerName: string | null;
  dueDate: string;
}): Promise<ActionResult> {
  try {
    const user = await getAuthUser();
    if (!user) {
      await writeOnboardingDraft(input);
      return { ok: true, next: "/signup-account" };
    }
    const family = await createFamilyForUser(input);
    await clearOnboardingDraft();
    revalidateFamily(family.slug);
    return { ok: true, next: "/dashboard" };
  } catch (error) {
    return { ok: false, error: userFacingError(error) };
  }
}

export async function signUpAccountAction(input: {
  email: string;
  password: string;
}): Promise<ActionResult> {
  try {
    const supabase = await createUserClient();
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
    });
    if (error) return { ok: false, error: authFacingError(error) };
    if (!data.session) {
      return {
        ok: false,
        error: "Check your email to confirm your account, then sign in.",
      };
    }

    const draft = await readOnboardingDraft();
    if (draft) {
      const family = await createFamilyForUser(draft);
      await clearOnboardingDraft();
      revalidateFamily(family.slug);
      return { ok: true, next: "/dashboard" };
    }
    return { ok: true, next: "/signup" };
  } catch (error) {
    return { ok: false, error: authFacingError(error) };
  }
}

export async function signInAction(input: { email: string; password: string }): Promise<ActionResult> {
  try {
    const supabase = await createUserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });
    if (error) return { ok: false, error: authFacingError(error) };
    const family = await getOwnFamily();
    return { ok: true, next: family ? "/dashboard" : "/signup" };
  } catch (error) {
    return { ok: false, error: authFacingError(error) };
  }
}

export async function signOutAction() {
  const supabase = await createUserClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function addRecipientAction(
  name: string,
  phone: string,
  smsConsent: boolean,
): Promise<ActionResult> {
  try {
    const user = await getAuthUser();
    if (!user) return parentAuthError();
    const slug = await insertRecipient(name, phone, smsConsent);
    revalidateFamily(slug);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: userFacingError(error) };
  }
}

export async function removeRecipientAction(id: string): Promise<ActionResult> {
  try {
    const user = await getAuthUser();
    if (!user) return parentAuthError();
    const slug = await deleteRecipient(id);
    revalidateFamily(slug);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: userFacingError(error) };
  }
}

function photoFromForm(formData: FormData): File | null {
  const value = formData.get("photo");
  if (!value || typeof value === "string") return null;
  const file = value as File;
  if (typeof file.size === "number" && file.size === 0) return null;
  return file;
}

export async function sendUpdateAction(formData: FormData): Promise<ActionResult> {
  try {
    const user = await getAuthUser();
    if (!user) return parentAuthError();
    const message = String(formData.get("message") ?? "").trim();
    const photo = photoFromForm(formData);
    if (!message && !photo) {
      return { ok: false, error: "Write an update or add a photo." };
    }
    let photoPath: string | null = null;
    if (photo) {
      photoPath = await uploadOwnedFamilyPhoto("updates", photo);
    }
    const slug = await insertUpdate(message, photoPath);
    revalidateFamily(slug);
    let notice = "Update saved.";
    try {
      const family = await getOwnFamily();
      if (family) {
        const recipients = await listOwnedRecipients();
        notice = await notifyRecipientsOfNormalUpdate(family, recipients);
      }
    } catch {
      notice = "Update saved, but some notifications could not be sent.";
    }
    return { ok: true, notice };
  } catch (error) {
    return { ok: false, error: userFacingError(error) };
  }
}

export async function startLaborAction(): Promise<ActionResult> {
  try {
    const user = await getAuthUser();
    if (!user) return parentAuthError();
    const { slug, started } = await startLabor();
    revalidateFamily(slug);
    if (!started) return { ok: true };

    let notice = "You're in labor.";
    try {
      const family = await getOwnFamily();
      if (family) {
        const recipients = await listOwnedRecipients();
        notice = await notifyRecipientsOfLaborStarted(family, recipients);
      }
    } catch {
      notice = "You're in labor, but the texts could not be sent.";
    }
    return { ok: true, notice };
  } catch (error) {
    return { ok: false, error: userFacingError(error) };
  }
}

export async function announceBirthAction(formData: FormData): Promise<ActionResult> {
  try {
    const user = await getAuthUser();
    if (!user) return parentAuthError();
    const babyName = String(formData.get("babyName") ?? "").trim();
    const bornAt = String(formData.get("bornAt") ?? "").trim();
    const poundsRaw = String(formData.get("weightPounds") ?? "").trim();
    const ouncesRaw = String(formData.get("weightOunces") ?? "").trim();
    const lengthRaw = String(formData.get("lengthInches") ?? "").trim();
    const photo = photoFromForm(formData);

    if (!babyName) return { ok: false, error: "Enter the baby’s name." };
    if (!bornAt) return { ok: false, error: "Enter the time of birth." };

    let photoPath: string | null = null;
    if (photo) {
      photoPath = await uploadOwnedFamilyPhoto("birth", photo);
    }

    const slug = await announceBirthRecord({
      babyName,
      bornAt,
      weightPounds: poundsRaw === "" ? null : Number(poundsRaw),
      weightOunces: ouncesRaw === "" ? null : Number(ouncesRaw),
      lengthInches: lengthRaw === "" ? null : Number(lengthRaw),
      photoPath,
    });
    revalidateFamily(slug);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: userFacingError(error) };
  }
}

export async function toggleReactionAction(
  slug: string,
  updateId: string,
  visitorId: string,
  kind: ReactionKind,
): Promise<ActionResult> {
  try {
    await toggleReactionForVisitor(slug, updateId, visitorId, kind);
    revalidateFamily(slug);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: userFacingError(error) };
  }
}

export async function submitWeightGuessAction(
  slug: string,
  input: { name: string; pounds: number; ounces: number },
): Promise<ActionResult> {
  try {
    await insertWeightGuess(slug, input);
    revalidateFamily(slug);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: userFacingError(error) };
  }
}
