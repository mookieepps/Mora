"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { submitSmsOptInAction } from "@/app/actions/sms-opt-in";
import type { SmsOptInView } from "@/lib/data/sms-opt-in";

export function SmsOptInForm({ view }: { view: SmsOptInView }) {
  const [phone, setPhone] = useState(view.phone);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(view.alreadyConsented);

  async function submit() {
    if (busy) return;
    if (!agreed) {
      setError("Check the box if you want to receive text messages.");
      return;
    }
    setBusy(true);
    setError("");
    const result = await submitSmsOptInAction(view.token, phone, agreed);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div>
        <p className="text-[15px] leading-relaxed text-charcoal/85">
          You’re signed up for Mora text updates from {view.familyNames}. You can still read
          everything on their family page.
        </p>
        <Button href={`/family/${view.familySlug}`} className="mt-6 h-12 w-full">
          View family updates
        </Button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[15px] leading-relaxed text-charcoal/85">
        {view.recipientName}, {view.familyNames} invited you to receive pregnancy, labor, and birth
        updates from Mora. Mora is operated by {"Papa J's & Company LLC"}.
      </p>
      <p className="mt-4 text-[15px] leading-relaxed text-charcoal/85">
        Texts are optional. You can decline and still view their family page on the web.
      </p>

      <div className="mt-6">
        <Field
          id="opt-in-phone"
          label="Mobile number for texts"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-2.5">
        <input
          id="sms-opt-in-agree"
          type="checkbox"
          checked={agreed}
          onChange={(event) => setAgreed(event.target.checked)}
          className="mt-1 size-4 shrink-0 rounded border-charcoal/25 accent-charcoal"
        />
        <span className="text-sm leading-relaxed text-ink-muted">
          I agree to receive SMS text messages from Mora, operated by {"Papa J's & Company LLC"},
          containing pregnancy, labor, and birth updates from the family that invited me. Message
          frequency varies. Message and data rates may apply. Reply STOP to opt out and HELP for
          help.
        </span>
      </label>

      <p className="mt-3 text-sm text-ink-muted">
        <Link href="/privacy" className="underline underline-offset-4 hover:text-charcoal">
          Privacy Policy
        </Link>
        <span aria-hidden className="px-2">
          ·
        </span>
        <Link href="/terms" className="underline underline-offset-4 hover:text-charcoal">
          Terms of Service
        </Link>
      </p>
      <p className="mt-2 text-sm text-ink-muted">
        Agreeing to SMS is optional and is not a condition of purchase.
      </p>

      {error ? <p className="mt-3 text-sm text-[#9a4f40]">{error}</p> : null}

      <div className="mt-6 flex flex-col gap-2">
        <Button type="button" className="h-12 w-full" disabled={busy || !agreed} onClick={submit}>
          {busy ? "Saving..." : "Agree to texts"}
        </Button>
        <Link
          href={`/family/${view.familySlug}`}
          className="inline-flex h-12 w-full items-center justify-center rounded-full text-sm font-medium text-charcoal/75"
        >
          No thanks — view the family page
        </Link>
      </div>
    </div>
  );
}
