import { Reveal } from "@/components/motion/Reveal";

const invited = ["Mom", "Aunt May", "Jordan", "Priya"];

export function PrivacySection() {
  return (
    <section
      id="privacy"
      className="scroll-mt-20 px-5 py-16 sm:px-8 sm:py-24 lg:px-12"
    >
      <Reveal>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-medium tracking-[0.22em] text-blush uppercase">
            Privacy
          </p>
          <h2 className="mt-4 font-serif text-[2.15rem] leading-[1.05] sm:text-5xl">
            Your pregnancy isn’t social media.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
            Mora is intimate on purpose. You choose exactly who can see the
            page. There is no public discovery, no follower graph, and no
            pressure to perform a pregnancy for strangers.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-charcoal/85">
            The people you love stay close. Everyone else stays out.
          </p>
          <ul className="mt-10 flex flex-wrap justify-center gap-2">
            {invited.map((name) => (
              <li
                key={name}
                className="rounded-full border border-charcoal/10 px-3.5 py-1.5 text-sm text-charcoal/80"
              >
                {name}
              </li>
            ))}
            <li className="rounded-full px-3.5 py-1.5 text-sm text-ink-muted">
              + whoever you choose
            </li>
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
