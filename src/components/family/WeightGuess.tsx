"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { submitWeightGuessAction } from "@/app/actions/mora";
import { closestWeightGuess, formatBirthWeight } from "@/lib/data/birth";
import type { BirthDetails, WeightGuess as WeightGuessType } from "@/lib/data/types";

export function WeightGuess({
  slug,
  birth,
  guesses,
}: {
  slug: string;
  birth?: BirthDetails | null;
  guesses: WeightGuessType[];
}) {
  const router = useRouter();
  const actualWeight =
    birth && (birth.weightPounds != null || birth.weightOunces != null)
      ? formatBirthWeight(birth.weightPounds, birth.weightOunces)
      : null;
  const closest =
    birth && birth.weightPounds != null
      ? closestWeightGuess(guesses, birth.weightPounds, birth.weightOunces ?? 0)
      : null;
  const arrived = Boolean(birth);
  const [name, setName] = useState("");
  const [pounds, setPounds] = useState("");
  const [ounces, setOunces] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit() {
    const nextName = name.trim();
    const lb = Number(pounds);
    const oz = Number(ounces);

    if (!nextName) {
      setError("Add your name.");
      return;
    }
    if (!Number.isFinite(lb) || lb < 0 || lb > 20 || pounds.trim() === "") {
      setError("Enter pounds between 0 and 20.");
      return;
    }
    if (!Number.isFinite(oz) || oz < 0 || oz > 15 || ounces.trim() === "") {
      setError("Enter ounces between 0 and 15.");
      return;
    }

    setBusy(true);
    const result = await submitWeightGuessAction(slug, {
      name: nextName,
      pounds: lb,
      ounces: oz,
    });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setName("");
    setPounds("");
    setOunces("");
    setError("");
    setSaved(true);
    router.refresh();
    window.setTimeout(() => setSaved(false), 2500);
  }

  return (
    <section className="mt-12 border-t border-charcoal/8 pt-8">
      {arrived ? (
        <>
          <h2 className="text-lg font-medium tracking-tight">Birth weight</h2>
          {actualWeight ? (
            <>
              <p className="mt-1 text-sm text-ink-muted">Actual</p>
              <p className="mt-1 text-[17px]">{actualWeight}</p>
              {closest ? (
                <div className="mt-5">
                  <p className="text-[13px] text-ink-muted">Closest guess</p>
                  <p className="mt-1 text-[15px] font-medium">{closest.name}</p>
                  <p className="text-sm text-ink-muted">
                    {closest.pounds} lb {closest.ounces} oz
                  </p>
                </div>
              ) : null}
            </>
          ) : (
            <p className="mt-2 text-sm text-ink-muted">No official weight was shared yet.</p>
          )}
          {guesses.length > 0 ? (
            <ul className="mt-6 space-y-2">
              {guesses.map((guess) => (
                <li key={guess.id} className="flex items-baseline justify-between gap-3 text-[15px]">
                  <span className="min-w-0 truncate">{guess.name}</span>
                  <span className="shrink-0 text-ink-muted">
                    {guess.pounds} lb {guess.ounces} oz
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      ) : (
        <>
          <h2 className="text-lg font-medium tracking-tight">Guess the birth weight</h2>
          <p className="mt-1 text-sm text-ink-muted">
            A small family pool — just for fun, kept on this page.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_5.5rem_5.5rem]">
            <Field
              id="guess-name"
              label="Name"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <Field
              id="guess-pounds"
              label="Pounds"
              inputMode="numeric"
              value={pounds}
              onChange={(event) => setPounds(event.target.value)}
            />
            <Field
              id="guess-ounces"
              label="Ounces"
              inputMode="numeric"
              value={ounces}
              onChange={(event) => setOunces(event.target.value)}
            />
          </div>
          {error ? <p className="mt-2 text-sm text-[#9a4f40]">{error}</p> : null}

          <Button
            type="button"
            className="mt-5 h-12 w-full sm:w-auto"
            disabled={busy}
            onClick={submit}
          >
            Submit my guess
          </Button>
          {saved ? <p className="mt-3 text-sm text-charcoal">Guess saved.</p> : null}

          {guesses.length > 0 ? (
            <ul className="mt-6 space-y-2">
              {guesses.map((guess) => (
                <li key={guess.id} className="flex items-baseline justify-between gap-3 text-[15px]">
                  <span className="min-w-0 truncate">{guess.name}</span>
                  <span className="shrink-0 text-ink-muted">
                    {guess.pounds} lb {guess.ounces} oz
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      )}
    </section>
  );
}
