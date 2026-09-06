"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { createFamilyAction } from "@/app/actions/mora";
import { useHydrated } from "@/lib/use-hydrated";
import {
  addDays,
  coupleDisplayName,
  toIsoDate,
  weeksRemaining,
} from "@/lib/domain/pregnancy";

type Step = 1 | 2 | 3;

const continueClassName =
  "relative z-20 mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-charcoal px-5 text-sm font-medium tracking-wide text-cream";

export function SignupFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [motherName, setMotherName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState<{ mother?: string; dueDate?: string; save?: string }>({});
  const creating = useRef(false);
  const [saving, setSaving] = useState(false);
  const [mountId] = useState("client-pending");
  const hydrated = useHydrated();
  const pageHost = hydrated ? window.location.hostname : "(server)";
  const pagePort = hydrated ? window.location.port || "(default)" : "(server)";

  const [debug, setDebug] = useState({
    buttonTapped: false,
    tapCount: 0,
    validationPassed: false,
    setterCalled: false,
    lastHandler: "none",
  });

  const today = useMemo(() => new Date(), []);
  const minDate = toIsoDate(addDays(today, -21));
  const maxDate = toIsoDate(addDays(today, 42 * 7));

  const names = coupleDisplayName(motherName, partnerName);
  const remaining = dueDate ? weeksRemaining(dueDate) : 0;

  function handleContinue() {
    setDebug((current) => ({
      ...current,
      buttonTapped: true,
      tapCount: current.tapCount + 1,
      lastHandler: "handleContinue",
      setterCalled: false,
    }));

    const typedName =
      document.getElementById("mother-name") instanceof HTMLInputElement
        ? (document.getElementById("mother-name") as HTMLInputElement).value
        : motherName;
    const name = typedName.trim();
    setMotherName(name);

    if (!name) {
      setErrors({ mother: "Please enter your name." });
      setDebug((current) => ({
        ...current,
        validationPassed: false,
        setterCalled: false,
      }));
      return;
    }

    setErrors({});
    setDebug((current) => ({
      ...current,
      validationPassed: true,
      setterCalled: true,
    }));
    setStep(2);
  }

  function goToPreview() {
    const nextDueDate =
      document.getElementById("due-date") instanceof HTMLInputElement
        ? (document.getElementById("due-date") as HTMLInputElement).value
        : dueDate;
    setDueDate(nextDueDate);

    if (!nextDueDate) {
      setErrors({ dueDate: "Choose your expected due date." });
      return;
    }
    if (nextDueDate > maxDate) {
      setErrors({ dueDate: "That date is farther than a full pregnancy from now." });
      return;
    }

    setErrors({});
    setStep(3);
  }

  async function createPage() {
    if (creating.current) return;
    const mother = motherName.trim();
    const partner = partnerName.trim();
    if (!mother || mother.length < 2 || !dueDate || dueDate > maxDate) {
      if (!mother || mother.length < 2) {
        setStep(1);
        return;
      }
      setStep(2);
      return;
    }

    creating.current = true;
    setSaving(true);
    const result = await createFamilyAction({
      motherName: mother,
      partnerName: partner ? partner : null,
      dueDate,
    });
    setSaving(false);
    if (!result.ok) {
      creating.current = false;
      setErrors({ save: result.error });
      return;
    }

    router.push(result.next ?? "/dashboard");
    router.refresh();
  }

  return (
    <div className="relative z-10 mx-auto w-full max-w-md">
      <div className="mb-6 rounded-xl border border-[#b45c4c]/40 bg-[#f7ece8] px-3 py-3 font-mono text-[11px] leading-relaxed text-charcoal">
        <p>Hydrated: {hydrated ? "YES" : "NO"}</p>
        <p>Current hostname: {pageHost}</p>
        <p>Current port: {pagePort}</p>
        <p>Current step: {step}</p>
        <p>Button tapped: {debug.buttonTapped ? "true" : "false"}</p>
        <p>Tap count: {debug.tapCount}</p>
        <p>Validation passed: {debug.validationPassed ? "true" : "false"}</p>
        <p>State setter called: {debug.setterCalled ? "true" : "false"}</p>
        <p>Last handler: {debug.lastHandler}</p>
        <p>Name in state: {motherName || "(empty)"}</p>
        <p>Mount id: {mountId}</p>
        <p>Render count: {hydrated ? "client" : "server"}</p>
      </div>

      <p className="text-[11px] font-medium tracking-[0.22em] text-blush uppercase">
        Step {step} of 3
      </p>

      {step === 1 && (
        <div className="mt-4">
          <h1 className="font-serif text-[2.15rem] leading-[1.05] tracking-tight">
            Let’s create your family page
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
            Just your names for now. You can invite family after.
          </p>

          <div className="mt-8 space-y-5">
            <Field
              id="mother-name"
              label="Your name"
              autoComplete="given-name"
              autoCapitalize="words"
              value={motherName}
              error={errors.mother}
              onChange={(event) => setMotherName(event.target.value)}
            />
            <Field
              id="partner-name"
              label={
                <>
                  Partner’s name{" "}
                  <span className="font-normal text-ink-muted">(optional)</span>
                </>
              }
              autoComplete="name"
              autoCapitalize="words"
              value={partnerName}
              onChange={(event) => setPartnerName(event.target.value)}
            />
          </div>

          <button
            type="button"
            className={continueClassName}
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <form
          noValidate
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            goToPreview();
          }}
          className="mt-4"
        >
          <h1 className="font-serif text-[2.15rem] leading-[1.05] tracking-tight">
            When are you expecting?
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
            We’ll keep count from this date — no need to enter how many weeks
            along you are.
          </p>

          <div className="mt-8">
            <Field
              id="due-date"
              label="Expected due date"
              type="date"
              value={dueDate}
              min={minDate}
              max={maxDate}
              error={errors.dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </div>

          <Button type="button" className="mt-8 h-12 w-full" onClick={goToPreview}>
            Continue
          </Button>
          <button
            type="button"
            className="mt-3 flex h-11 w-full items-center justify-center text-sm text-charcoal/70"
            onClick={() => setStep(1)}
          >
            Back
          </button>
        </form>
      )}

      {step === 3 && (
        <form
          noValidate
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            createPage();
          }}
          className="mt-4"
        >
          <h1 className="font-serif text-[2.15rem] leading-[1.05] tracking-tight">
            This is your page
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
            One private place for everyone you choose.
          </p>

          <div className="mt-8 border-y border-charcoal/10 py-8 text-center">
            <p className="font-serif text-[2rem] leading-none tracking-tight">
              {names}
            </p>
            <p className="mt-3 text-[11px] font-medium tracking-[0.18em] text-ink-muted uppercase">
              Pregnancy
            </p>
            <p className="mt-2 text-[15px] text-charcoal/80">
              {remaining === 0
                ? "Due any day now"
                : `${remaining} week${remaining === 1 ? "" : "s"} away from meeting baby ❤️`}
            </p>
          </div>

          {errors.save ? (
            <p className="mt-6 text-sm text-[#9a4f40]">{errors.save}</p>
          ) : null}
          <Button
            type="button"
            className="mt-8 h-12 w-full whitespace-normal px-4 text-center"
            disabled={saving}
            onClick={createPage}
          >
            Create my family page
          </Button>
          <button
            type="button"
            className="mt-3 flex h-11 w-full items-center justify-center text-sm text-charcoal/70"
            onClick={() => setStep(2)}
          >
            Back
          </button>
        </form>
      )}
    </div>
  );
}
