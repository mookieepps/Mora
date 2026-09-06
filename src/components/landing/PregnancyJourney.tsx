"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { FamilyScreen, type FamilyScreenVariant } from "@/components/product/FamilyScreen";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { cn } from "@/lib/cn";

const stages = [
  {
    label: "Pregnancy",
    line: "18 weeks away from meeting baby ❤️",
    variant: "pregnancy" as const,
  },
  {
    label: "In Labor",
    line: "🚗 Currently in Labor",
    variant: "labor" as const,
  },
  {
    label: "Baby Arrived",
    line: "Baby Is Here! 🎉",
    variant: "birth" as const,
  },
];

export function PregnancyJourney() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      setActive((value) => (value + 1) % stages.length);
    }, 4200);

    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <section className="px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-[11px] font-medium tracking-[0.22em] text-blush uppercase">
            The family page
          </p>
          <h2 className="mt-3 max-w-2xl font-serif text-[2.15rem] leading-[1.05] sm:text-5xl">
            The same private page, through every moment.
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-muted">
            Mora follows the journey — pregnancy, labor, arrival — so family
            never has to wonder which version of the story they’re in.
          </p>
        </Reveal>

        <div className="mt-10 lg:hidden">
          <StageTabs active={active} onSelect={setActive} />
          <p className="mt-5 font-serif text-xl leading-snug text-charcoal/80">
            {stages[active].line}
          </p>
          <div
            className="mt-6"
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
          >
            <JourneyPhone variant={stages[active].variant} />
          </div>
        </div>

        <div
          className="mt-14 hidden lg:grid lg:grid-cols-3 lg:gap-8"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
        >
          {stages.map((stage, index) => (
            <article
              key={stage.label}
              className={cn(
                "text-left transition-opacity duration-500",
                active === index ? "opacity-100" : "opacity-45",
              )}
            >
              <button
                type="button"
                onClick={() => setActive(index)}
                className="mb-5 flex w-full items-center gap-3 text-left"
              >
                <span className="text-sm font-medium tracking-wide">
                  {stage.label}
                </span>
                {index < stages.length - 1 && (
                  <span className="h-px flex-1 bg-charcoal/15" aria-hidden />
                )}
              </button>
              <p className="mb-6 font-serif text-[1.35rem] leading-snug text-charcoal/80">
                {stage.line}
              </p>
              <div
                className={cn(
                  "transition-transform duration-500",
                  active === index && "scale-[1.02]",
                )}
              >
                <PhoneFrame>
                  <FamilyScreen variant={stage.variant} />
                </PhoneFrame>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function StageTabs({
  active,
  onSelect,
}: {
  active: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex flex-col">
      {stages.map((stage, index) => (
        <button
          key={stage.label}
          type="button"
          onClick={() => onSelect(index)}
          className="flex items-center gap-3 py-2 text-left"
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              active === index ? "bg-blush" : "bg-charcoal/20",
            )}
          />
          <span
            className={cn(
              "text-sm",
              active === index ? "text-charcoal" : "text-ink-muted",
            )}
          >
            {stage.label}
          </span>
          {index < stages.length - 1 && (
            <span className="ml-1 text-ink-muted" aria-hidden>
              ↓
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

function JourneyPhone({ variant }: { variant: FamilyScreenVariant }) {
  return (
    <PhoneFrame>
      <FamilyScreen variant={variant} />
    </PhoneFrame>
  );
}
