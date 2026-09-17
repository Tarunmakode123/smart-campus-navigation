import type { NavigationPosition, AccuracyState, PositionSource } from "@/lib/wayfindr-types";
import type { PositioningProvider, PositioningSignal } from "./PositioningProvider";
import { matchPositionToGraph } from "./MapMatchingService";

export class FusionPositioningEngine {
  private providers: Map<string, PositioningProvider> = new Map();
  private lastSignals: Map<string, PositioningSignal> = new Map();
  private currentFusedPosition: NavigationPosition | null = null;
  private listeners: Set<(pos: NavigationPosition) => void> = new Set();
  private unsubscribers: Map<string, () => void> = new Map();

  public registerProvider(provider: PositioningProvider): void {
    this.providers.set(provider.id, provider);
  }

  public unregisterProvider(providerId: string): void {
    const unsub = this.unsubscribers.get(providerId);
    if (unsub) {
      unsub();
      this.unsubscribers.delete(providerId);
    }
    this.providers.get(providerId)?.stop();
    this.providers.delete(providerId);
    this.lastSignals.delete(providerId);
  }

  public start(): void {
    this.providers.forEach((provider) => {
      provider.start();
      const unsub = provider.subscribe((signal) => {
        this.processSignal(signal);
      });
      this.unsubscribers.set(provider.id, unsub);
    });
  }

  public stop(): void {
    this.unsubscribers.forEach((unsub) => unsub());
    this.unsubscribers.clear();
    this.providers.forEach((provider) => provider.stop());
  }

  public subscribe(callback: (pos: NavigationPosition) => void): () => void {
    this.listeners.add(callback);
    if (this.currentFusedPosition) {
      callback(this.currentFusedPosition);
    }
    return () => {
      this.listeners.delete(callback);
    };
  }

  private processSignal(signal: PositioningSignal): void {
    const now = Date.now();
    // Ignore signals older than 10 seconds (outlier / stale signal rejection)
    if (now - signal.timestamp > 10000) return;

    this.lastSignals.set(signal.providerId, signal);
    const fused = this.computeFusedLocation();
    if (fused) {
      this.currentFusedPosition = fused;
      this.notifyListeners(fused);
    }
  }

  private computeFusedLocation(): NavigationPosition | null {
    if (this.lastSignals.size === 0) return null;

    const validSignals = Array.from(this.lastSignals.values()).filter(
      (s) => Date.now() - s.timestamp <= 8000
    );

    if (validSignals.length === 0) return this.currentFusedPosition;

    // Highest confidence provider takes precedence if confidence > 0.9 (e.g. fresh QR scan)
    const qrSignal = validSignals.find((s) => s.source === "QR" && s.confidence >= 0.95);
    if (qrSignal) {
      const rawPos: NavigationPosition = {
        x: qrSignal.x,
        y: qrSignal.y,
        floorId: qrSignal.floorId,
        accuracyMetres: qrSignal.accuracyMetres,
        accuracyState: "high",
        source: "QR",
        timestamp: qrSignal.timestamp,
        heading: qrSignal.heading,
      };
      return matchPositionToGraph(rawPos);
    }

    // Weighted sensor fusion across BLE, Wi-Fi RTT, UWB, GPS signals
    let totalWeight = 0;
    let weightedX = 0;
    let weightedY = 0;
    let primaryFloor = validSignals[0].floorId;
    let bestConfidence = 0;
    let primarySource: PositionSource = "FUSION";

    for (const s of validSignals) {
      // Weight inversely proportional to accuracy error metres & proportional to confidence
      const weight = (s.confidence / (s.accuracyMetres || 1)) + 0.001;
      weightedX += s.x * weight;
      weightedY += s.y * weight;
      totalWeight += weight;

      if (s.confidence > bestConfidence) {
        bestConfidence = s.confidence;
        primaryFloor = s.floorId;
        primarySource = s.source as PositionSource;
      }
    }

    const fusedX = totalWeight > 0 ? weightedX / totalWeight : validSignals[0].x;
    const fusedY = totalWeight > 0 ? weightedY / totalWeight : validSignals[0].y;

    const accuracyState: AccuracyState =
      bestConfidence >= 0.85 ? "high" : bestConfidence >= 0.5 ? "medium" : "low";

    const rawPos: NavigationPosition = {
      x: fusedX,
      y: fusedY,
      floorId: primaryFloor,
      accuracyMetres: Math.max(1, 10 * (1 - bestConfidence)),
      accuracyState,
      source: validSignals.length > 1 ? "FUSION" : primarySource,
      timestamp: Date.now(),
    };

    return matchPositionToGraph(rawPos);
  }

  private notifyListeners(pos: NavigationPosition): void {
    for (const listener of this.listeners) {
      listener(pos);
    }
  }
}

export const fusionPositioningEngine = new FusionPositioningEngine();
