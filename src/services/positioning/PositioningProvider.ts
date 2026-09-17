import type { NavigationPosition, AccuracyState } from "@/lib/wayfindr-types";

export interface PositioningSignal {
  providerId: string;
  source: string;
  x: number;
  y: number;
  floorId: string;
  accuracyMetres: number;
  confidence: number; // 0.0 to 1.0 scale
  timestamp: number;
  heading?: number;
  rawSignalData?: Record<string, unknown>;
}

export interface PositioningProvider {
  readonly id: string;
  readonly name: string;
  readonly type: "QR" | "BLE" | "WIFI_RTT" | "UWB" | "GPS" | "FUSION" | "SIMULATION";
  
  isAvailable(): Promise<boolean>;
  start(): void;
  stop(): void;
  subscribe(callback: (signal: PositioningSignal) => void): () => void;
}
