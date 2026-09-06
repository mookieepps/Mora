import type { PregnancyStatus } from "@/lib/domain/pregnancy";

export const DEMO_FAMILY_SLUG = "smyia-and-regis";

export const mockFamily = {
  motherName: "Smyia",
  partnerName: "Regis",
  coupleName: "Smyia & Regis",
  weeksRemaining: 18,
  babyName: "Juniper",
  bornAtLabel: "6:42 AM",
  bornOnLabel: "September 2",
} as const;

export const mockUpdate = {
  timeLabel: "Today · 2:14 PM",
  body: "Felt the baby kick through dinner. We’re both a little breathless — and very sure this is real.",
} as const;

export const mockLaborUpdate = {
  timeLabel: "Just now",
  body: "Water broke. We’re heading in. More soon — we love you.",
} as const;

export type ReactionKind = "heart" | "pray" | "celebrate";

export type FamilyPhotoKind = "bump" | "labor" | "newborn";

export type MockFamilyUpdate = {
  id: string;
  body: string;
  timeLabel: string;
  photo: FamilyPhotoKind | null;
  photoUrl?: string | null;
  reactions: Record<ReactionKind, number>;
  kind?: "update" | "labor" | "birth";
};

export type MockFamilyPage = {
  slug: string;
  coupleName: string;
  /** Change this to preview IN_LABOR or BABY_ARRIVED. */
  status: PregnancyStatus;
  weeksRemaining: number;
  dueDateLabel: string;
  babyName: string;
  bornAtLabel: string;
  bornOnLabel: string;
  babyPhoto: boolean;
  babyWeightLabel: string | null;
  laborUpdate: MockFamilyUpdate;
  updates: MockFamilyUpdate[];
};

export const mockFamilyPage: MockFamilyPage = {
  slug: DEMO_FAMILY_SLUG,
  coupleName: mockFamily.coupleName,
  status: "PREGNANCY",
  weeksRemaining: mockFamily.weeksRemaining,
  dueDateLabel: "January 3, 2027",
  babyName: mockFamily.babyName,
  bornAtLabel: mockFamily.bornAtLabel,
  bornOnLabel: mockFamily.bornOnLabel,
  babyPhoto: true,
  babyWeightLabel: null,
  laborUpdate: {
    id: "labor-1",
    timeLabel: mockLaborUpdate.timeLabel,
    body: mockLaborUpdate.body,
    photo: null,
    reactions: { heart: 8, pray: 11, celebrate: 2 },
  },
  updates: [
    {
      id: "u-1",
      timeLabel: "Today · 10:12 AM",
      body: "Just had our 36-week appointment. Baby is measuring great.",
      photo: "bump",
      reactions: { heart: 12, pray: 4, celebrate: 7 },
    },
    {
      id: "u-2",
      timeLabel: mockUpdate.timeLabel,
      body: mockUpdate.body,
      photo: null,
      reactions: { heart: 9, pray: 3, celebrate: 1 },
    },
    {
      id: "u-3",
      timeLabel: "March 12 · 4:05 PM",
      body: "Third-trimester appointment today. Heartbeat was strong, and we both cried a little in the parking lot.",
      photo: null,
      reactions: { heart: 6, pray: 2, celebrate: 0 },
    },
  ],
};

export function getMockFamilyPage(slug: string): MockFamilyPage | null {
  if (slug !== DEMO_FAMILY_SLUG) return null;
  return mockFamilyPage;
}

export function feedUpdatesFor(page: MockFamilyPage): MockFamilyUpdate[] {
  if (page.status === "IN_LABOR") {
    return [page.laborUpdate, ...page.updates];
  }
  return page.updates;
}
