import { coupleDisplayName } from "@/lib/domain/pregnancy";
import type { FamilyRecord, Recipient } from "@/lib/data/types";
import { familyPageUrl, isTwilioConfigured } from "@/lib/sms/env";
import { normalizeUsPhone } from "@/lib/sms/phone";
import { sendFamilyUpdateSms } from "@/lib/sms/send-family-update";

function testPhoneFilter(): string | null {
  const raw = process.env.TWILIO_TEST_PHONE?.trim();
  if (!raw) return null;
  return normalizeUsPhone(raw);
}

export async function notifyRecipientsOfNormalUpdate(
  family: FamilyRecord,
  recipients: Recipient[],
): Promise<string> {
  if (recipients.length === 0) {
    return "Update saved. Add a recipient to send texts.";
  }

  const familyUrl = familyPageUrl(family.slug);
  if (!familyUrl) {
    return "Update saved. To text family, set NEXT_PUBLIC_APP_URL to a public https address (not localhost).";
  }

  if (!isTwilioConfigured()) {
    return "Update saved. Text notifications are not connected yet.";
  }

  const coupleName = coupleDisplayName(family.motherName, family.partnerName);
  const testPhone = testPhoneFilter();
  const targets = testPhone
    ? recipients.filter((recipient) => normalizeUsPhone(recipient.phone) === testPhone)
    : recipients;

  if (testPhone && targets.length === 0) {
    return "Update saved. Test mode is on, and no recipient matched TWILIO_TEST_PHONE.";
  }

  let sent = 0;
  let failed = 0;
  let skipped = 0;

  for (const recipient of targets) {
    const to = normalizeUsPhone(recipient.phone);
    if (!to) {
      skipped += 1;
      continue;
    }
    const result = await sendFamilyUpdateSms({ to, coupleName, familyUrl });
    if (result.ok) sent += 1;
    else failed += 1;
  }

  const attempted = sent + failed;
  if (attempted === 0 && skipped > 0) {
    return "Update saved, but some notifications could not be sent.";
  }
  if (failed === 0 && skipped === 0) {
    return `Update sent. ${sent} of ${sent} family members notified.`;
  }
  if (sent > 0 && (failed > 0 || skipped > 0)) {
    return `Update sent. ${sent} of ${sent + failed + skipped} family members notified.`;
  }
  return "Update saved, but some notifications could not be sent.";
}
