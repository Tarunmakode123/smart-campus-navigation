import { Clock, MapPin, Navigation, Play, X } from "lucide-react";
import type { Destination, RouteResult } from "@/lib/wayfindr-types";

export function DestinationBottomSheet({
  destination,
  fromName,
  routeResult,
  onStartNavigation,
  onCancel,
}: {
  destination: Destination;
  fromName: string;
  routeResult: RouteResult | null;
  onStartNavigation: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="rounded-2xl border-2 border-[#111827]/12 bg-white p-5 shadow-xl space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#F97316]">
            <span>ROUTE PREVIEW</span>
            <span>•</span>
            <span>{destination.category}</span>
          </div>
          <h2 className="mt-0.5 truncate font-display text-2xl font-extrabold text-[#111827]">
            {destination.name}
          </h2>
          <p className="mt-0.5 font-sans text-xs text-[#6B7280]">
            {destination.floorName} • {destination.buildingName} {destination.roomNumber ? `(${destination.roomNumber})` : ""}
          </p>
        </div>

        <button
          onClick={onCancel}
          className="rounded-full p-1.5 text-[#6B7280] hover:bg-[#111827]/10"
          aria-label="Close preview"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Origin -> Destination Banner */}
      <div className="flex items-center justify-between rounded-xl border border-[#111827]/10 bg-[#F8FAFC] p-3 text-xs font-semibold text-[#111827]">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="h-4 w-4 shrink-0 text-[#6B7280]" />
          <span className="text-[#6B7280]">From:</span>
          <span className="truncate font-bold">{fromName}</span>
        </div>
        <span className="text-[#F97316] font-bold mx-2">→</span>
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="h-4 w-4 shrink-0 text-[#F97316]" />
          <span className="text-[#6B7280]">To:</span>
          <span className="truncate font-bold">{destination.name}</span>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-[#111827]/10 bg-white p-3 text-center">
          <div className="font-mono text-[10px] font-bold uppercase text-[#6B7280]">TOTAL DISTANCE</div>
          <div className="mt-1 font-display text-xl font-extrabold text-[#111827]">
            {routeResult?.totalMetres ?? 0} m
          </div>
        </div>
        <div className="rounded-xl border border-[#111827]/10 bg-white p-3 text-center">
          <div className="font-mono text-[10px] font-bold uppercase text-[#6B7280]">EST. WALK TIME</div>
          <div className="mt-1 flex items-center justify-center gap-1 font-display text-xl font-extrabold text-[#111827]">
            <Clock className="h-4 w-4 text-[#F97316]" />
            <span>~{routeResult?.estimatedMinutes ?? 1} min</span>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        onClick={onStartNavigation}
        className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#F97316] px-5 py-3 font-display text-sm font-extrabold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#ea580c] active:scale-[0.98]"
      >
        <Play className="h-5 w-5 fill-current" />
        <span>START NAVIGATION</span>
      </button>
    </div>
  );
}
