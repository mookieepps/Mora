export function normalizeUsPhone(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

export function phoneKey(input: string): string | null {
  const normalized = normalizeUsPhone(input);
  if (normalized) return normalized;
  const digits = input.replace(/\D/g, "");
  return digits.length > 0 ? digits : null;
}
