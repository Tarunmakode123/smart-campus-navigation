import {
  ArrowUp,
  ArrowUpLeft,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Footprints,
  RotateCcw,
} from "lucide-react";
import type { TurnAction, TurnStep } from "@/lib/wayfindr-types";

export function NavigationInstruction({
  currentStep,
  nextStep,
  currentStepIndex,
  totalSteps,
  remainingMetres,
  estimatedMinutes,
  onNextStep,
  onPrevStep,
  onEndNavigation,
}: {
  currentStep: TurnStep;
  nextStep?: TurnStep;
  currentStepIndex: number;
  totalSteps: number;
  remainingMetres: number;
  estimatedMinutes: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onEndNavigation: () => void;
}) {
  return (
    <div className="rounded-2xl border-2 border-[#F97316] bg-[#111827] p-5 text-white shadow-xl space-y-4">
      {/* Top Header Step Counter */}
      <div className="flex items-center justify-between font-mono text-xs font-bold uppercase text-[#F97316]">
        <span>
          STEP {currentStepIndex + 1} OF {totalSteps}
        </span>
        <button
          onClick={onEndNavigation}
          className="text-[10px] uppercase text-[#9CA3AF] hover:text-white underline"
        >
          Cancel Navigation
        </button>
      </div>

      {/* Main Turn Direction Box */}
      <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-2 border-white bg-[#F97316] text-white shadow-lg">
          <TurnIcon action={currentStep.action} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-display text-lg font-extrabold leading-snug text-white">
            {currentStep.text}
          </div>
          <div className="mt-1 flex items-center gap-2 font-mono text-xs font-semibold text-[#F97316]">
            <span>{currentStep.metres} m leg</span>
            <span>•</span>
            <span>{remainingMetres} m remaining</span>
          </div>
        </div>
      </div>

      {/* Next Step Preview */}
      {nextStep && (
        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-[#9CA3AF]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono text-[10px] font-bold uppercase text-[#F97316]">NEXT:</span>
            <span className="truncate font-sans font-medium text-white">{nextStep.text}</span>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-[#9CA3AF]" />
        </div>
      )}

      {/* Controls: Prev / Next */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={onPrevStep}
          disabled={currentStepIndex === 0}
          className="flex h-11 items-center justify-center rounded-lg border border-white/20 bg-white/10 px-4 font-display text-xs font-bold text-white disabled:opacity-30"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          onClick={onNextStep}
          className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#F97316] font-display text-xs font-extrabold uppercase tracking-wider text-white shadow-sm hover:bg-[#ea580c]"
        >
          <span>{currentStepIndex === totalSteps - 1 ? "FINISH ROUTE" : "NEXT INSTRUCTION"}</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function TurnIcon({ action }: { action: TurnAction }) {
  switch (action) {
    case "turn-right":
    case "slight-right":
      return <ArrowUpRight className="h-9 w-9" />;
    case "turn-left":
    case "slight-left":
      return <ArrowUpLeft className="h-9 w-9" />;
    case "stairs":
    case "elevator":
      return <Footprints className="h-9 w-9" />;
    case "arrive":
      return <CheckCircle2 className="h-9 w-9 text-[#22C55E]" />;
    default:
      return <ArrowUp className="h-9 w-9" />;
  }
}
