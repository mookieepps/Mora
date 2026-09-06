import { Reveal } from "@/components/motion/Reveal";

const questions = [
  "Any updates?",
  "How’s the baby?",
  "Are you at the hospital?",
  "Did the baby come?",
];

export function ProblemSection() {
  return (
    <section className="px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-end lg:gap-16">
        <Reveal>
          <h2 className="max-w-lg font-serif text-[2.15rem] leading-[1.05] tracking-tight text-balance sm:text-5xl">
            Stop sending the same update 20 times.
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink-muted sm:text-lg">
            Expecting parents spend pregnancy answering the same questions, over
            and over, to everyone who loves them.
          </p>
          <p className="mt-4 max-w-md text-base leading-relaxed text-charcoal/85">
            Mora lets you write it once. The people you choose stay close —
            without another round of texts.
          </p>
        </Reveal>

        <Reveal delayMs={120}>
          <ul className="border-t border-charcoal/10">
            {questions.map((question) => (
              <li
                key={question}
                className="border-b border-charcoal/10 py-4 font-serif text-[1.65rem] leading-tight text-charcoal/80 sm:text-[1.85rem]"
              >
                “{question}”
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
