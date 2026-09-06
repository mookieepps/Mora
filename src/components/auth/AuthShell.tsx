import type { ReactNode } from "react";
import Link from "next/link";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col overflow-x-clip">
      <header className="px-5 py-4 sm:px-8">
        <div className="mx-auto flex h-10 max-w-md items-center">
          <Link href="/" className="font-serif text-[1.45rem] leading-none tracking-tight">
            Mora
          </Link>
        </div>
      </header>
      <main className="flex flex-1 px-5 pt-6 pb-12 sm:px-8 sm:pt-10">
        <div className="relative z-10 mx-auto w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
