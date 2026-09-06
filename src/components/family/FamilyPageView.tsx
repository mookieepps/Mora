"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FamilyReactions } from "@/components/family/FamilyReactions";
import { WeightGuess } from "@/components/family/WeightGuess";
import { FamilyPhoto } from "@/components/media/FamilyPhoto";
import { Still } from "@/components/product/Still";
import { loadMyReactions, toggleReactionAction } from "@/app/actions/mora";
import { formatBirthMeasures } from "@/lib/data/birth";
import { liveUpdatesToFeed } from "@/lib/data/family-feed";
import { emptyReactionCounts, type BirthDetails, type PublicFamilyData } from "@/lib/data/types";
import { getVisitorId } from "@/lib/data/visitor";
import {
  coupleDisplayName,
  formatDueDate,
  weeksRemaining,
} from "@/lib/domain/pregnancy";
import type { MockFamilyPage, MockFamilyUpdate, ReactionKind } from "@/lib/mock/family";

export function FamilyPageView({ data }: { data: PublicFamilyData }) {
  const router = useRouter();
  const family = data.family;
  const coupleName = coupleDisplayName(family.motherName, family.partnerName);
  const weeks = weeksRemaining(family.dueDate);
  const dueDateLabel = formatDueDate(family.dueDate);
  const feed = liveUpdatesToFeed(data.updates, data.reactionCountsByUpdate);
  const [mine, setMine] = useState<Record<string, ReactionKind | undefined>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    const visitorId = getVisitorId();
    loadMyReactions(family.slug, visitorId)
      .then(setMine)
      .catch(() => undefined);
  }, [family.slug, data.updates.length]);

  async function onToggle(updateId: string, kind: ReactionKind) {
    setError("");
    const result = await toggleReactionAction(family.slug, updateId, getVisitorId(), kind);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex min-h-full flex-col overflow-x-clip">
      <header className="px-5 py-3 sm:px-8">
        <div className="mx-auto flex h-9 max-w-lg items-center justify-between">
          <Link href="/" className="font-serif text-[1.35rem] leading-none tracking-tight">
            Mora
          </Link>
          <p className="text-[12px] tracking-wide text-ink-muted">Private</p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg flex-1 px-5 pb-14 sm:px-8">
        <FamilyStatusHeader
          coupleName={coupleName}
          status={family.status}
          weeksRemaining={weeks}
          dueDateLabel={dueDateLabel}
          birth={family.birth}
        />

        <section className="mt-8">
          <h2 className="text-[11px] font-medium tracking-[0.16em] text-ink-muted uppercase">
            Updates
          </h2>
          {error ? <p className="mt-3 text-sm text-[#9a4f40]">{error}</p> : null}
          {feed.length === 0 ? (
            <p className="mt-4 text-sm text-ink-muted">No updates yet.</p>
          ) : (
            <ol className="mt-4">
              {feed.map((update, index) => (
                <li
                  key={update.id}
                  className={index === 0 ? "" : "mt-7 border-t border-charcoal/8 pt-7"}
                >
                  <UpdateItem
                    update={update}
                    counts={data.reactionCountsByUpdate[update.id] ?? emptyReactionCounts()}
                    selected={mine[update.id]}
                    onToggle={onToggle}
                  />
                </li>
              ))}
            </ol>
          )}
        </section>

        <WeightGuess slug={family.slug} birth={family.birth} guesses={data.guesses} />
      </main>
    </div>
  );
}

function FamilyStatusHeader({
  coupleName,
  status,
  weeksRemaining,
  dueDateLabel,
  birth,
}: {
  coupleName: string;
  status: MockFamilyPage["status"];
  weeksRemaining: number;
  dueDateLabel: string;
  birth: BirthDetails | null;
}) {
  const measures = birth ? formatBirthMeasures(birth) : null;

  return (
    <header className="pt-2 text-center">
      <h1 className="font-serif text-[2rem] leading-[1.05] tracking-tight sm:text-[2.2rem]">
        {coupleName}
      </h1>

      {status === "PREGNANCY" ? (
        <>
          <p className="mt-3 text-[13px] text-ink-muted">Pregnancy</p>
          <p className="mt-1.5 text-[17px] leading-snug text-charcoal">
            {weeksRemaining} weeks away from meeting baby{" "}
            <span aria-hidden>❤️</span>
          </p>
          <p className="mt-2 text-sm text-ink-muted">Due {dueDateLabel}</p>
        </>
      ) : null}

      {status === "IN_LABOR" ? (
        <>
          <p className="mt-3 text-[13px] text-ink-muted">In labor</p>
          <p className="mt-2 font-serif text-[1.55rem] leading-snug">
            <span aria-hidden>🚗 </span>Currently in Labor
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
            We’re heading in. We’ll share updates here as things progress.
          </p>
        </>
      ) : null}

      {status === "BABY_ARRIVED" && birth ? (
        <>
          <p className="mt-4 text-[17px] leading-snug">
            Baby Is Here! <span aria-hidden>🎉</span>
          </p>
          <p className="mt-3 font-serif text-[2.5rem] leading-none tracking-tight">
            {birth.babyName}
          </p>
          <p className="mt-3 text-[15px] text-ink-muted">Born at {birth.bornAt}</p>
          {measures ? <p className="mt-1 text-[15px] text-ink-muted">{measures}</p> : null}
          {birth.photoDataUrl ? (
            <FamilyPhoto
              src={birth.photoDataUrl}
              alt={birth.babyName}
              className="mx-auto mt-5 max-w-xs"
            />
          ) : null}
        </>
      ) : null}

      {status === "BABY_ARRIVED" && !birth ? (
        <p className="mt-4 text-[17px] leading-snug">
          Baby Is Here! <span aria-hidden>🎉</span>
        </p>
      ) : null}
    </header>
  );
}

function UpdateItem({
  update,
  counts,
  selected,
  onToggle,
}: {
  update: MockFamilyUpdate;
  counts: PublicFamilyData["reactionCountsByUpdate"][string];
  selected?: ReactionKind;
  onToggle: (updateId: string, kind: ReactionKind) => void;
}) {
  const milestone = update.kind === "birth";

  return (
    <article
      className={
        milestone
          ? "-mx-1 rounded-[1.5rem] bg-blush-soft/40 px-4 py-4 sm:px-5"
          : undefined
      }
    >
      <p className="text-[13px] text-ink-muted">{update.timeLabel}</p>
      <p
        className={
          milestone
            ? "mt-2 font-serif text-[1.45rem] leading-snug tracking-tight"
            : "mt-2 text-[16px] leading-relaxed"
        }
      >
        {update.body}
      </p>
      {update.photoUrl ? <FamilyPhoto src={update.photoUrl} alt="" className="mt-4" /> : null}
      {update.photo && !update.photoUrl ? (
        <Still kind={update.photo} className="mt-4 h-36 w-full rounded-2xl sm:h-40" />
      ) : null}
      <FamilyReactions
        updateId={update.id}
        counts={counts}
        selected={selected}
        onToggle={onToggle}
      />
    </article>
  );
}
