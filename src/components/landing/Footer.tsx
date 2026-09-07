export function Footer() {
  return (
    <footer className="border-t border-charcoal/8 px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-serif text-2xl">Mora</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-muted">
            Private pregnancy updates for the people you choose.
          </p>
        </div>
        <div className="flex gap-6 text-sm text-charcoal/70">
          <a href="#how-it-works" className="hover:text-charcoal">
            How it works
          </a>
          <a href="#privacy" className="hover:text-charcoal">
            Privacy
          </a>
          <a href="/sms-consent" className="hover:text-charcoal">
            SMS
          </a>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-6xl text-xs text-ink-muted">
        © {new Date().getFullYear()} Mora
      </p>
    </footer>
  );
}
