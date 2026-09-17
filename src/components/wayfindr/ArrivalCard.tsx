import { CheckCircle2, Navigation, RotateCcw } from "lucide-react";
import type { Destination } from "@/lib/wayfindr-types";

export function ArrivalCard({
  destination,
  onReset,
  onNavigateElse,
}: {
  destination: Destination;
  onReset: () => void;
  onNavigateElse: () => void;
}) {
  return (
    <div className="rounded-2xl border-2 border-[#22C55E] bg-[#111827] p-6 text-center text-white shadow-2xl space-y-4">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#22C55E] text-white shadow-lg">
        <CheckCircle2 className="h-9 w-9" />
      </div>

      <div>
        <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#22C55E]">
          ✓ YOU&apos;VE ARRIVED AT
        </div>
        <h2 className="mt-1 font-display text-3xl font-extrabold text-white">
          {destination.name}
        </h2>
        <p className="mt-1 font-sans text-xs text-[#9CA3AF]">
          {destination.floorName} • {destination.buildingName} {destination.roomNumber ? `(${destination.roomNumber})` : ""}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={onReset}
          className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 font-display text-xs font-bold uppercase text-white hover:bg-white/20"
        >
          <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
          <span>DONE</span>
        </button>

        <button
          onClick={onNavigateElse}
          className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-[#F97316] px-4 font-display text-xs font-extrabold uppercase tracking-wider text-white shadow-md hover:bg-[#ea580c]"
        >
          <Navigation className="h-4 w-4" />
          <span>NAVIGATE ELSEWHERE</span>
        </button>
      </div>
    </div>
  );
}
