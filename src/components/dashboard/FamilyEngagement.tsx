"use client";

import { closestWeightGuess, formatBirthWeight } from "@/lib/data/birth";
import type { BirthDetails, ReactionCounts, WeightGuess } from "@/lib/data/types";

export function FamilyEngagement({
  totals,
  guesses,
  birth,
}: {
  totals: ReactionCounts;
  guesses: WeightGuess[];
  birth: BirthDetails | null;
}) {
  const actualWeight =
    birth && (birth.weightPounds != null || birth.weightOunces != null)
      ? formatBirthWeight(birth.weightPounds, birth.weightOunces)
      : null;
  const closest =
    birth && birth.weightPounds != null
      ? closestWeightGuess(guesses, birth.weightPounds, birth.weightOunces ?? 0)
      : null;

  return (
    <>
      <section>
        <h2 className="text-lg font-medium tracking-tight">Family reactions</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Love, prayers, and cheers from your private page.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <ReactionTotal emoji="❤️" label="Love" count={totals.heart} />
          <ReactionTotal emoji="🙏" label="Thinking of you" count={totals.pray} />
          <ReactionTotal
            emoji="🎉"
            label="Celebrate"
            count={totals.celebrate}
            featured={Boolean(birth)}
          />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium tracking-tight">
          {actualWeight ? "Birth weight" : "Baby weight guesses"}
        </h2>
        {actualWeight ? (
          <>
            <p className="mt-3 text-[17px]">{actualWeight}</p>
            {closest ? (
              <div className="mt-4">
                <p className="text-[13px] text-ink-muted">Closest guess</p>
                <p className="mt-1 text-[15px] font-medium">{closest.name}</p>
                <p className="text-sm text-ink-muted">
                  {closest.pounds} lb {closest.ounces} oz
                </p>
              </div>
            ) : null}
            {guesses.length > 1 ? (
              <ul className="mt-4 space-y-2">
                {guesses.map((guess) => (
                  <li
                    key={guess.id}
                    className="flex items-baseline justify-between gap-3 text-sm text-ink-muted"
                  >
                    <span className="min-w-0 truncate">{guess.name}</span>
                    <span className="shrink-0">
                      {guess.pounds} lb {guess.ounces} oz
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        ) : guesses.length === 0 ? (
          <p className="mt-4 text-sm text-ink-muted">No guesses yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {guesses.map((guess) => (
              <li key={guess.id} className="flex items-baseline justify-between gap-3">
                <span className="min-w-0 truncate text-[15px] font-medium">{guess.name}</span>
                <span className="shrink-0 text-[15px] text-ink-muted">
                  {guess.pounds} lb {guess.ounces} oz
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function ReactionTotal({
  emoji,
  label,
  count,
  featured = false,
}: {
  emoji: string;
  label: string;
  count: number;
  featured?: boolean;
}) {
  return (
    <p
      className={
        featured
          ? "inline-flex h-11 min-w-[4.75rem] items-center justify-center gap-1.5 rounded-full bg-blush-soft px-3.5 text-sm text-charcoal"
          : "inline-flex h-10 min-w-[4.25rem] items-center justify-center gap-1.5 rounded-full bg-blush-soft/70 px-3 text-sm text-charcoal"
      }
      aria-label={`${label}, ${count}`}
    >
      <span aria-hidden>{emoji}</span>
      <span>{count}</span>
    </p>
  );
}
