"use client";

import { cn } from "@/lib/cn";
import type { ReactionCounts } from "@/lib/data/types";
import type { ReactionKind } from "@/lib/mock/family";

const REACTIONS: { kind: ReactionKind; emoji: string; label: string }[] = [
  { kind: "heart", emoji: "❤️", label: "Love" },
  { kind: "pray", emoji: "🙏", label: "Thinking of you" },
  { kind: "celebrate", emoji: "🎉", label: "Celebrate" },
];

type FamilyReactionsProps = {
  updateId: string;
  counts: ReactionCounts;
  selected?: ReactionKind;
  onToggle: (updateId: string, kind: ReactionKind) => void;
};

export function FamilyReactions({
  updateId,
  counts,
  selected,
  onToggle,
}: FamilyReactionsProps) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {REACTIONS.map((reaction) => {
        const active = selected === reaction.kind;
        return (
          <button
            key={reaction.kind}
            type="button"
            aria-pressed={active}
            aria-label={`${reaction.label}, ${counts[reaction.kind]}`}
            className={cn(
              "inline-flex h-10 min-w-[4.25rem] items-center justify-center gap-1.5 rounded-full px-3 text-sm",
              reaction.kind === "celebrate" ? "min-w-[4.75rem]" : "",
              active
                ? "bg-blush-soft/70 text-charcoal"
                : reaction.kind === "celebrate"
                  ? "bg-blush-soft/50 text-charcoal hover:bg-blush-soft/70"
                  : "bg-cream-deep/60 text-charcoal/80 hover:bg-cream-deep",
            )}
            onClick={() => onToggle(updateId, reaction.kind)}
          >
            <span aria-hidden>{reaction.emoji}</span>
            <span>{counts[reaction.kind]}</span>
          </button>
        );
      })}
    </div>
  );
}
