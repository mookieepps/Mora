import type { Metadata } from "next";
import { LegalShell } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Privacy Policy — Mora",
  description: "How Mora collects, uses, and shares information, including SMS consent.",
};

export default function PrivacyPage() {
  return (
    <LegalShell kicker="Legal" title="Privacy Policy">
      <p className="text-sm text-ink-muted">Last updated: September 19, 2026</p>
      <p>Mora is operated by {"Papa J's & Company LLC"}.</p>
      <p>
        Mora is a private family-update service. Expecting parents can share pregnancy, labor, and
        birth updates with people they invite. This policy describes information Mora may collect
        and how it is used in the current product.
      </p>

      <h2 className="pt-2 font-serif text-2xl tracking-tight text-charcoal">Information we may collect</h2>
      <p>Depending on how Mora is used, we may collect:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Account information, such as an email address and authentication details used to sign in.</li>
        <li>Expecting parent and family information, such as names, due date, family page details, and birth announcement details.</li>
        <li>Recipient names and phone numbers that a parent adds so family members can be invited.</li>
        <li>Pregnancy and family updates posted to a family page, including optional photos uploaded by users.</li>
        <li>SMS consent records, including whether a recipient agreed to texts, when they agreed, the phone number they confirmed, and basic technical details from that opt-in (such as IP address or browser information) used to document consent.</li>
        <li>Reactions and baby-weight guesses submitted on a family page.</li>
        <li>Basic technical and service information needed to operate Mora, such as logs, device or browser information, and data required to keep the service running securely.</li>
      </ul>

      <h2 className="pt-2 font-serif text-2xl tracking-tight text-charcoal">How we use information</h2>
      <p>We use this information to:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Operate family update pages and show invited people the content a family chooses to share.</li>
        <li>Send requested pregnancy, labor, and birth notifications, including SMS to recipients who have personally opted in.</li>
        <li>Maintain accounts, family pages, and recipient lists.</li>
        <li>Operate, secure, and improve the service.</li>
      </ul>
      <p>Mora is not a medical or healthcare service, and we do not use this information to provide medical advice.</p>

      <h2 className="pt-2 font-serif text-2xl tracking-tight text-charcoal">SMS</h2>
      <p>
        Recipients only receive Mora texts after they personally agree on the Mora SMS Family
        Updates opt-in page. Parents cannot consent on a recipient’s behalf. SMS participation is
        optional. Recipients can decline texts and still view a family’s web updates if they have
        the family page link.
      </p>
      <p>
        SMS consent is not shared with third parties or affiliates for marketing or promotional
        purposes.
      </p>
      <p>Message frequency varies. Message and data rates may apply. Recipients can reply STOP to SMS messages to opt out, and HELP for help.</p>

      <h2 className="pt-2 font-serif text-2xl tracking-tight text-charcoal">Service providers</h2>
      <p>
        Mora uses service providers such as hosting, database, authentication, storage, and
        communications providers to operate the service. These providers process information only
        as needed to provide their services to Mora.
      </p>

      <h2 className="pt-2 font-serif text-2xl tracking-tight text-charcoal">Sharing and access</h2>
      <p>
        Family pages are meant for people a parent invites. Recipients and others who receive a
        family page link may see the updates, photos, and details the family posts there. Do not
        upload or share information you do not have permission to share.
      </p>
      <p>
        We may also disclose information if required by law, to protect the service or users, or in
        connection with a business transfer of Mora.
      </p>

      <h2 className="pt-2 font-serif text-2xl tracking-tight text-charcoal">Security</h2>
      <p>
        We use reasonable security measures to protect information. No internet service can
        guarantee absolute security.
      </p>

      <h2 className="pt-2 font-serif text-2xl tracking-tight text-charcoal">Your choices</h2>
      <p>
        Parents can manage recipients and family page content from their Mora account. Recipients
        who opted in to SMS can reply STOP to opt out of texts. Anyone with a family page link can
        use the web page without agreeing to SMS.
      </p>

      <h2 className="pt-2 font-serif text-2xl tracking-tight text-charcoal">Contact</h2>
      <p>
        Mora is operated by {"Papa J's & Company LLC"}. For privacy questions, email:{" "}
        <span className="font-medium text-charcoal">[ADD SUPPORT EMAIL]</span>
      </p>
    </LegalShell>
  );
}
