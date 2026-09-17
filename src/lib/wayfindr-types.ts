export type FloorLevel = "G" | "1" | "2" | "B1";

export interface Building {
  id: string;
  name: string;
  floors: Floor[];
}

export interface Floor {
  id: string;
  name: string;
  level: FloorLevel;
}

export interface IndoorNode {
  id: string;
  floorId: FloorLevel;
  x: number; // 0 - 100 percentage for vector map
  y: number; // 0 - 100 percentage for vector map
  name: string;
  type: "entrance" | "room" | "corridor" | "staircase" | "elevator" | "restroom";
}

export interface Destination {
  id: string;
  name: string;
  category: "Admissions" | "Library" | "Faculty" | "Kitchen" | "Bedrooms" | "Prayer" | "Restroom" | "Facility" | "Entry";
  nodeId: string;
  floorId: FloorLevel;
  buildingName: string;
  floorName: string;
  icon: string; // Lucide icon identifier
  description?: string;
  hours?: string;
  roomNumber?: string;
}

export interface QRLocation {
  qrId: string; // e.g. "main-gate", "reception", "floor-1"
  nodeId: string;
  locationName: string;
  buildingName: string;
  floorName: string;
  floorId: FloorLevel;
}

export interface NavigationEdge {
  from: string;
  to: string;
  distance: number; // in metres
  edgeType?: "walk" | "stairs" | "elevator";
}

export type TurnAction =
  | "straight"
  | "slight-right"
  | "turn-right"
  | "slight-left"
  | "turn-left"
  | "stairs"
  | "elevator"
  | "arrive";

export interface TurnStep {
  stepNumber: number;
  text: string;
  action: TurnAction;
  fromNodeId: string;
  toNodeId: string;
  fromName: string;
  toName: string;
  metres: number;
  remainingMetres: number;
  floorTransition?: {
    fromFloor: FloorLevel;
    toFloor: FloorLevel;
    type: "stairs" | "elevator";
  };
}

export interface RouteResult {
  nodes: string[];
  edges: NavigationEdge[];
  totalMetres: number;
  estimatedMinutes: number;
  steps: TurnStep[];
}
