import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

export function FinalCTA() {
  return (
    <section className="px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12">
      <Reveal>
        <div className="mx-auto max-w-2xl border-t border-charcoal/10 pt-16 text-center sm:pt-20">
          <h2 className="font-serif text-[2.15rem] leading-[1.05] sm:text-5xl">
            Share once. Keep everyone close.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-ink-muted">
            Create a private family page for the months between now and hello.
          </p>
          <div className="mt-8">
            <Button href="/signup">Create your family page</Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
