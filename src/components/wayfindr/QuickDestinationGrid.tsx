import {
  Bed,
  Coffee,
  Flame,
  GraduationCap,
  Library as LibraryIcon,
  UserRoundCheck,
  Utensils,
  Droplets,
  Building2,
} from "lucide-react";
import type { Destination } from "@/lib/wayfindr-types";

const QUICK_TILES = [
  { id: "admissions", label: "Admissions", icon: GraduationCap, category: "Admissions" },
  { id: "library", label: "Library", icon: LibraryIcon, category: "Library" },
  { id: "faculty-cabins", label: "Faculty Cabins", icon: UserRoundCheck, category: "Faculty" },
  { id: "kitchen", label: "Kitchen", icon: Utensils, category: "Kitchen" },
  { id: "first-bedroom", label: "Bedrooms", icon: Bed, category: "Bedrooms" },
  { id: "bhagwan-room", label: "Bhagwan Room", icon: Flame, category: "Prayer" },
];

export function QuickDestinationGrid({
  destinations,
  onSelectDestination,
  selectedId,
}: {
  destinations: Destination[];
  onSelectDestination: (dest: Destination) => void;
  selectedId?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="font-display text-xs font-bold uppercase tracking-wider text-[#111827]">
        Quick Destinations
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {QUICK_TILES.map((tile) => {
          const Icon = tile.icon;
          const destObj = destinations.find((d) => d.id === tile.id || d.category === tile.category);
          const active = selectedId === destObj?.id;

          return (
            <button
              key={tile.id}
              onClick={() => {
                if (destObj) onSelectDestination(destObj);
              }}
              className={`flex min-h-[44px] items-center gap-2.5 rounded-xl border p-3 text-left transition-all active:scale-[0.98] ${
                active
                  ? "border-[#F97316] bg-[#111827] text-white shadow-sm ring-2 ring-[#F97316]/30"
                  : "border-[#111827]/12 bg-white text-[#111827] hover:border-[#F97316] hover:shadow-xs"
              }`}
            >
              <div
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                  active ? "bg-[#F97316] text-white" : "bg-[#F8FAFC] text-[#F97316]"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="font-display text-xs font-bold leading-snug">{tile.label}</div>
                {destObj?.floorName && (
                  <div className={`font-mono text-[10px] ${active ? "text-[#9CA3AF]" : "text-[#6B7280]"}`}>
                    {destObj.floorName.replace(" Floor", "")}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
