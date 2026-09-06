"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-charcoal/8 bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl flex-nowrap items-center justify-between px-5 sm:h-16 sm:px-8">
        <a
          href="#top"
          className="shrink-0 font-serif text-[1.45rem] leading-none tracking-tight whitespace-nowrap sm:text-[1.55rem]"
          onClick={() => setOpen(false)}
        >
          Mora
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="#how-it-works"
            className="text-sm whitespace-nowrap text-charcoal/70 transition-colors hover:text-charcoal"
          >
            How it works
          </a>
          <Button variant="ghost" size="sm" href="/login" className="whitespace-nowrap">
            Sign in
          </Button>
          <Button href="/signup" size="sm">
            Create your page
          </Button>
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <Button variant="ghost" size="sm" href="/login" className="whitespace-nowrap px-2.5">
            Sign in
          </Button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-charcoal"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={18} strokeWidth={1.75} /> : <Menu size={18} strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-charcoal/8 px-5 py-4 md:hidden"
      >
        <div className="flex flex-col gap-1">
          <a
            href="#how-it-works"
            className="rounded-xl px-1 py-3 text-[15px] text-charcoal/80"
            onClick={() => setOpen(false)}
          >
            How it works
          </a>
          <Button href="/signup" className="mt-1 w-full" onClick={() => setOpen(false)}>
            Create your family page
          </Button>
        </div>
      </div>
    </header>
  );
}
