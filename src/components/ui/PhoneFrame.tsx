import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type PhoneFrameProps = {
  children: ReactNode;
  className?: string;
  float?: boolean;
};

export function PhoneFrame({ children, className, float = false }: PhoneFrameProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[268px]",
        float && "md:animate-float",
        className,
      )}
    >
      <div className="rounded-[2.35rem] bg-[#1c1816] p-[9px] shadow-[0_28px_60px_-28px_rgb(42_36_33_/_0.5)]">
        <div className="relative aspect-[9/19.2] overflow-hidden rounded-[1.9rem] bg-paper">
          <div className="pointer-events-none absolute top-2 left-1/2 z-20 h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-[#1c1816]" />
          {children}
        </div>
      </div>
    </div>
  );
}
