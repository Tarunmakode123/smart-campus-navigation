import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Compass } from "lucide-react";

import { WayFindrHeader } from "@/components/wayfindr/WayFindrHeader";
import { VisitorForm } from "@/components/wayfindr/VisitorForm";
import { LocationPermissionBanner } from "@/components/wayfindr/LocationPermissionBanner";
import { LiveNavigationUI } from "@/components/wayfindr/LiveNavigationUI";
import { ArrivalCard } from "@/components/wayfindr/ArrivalCard";
import { LostHelpPanel } from "@/components/wayfindr/LostHelpPanel";

import { DEMO_QR_LOCATIONS } from "@/lib/wayfindr-data";
import { positioningService } from "@/services/positioning/PositioningService";
import { calculateRouteFromPosition } from "@/services/routeService";
import type { Destination, NavigationPosition, Person, RouteResult } from "@/lib/wayfindr-types";

export const Route = createFileRoute("/navigate/")({
  validateSearch: (search: Record<string, unknown>) => ({
    location:
      typeof search.location === "string" && search.location in DEMO_QR_LOCATIONS
        ? search.location
        : "main-gate",
  }),
  head: () => ({
    meta: [
      { title: "WayFindr — Live Indoor Navigation & Visitor Entry" },
      {
        name: "description",
        content:
          "Scan entrance QR, specify your destination or host, and follow live turn-by-turn indoor navigation.",
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

  // Navigation Application Flow States
  const [appState, setAppState] = useState<
    "VISITOR_FORM" | "LIVE_NAVIGATION" | "ARRIVED"
  >("VISITOR_FORM");

  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [currentPos, setCurrentPos] = useState<NavigationPosition>(() =>
    positioningService.initializeFromQR(qrContext.qrId)
  );
  const [lostModalOpen, setLostModalOpen] = useState(false);

  // Initialize QR location anchor on change
  useEffect(() => {
    const initPos = positioningService.initializeFromQR(qrContext.qrId);
    setCurrentPos(initPos);
  }, [qrContext.qrId]);

  // Subscribe to live positioning updates (GPS, Sensors, Simulation)
  useEffect(() => {
    const unsubscribe = positioningService.subscribe((updatedPos) => {
      setCurrentPos(updatedPos);
    });
    return () => {
      unsubscribe();
      positioningService.stopAll();
    };
  }, []);

  // Calculate shortest path route from current live position to destination
  const routeResult: RouteResult | null = useMemo(() => {
    if (!selectedDestination || !currentPos) return null;
    return calculateRouteFromPosition(currentPos, selectedDestination);
  }, [currentPos, selectedDestination]);

  // Handle Form Submission -> Start Live Navigation
  const handleStartNavigation = (dest: Destination, person: Person | null) => {
    setSelectedDestination(dest);
    setSelectedPerson(person);
    setAppState("LIVE_NAVIGATION");
  };

  const handleCancelNavigation = () => {
    positioningService.stopDevSimulation();
    setAppState("VISITOR_FORM");
    setSelectedDestination(null);
    setSelectedPerson(null);
  };

  const handleArrival = () => {
    positioningService.stopDevSimulation();
    setAppState("ARRIVED");
  };

  const handleFinishArrival = () => {
    setAppState("VISITOR_FORM");
    setSelectedDestination(null);
    setSelectedPerson(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 text-[#111827]">
      {/* WayFindr Header */}
      <WayFindrHeader
        onOpenLostModal={() => setLostModalOpen(true)}
        voiceEnabled={true}
        onToggleVoice={() => {}}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-5xl px-4 pt-3 space-y-4">
        {/* Navigation Application Return Link */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-display text-xs font-bold text-[#6B7280] hover:text-[#111827]"
          >
            <ArrowLeft className="h-4 w-4 text-[#F97316]" /> Back to WayFindr Overview
          </Link>
          <span className="rounded-full bg-[#111827] px-2.5 py-0.5 font-mono text-[10px] font-bold text-white uppercase tracking-wider">
            {appState === "LIVE_NAVIGATION" ? "● LIVE NAVIGATION MODE" : "VISITOR ENTRY MODE"}
          </span>
        </div>

        {/* Device Location Permission Request Banner */}
        {appState === "VISITOR_FORM" && (
          <LocationPermissionBanner
            startingLocationName={qrContext.locationName}
            onPermissionChange={() => {}}
          />
        )}

        {/* Stage 1: Visitor Entry & Destination Form */}
        {appState === "VISITOR_FORM" && (
          <VisitorForm
            startingLocation={qrContext}
            onStartNavigation={handleStartNavigation}
          />
        )}

        {/* Stage 2: Live Navigation Mode UI */}
        {appState === "LIVE_NAVIGATION" && selectedDestination && routeResult && (
          <LiveNavigationUI
            startingLocationName={qrContext.locationName}
            destination={selectedDestination}
            person={selectedPerson}
            currentPosition={currentPos}
            routeResult={routeResult}
            onRecenter={() => {
              // Recenter map logic
              setCurrentPos((prev) => ({ ...prev, timestamp: Date.now() }));
            }}
            onCancelNavigation={handleCancelNavigation}
            onArrival={handleArrival}
            onRouteRecalculated={() => {
              // Recalculate route if position deviates
            }}
          />
        )}

        {/* Stage 3: Arrival Completion Card */}
        {appState === "ARRIVED" && selectedDestination && (
          <ArrivalCard
            destination={selectedDestination}
            onReset={handleFinishArrival}
            onNavigateElse={handleFinishArrival}
          />
        )}
      </main>

      {/* "I'm Lost" Help Modal */}
      {lostModalOpen && (
        <LostHelpPanel
          onClose={() => setLostModalOpen(false)}
          onResetToEntrance={() => {
            navigate({ search: { location: "main-gate" } });
            setLostModalOpen(false);
          }}
          onSearchFocus={() => {
            setLostModalOpen(false);
            setAppState("VISITOR_FORM");
          }}
        />
      )}
    </div>
  );
}
