import { DEMO_NODES, DEMO_QR_LOCATIONS } from "@/lib/wayfindr-data";
import type { FloorLevel, NavigationPosition, PositionSource } from "@/lib/wayfindr-types";
import { matchPositionToGraph } from "./MapMatchingService";

type PositionCallback = (pos: NavigationPosition) => void;

class PositioningServiceImpl {
  private startingPos: NavigationPosition | null = null;
  private currentPos: NavigationPosition | null = null;
  private listeners: Set<PositionCallback> = new Set();
  private watchId: number | null = null;
  private simulationTimer: NodeJS.Timeout | null = null;
  private simulationPath: string[] = [];
  private simulationStepIndex = 0;

  public initializeFromQR(qrKey: string): NavigationPosition {
    const qrData = DEMO_QR_LOCATIONS[qrKey] || DEMO_QR_LOCATIONS["main-gate"];
    const node = DEMO_NODES.find((n) => n.id === qrData.nodeId) || DEMO_NODES[0];

    const pos: NavigationPosition = {
      x: node.x,
      y: node.y,
      nodeId: node.id,
      floorId: node.floorId,
      accuracyState: "high",
      source: "QR",
      timestamp: Date.now(),
    };

    this.startingPos = pos;
    this.currentPos = pos;
    this.notifyListeners(pos);
    return pos;
  }

  public getStartingPosition(): NavigationPosition | null {
    return this.startingPos;
  }

  public getCurrentPosition(): NavigationPosition | null {
    return this.currentPos;
  }

  public subscribe(callback: PositionCallback): () => void {
    this.listeners.add(callback);
    if (this.currentPos) {
      callback(this.currentPos);
    }
    return () => {
      this.listeners.delete(callback);
    };
  }

  public startBrowserGeolocation(): void {
    if (typeof window === "undefined" || !("geolocation" in navigator)) return;

    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
    }

    this.watchId = navigator.geolocation.watchPosition(
      (geoPos) => {
        // Map raw GPS lat/lng or accuracy to indoor position estimate
        if (!this.currentPos) return;

        const updated: NavigationPosition = {
          ...this.currentPos,
          latitude: geoPos.coords.latitude,
          longitude: geoPos.coords.longitude,
          heading: geoPos.coords.heading ?? undefined,
          accuracyMetres: geoPos.coords.accuracy,
          accuracyState: geoPos.coords.accuracy <= 10 ? "high" : geoPos.coords.accuracy <= 30 ? "medium" : "low",
          source: "GPS",
          timestamp: Date.now(),
        };

        const mapMatched = matchPositionToGraph(updated);
        this.currentPos = mapMatched;
        this.notifyListeners(mapMatched);
      },
      (err) => {
        console.warn("Geolocation positioning notice:", err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000,
      }
    );
  }

  public updateOrientationHeading(heading: number): void {
    if (!this.currentPos) return;
    this.currentPos = {
      ...this.currentPos,
      heading,
      timestamp: Date.now(),
    };
    this.notifyListeners(this.currentPos);
  }

  public startDevSimulation(routeNodeIds: string[]): void {
    this.stopDevSimulation();
    this.simulationPath = routeNodeIds;
    this.simulationStepIndex = 0;

    this.simulationTimer = setInterval(() => {
      if (this.simulationStepIndex >= this.simulationPath.length) {
        this.stopDevSimulation();
        return;
      }

      const nodeId = this.simulationPath[this.simulationStepIndex];
      const node = DEMO_NODES.find((n) => n.id === nodeId);
      if (node) {
        const simPos: NavigationPosition = {
          x: node.x,
          y: node.y,
          nodeId: node.id,
          floorId: node.floorId,
          accuracyState: "high",
          source: "SIMULATION",
          timestamp: Date.now(),
        };
        this.currentPos = simPos;
        this.notifyListeners(simPos);
      }
      this.simulationStepIndex++;
    }, 2500);
  }

  public stopDevSimulation(): void {
    if (this.simulationTimer) {
      clearInterval(this.simulationTimer);
      this.simulationTimer = null;
    }
  }

  public stopAll(): void {
    if (this.watchId !== null && typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.stopDevSimulation();
  }

  private notifyListeners(pos: NavigationPosition): void {
    for (const listener of this.listeners) {
      listener(pos);
    }
  }
}

export const positioningService = new PositioningServiceImpl();
