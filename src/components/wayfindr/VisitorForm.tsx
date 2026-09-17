import { useState } from "react";
import { Navigation, MapPin, User, ArrowRight, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import { AutocompleteSearch } from "./AutocompleteSearch";
import { findDestinationById, findPersonById } from "@/services/searchService";
import type { AutocompleteItem, Destination, Person, QRLocation } from "@/lib/wayfindr-types";

export function VisitorForm({
  startingLocation,
  onStartNavigation,
}: {
  startingLocation: QRLocation;
  onStartNavigation: (dest: Destination, person: Person | null) => void;
}) {
  const [selectedDestItem, setSelectedDestItem] = useState<AutocompleteItem | null>(null);
  const [selectedPersonItem, setSelectedPersonItem] = useState<AutocompleteItem | null>(null);

  const activeDestination: Destination | null = selectedDestItem
    ? (selectedDestItem.originalObj as Destination)
    : null;

  const activePerson: Person | null = selectedPersonItem
    ? (selectedPersonItem.originalObj as Person)
    : null;

  const handleSelectPerson = (item: AutocompleteItem) => {
    setSelectedPersonItem(item);
    const personObj = item.originalObj as Person;
    // Auto-suggest meeting location if destination not already chosen
    if (personObj.destinationId) {
      const destObj = findDestinationById(personObj.destinationId);
      if (destObj) {
        setSelectedDestItem({
          id: destObj.id,
          title: destObj.name,
          subtitle: `${destObj.floorName} • ${destObj.buildingName}`,
          type: "destination",
          originalObj: destObj,
        });
      }
    }
  };

  const handleSelectDestination = (item: AutocompleteItem) => {
    setSelectedDestItem(item);
  };

  const canSubmit = activeDestination !== null;

  return (
    <div className="mx-auto max-w-lg space-y-5 rounded-3xl border-2 border-[#111827]/12 bg-white p-6 shadow-xl">
      {/* Starting Location Header Badge */}
      <div className="rounded-2xl border border-[#111827]/10 bg-[#F8FAFC] p-4 text-left space-y-1">
        <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#F97316]">
          <MapPin className="h-3.5 w-3.5" /> STARTING LOCATION CONFIRMED
        </div>
        <div className="font-display text-lg font-extrabold text-[#111827]">
          {startingLocation.locationName}
        </div>
        <div className="font-mono text-xs text-[#6B7280]">
          {startingLocation.floorName} • {startingLocation.buildingName}
        </div>
      </div>

      <div className="space-y-1 text-left">
        <h2 className="font-display text-xl font-extrabold text-[#111827]">
          Where do you want to go?
        </h2>
        <p className="font-sans text-xs text-[#6B7280]">
          Tell us your destination and whom you are visiting.
        </p>
      </div>

      {/* Field 1: Destination Search */}
      <AutocompleteSearch
        type="destination"
        label="WHERE DO YOU WANT TO GO?"
        placeholder="Search destination (e.g. Kitchen, Library, Admissions)..."
        selectedItem={selectedDestItem}
        onSelect={handleSelectDestination}
        onClear={() => setSelectedDestItem(null)}
      />

      {/* Field 2: Person Search */}
      <AutocompleteSearch
        type="person"
        label="WHOM DO YOU WANT TO MEET? (OPTIONAL)"
        placeholder="Search person (e.g. Tarun Kumar, Tanya Sharma)..."
        selectedItem={selectedPersonItem}
        onSelect={handleSelectPerson}
        onClear={() => setSelectedPersonItem(null)}
      />

      {/* Visit Details Summary Card (Appears when destination is selected) */}
      {activeDestination && (
        <div className="rounded-2xl border-2 border-[#F97316]/40 bg-[#F8FAFC] p-4 text-left space-y-3 shadow-inner">
          <div className="flex items-center justify-between border-b border-[#111827]/10 pb-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#F97316]">
              VISIT DETAILS SUMMARY
            </span>
            <span className="rounded bg-[#10B981]/15 px-2 py-0.5 font-mono text-[10px] font-bold text-[#10B981]">
              READY TO NAVIGATE
            </span>
          </div>

          <div className="space-y-2 text-xs text-[#111827]">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-bold text-[#6B7280]">📍 From:</span>
              <span className="font-bold">{startingLocation.locationName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-bold text-[#6B7280]">🎯 Going to:</span>
              <span className="font-extrabold text-[#F97316]">{activeDestination.name}</span>
              <span className="font-mono text-[10px] text-[#6B7280]">({activeDestination.floorName})</span>
            </div>
            {activePerson && (
              <div className="flex items-center gap-2 border-t border-[#111827]/8 pt-2">
                <span className="font-mono text-[11px] font-bold text-[#6B7280]">👤 Meeting:</span>
                <span className="font-bold text-[#111827]">{activePerson.name}</span>
                <span className="font-mono text-[10px] text-[#6B7280]">({activePerson.title})</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Start Navigation CTA */}
      <button
        disabled={!canSubmit}
        onClick={() => {
          if (activeDestination) onStartNavigation(activeDestination, activePerson);
        }}
        className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-[#F97316] px-6 py-3.5 font-display text-sm font-extrabold uppercase tracking-wider text-white shadow-lg transition-all hover:bg-[#ea580c] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
      >
        <Navigation className="h-5 w-5" />
        <span>START NAVIGATION</span>
        <ArrowRight className="h-4 w-4 ml-1" />
      </button>
    </div>
  );
}
