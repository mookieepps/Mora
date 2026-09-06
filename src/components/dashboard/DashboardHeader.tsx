import Link from "next/link";
import { signOutAction } from "@/app/actions/mora";

export function DashboardHeader({ familySlug }: { familySlug: string }) {
  return (
    <header className="border-b border-charcoal/8 px-5 py-4 sm:px-8">
      <div className="mx-auto flex h-10 max-w-5xl items-center justify-between gap-3">
        <Link href="/" className="font-serif text-[1.45rem] leading-none tracking-tight">
          Mora
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href={`/family/${familySlug}`}
            className="inline-flex h-10 items-center text-sm text-charcoal/75 underline-offset-4 hover:text-charcoal hover:underline"
          >
            Preview family page
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="inline-flex h-10 items-center text-sm text-charcoal/75 underline-offset-4 hover:text-charcoal hover:underline"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
