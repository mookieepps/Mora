import type { PregnancyStatus } from "@/lib/domain/pregnancy";
import type { ReactionKind } from "@/lib/mock/family";

export type { PregnancyStatus, ReactionKind };

export type BirthDetails = {
  babyName: string;
  bornAt: string;
  weightPounds: number | null;
  weightOunces: number | null;
  lengthInches: number | null;
  photoDataUrl: string | null;
  photoName: string | null;
  announcedAt: string;
};

export type FamilyRecord = {
  id: string;
  slug: string;
  motherName: string;
  partnerName: string | null;
  dueDate: string;
  status: PregnancyStatus;
  createdAt: string;
  birth: BirthDetails | null;
};

export type Recipient = {
  id: string;
  name: string;
  phone: string;
  smsConsent: boolean;
  smsConsentAt: string | null;
  consentMethod: string | null;
};

export type UpdateType = "NORMAL" | "LABOR" | "BIRTH";

export type FamilyUpdate = {
  id: string;
  body: string;
  photoUrl: string | null;
  createdAt: string;
  updateType: UpdateType;
};

export type WeightGuess = {
  id: string;
  name: string;
  pounds: number;
  ounces: number;
};

export type ReactionCounts = Record<ReactionKind, number>;

export type DashboardData = {
  family: FamilyRecord;
  recipients: Recipient[];
  updates: FamilyUpdate[];
  guesses: WeightGuess[];
  reactionTotals: ReactionCounts;
  reactionCountsByUpdate: Record<string, ReactionCounts>;
};

export type PublicFamilyData = {
  family: FamilyRecord;
  updates: FamilyUpdate[];
  guesses: WeightGuess[];
  reactionCountsByUpdate: Record<string, ReactionCounts>;
};

export const emptyReactionCounts = (): ReactionCounts => ({
  heart: 0,
  pray: 0,
  celebrate: 0,
});
