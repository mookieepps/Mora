import { Reveal } from "@/components/motion/Reveal";
import { FamilyScreen } from "@/components/product/FamilyScreen";
import { PhoneFrame } from "@/components/ui/PhoneFrame";

export function FamilyExperience() {
  return (
    <section className="border-y border-charcoal/8 bg-paper/70 px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal className="order-2 mx-auto w-full max-w-[22rem] lg:order-1">
          <PhoneFrame>
            <FamilyScreen variant="pregnancy" showViewerChrome />
          </PhoneFrame>
        </Reveal>

        <Reveal className="order-1 lg:order-2" delayMs={80}>
          <p className="text-[11px] font-medium tracking-[0.22em] text-blush uppercase">
            Friends &amp; family
          </p>
          <h2 className="mt-3 max-w-lg font-serif text-[2.15rem] leading-[1.05] sm:text-5xl">
            They follow along. They don’t need another app.
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink-muted">
            The people you invite receive a private link. They can read updates,
            see photos, send a reaction, and guess the baby’s weight — without
            creating an account or downloading anything.
          </p>
          <p className="mt-4 max-w-md text-base leading-relaxed text-charcoal/85">
            No public profile. No comments thread. Just the family you chose.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
