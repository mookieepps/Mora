"use client";

import { cn } from "@/lib/cn";

export function FamilyPhoto({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    // Object URLs and HEIC files are not a good fit for next/image.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={cn(
        "h-auto w-full max-h-[22rem] rounded-[1.75rem] object-contain bg-cream-deep/50",
        className,
      )}
    />
  );
}
