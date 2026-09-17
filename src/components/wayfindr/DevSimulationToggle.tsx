import { useState } from "react";
import { Play, Pause, Cpu } from "lucide-react";
import { positioningService } from "@/services/positioning/PositioningService";

export function DevSimulationToggle({
  routeNodeIds,
}: {
  routeNodeIds: string[];
}) {
  const [simulating, setSimulating] = useState(false);

  const toggleSim = () => {
    const next = !simulating;
    setSimulating(next);

    if (next) {
      positioningService.startDevSimulation(routeNodeIds);
    } else {
      positioningService.stopDevSimulation();
    }
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-[#111827]/15 bg-[#111827] px-3.5 py-2 text-white">
      <div className="flex items-center gap-2">
        <Cpu className="h-4 w-4 text-[#F97316]" />
        <span className="font-mono text-[11px] font-bold text-white uppercase tracking-wider">
          DEV SIMULATION MODE
        </span>
      </div>

      <button
        onClick={toggleSim}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1 font-mono text-xs font-bold transition-colors ${
          simulating ? "bg-[#F97316] text-white" : "bg-white/10 text-white hover:bg-white/20"
        }`}
      >
        {simulating ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        <span>{simulating ? "Simulating..." : "Simulate Walk"}</span>
      </button>
    </div>
  );
}
