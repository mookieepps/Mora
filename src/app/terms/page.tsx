import type { Metadata } from "next";
import { LegalShell } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Terms of Service — Mora",
  description: "Terms for using Mora, including family pages and optional SMS updates.",
};

export default function TermsPage() {
  return (
    <LegalShell kicker="Legal" title="Terms of Service">
      <p className="text-sm text-ink-muted">Last updated: September 19, 2026</p>
      <p>Mora is operated by {"Papa J's & Company LLC"}.</p>
      <p>
        These terms govern use of Mora, a private family-update service for sharing pregnancy,
        labor, and birth updates with people a family invites. By creating an account, posting
        content, or using a family page, you agree to these terms.
      </p>
      <p>
        Mora does not provide medical advice or healthcare services. Information shared on Mora is
        for family communication only and is not a substitute for care from a qualified clinician.
      </p>

      <h2 className="pt-2 font-serif text-2xl tracking-tight text-charcoal">Using Mora</h2>
      <p>
        You may use Mora only for lawful family communication. You are responsible for the
        information, photos, and other content you submit, and for keeping your account details
        accurate. You must have permission to upload or share any content you add, including photos
        and personal information about other people.
      </p>

      <h2 className="pt-2 font-serif text-2xl tracking-tight text-charcoal">Family pages and recipients</h2>
      <p>
        A parent can create a family page and add recipients by name and phone number. People who
        have the family page link can view updates on the web. Adding a recipient does not, by
        itself, authorize SMS. Recipients only receive texts after they personally opt in.
      </p>
      <p>
        Parents should only invite people they intend to share pregnancy and birth updates with.
        Recipients and others with the link may see content posted to that family page.
      </p>

      <h2 className="pt-2 font-serif text-2xl tracking-tight text-charcoal">SMS family notifications</h2>
      <p>
        Mora may send pregnancy, labor, and birth text updates to recipients who agree on the Mora
        SMS Family Updates page. SMS participation is optional. Agreeing to SMS is not required to
        use or view the underlying Mora web service.
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Message frequency varies.</li>
        <li>Message and data rates may apply.</li>
        <li>Reply STOP to opt out.</li>
        <li>Reply HELP for help.</li>
      </ul>
      <p>Consent to receive SMS is not a condition of purchase.</p>

      <h2 className="pt-2 font-serif text-2xl tracking-tight text-charcoal">Acceptable use</h2>
      <p>You agree not to:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Use Mora to harass, impersonate, or harm others.</li>
        <li>Share another person’s information or photos without permission.</li>
        <li>Attempt to access accounts, family pages, or data you are not invited to use.</li>
        <li>Interfere with or misuse the service, including automated abuse or attempts to bypass security.</li>
        <li>Use Mora to send spam or unsolicited commercial messages.</li>
      </ul>
      <p>We may suspend or remove access if these terms are violated.</p>

      <h2 className="pt-2 font-serif text-2xl tracking-tight text-charcoal">Service availability</h2>
      <p>
        Mora is an early-stage family communication service. We work to keep it available, but we
        do not guarantee uninterrupted, error-free, or complete service. Features, content, and
        availability may change.
      </p>

      <h2 className="pt-2 font-serif text-2xl tracking-tight text-charcoal">Disclaimer and limitation</h2>
      <p>
        Mora is provided as is, without warranties of any kind, to the fullest extent permitted by
        law. {"Papa J's & Company LLC"} is not responsible for decisions made based on family
        updates, for content posted by users, or for delays or failures in notifications, including
        SMS delivery by communications providers.
      </p>
      <p>
        To the fullest extent permitted by law, {"Papa J's & Company LLC"} is not liable for
        indirect, incidental, special, consequential, or punitive damages, or for lost data, arising
        from use of Mora.
      </p>

      <h2 className="pt-2 font-serif text-2xl tracking-tight text-charcoal">Contact</h2>
      <p>
        Mora is operated by {"Papa J's & Company LLC"}. For questions about these terms, email:{" "}
        <span className="font-medium text-charcoal">[ADD SUPPORT EMAIL]</span>
      </p>
    </LegalShell>
  );
}
