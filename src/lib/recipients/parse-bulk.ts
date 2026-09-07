import { normalizeUsPhone, phoneKey } from "@/lib/sms/phone";

export type BulkRecipient = {
  name: string;
  phone: string;
};

export type BulkLineError = {
  lineNumber: number;
  text: string;
  error: string;
};

export function parseBulkRecipientText(
  text: string,
  existingPhones: string[],
): { valid: BulkRecipient[]; errors: BulkLineError[] } {
  const existingKeys = new Set(
    existingPhones.map(phoneKey).filter((key): key is string => Boolean(key)),
  );
  const seenInBatch = new Set<string>();
  const valid: BulkRecipient[] = [];
  const errors: BulkLineError[] = [];

  text.split(/\r?\n/).forEach((raw, index) => {
    const line = raw.trim();
    if (!line) return;

    const lineNumber = index + 1;
    const comma = line.indexOf(",");
    if (comma === -1) {
      errors.push({
        lineNumber,
        text: line,
        error: "Use Name, Phone Number on each line.",
      });
      return;
    }

    const name = line.slice(0, comma).trim();
    const phoneRaw = line.slice(comma + 1).trim();
    if (!name) {
      errors.push({ lineNumber, text: line, error: "Add a name before the comma." });
      return;
    }
    if (!phoneRaw) {
      errors.push({ lineNumber, text: line, error: "Add a phone number after the comma." });
      return;
    }

    const phone = normalizeUsPhone(phoneRaw);
    if (!phone) {
      errors.push({ lineNumber, text: line, error: "Enter a valid US phone number." });
      return;
    }

    if (existingKeys.has(phone) || seenInBatch.has(phone)) {
      errors.push({
        lineNumber,
        text: line,
        error: existingKeys.has(phone)
          ? "This number is already on your list."
          : "This number is listed more than once.",
      });
      return;
    }

    seenInBatch.add(phone);
    valid.push({ name, phone });
  });

  return { valid, errors };
}
