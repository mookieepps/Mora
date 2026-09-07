import type { Recipient } from "@/lib/data/types";
import { normalizeUsPhone } from "@/lib/sms/phone";

function testPhoneFilter(): string | null {
  const raw = process.env.TWILIO_TEST_PHONE?.trim();
  if (!raw) return null;
  return normalizeUsPhone(raw);
}

export type SmsTargetSelection =
  | { status: "none" }
  | { status: "no_consent" }
  | { status: "test_mismatch" }
  | { status: "ok"; targets: Recipient[] };

export function selectSmsTargets(recipients: Recipient[]): SmsTargetSelection {
  if (recipients.length === 0) return { status: "none" };

  const consented = recipients.filter((recipient) => recipient.smsConsent);
  if (consented.length === 0) return { status: "no_consent" };

  const testPhone = testPhoneFilter();
  const targets = testPhone
    ? consented.filter((recipient) => normalizeUsPhone(recipient.phone) === testPhone)
    : consented;

  if (testPhone && targets.length === 0) return { status: "test_mismatch" };
  return { status: "ok", targets };
}
