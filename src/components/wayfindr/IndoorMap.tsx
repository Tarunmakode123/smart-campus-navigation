import { useState } from "react";
import { MapPin, Navigation, Plus, Minus } from "lucide-react";
import { DEMO_EDGES, DEMO_NODES } from "@/lib/wayfindr-data";
import type { Destination, FloorLevel, IndoorNode, RouteResult } from "@/lib/wayfindr-types";

export function IndoorMap({
  nodes = DEMO_NODES,
  currentPosNodeId,
  selectedDestination,
  routeResult,
  currentStepIndex = 0,
  activeFloor,
  onSelectFloor,
}: {
  nodes?: IndoorNode[];
  currentPosNodeId: string;
  selectedDestination?: Destination | null;
  routeResult?: RouteResult | null;
  currentStepIndex?: number;
  activeFloor: FloorLevel;
  onSelectFloor: (floor: FloorLevel) => void;
}) {
  const [zoom, setZoom] = useState(1);

  const displayNodes = nodes && nodes.length > 0 ? nodes : DEMO_NODES;

  // Active step / current position node
  const activeRouteNodeId =
    routeResult && routeResult.nodes.length > 0
      ? routeResult.nodes[Math.min(currentStepIndex, routeResult.nodes.length - 1)]
      : currentPosNodeId;

  const currentNode = displayNodes.find((n) => n.id === activeRouteNodeId);
  const destNode = selectedDestination
    ? displayNodes.find((n) => n.id === selectedDestination.nodeId)
    : null;

  // Build SVG Route Line Path if route exists
  const routePathD =
    routeResult && routeResult.nodes.length > 1
      ? routeResult.nodes
          .map((nid) => {
            const n = displayNodes.find((loc) => loc.id === nid);
            return n ? `${n.x} ${n.y}` : null;
          })
          .filter(Boolean)
          .map((coord, idx) => `${idx === 0 ? "M" : "L"} ${coord}`)
          .join(" ")
      : "";

  return (
    <div className="relative min-h-[420px] w-full overflow-hidden rounded-2xl border-2 border-[#111827]/12 bg-[#F8FAFC] shadow-sm">
      {/* Surface Radial Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Vector SVG Map Canvas */}
      <div
        className="absolute inset-0 h-full w-full transition-transform duration-300"
        style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
      >
        <svg viewBox="0 0 100 100" className="h-full w-full">
          {/* Main House Perimeter Wall Outline */}
          <rect x="5" y="4" width="90" height="92" rx="3" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.8" />

          {/* Floor Plan Room Boxes */}
          {/* Top Row: Bhagwan Room (Left) & Porch (Right) */}
          <rect x="10" y="6" width="30" height="16" rx="1.5" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="0.6" />
          <rect x="60" y="6" width="30" height="16" rx="1.5" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="0.6" />

          {/* Upper Middle Row: 2nd Bedroom (Left) & Kitchen (Right) */}
          <rect x="10" y="25" width="30" height="16" rx="1.5" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="0.6" />
          <rect x="60" y="25" width="30" height="16" rx="1.5" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="0.6" />

          {/* Middle Row: Bathroom (Left) & Dining Room (Right) */}
          <rect x="10" y="44" width="30" height="16" rx="1.5" fill="#F0FDF4" stroke="#BBF7D0" strokeWidth="0.6" />
          <rect x="60" y="44" width="30" height="18" rx="1.5" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="0.6" />

          {/* Lower Center: Central Hall */}
          <rect x="30" y="63" width="30" height="16" rx="1.5" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="0.8" />

          {/* Bottom Row: 1st Bedroom (Left) & Main Gate Entrance (Right/Bottom) */}
          <rect x="10" y="80" width="22" height="14" rx="1.5" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="0.6" />
          <rect x="34" y="82" width="22" height="12" rx="2" fill="#F97316" fillOpacity="0.1" stroke="#F97316" strokeWidth="0.8" strokeDasharray="2 1" />

          {/* Graph Connection Edges (Dashed Lines representing physical hallways/doors) */}
          {DEMO_EDGES.map((edge, idx) => {
            const fromN = displayNodes.find((n) => n.id === edge.from);
            const toN = displayNodes.find((n) => n.id === edge.to);
            if (!fromN || !toN) return null;
            return (
              <g key={idx}>
                <line
                  x1={fromN.x}
                  y1={fromN.y}
                  x2={toN.x}
                  y2={toN.y}
                  stroke="#CBD5E1"
                  strokeWidth="1.2"
                  strokeDasharray="2 1.5"
                />
              </g>
            );
          })}

          {/* Active Navigation Path (Solid Orange #F97316) */}
          {routePathD && (
            <path
              d={routePathD}
              fill="none"
              stroke="#F97316"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-pulse"
            />
          )}
        </svg>

        {/* Room Labels */}
        {displayNodes.map((n) => (
          <div
            key={n.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none select-none"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            <span className="rounded bg-white/90 px-1 py-0.5 font-mono text-[9px] font-extrabold text-[#111827] shadow-2xs border border-[#111827]/10">
              {n.name}
            </span>
          </div>
        ))}

        {/* Selected Destination Marker */}
        {destNode && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-20"
            style={{ left: `${destNode.x}%`, top: `${destNode.y}%` }}
          >
            <div className="flex flex-col items-center">
              <div className="grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-[#111827] text-[#F97316] shadow-lg">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="mt-0.5 rounded bg-[#111827] px-1.5 py-0.5 font-mono text-[9px] font-bold text-white shadow-xs">
                🎯 {selectedDestination?.name}
              </div>
            </div>
          </div>
        )}

        {/* User Location Position Marker */}
        {currentNode && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out z-30"
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
      <div className="absolute left-3 top-3 z-10 rounded-md border border-[#111827]/10 bg-white/95 px-3 py-1.5 backdrop-blur shadow-xs">
        <div className="flex items-center gap-1.5 font-display text-[10px] font-extrabold uppercase text-[#111827]">
          <Navigation className="h-3.5 w-3.5 text-[#F97316]" />
          <span>HOME FLOOR PLAN</span>
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
    </div>
  );
}
