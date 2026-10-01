import { smsOptInUrl } from "@/lib/sms/env";
import { normalizeUsPhone } from "@/lib/sms/phone";

export function recipientInviteUrl(token: string): string | null {
  return smsOptInUrl(token);
}

export function parentInviteMessage(familyNames: string, optInUrl: string): string {
  return `${familyNames} invited you to follow their pregnancy updates on Mora. Choose whether you'd like to receive text updates here: ${optInUrl}`;
}

export function prefersNativeSms(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return true;
  if (/iPhone|iPod|iPad/i.test(ua)) return true;
  if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) return true;
  return false;
}

function smsRecipient(phone: string): string {
  return normalizeUsPhone(phone) ?? phone.replace(/[^\d+]/g, "");
}

export function nativeSmsHref(phone: string, body: string): string {
  const encodedBody = encodeURIComponent(body);
  const to = smsRecipient(phone);
  const isApple =
    typeof navigator !== "undefined" &&
    (/iPhone|iPod|iPad/i.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
  if (to) {
    return isApple ? `sms:${to}&body=${encodedBody}` : `sms:${to}?body=${encodedBody}`;
  }
  return isApple ? `sms:&body=${encodedBody}` : `sms:?body=${encodedBody}`;
}
