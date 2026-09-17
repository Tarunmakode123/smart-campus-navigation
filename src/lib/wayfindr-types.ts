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

export interface Person {
  id: string;
  name: string;
  title: string;
  department: string;
  destinationId: string;
  nodeId: string;
  roomNumber: string;
  floorName: string;
  buildingName: string;
  avatar?: string;
}

export interface VisitorDetails {
  startingLocation: QRLocation;
  destination: Destination | null;
  person: Person | null;
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
  totalDistance?: number;
  estimatedMinutes: number;
  steps: TurnStep[];
}

export type PositionSource = "QR" | "GPS" | "SENSOR" | "MAP_MATCHED" | "SIMULATION";
export type AccuracyState = "high" | "medium" | "low" | "weak";

export interface NavigationPosition {
  x: number; // 0-100 indoor map X percentage
  y: number; // 0-100 indoor map Y percentage
  nodeId?: string;
  floorId: FloorLevel;
  latitude?: number;
  longitude?: number;
  heading?: number; // 0-360 degrees orientation compass heading
  accuracyMetres?: number;
  accuracyState: AccuracyState;
  source: PositionSource;
  timestamp: number;
}

export interface AutocompleteItem {
  id: string;
  title: string;
  subtitle: string;
  type: "destination" | "person";
  originalObj: Destination | Person;
}
