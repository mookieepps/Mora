import { createAdminClient } from "@/lib/supabase/admin";
import { coupleDisplayName } from "@/lib/domain/pregnancy";
import { normalizeUsPhone, phoneKey } from "@/lib/sms/phone";
import type { FamilyRow, RecipientRow } from "@/lib/data/mappers";

const FAMILY_COLUMNS =
  "id, expecting_parent_name, partner_name, due_date, status, family_slug, baby_name, birth_time, birth_weight_pounds, birth_weight_ounces, birth_length, baby_photo_url, created_at, updated_at";

export type SmsOptInView = {
  token: string;
  recipientName: string;
  phone: string;
  alreadyConsented: boolean;
  familyNames: string;
  familySlug: string;
};

export async function getSmsOptInByToken(token: string): Promise<SmsOptInView | null> {
  const trimmed = token.trim();
  if (!trimmed) return null;
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("recipients")
    .select("id, name, phone_number, sms_consent, family_id, invite_token")
    .eq("invite_token", trimmed)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const recipient = data as RecipientRow & { family_id: string; invite_token: string };
  const { data: family, error: familyError } = await admin
    .from("families")
    .select(FAMILY_COLUMNS)
    .eq("id", recipient.family_id)
    .maybeSingle();
  if (familyError) throw familyError;
  if (!family) return null;
  const row = family as FamilyRow;

  return {
    token: trimmed,
    recipientName: recipient.name,
    phone: recipient.phone_number,
    alreadyConsented: Boolean(recipient.sms_consent),
    familyNames: coupleDisplayName(row.expecting_parent_name, row.partner_name),
    familySlug: row.family_slug,
  };
}

export async function recordRecipientSmsOptIn(input: {
  token: string;
  phone: string;
  ip: string | null;
  userAgent: string | null;
}) {
  const page = await getSmsOptInByToken(input.token);
  if (!page) throw new Error("opt_in_not_found");
  const confirmed = normalizeUsPhone(input.phone);
  if (!confirmed || phoneKey(confirmed) !== phoneKey(page.phone)) {
    throw new Error("opt_in_phone_mismatch");
  }
  if (page.alreadyConsented) return page.familySlug;

  const admin = createAdminClient();
  const { error } = await admin
    .from("recipients")
    .update({
      sms_consent: true,
      sms_consent_at: new Date().toISOString(),
      consent_method: "recipient_web_form",
      consent_phone: confirmed,
      consent_ip: input.ip,
      consent_user_agent: input.userAgent,
    })
    .eq("invite_token", input.token.trim())
    .eq("sms_consent", false);
  if (error) throw error;
  return page.familySlug;
}
