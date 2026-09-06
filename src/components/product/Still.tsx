import { cn } from "@/lib/cn";

type StillKind = "bump" | "labor" | "newborn";

export function Still({
  kind,
  className,
}: {
  kind: StillKind;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("relative overflow-hidden", className)}
    >
      {kind === "bump" && <BumpStill />}
      {kind === "labor" && <LaborStill />}
      {kind === "newborn" && <NewbornStill />}
    </div>
  );
}

function BumpStill() {
  return (
    <div className="h-full w-full bg-[#c9a898]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(255_248_242_/_0.18),transparent_40%,rgb(90_60_50_/_0.18))]" />
      <div className="absolute top-2 right-3 h-10 w-16 rounded-sm bg-[#f3e6d8]/50" />
      <div className="absolute right-4 bottom-[-18%] left-[-10%] h-[90%] rounded-[50%] bg-[#b08978]" />
      <div className="absolute right-[8%] bottom-[-12%] left-[18%] h-[70%] rounded-[50%] bg-[#d4b3a4]" />
    </div>
  );
}

function LaborStill() {
  return (
    <div className="h-full w-full bg-[#3d3532]">
      <div className="absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgb(196_125_108_/_0.22),transparent_70%)]" />
      <div className="absolute top-1/3 left-1/2 h-16 w-px bg-[#f4eee6]/25" />
      <div className="absolute right-6 bottom-4 h-8 w-8 rounded-full bg-[#ead4cc]/30 blur-[2px]" />
    </div>
  );
}

function NewbornStill() {
  return (
    <div className="h-full w-full bg-[#d7c4b6]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgb(250_247_242)_0%,rgb(215_196_182)_54%,rgb(176_140_126)_100%)]" />
      <div className="absolute top-[38%] left-1/2 h-[42%] w-[46%] -translate-x-1/2 rounded-[45%] bg-[#f7efe8]" />
      <div className="absolute top-[46%] left-1/2 h-[18%] w-[22%] -translate-x-1/2 rounded-full bg-[#e8d5c8]" />
    </div>
  );
}
