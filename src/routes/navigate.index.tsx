import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, MapPin, Route as RouteIcon } from "lucide-react";

import { WayFindrHeader } from "@/components/wayfindr/WayFindrHeader";
import { LocationBanner } from "@/components/wayfindr/LocationBanner";
import { DestinationSearch } from "@/components/wayfindr/DestinationSearch";
import { QuickDestinationGrid } from "@/components/wayfindr/QuickDestinationGrid";
import { IndoorMap } from "@/components/wayfindr/IndoorMap";
import { DestinationBottomSheet } from "@/components/wayfindr/DestinationBottomSheet";
import { NavigationInstruction } from "@/components/wayfindr/NavigationInstruction";
import { ArrivalCard } from "@/components/wayfindr/ArrivalCard";
import { LostHelpPanel } from "@/components/wayfindr/LostHelpPanel";

import {
  DEMO_DESTINATIONS,
  DEMO_EDGES,
  DEMO_NODES,
  DEMO_QR_LOCATIONS,
} from "@/lib/wayfindr-data";
import {
  findShortestPath,
  generateTurnSteps,
  searchDestinations,
} from "@/lib/wayfindr-engine";
import { speakTurnInstruction, stopSpeech } from "@/lib/speech";
import type { Destination, FloorLevel, TurnStep } from "@/lib/wayfindr-types";

export const Route = createFileRoute("/navigate/")({
  validateSearch: (search: Record<string, unknown>) => ({
    location:
      typeof search.location === "string" && search.location in DEMO_QR_LOCATIONS
        ? search.location
        : "main-gate",
  }),
  head: () => ({
    meta: [
      { title: "WayFindr — Live Indoor Navigation" },
      {
        name: "description",
        content:
          "Scan entrance QR, search destination, and follow live turn-by-turn map guidance.",
      },
    ],
  }),
  component: WayFindrNavigateApp,
});

function WayFindrNavigateApp() {
  const { location } = Route.useSearch();
  const navigate = useNavigate();

  // QR Checkpoint state derived from URL parameter
  const qrContext = DEMO_QR_LOCATIONS[location] || DEMO_QR_LOCATIONS["main-gate"];

  // Search & Navigation States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [lostModalOpen, setLostModalOpen] = useState(false);
  const [activeFloor, setActiveFloor] = useState<FloorLevel>(qrContext.floorId);
  const [hasArrived, setHasArrived] = useState(false);
  const [showDirectoryMap, setShowDirectoryMap] = useState(false);

  // Sync active floor if checkpoint location changes
  useEffect(() => {
    setActiveFloor(qrContext.floorId);
  }, [qrContext.floorId]);

  // Calculate Shortest Path Route
  const routeResult = useMemo(() => {
    if (!selectedDestination) return null;
    return findShortestPath(qrContext.nodeId, selectedDestination.nodeId, DEMO_NODES, DEMO_EDGES);
  }, [qrContext.nodeId, selectedDestination]);

  // Generate Turn-by-Turn Guidance Steps
  const steps: TurnStep[] = useMemo(() => {
    if (!routeResult || !selectedDestination) return [];
    return generateTurnSteps(routeResult, DEMO_NODES, selectedDestination.name);
  }, [routeResult, selectedDestination]);

  // Active step & route metrics
  const activeStep = steps[currentStepIndex] || steps[0];
  const nextStep = steps[currentStepIndex + 1];
  const remainingMetres = routeResult ? Math.max(0, routeResult.totalMetres - currentStepIndex * 15) : 0;
  const etaMinutes = Math.max(1, Math.ceil(remainingMetres / 50));

  // Voice synthesis effect on step update
  useEffect(() => {
    if (isNavigating && voiceEnabled && activeStep) {
      speakTurnInstruction(activeStep);
    }
  }, [isNavigating, currentStepIndex, voiceEnabled, activeStep]);

  // Search results calculation
  const filteredDestinations = useMemo(() => {
    return searchDestinations(searchQuery, DEMO_DESTINATIONS);
  }, [searchQuery]);

  // Destination Selection Handler
  const handleSelectDestination = (dest: Destination) => {
    setSelectedDestination(dest);
    setSearchQuery("");
    setIsNavigating(false);
    setCurrentStepIndex(0);
    setHasArrived(false);
    setActiveFloor(dest.floorId);
  };

  // Start Navigation Handler
  const handleStartNavigation = () => {
    if (!selectedDestination) return;
    setIsNavigating(true);
    setCurrentStepIndex(0);
    setHasArrived(false);
    setActiveFloor(qrContext.floorId);
  };

  // Turn Step Navigation Handlers
  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      const nextNodeId = routeResult?.nodes[nextIndex];
      const nextNode = DEMO_NODES.find((n) => n.id === nextNodeId);
      if (nextNode) {
        setActiveFloor(nextNode.floorId);
      }
    } else {
      // Reached final destination step
      setIsNavigating(false);
      setHasArrived(true);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      const prevNodeId = routeResult?.nodes[prevIndex];
      const prevNode = DEMO_NODES.find((n) => n.id === prevNodeId);
      if (prevNode) {
        setActiveFloor(prevNode.floorId);
      }
    }
  };

  const handleCancelNavigation = () => {
    setIsNavigating(false);
    setCurrentStepIndex(0);
    stopSpeech();
  };

  const handleFinishArrival = () => {
    setHasArrived(false);
    setSelectedDestination(null);
    setIsNavigating(false);
    setCurrentStepIndex(0);
    stopSpeech();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 text-[#111827]">
      {/* WayFindr Header */}
      <WayFindrHeader
        onOpenLostModal={() => setLostModalOpen(true)}
        voiceEnabled={voiceEnabled}
        onToggleVoice={() => {
          const next = !voiceEnabled;
          setVoiceEnabled(next);
          if (!next) stopSpeech();
        }}
      />

      {/* Main Container - Mobile First Layout / Desktop Split Kiosk */}
      <main className="mx-auto max-w-6xl px-4 pt-3 space-y-4">
        {/* Navigation Application Return Link */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-display text-xs font-bold text-[#6B7280] hover:text-[#111827]"
          >
            <ArrowLeft className="h-4 w-4 text-[#F97316]" /> Back to WayFindr Overview
          </Link>
          <span className="rounded-full bg-[#111827] px-2.5 py-0.5 font-mono text-[10px] font-bold text-white uppercase tracking-wider">
            LIVE NAVIGATION APP MODE
          </span>
        </div>

        {/* Step 1: 📍 WHERE AM I? Banner */}
        <LocationBanner qrContext={qrContext} />

        {/* Desktop & Kiosk Split View Grid */}
        <div className="grid gap-5 lg:grid-cols-[380px_minmax(0,1fr)] items-start">
          {/* Left Column: Search & Quick Tiles */}
          <div className="space-y-4">
            {/* Step 2: 🔎 WHERE DO I WANT TO GO? Search Input */}
            <DestinationSearch
              query={searchQuery}
              onQueryChange={setSearchQuery}
              results={filteredDestinations}
              onSelectDestination={handleSelectDestination}
            />

            {/* Case B Handling: Search typed but location not found in database */}
            {searchQuery.trim() !== "" && filteredDestinations.length === 0 && (
              <div className="rounded-xl border-2 border-dashed border-[#F97316]/40 bg-white p-5 text-center shadow-xs">
                <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-[#111827] text-[#F97316]">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <h3 className="mt-2 font-display text-sm font-extrabold text-[#111827]">
                  Location &quot;{searchQuery}&quot; is not present in our system.
                </h3>
                <p className="mt-1 font-sans text-xs text-[#6B7280]">
                  Please verify room name or explore registered locations directly on the map.
                </p>
                <button
                  onClick={() => setShowDirectoryMap(true)}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#111827] px-4 py-2 font-display text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-[#111827]/90 transition-colors"
                >
                  <RouteIcon className="h-4 w-4 text-[#F97316]" /> View Interactive Map Directory
                </button>
              </div>
            )}

            {/* Quick Destination Grid (Admissions, Library, Faculty Cabins, Kitchen, Bedrooms, Bhagwan Room) */}
            <QuickDestinationGrid
              destinations={DEMO_DESTINATIONS}
              selectedId={selectedDestination?.id}
              onSelectDestination={handleSelectDestination}
            />

            {/* Turn-by-Turn Instruction Card (Visible during active navigation) */}
            {isNavigating && activeStep && (
              <NavigationInstruction
                currentStep={activeStep}
                nextStep={nextStep}
                currentStepIndex={currentStepIndex}
                totalSteps={steps.length}
                remainingMetres={remainingMetres}
                estimatedMinutes={etaMinutes}
                onNextStep={handleNextStep}
                onPrevStep={handlePrevStep}
                onEndNavigation={handleCancelNavigation}
              />
            )}
          </div>

          {/* Right Column: Step 3: 🗺️ HOW DO I GET THERE? Interactive Vector Map */}
          <div className="space-y-4">
            <IndoorMap
              nodes={DEMO_NODES}
              currentPosNodeId={qrContext.nodeId}
              selectedDestination={selectedDestination}
              routeResult={routeResult}
              currentStepIndex={currentStepIndex}
              activeFloor={activeFloor}
              onSelectFloor={setActiveFloor}
            />

            {/* Case B Full Directory View Drawer/Panel */}
            {showDirectoryMap && (
              <div className="rounded-xl border border-[#111827]/12 bg-white p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#111827]/10 pb-2">
                  <span className="font-display text-xs font-extrabold uppercase text-[#111827]">
                    BUILDING LOCATIONS DIRECTORY
                  </span>
                  <button
                    onClick={() => setShowDirectoryMap(false)}
                    className="font-mono text-xs text-[#6B7280] hover:text-[#111827]"
                  >
                    Close Directory [X]
                  </button>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {DEMO_DESTINATIONS.map((dest) => (
                    <button
                      key={dest.id}
                      onClick={() => {
                        handleSelectDestination(dest);
                        setShowDirectoryMap(false);
                      }}
                      className="flex items-center justify-between rounded-lg border border-[#111827]/10 p-2.5 text-left transition-colors hover:border-[#F97316] hover:bg-[#F8FAFC]"
                    >
                      <div>
                        <div className="font-display text-xs font-bold text-[#111827]">{dest.name}</div>
                        <div className="font-mono text-[10px] text-[#6B7280]">{dest.floorName}</div>
                      </div>
                      <MapPin className="h-4 w-4 shrink-0 text-[#F97316]" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Destination Bottom Sheet Modal (Preview before starting route) */}
      {selectedDestination && !isNavigating && !hasArrived && (
        <DestinationBottomSheet
          destination={selectedDestination}
          fromName={qrContext.locationName}
          routeResult={routeResult}
          onStartNavigation={handleStartNavigation}
          onCancel={() => setSelectedDestination(null)}
        />
      )}

      {/* Arrival Completion Sheet */}
      {hasArrived && selectedDestination && (
        <ArrivalCard
          destination={selectedDestination}
          onReset={handleFinishArrival}
          onNavigateElse={handleFinishArrival}
        />
      )}

      {/* "I'm Lost" Checkpoint Selector Modal */}
      {lostModalOpen && (
        <LostHelpPanel
          onClose={() => setLostModalOpen(false)}
          onResetToEntrance={() => {
            navigate({ search: { location: "main-gate" } });
            setLostModalOpen(false);
          }}
          onSearchFocus={() => {
            setLostModalOpen(false);
            const searchInput = document.querySelector(
              'input[type="text"]'
            ) as HTMLInputElement;
            searchInput?.focus();
          }}
        />
      )}
    </div>
  );
}
