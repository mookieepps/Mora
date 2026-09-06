import { mockFamily, mockLaborUpdate, mockUpdate } from "@/lib/mock/family";
import { Still } from "@/components/product/Still";

export type FamilyScreenVariant = "pregnancy" | "labor" | "birth";

type FamilyScreenProps = {
  variant: FamilyScreenVariant;
  showViewerChrome?: boolean;
};

export function FamilyScreen({
  variant,
  showViewerChrome = false,
}: FamilyScreenProps) {
  return (
    <div className="flex h-full flex-col bg-paper px-4 pt-11 pb-5 text-charcoal">
      {showViewerChrome && (
        <p className="mb-2 text-center text-[9px] font-medium tracking-[0.2em] text-ink-muted uppercase">
          Private family page
        </p>
      )}
      <p className="text-center font-serif text-[1.35rem] leading-none tracking-tight">
        {mockFamily.coupleName}
      </p>

      {variant === "pregnancy" && (
        <PregnancyBody showViewerChrome={showViewerChrome} />
      )}
      {variant === "labor" && <LaborBody />}
      {variant === "birth" && <BirthBody />}
    </div>
  );
}

function StatusPill({ children }: { children: string }) {
  return (
    <p className="mt-3 text-center text-[10px] font-medium tracking-[0.18em] text-ink-muted uppercase">
      {children}
    </p>
  );
}

function PregnancyBody({ showViewerChrome }: { showViewerChrome: boolean }) {
  return (
    <>
      <StatusPill>Pregnancy</StatusPill>
      <p className="mt-2 text-center text-[13px] leading-snug text-charcoal/80">
        {mockFamily.weeksRemaining} weeks away from meeting baby{" "}
        <span aria-hidden>❤️</span>
      </p>

      <article className="mt-5 rounded-2xl border border-charcoal/10 bg-cream/80 p-3.5">
        <p className="text-[10px] tracking-wide text-ink-muted uppercase">
          {mockUpdate.timeLabel}
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-charcoal/90">
          {mockUpdate.body}
        </p>
        <Still kind="bump" className="mt-3 h-24 rounded-xl" />
      </article>

      {showViewerChrome && (
        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between px-2 text-[13px] text-charcoal/80">
            <span>❤️ 12</span>
            <span>🙏 4</span>
            <span>🎉 7</span>
          </div>
          <p className="mt-3 rounded-full border border-charcoal/10 px-3 py-2 text-center text-[11px] text-ink-muted">
            Guess the birth weight
          </p>
        </div>
      )}
    </>
  );
}

function LaborBody() {
  return (
    <>
      <StatusPill>In labor</StatusPill>
      <p className="mt-3 text-center text-[15px] leading-snug">
        <span aria-hidden>🚗 </span>Currently in Labor
      </p>

      <article className="mt-5 rounded-2xl border border-charcoal/10 bg-[#f3e6e0] p-3.5">
        <p className="text-[10px] tracking-wide text-ink-muted uppercase">
          {mockLaborUpdate.timeLabel}
        </p>
        <p className="mt-2 text-[13px] leading-relaxed">{mockLaborUpdate.body}</p>
        <Still kind="labor" className="mt-3 h-16 rounded-xl" />
      </article>
    </>
  );
}

function BirthBody() {
  return (
    <div className="flex flex-1 flex-col">
      <StatusPill>Baby arrived</StatusPill>
      <p className="mt-3 text-center text-[13px] tracking-wide text-charcoal">
        Baby Is Here! <span aria-hidden>🎉</span>
      </p>
      <p className="mt-2 text-center font-serif text-[2.15rem] leading-none">
        {mockFamily.babyName}
      </p>
      <p className="mt-2 text-center text-[12px] text-ink-muted">
        {mockFamily.bornOnLabel} · {mockFamily.bornAtLabel}
      </p>
      <Still kind="newborn" className="mt-5 min-h-[8.5rem] flex-1 rounded-2xl" />
    </div>
  );
}
