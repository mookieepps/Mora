import type { FamilyUpdate, ReactionCounts } from "@/lib/data/types";
import { emptyReactionCounts } from "@/lib/data/types";
import type { MockFamilyUpdate } from "@/lib/mock/family";

export function formatFeedTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function liveUpdatesToFeed(
  updates: FamilyUpdate[],
  countsByUpdate: Record<string, ReactionCounts> = {},
): MockFamilyUpdate[] {
  return updates.map((update) => ({
    id: update.id,
    body: update.body,
    timeLabel: formatFeedTime(update.createdAt),
    photo: null,
    photoUrl: update.photoUrl,
    reactions: countsByUpdate[update.id] ?? emptyReactionCounts(),
    kind:
      update.updateType === "BIRTH"
        ? "birth"
        : update.updateType === "LABOR"
          ? "labor"
          : "update",
  }));
}

export function reactionTotals(counts: Record<string, ReactionCounts>): ReactionCounts {
  const total = emptyReactionCounts();
  for (const item of Object.values(counts)) {
    total.heart += item.heart ?? 0;
    total.pray += item.pray ?? 0;
    total.celebrate += item.celebrate ?? 0;
  }
  return total;
}
