import { coupleDisplayName } from "@/lib/domain/pregnancy";
import type { FamilyRecord, Recipient } from "@/lib/data/types";
import { familyPageUrl, isTwilioConfigured } from "@/lib/sms/env";
import { normalizeUsPhone } from "@/lib/sms/phone";
import { sendFamilyUpdateSms, sendSms } from "@/lib/sms/send-family-update";
import { selectSmsTargets } from "@/lib/sms/targets";

function laborStartedBody(coupleName: string, familyUrl: string) {
  return `🚗 Baby update from Mora: ${coupleName} are heading in — labor has started! Follow their updates here: ${familyUrl}. Reply STOP to opt out.`;
}

async function sendLaborSmsToTargets(
  targets: Recipient[],
  coupleName: string,
  familyUrl: string,
) {
  let sent = 0;
  let failed = 0;
  let skipped = 0;
  const body = laborStartedBody(coupleName, familyUrl);

  for (const recipient of targets) {
    const to = normalizeUsPhone(recipient.phone);
    if (!to) {
      skipped += 1;
      continue;
    }
    const result = await sendSms({ to, body });
    if (result.ok) sent += 1;
    else failed += 1;
  }

  return { sent, failed, skipped };
}

export async function notifyRecipientsOfNormalUpdate(
  family: FamilyRecord,
  recipients: Recipient[],
): Promise<string> {
  const selected = selectSmsTargets(recipients);
  if (selected.status === "none") {
    return "Update saved. Add a recipient to send texts.";
  }
  if (selected.status === "no_consent") {
    return "Update saved. Recipients need SMS consent before texts can be sent.";
  }

  const familyUrl = familyPageUrl(family.slug);
  if (!familyUrl) {
    return "Update saved. To text family, set NEXT_PUBLIC_APP_URL to a public https address (not localhost).";
  }

  if (!isTwilioConfigured()) {
    return "Update saved. Text notifications are not connected yet.";
  }

  if (selected.status === "test_mismatch") {
    return "Update saved. Test mode is on, and no recipient matched TWILIO_TEST_PHONE.";
  }

  const coupleName = coupleDisplayName(family.motherName, family.partnerName);
  let sent = 0;
  let failed = 0;
  let skipped = 0;

  for (const recipient of selected.targets) {
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

export async function notifyRecipientsOfLaborStarted(
  family: FamilyRecord,
  recipients: Recipient[],
): Promise<string> {
  const selected = selectSmsTargets(recipients);
  if (selected.status === "none") {
    return "You're in labor. Add a recipient to send texts.";
  }
  if (selected.status === "no_consent") {
    return "You're in labor. Recipients need SMS consent before texts can be sent.";
  }

  const familyUrl = familyPageUrl(family.slug);
  if (!familyUrl) {
    return "You're in labor, but texts could not be sent. Set NEXT_PUBLIC_APP_URL to a public https address (not localhost).";
  }

  if (!isTwilioConfigured()) {
    return "You're in labor, but texts could not be sent. Text notifications are not connected yet.";
  }

  if (selected.status === "test_mismatch") {
    return "You're in labor. Test mode is on, and no recipient matched TWILIO_TEST_PHONE.";
  }

  const coupleName = coupleDisplayName(family.motherName, family.partnerName);
  const { sent, failed, skipped } = await sendLaborSmsToTargets(
    selected.targets,
    coupleName,
    familyUrl,
  );

  if (failed === 0 && skipped === 0 && sent > 0) {
    return `You're in labor. Family has been notified.`;
  }
  if (sent > 0 && (failed > 0 || skipped > 0)) {
    return "You're in labor, but some texts could not be sent.";
  }
  return "You're in labor, but the texts could not be sent.";
}
