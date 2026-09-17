import { useState, useEffect } from "react";
import {
  Navigation,
  Volume2,
  VolumeX,
  Compass,
  MapPin,
  Clock,
  ArrowUp,
  ArrowUpLeft,
  ArrowUpRight,
  Footprints,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  Target,
} from "lucide-react";
import { IndoorMap } from "./IndoorMap";
import { DevSimulationToggle } from "./DevSimulationToggle";
import { calculateRemainingRouteDistance, calculateETA, checkRouteDeviation, checkArrival } from "@/services/routeService";
import { speakTurnInstruction, stopSpeech } from "@/lib/speech";
import type { Destination, FloorLevel, NavigationPosition, Person, RouteResult, TurnAction, TurnStep } from "@/lib/wayfindr-types";

export function LiveNavigationUI({
  startingLocationName,
  destination,
  person,
  currentPosition,
  routeResult,
  onRecenter,
  onCancelNavigation,
  onArrival,
  onRouteRecalculated,
}: {
  startingLocationName: string;
  destination: Destination;
  person: Person | null;
  currentPosition: NavigationPosition;
  routeResult: RouteResult;
  onRecenter: () => void;
  onCancelNavigation: () => void;
  onArrival: () => void;
  onRouteRecalculated: () => void;
}) {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [activeFloor, setActiveFloor] = useState<FloorLevel>(currentPosition.floorId);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Sync active floor with live current position
  useEffect(() => {
    setActiveFloor(currentPosition.floorId);
  }, [currentPosition.floorId]);

  // Calculate dynamic live distance & ETA based on current position
  const remainingMetres = calculateRemainingRouteDistance(currentPosition, routeResult);
  const etaMinutes = calculateETA(remainingMetres);

  // Active step & turn instruction
  const steps = routeResult.steps || [];
  const activeStep: TurnStep | undefined = steps[Math.min(currentStepIndex, steps.length - 1)];

  // Check arrival threshold (remaining distance <= 8 meters)
  useEffect(() => {
    if (checkArrival(remainingMetres, 8)) {
      onArrival();
    }
  }, [remainingMetres, onArrival]);

  // Check route deviation
  useEffect(() => {
    if (checkRouteDeviation(currentPosition, routeResult)) {
      onRouteRecalculated();
    }
  }, [currentPosition, routeResult, onRouteRecalculated]);

  // Voice synthesis effect on active step change
  useEffect(() => {
    if (voiceEnabled && activeStep) {
      speakTurnInstruction(activeStep);
    }
  }, [voiceEnabled, currentStepIndex, activeStep]);

  return (
    <div className="mx-auto max-w-4xl space-y-3 text-left">
      {/* Top Status Bar */}
      <div className="flex items-center justify-between rounded-xl border border-[#111827]/12 bg-[#111827] px-4 py-2.5 text-white shadow-md">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#10B981] animate-pulse" />
          <span className="font-display text-xs font-bold text-white uppercase tracking-wider">
            LIVE NAVIGATION
          </span>
          <span className="font-mono text-[10px] text-[#9CA3AF] hidden sm:inline-flex items-center gap-1.5">
            <span>• Provider:</span>
            <span className="rounded bg-[#F97316]/20 px-1.5 py-0.5 font-extrabold text-[#F97316]">
              {currentPosition.source}
            </span>
            <span className={`rounded px-1.5 py-0.5 font-bold ${
              currentPosition.accuracyState === "high" ? "bg-[#10B981]/20 text-[#10B981]" :
              currentPosition.accuracyState === "medium" ? "bg-amber-500/20 text-amber-400" :
              "bg-red-500/20 text-red-400"
            }`}>
              {currentPosition.accuracyState.toUpperCase()} CONFIDENCE {currentPosition.accuracyMetres ? `(±${Math.round(currentPosition.accuracyMetres)}m)` : ""}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const next = !voiceEnabled;
              setVoiceEnabled(next);
              if (!next) stopSpeech();
            }}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-mono text-xs font-bold transition-colors ${
              voiceEnabled ? "bg-[#F97316] text-white" : "bg-white/10 text-[#9CA3AF]"
            }`}
          >
            {voiceEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            <span>{voiceEnabled ? "Voice ON" : "Muted"}</span>
          </button>

          <button
            onClick={onCancelNavigation}
            className="text-xs font-mono font-semibold text-[#9CA3AF] hover:text-white underline"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Primary Turn Instruction Header Banner */}
      {activeStep && (
        <div className="flex items-center gap-4 rounded-2xl border-2 border-[#F97316] bg-[#111827] p-4 text-white shadow-xl">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#F97316] text-white shadow-lg">
            <TurnIcon action={activeStep.action} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#F97316]">
              STEP {currentStepIndex + 1} OF {steps.length} • {activeStep.metres} m LEG
            </div>
            <div className="font-display text-base font-extrabold leading-tight text-white mt-0.5">
              {activeStep.text}
            </div>
          </div>
        </div>
      )}

      {/* Vector SVG Indoor Map Display */}
      <div className="relative">
        <IndoorMap
          nodes={[]}
          currentPosNodeId={currentPosition.nodeId || ""}
          selectedDestination={destination}
          routeResult={routeResult}
          currentStepIndex={currentStepIndex}
          activeFloor={activeFloor}
          onSelectFloor={setActiveFloor}
        />
      </div>

      {/* Navigation Information & Controls Footer Bar */}
      <div className="rounded-2xl border-2 border-[#111827]/12 bg-white p-4 shadow-xl space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#F97316]">
              TARGET DESTINATION
            </div>
            <h2 className="font-display text-lg font-extrabold text-[#111827] truncate">
              {destination.name}
            </h2>
            <p className="font-sans text-xs text-[#6B7280]">
              {destination.floorName} • {destination.buildingName} {person ? `(Visiting ${person.name})` : ""}
            </p>
          </div>

          <div className="flex flex-col items-end">
            <div className="font-display text-2xl font-black text-[#111827]">
              {remainingMetres} m
            </div>
            <div className="flex items-center gap-1 font-mono text-xs font-semibold text-[#F97316]">
              <Clock className="h-3.5 w-3.5" />
              <span>~{etaMinutes} min walk</span>
            </div>
          </div>
        </div>

        {/* Recenter & Manual Step Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={onRecenter}
            className="flex min-h-[44px] items-center gap-1.5 rounded-xl border border-[#111827]/15 bg-[#F8FAFC] px-4 font-display text-xs font-bold text-[#111827] hover:bg-[#111827] hover:text-white transition-colors"
          >
            <Target className="h-4 w-4 text-[#F97316]" />
            <span>Recenter Map</span>
          </button>

          <button
            onClick={() => {
              if (currentStepIndex < steps.length - 1) {
                setCurrentStepIndex((prev) => prev + 1);
              } else {
                onArrival();
              }
            }}
            className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#F97316] font-display text-xs font-extrabold uppercase tracking-wider text-white shadow-md hover:bg-[#ea580c] active:scale-[0.98]"
          >
            <span>{currentStepIndex === steps.length - 1 ? "FINISH ROUTE" : "NEXT INSTRUCTION"}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Developer Simulation Toggle */}
        <DevSimulationToggle routeNodeIds={routeResult.nodes} />
      </div>
    </div>
  );
}

function TurnIcon({ action }: { action: TurnAction }) {
  switch (action) {
    case "turn-right":
    case "slight-right":
      return <ArrowUpRight className="h-8 w-8" />;
    case "turn-left":
    case "slight-left":
      return <ArrowUpLeft className="h-8 w-8" />;
    case "stairs":
    case "elevator":
      return <Footprints className="h-8 w-8" />;
    case "arrive":
      return <CheckCircle2 className="h-8 w-8 text-[#10B981]" />;
    default:
      return <ArrowUp className="h-8 w-8" />;
  }
}
