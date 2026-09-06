import { Reveal } from "@/components/motion/Reveal";

const features = [
  {
    title: "Private family page",
    body: "An unlisted home for your pregnancy — shared only with the people you invite.",
  },
  {
    title: "Pregnancy updates",
    body: "Write once. Everyone you love can read the same words, at the same time.",
  },
  {
    title: "Photo updates",
    body: "Add a still from the day when words aren’t enough.",
  },
  {
    title: "SMS notifications",
    body: "A quiet text when something important happens, with a link back to the page.",
  },
  {
    title: "Labor alerts",
    body: "One confirmation — and family knows you’re heading in.",
  },
  {
    title: "Birth announcement",
    body: "Name, time, and a first photograph, published when you’re ready.",
  },
  {
    title: "Family reactions",
    body: "A heart, a prayer, a celebration — presence without a comment thread.",
  },
  {
    title: "Baby weight guesses",
    body: "A small ritual for the waiting, gathered in one place.",
  },
];

export function Features() {
  return (
    <section className="px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="max-w-xl font-serif text-[2.15rem] leading-[1.05] sm:text-5xl">
            Everything the months ask of you, kept close.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-x-12 sm:grid-cols-2">
          {features.map((feature, index) => (
            <Reveal key={feature.title} delayMs={(index % 2) * 70}>
              <article className="border-t border-charcoal/10 py-8">
                <h3 className="text-[15px] font-medium tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-ink-muted">
                  {feature.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
