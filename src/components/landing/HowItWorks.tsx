import { Reveal } from "@/components/motion/Reveal";

const steps = [
  {
    n: "01",
    title: "Create your family page",
    body: "Add your names and due date. Mora becomes one quiet place for the months ahead.",
  },
  {
    n: "02",
    title: "Add the people you love",
    body: "Invite only who you choose. They receive a private link — not a public feed.",
  },
  {
    n: "03",
    title: "Share the journey",
    body: "Post an update once. Everyone stays informed, instead of hearing it twenty times.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-y border-charcoal/8 bg-cream-deep/50 px-5 py-16 sm:px-8 sm:py-24 lg:px-12"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-[11px] font-medium tracking-[0.22em] text-blush uppercase">
            How it works
          </p>
          <h2 className="mt-3 max-w-xl font-serif text-[2.15rem] leading-[1.05] sm:text-5xl">
            One place. Not a dozen conversations.
          </h2>
        </Reveal>

        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step, index) => (
            <li key={step.n}>
              <Reveal delayMs={index * 90}>
                <p className="font-serif text-3xl text-blush/80">{step.n}</p>
                <h3 className="mt-4 text-lg font-medium tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
                  {step.body}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
