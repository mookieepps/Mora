function slugPart(value: string): string {
  const part = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return part || "family";
}

export function familySlugFromNames(motherName: string, partnerName: string | null): string {
  const mother = slugPart(motherName);
  const partner = partnerName?.trim() ? slugPart(partnerName) : "";
  return partner ? `${mother}-and-${partner}` : mother;
}
