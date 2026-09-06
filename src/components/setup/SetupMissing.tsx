export function SetupMissing() {
  return (
    <main className="mx-auto max-w-lg px-5 py-16">
      <h1 className="font-serif text-[2rem] leading-tight tracking-tight">
        Connect Supabase to continue
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
        Mora needs a Supabase project before it can save families, updates, and
        reactions. Add these values to <code className="text-charcoal">.env.local</code>,
        then run the SQL in <code className="text-charcoal">supabase/schema.sql</code>.
      </p>
      <ul className="mt-5 list-disc space-y-1 pl-5 text-sm text-charcoal/80">
        <li>NEXT_PUBLIC_SUPABASE_URL</li>
        <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
        <li>SUPABASE_SERVICE_ROLE_KEY</li>
      </ul>
    </main>
  );
}
