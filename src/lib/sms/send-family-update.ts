import twilio from "twilio";
import { getTwilioConfig } from "@/lib/sms/env";

export async function sendSms(input: {
  to: string;
  body: string;
}): Promise<{ ok: true } | { ok: false }> {
  const config = getTwilioConfig();
  if (!config) return { ok: false };

  try {
    const client = twilio(config.accountSid, config.authToken);
    await client.messages.create({
      from: config.fromNumber,
      to: input.to,
      body: input.body,
    });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export async function sendFamilyUpdateSms(input: {
  to: string;
  coupleName: string;
  familyUrl: string;
}): Promise<{ ok: true } | { ok: false }> {
  return sendSms({
    to: input.to,
    body: `${input.coupleName} shared a new pregnancy update on Mora. View it here: ${input.familyUrl}`,
  });
}
