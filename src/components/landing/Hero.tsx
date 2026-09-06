import { Button } from "@/components/ui/Button";
import { ProductPreview } from "@/components/landing/ProductPreview";

export function Hero() {
  return (
    <section className="relative overflow-x-clip px-5 pt-6 pb-10 sm:px-8 sm:pt-12 sm:pb-16 lg:px-12 lg:pt-16 lg:pb-24">
      <div className="mx-auto grid max-w-6xl items-center gap-6 sm:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-8">
        <div className="max-w-xl">
          <p
            className="animate-fade-up text-[11px] font-medium tracking-[0.22em] text-blush uppercase"
            style={{ animationDelay: "40ms" }}
          >
            Private family updates
          </p>
          <h1
            className="animate-fade-up mt-3 font-serif text-[2.35rem] leading-[1.02] tracking-tight min-[390px]:text-[2.5rem] min-[430px]:text-[2.65rem] sm:mt-4 sm:text-6xl sm:leading-[0.96] lg:text-[4.4rem]"
            style={{ animationDelay: "120ms" }}
          >
            Make pregnancy
            <br className="lg:hidden" /> much easier.
          </h1>
          <p
            className="animate-fade-up mt-4 max-w-[20.75rem] text-[15px] leading-[1.6] text-ink-muted sm:mt-6 sm:max-w-md sm:text-lg sm:leading-relaxed"
            style={{ animationDelay: "220ms" }}
          >
            One update keeps everyone you love in the loop — from pregnancy, to
            labor, to the moment your baby arrives.
          </p>
          <div
            className="animate-fade-up mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:items-center sm:gap-3"
            style={{ animationDelay: "320ms" }}
          >
            <Button href="/signup" className="h-10 w-full sm:h-11 sm:w-auto">
              Create your family page
            </Button>
            <a
              href="#how-it-works"
              className="inline-flex h-10 w-full items-center justify-center rounded-full border border-charcoal/15 px-5 text-sm font-medium tracking-wide whitespace-nowrap text-charcoal transition-colors duration-200 hover:border-charcoal/30 hover:bg-charcoal/[0.03] sm:h-11 sm:w-auto"
            >
              See how it works
            </a>
          </div>
        </div>

        <div
          className="animate-fade-up min-w-0 lg:justify-self-end"
          style={{ animationDelay: "280ms" }}
        >
          <ProductPreview />
        </div>
      </div>
    </section>
  );
}
