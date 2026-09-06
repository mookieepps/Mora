import { randomBytes } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { createUserClient, getAuthUser } from "@/lib/supabase/server";
import { mockLaborUpdate } from "@/lib/mock/family";
import { familySlugFromNames } from "@/lib/data/slug";
import {
  FAMILY_MEDIA_BUCKET,
  familyMediaPath,
  fileExtension,
  validatePhotoFile,
} from "@/lib/media/photos";
import {
  aggregateReactions,
  dbReactionType,
  mapFamily,
  mapGuess,
  mapRecipient,
  mapUpdate,
  uiReactionKind,
  type FamilyRow,
  type GuessRow,
  type ReactionRow,
  type RecipientRow,
  type UpdateRow,
} from "@/lib/data/mappers";
import type { BirthDetails, DashboardData, FamilyRecord, PublicFamilyData, ReactionKind } from "@/lib/data/types";
import type { OnboardingDraft } from "@/lib/data/onboarding-draft";
import type { SupabaseClient, User } from "@supabase/supabase-js";

const FAMILY_COLUMNS =
  "id, expecting_parent_name, partner_name, due_date, status, family_slug, baby_name, birth_time, birth_weight_pounds, birth_weight_ounces, birth_length, baby_photo_url, created_at, updated_at";

async function familyByOwner(user: User): Promise<FamilyRow | null> {
  const supabase = await createUserClient();
  const { data, error } = await supabase
    .from("families")
    .select(FAMILY_COLUMNS)
    .eq("owner_user_id", user.id)
    .maybeSingle();
  if (error) throw error;
  return data as FamilyRow | null;
}

async function familyBySlugAdmin(slug: string): Promise<FamilyRow | null> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("families").select(FAMILY_COLUMNS).eq("family_slug", slug).maybeSingle();
  if (error) throw error;
  return data as FamilyRow | null;
}

async function loadRelatedWith(client: SupabaseClient, familyId: string) {
  const [recipients, updates, reactions, guesses] = await Promise.all([
    client.from("recipients").select("id, name, phone_number").eq("family_id", familyId).order("created_at"),
    client
      .from("updates")
      .select("id, message, photo_url, update_type, created_at")
      .eq("family_id", familyId)
      .order("created_at", { ascending: false }),
    client.from("reactions").select("update_id, visitor_id, reaction_type").eq("family_id", familyId),
    client
      .from("weight_guesses")
      .select("id, name, pounds, ounces")
      .eq("family_id", familyId)
      .order("created_at", { ascending: false }),
  ]);

  if (recipients.error) throw recipients.error;
  if (updates.error) throw updates.error;
  if (reactions.error) throw reactions.error;
  if (guesses.error) throw guesses.error;

  const reactionAgg = aggregateReactions((reactions.data ?? []) as ReactionRow[]);
  return {
    recipients: ((recipients.data ?? []) as RecipientRow[]).map(mapRecipient),
    updates: ((updates.data ?? []) as UpdateRow[]).map(mapUpdate),
    guesses: ((guesses.data ?? []) as GuessRow[]).map(mapGuess),
    reactionTotals: reactionAgg.totals,
    reactionCountsByUpdate: reactionAgg.byUpdate,
  };
}

export async function getOwnFamily(): Promise<FamilyRecord | null> {
  const user = await getAuthUser();
  if (!user) return null;
  const row = await familyByOwner(user);
  return row ? mapFamily(row) : null;
}

export async function uploadOwnedFamilyPhoto(kind: "updates" | "birth", file: File): Promise<string> {
  const user = await getAuthUser();
  if (!user) throw new Error("unauthorized");
  const family = await familyByOwner(user);
  if (!family) throw new Error("unauthorized");
  validatePhotoFile(file);
  const extension = fileExtension(file);
  const path = familyMediaPath(family.id, kind, `${crypto.randomUUID()}.${extension}`);
  const supabase = await createUserClient();
  const contentType =
    file.type || (extension === "jpg" ? "image/jpeg" : `image/${extension}`);
  const { error } = await supabase.storage.from(FAMILY_MEDIA_BUCKET).upload(path, file, {
    contentType,
    upsert: false,
  });
  if (error) throw error;
  return path;
}

export async function getDashboardForUser(): Promise<DashboardData | null> {
  const user = await getAuthUser();
  if (!user) return null;
  const row = await familyByOwner(user);
  if (!row) return null;
  const related = await loadRelatedWith(await createUserClient(), row.id);
  return { family: mapFamily(row), ...related };
}

export async function createFamilyForUser(draft: OnboardingDraft): Promise<FamilyRecord> {
  const user = await getAuthUser();
  if (!user) throw new Error("unauthorized");

  const existing = await familyByOwner(user);
  if (existing) return mapFamily(existing);

  const supabase = await createUserClient();
  const base = familySlugFromNames(draft.motherName, draft.partnerName);
  let lastError: unknown = null;

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const slug = attempt === 0 ? base : `${base}-${randomBytes(3).toString("hex")}`;
    const { data, error } = await supabase
      .from("families")
      .insert({
        expecting_parent_name: draft.motherName,
        partner_name: draft.partnerName,
        due_date: draft.dueDate,
        status: "PREGNANCY",
        family_slug: slug,
        owner_user_id: user.id,
      })
      .select(FAMILY_COLUMNS)
      .single();
    if (!error && data) return mapFamily(data as FamilyRow);
    lastError = error;
    if (error?.code !== "23505") throw error;
    const owned = await familyByOwner(user);
    if (owned) return mapFamily(owned);
  }
  throw lastError;
}

export async function insertRecipient(name: string, phone: string) {
  const user = await getAuthUser();
  if (!user) throw new Error("unauthorized");
  const family = await familyByOwner(user);
  if (!family) throw new Error("unauthorized");
  const supabase = await createUserClient();
  const { error } = await supabase.from("recipients").insert({
    family_id: family.id,
    name,
    phone_number: phone,
  });
  if (error) throw error;
  return family.family_slug;
}

export async function deleteRecipient(recipientId: string) {
  const user = await getAuthUser();
  if (!user) throw new Error("unauthorized");
  const family = await familyByOwner(user);
  if (!family) throw new Error("unauthorized");
  const supabase = await createUserClient();
  const { error } = await supabase.from("recipients").delete().eq("id", recipientId).eq("family_id", family.id);
  if (error) throw error;
  return family.family_slug;
}

export async function insertUpdate(message: string, photoPath: string | null = null) {
  const user = await getAuthUser();
  if (!user) throw new Error("unauthorized");
  const family = await familyByOwner(user);
  if (!family) throw new Error("unauthorized");
  const supabase = await createUserClient();
  const { error } = await supabase.from("updates").insert({
    family_id: family.id,
    message,
    photo_url: photoPath,
    update_type: "NORMAL",
  });
  if (error) throw error;
  return family.family_slug;
}

export async function listOwnedRecipients() {
  const user = await getAuthUser();
  if (!user) throw new Error("unauthorized");
  const family = await familyByOwner(user);
  if (!family) throw new Error("unauthorized");
  const supabase = await createUserClient();
  const { data, error } = await supabase
    .from("recipients")
    .select("id, name, phone_number")
    .eq("family_id", family.id)
    .order("created_at");
  if (error) throw error;
  return ((data ?? []) as RecipientRow[]).map(mapRecipient);
}

export async function startLabor() {
  const user = await getAuthUser();
  if (!user) throw new Error("unauthorized");
  const family = await familyByOwner(user);
  if (!family) throw new Error("unauthorized");
  if (family.status !== "PREGNANCY") return family.family_slug;
  const supabase = await createUserClient();
  const { error: statusError } = await supabase.from("families").update({ status: "IN_LABOR" }).eq("id", family.id);
  if (statusError) throw statusError;

  const { data: existing, error: existingError } = await supabase
    .from("updates")
    .select("id")
    .eq("family_id", family.id)
    .eq("update_type", "LABOR")
    .limit(1);
  if (existingError) throw existingError;
  if (!existing?.length) {
    const { error } = await supabase.from("updates").insert({
      family_id: family.id,
      message: mockLaborUpdate.body,
      photo_url: null,
      update_type: "LABOR",
    });
    if (error) throw error;
  }
  return family.family_slug;
}

export async function announceBirthRecord(
  details: Omit<BirthDetails, "announcedAt" | "photoDataUrl" | "photoName"> & {
    photoPath: string | null;
  },
) {
  const user = await getAuthUser();
  if (!user) throw new Error("unauthorized");
  const family = await familyByOwner(user);
  if (!family) throw new Error("unauthorized");
  if (family.status !== "IN_LABOR") return family.family_slug;
  const supabase = await createUserClient();
  const { error: statusError } = await supabase
    .from("families")
    .update({
      status: "BABY_ARRIVED",
      baby_name: details.babyName,
      birth_time: details.bornAt,
      birth_weight_pounds: details.weightPounds,
      birth_weight_ounces: details.weightOunces,
      birth_length: details.lengthInches,
      baby_photo_url: details.photoPath,
    })
    .eq("id", family.id);
  if (statusError) throw statusError;

  const { data: existing, error: existingError } = await supabase
    .from("updates")
    .select("id")
    .eq("family_id", family.id)
    .eq("update_type", "BIRTH")
    .limit(1);
  if (existingError) throw existingError;
  if (!existing?.length) {
    const { error } = await supabase.from("updates").insert({
      family_id: family.id,
      message: `Baby ${details.babyName} arrived at ${details.bornAt} 🎉`,
      photo_url: details.photoPath,
      update_type: "BIRTH",
    });
    if (error) throw error;
  }
  return family.family_slug;
}

export async function getPublicFamilyBySlug(slug: string): Promise<PublicFamilyData | null> {
  const row = await familyBySlugAdmin(slug);
  if (!row) return null;
  const related = await loadRelatedWith(createAdminClient(), row.id);
  return {
    family: mapFamily(row),
    updates: related.updates,
    guesses: related.guesses,
    reactionCountsByUpdate: related.reactionCountsByUpdate,
  };
}

export async function toggleReactionForVisitor(
  slug: string,
  updateId: string,
  visitorId: string,
  kind: ReactionKind,
) {
  const family = await familyBySlugAdmin(slug);
  if (!family) throw new Error("not_found");
  const admin = createAdminClient();
  const { data: update, error: updateError } = await admin
    .from("updates")
    .select("id")
    .eq("id", updateId)
    .eq("family_id", family.id)
    .maybeSingle();
  if (updateError) throw updateError;
  if (!update) throw new Error("not_found");

  const dbType = dbReactionType(kind);
  const { data: existing, error: existingError } = await admin
    .from("reactions")
    .select("id, reaction_type")
    .eq("update_id", updateId)
    .eq("visitor_id", visitorId)
    .maybeSingle();
  if (existingError) throw existingError;

  if (existing?.reaction_type === dbType) {
    const { error } = await admin.from("reactions").delete().eq("id", existing.id);
    if (error) throw error;
  } else if (existing) {
    const { error } = await admin.from("reactions").update({ reaction_type: dbType }).eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await admin.from("reactions").insert({
      family_id: family.id,
      update_id: updateId,
      visitor_id: visitorId,
      reaction_type: dbType,
    });
    if (error) throw error;
  }
  return family.family_slug;
}

export async function getVisitorReactions(slug: string, visitorId: string) {
  const family = await familyBySlugAdmin(slug);
  if (!family) return {} as Record<string, ReactionKind>;
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("reactions")
    .select("update_id, reaction_type")
    .eq("family_id", family.id)
    .eq("visitor_id", visitorId);
  if (error) throw error;
  const mine: Record<string, ReactionKind> = {};
  for (const row of (data ?? []) as ReactionRow[]) {
    if (!row.update_id) continue;
    mine[row.update_id] = uiReactionKind(row.reaction_type);
  }
  return mine;
}

export async function insertWeightGuess(slug: string, input: { name: string; pounds: number; ounces: number }) {
  const family = await familyBySlugAdmin(slug);
  if (!family) throw new Error("not_found");
  const admin = createAdminClient();
  const { error } = await admin.from("weight_guesses").insert({
    family_id: family.id,
    name: input.name,
    pounds: input.pounds,
    ounces: input.ounces,
  });
  if (error) throw error;
  return family.family_slug;
}
