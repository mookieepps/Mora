import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { FamilyScreen } from "@/components/product/FamilyScreen";

export function ProductPreview() {
  return (
    <div className="relative mx-auto w-full min-w-0 max-w-[20.5rem] sm:max-w-[24rem]">
      <div className="rounded-[1.75rem] border border-charcoal/8 bg-cream-deep/60 px-4 pt-6 pb-5 sm:rounded-[2rem] sm:px-10 sm:pt-12 sm:pb-10">
        <p className="mb-4 text-center text-[11px] font-medium tracking-[0.2em] text-blush uppercase sm:mb-6">
          The family page
        </p>
        <PhoneFrame float className="relative z-10 max-w-[232px] sm:max-w-[268px]">
          <FamilyScreen variant="pregnancy" />
        </PhoneFrame>
        <p className="mt-4 text-center text-[13px] leading-relaxed text-ink-muted sm:mt-6">
          Smyia &amp; Regis · 18 weeks away
        </p>
      </div>
    </div>
  );
}
