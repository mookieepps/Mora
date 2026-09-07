import type { PregnancyStatus } from "@/lib/domain/pregnancy";
import type { ReactionKind } from "@/lib/mock/family";
import { familyMediaPublicUrl } from "@/lib/media/photos";
import {
  emptyReactionCounts,
  type BirthDetails,
  type FamilyRecord,
  type FamilyUpdate,
  type ReactionCounts,
  type Recipient,
  type UpdateType,
  type WeightGuess,
} from "@/lib/data/types";

export type FamilyRow = {
  id: string;
  expecting_parent_name: string;
  partner_name: string | null;
  due_date: string;
  status: PregnancyStatus;
  family_slug: string;
  baby_name: string | null;
  birth_time: string | null;
  birth_weight_pounds: number | string | null;
  birth_weight_ounces: number | string | null;
  birth_length: number | string | null;
  baby_photo_url: string | null;
  created_at: string;
  updated_at: string;
};

export type RecipientRow = {
  id: string;
  name: string;
  phone_number: string;
  sms_consent?: boolean | null;
  sms_consent_at?: string | null;
  consent_method?: string | null;
};

export type UpdateRow = {
  id: string;
  message: string;
  photo_url: string | null;
  update_type: UpdateType;
  created_at: string;
};

export type ReactionRow = {
  update_id: string | null;
  visitor_id: string;
  reaction_type: "HEART" | "PRAYER" | "CELEBRATE";
};

export type GuessRow = {
  id: string;
  name: string;
  pounds: number;
  ounces: number;
};

function toNumber(value: number | string | null): number | null {
  if (value == null || value === "") return null;
  const next = typeof value === "number" ? value : Number(value);
  return Number.isFinite(next) ? next : null;
}

function birthFromRow(row: FamilyRow): BirthDetails | null {
  if (!row.baby_name) return null;
  return {
    babyName: row.baby_name,
    bornAt: row.birth_time ?? "",
    weightPounds: toNumber(row.birth_weight_pounds),
    weightOunces: toNumber(row.birth_weight_ounces),
    lengthInches: toNumber(row.birth_length),
    photoDataUrl: familyMediaPublicUrl(row.baby_photo_url),
    photoName: null,
    announcedAt: row.updated_at,
  };
}

export function mapFamily(row: FamilyRow): FamilyRecord {
  return {
    id: row.id,
    slug: row.family_slug,
    motherName: row.expecting_parent_name,
    partnerName: row.partner_name,
    dueDate: row.due_date,
    status: row.status,
    createdAt: row.created_at,
    birth: birthFromRow(row),
  };
}

export function mapRecipient(row: RecipientRow): Recipient {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone_number,
    smsConsent: Boolean(row.sms_consent),
    smsConsentAt: row.sms_consent_at ?? null,
    consentMethod: row.consent_method ?? null,
  };
}

export function mapUpdate(row: UpdateRow): FamilyUpdate {
  return {
    id: row.id,
    body: row.message,
    photoUrl: familyMediaPublicUrl(row.photo_url),
    createdAt: row.created_at,
    updateType: row.update_type,
  };
}

export function mapGuess(row: GuessRow): WeightGuess {
  return {
    id: row.id,
    name: row.name,
    pounds: row.pounds,
    ounces: row.ounces,
  };
}

export function dbReactionType(kind: ReactionKind): ReactionRow["reaction_type"] {
  if (kind === "pray") return "PRAYER";
  if (kind === "celebrate") return "CELEBRATE";
  return "HEART";
}

export function uiReactionKind(type: ReactionRow["reaction_type"]): ReactionKind {
  if (type === "PRAYER") return "pray";
  if (type === "CELEBRATE") return "celebrate";
  return "heart";
}

export function aggregateReactions(rows: ReactionRow[]): {
  totals: ReactionCounts;
  byUpdate: Record<string, ReactionCounts>;
} {
  const totals = emptyReactionCounts();
  const byUpdate: Record<string, ReactionCounts> = {};
  for (const row of rows) {
    const kind = uiReactionKind(row.reaction_type);
    totals[kind] += 1;
    if (!row.update_id) continue;
    if (!byUpdate[row.update_id]) byUpdate[row.update_id] = emptyReactionCounts();
    byUpdate[row.update_id][kind] += 1;
  }
  return { totals, byUpdate };
}
