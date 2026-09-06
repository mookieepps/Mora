export function formatBirthWeight(
  pounds: number | null,
  ounces: number | null,
): string | null {
  if (pounds == null && ounces == null) return null;
  const lb = pounds ?? 0;
  const oz = ounces ?? 0;
  return `${lb} lb ${oz} oz`;
}

export function formatBirthLength(inches: number | null): string | null {
  if (inches == null) return null;
  return `${inches} in`;
}

export function formatBirthMeasures(birth: {
  weightPounds: number | null;
  weightOunces: number | null;
  lengthInches: number | null;
}): string | null {
  const weight = formatBirthWeight(birth.weightPounds, birth.weightOunces);
  const length = formatBirthLength(birth.lengthInches);
  if (weight && length) return `${weight} · ${length}`;
  return weight ?? length;
}

export function closestWeightGuess<T extends { pounds: number; ounces: number }>(
  guesses: T[],
  pounds: number,
  ounces: number,
): T | null {
  if (guesses.length === 0) return null;
  const actual = pounds * 16 + ounces;
  return guesses.reduce((best, guess) => {
    const diff = Math.abs(guess.pounds * 16 + guess.ounces - actual);
    const bestDiff = Math.abs(best.pounds * 16 + best.ounces - actual);
    return diff < bestDiff ? guess : best;
  });
}
