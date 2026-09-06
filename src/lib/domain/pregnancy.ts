export type PregnancyStatus = "PREGNANCY" | "IN_LABOR" | "BABY_ARRIVED";

export function parseLocalDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function weeksRemaining(dueDate: string, from: Date = new Date()): number {
  const due = startOfDay(parseLocalDate(dueDate));
  const today = startOfDay(from);
  const days = Math.ceil((due.getTime() - today.getTime()) / 86_400_000);
  return Math.max(0, Math.ceil(days / 7));
}

export function coupleDisplayName(motherName: string, partnerName?: string | null): string {
  const mother = motherName.trim();
  const partner = partnerName?.trim();
  return partner ? `${mother} & ${partner}` : mother;
}

export function formatDueDateNumeric(isoDate: string): string {
  const date = parseLocalDate(isoDate);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

export function formatDueDate(isoDate: string): string {
  return parseLocalDate(isoDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function statusLabel(status: PregnancyStatus): string {
  if (status === "IN_LABOR") return "In labor";
  if (status === "BABY_ARRIVED") return "Baby arrived";
  return "Pregnancy";
}
