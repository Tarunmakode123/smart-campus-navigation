import { useState } from "react";
import { Footprints, MapPin, Navigation, Plus, Minus } from "lucide-react";
import type { Destination, FloorLevel, IndoorNode, RouteResult } from "@/lib/wayfindr-types";

export function IndoorMap({
  nodes,
  currentPosNodeId,
  selectedDestination,
  routeResult,
  currentStepIndex = 0,
  activeFloor,
  onSelectFloor,
}: {
  nodes: IndoorNode[];
  currentPosNodeId: string;
  selectedDestination?: Destination | null;
  routeResult?: RouteResult | null;
  currentStepIndex?: number;
  activeFloor: FloorLevel;
  onSelectFloor: (floor: FloorLevel) => void;
}) {
  const [zoom, setZoom] = useState(1);

  // Filter nodes on the selected floor
  const floorNodes = nodes.filter((n) => n.floorId === activeFloor);

  // Compute current animated position dot
  const activeRouteNodeId =
    routeResult && routeResult.nodes.length > 0
      ? routeResult.nodes[Math.min(currentStepIndex, routeResult.nodes.length - 1)]
      : currentPosNodeId;

  const currentNode = nodes.find((n) => n.id === activeRouteNodeId);
  const destNode = selectedDestination
    ? nodes.find((n) => n.id === selectedDestination.nodeId)
    : null;

  // Build SVG Route Line Path if route exists
  const routePathD =
    routeResult && routeResult.nodes.length > 1
      ? routeResult.nodes
          .map((nid) => {
            const n = nodes.find((loc) => loc.id === nid);
            return n ? `${n.x} ${n.y}` : null;
          })
          .filter(Boolean)
          .map((coord, idx) => `${idx === 0 ? "M" : "L"} ${coord}`)
          .join(" ")
      : "";

  return (
    <div className="relative min-h-[360px] w-full overflow-hidden rounded-2xl border-2 border-[#111827]/12 bg-[#F8FAFC] shadow-sm">
      {/* Map Surface Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Vector SVG Indoor Map Canvas */}
      <div
        className="absolute inset-0 h-full w-full transition-transform duration-300"
        style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
      >
        <svg viewBox="0 0 100 100" className="h-full w-full">
          {/* Architectural Wall Outlines & Rooms */}
          <rect x="8" y="10" width="84" height="80" rx="3" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.8" />

          {/* Corridors */}
          <path d="M15 65 H85 M45 20 V80 M75 20 V80" fill="none" stroke="#E2E8F0" strokeWidth="8" strokeLinecap="round" />

          {/* Rooms Outlines */}
          <rect x="12" y="15" width="28" height="25" rx="1" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="0.5" />
          <rect x="12" y="45" width="28" height="18" rx="1" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="0.5" />
          <rect x="42" y="15" width="28" height="25" rx="1" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="0.5" />
          <rect x="42" y="72" width="28" height="15" rx="1" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="0.5" />
          <rect x="68" y="72" width="22" height="15" rx="1" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="0.5" />
          <rect x="68" y="52" width="22" height="18" rx="1" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="0.5" />
          <rect x="68" y="28" width="22" height="20" rx="1" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="0.5" />

          {/* Doors & Corridor Connector Nodes */}
          <circle cx="20" cy="65" r="1" fill="#64748B" />
          <circle cx="45" cy="65" r="1.2" fill="#64748B" />
          <circle cx="60" cy="65" r="1.2" fill="#64748B" />
          <circle cx="75" cy="65" r="1.2" fill="#64748B" />

          {/* Staircase & Elevator Visual Indicators */}
          <g transform="translate(58, 62)">
            <rect x="0" y="0" width="6" height="6" fill="#F1F5F9" stroke="#64748B" strokeWidth="0.4" rx="1" />
            <path d="M1 5 H5 M2 4 H5 M3 3 H5 M4 2 H5" stroke="#64748B" strokeWidth="0.4" fill="none" />
          </g>

          {/* Active Navigation Path (Orange #F97316) */}
          {routePathD && (
            <path
              d={routePathD}
              fill="none"
              stroke="#F97316"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="4 2"
              className="animate-pulse"
            />
          )}
        </svg>

        {/* Room Labels on Map */}
        {floorNodes.map((n) => (
          <div
            key={n.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 font-mono text-[8px] font-bold text-[#64748B] pointer-events-none select-none"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            {n.type === "room" || n.type === "entrance" ? n.name : ""}
          </div>
        ))}

        {/* Selected Destination Pin Marker */}
        {destNode && destNode.floorId === activeFloor && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-20"
            style={{ left: `${destNode.x}%`, top: `${destNode.y}%` }}
          >
            <div className="flex flex-col items-center">
              <div className="grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-[#111827] text-[#F97316] shadow-md">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="mt-0.5 rounded bg-[#111827] px-1.5 py-0.5 font-mono text-[9px] font-bold text-white shadow-xs">
                {selectedDestination?.name}
              </div>
            </div>
          </div>
        )}

        {/* Pulsing Location Position Marker (Current User Dot) */}
        {currentNode && currentNode.floorId === activeFloor && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out z-30"
            style={{ left: `${currentNode.x}%`, top: `${currentNode.y}%` }}
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute h-9 w-9 animate-ping rounded-full bg-[#F97316]/50" />
              <div className="grid h-6 w-6 place-items-center rounded-full border-2 border-white bg-[#F97316] text-white shadow-lg">
                <div className="h-2 w-2 rounded-full bg-white" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Header Overlay */}
      <div className="absolute left-3 top-3 z-10 rounded-md border border-[#111827]/10 bg-white/90 px-3 py-1.5 backdrop-blur shadow-xs">
        <div className="flex items-center gap-1.5 font-display text-[10px] font-extrabold uppercase text-[#111827]">
          <Navigation className="h-3.5 w-3.5 text-[#F97316]" />
          <span>INDOOR VECTOR MAP</span>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute left-3 bottom-3 z-10 flex flex-col gap-1">
        <button
          onClick={() => setZoom((z) => Math.min(1.8, z + 0.2))}
          className="grid h-8 w-8 place-items-center rounded-md border border-[#111827]/15 bg-white text-[#111827] shadow-xs hover:bg-[#F8FAFC]"
          aria-label="Zoom in"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.8, z - 0.2))}
          className="grid h-8 w-8 place-items-center rounded-md border border-[#111827]/15 bg-white text-[#111827] shadow-xs hover:bg-[#F8FAFC]"
          aria-label="Zoom out"
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>

      {/* Multi-Floor Selector Component */}
      <div className="absolute right-3 top-3 bottom-3 z-10 flex flex-col justify-center">
        <div className="flex flex-col gap-1 rounded-lg border border-[#111827]/15 bg-white p-1.5 shadow-md">
          <div className="px-1 text-center font-mono text-[9px] font-bold uppercase text-[#6B7280]">
            FLOOR
          </div>
          {(["2", "1", "G", "B1"] as FloorLevel[]).map((fl) => {
            const isActive = activeFloor === fl;
            return (
              <button
                key={fl}
                onClick={() => onSelectFloor(fl)}
                className={`grid h-8 w-8 place-items-center rounded-md font-display text-xs font-extrabold transition-all ${
                  isActive
                    ? "bg-[#F97316] text-white shadow-xs"
                    : "bg-[#F8FAFC] text-[#111827] hover:bg-[#111827] hover:text-white"
                }`}
              >
                {fl}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
