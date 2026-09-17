import { Search, X, MapPin, Navigation } from "lucide-react";
import type { Destination } from "@/lib/wayfindr-types";

export function DestinationSearch({
  query,
  onQueryChange,
  results,
  onSelectDestination,
}: {
  query: string;
  onQueryChange: (q: string) => void;
  results: Destination[];
  onSelectDestination: (dest: Destination) => void;
}) {
  return (
    <div className="relative w-full space-y-2">
      <div className="font-display text-xs font-bold uppercase tracking-wider text-[#111827]">
        Where do you want to go?
      </div>

      <div className="relative flex items-center rounded-xl border-2 border-[#111827]/15 bg-white p-2.5 shadow-sm focus-within:border-[#F97316] transition-colors">
        <Search className="h-5 w-5 shrink-0 text-[#F97316]" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search destination (e.g. Library, Admissions, Kitchen)..."
          className="min-w-0 flex-1 bg-transparent px-2 font-sans text-sm font-medium text-[#111827] placeholder:text-[#6B7280] focus:outline-none"
        />
        {query && (
          <button
            onClick={() => onQueryChange("")}
            className="rounded-full p-1 text-[#6B7280] hover:bg-[#111827]/10"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Live Dropdown Search Results */}
      {query.trim() !== "" && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-72 overflow-y-auto rounded-xl border border-[#111827]/15 bg-white p-2 shadow-xl">
          {results.length === 0 ? (
            <div className="p-4 text-center">
              <div className="font-display text-xs font-bold text-[#111827]">No destination found.</div>
              <p className="mt-1 font-sans text-[11px] text-[#6B7280]">
                Try checking spelling or search for Admissions, Library, Kitchen, or Bedrooms.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-2 py-1 font-mono text-[10px] font-bold uppercase text-[#6B7280]">
                {results.length} Search Result{results.length === 1 ? "" : "s"}
              </div>
              {results.map((dest) => (
                <button
                  key={dest.id}
                  onClick={() => {
                    onSelectDestination(dest);
                    onQueryChange("");
                  }}
                  className="flex w-full items-center justify-between rounded-lg border border-transparent p-2.5 text-left transition-colors hover:border-[#F97316]/30 hover:bg-[#F8FAFC]"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#111827] text-[#F97316]">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-display text-xs font-bold text-[#111827]">{dest.name}</div>
                      <div className="font-sans text-[11px] text-[#6B7280]">
                        {dest.floorName} • {dest.buildingName} {dest.roomNumber ? `(${dest.roomNumber})` : ""}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 font-display text-xs font-bold uppercase text-[#F97316]">
                    <span>Select</span>
                    <Navigation className="h-3.5 w-3.5" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
