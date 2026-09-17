import type { PositioningProvider, PositioningSignal } from "./PositioningProvider";

export class BLEPositionProvider implements PositioningProvider {
  public readonly id = "ble-beacon-provider";
  public readonly name = "Bluetooth Low Energy Beacon Provider";
  public readonly type = "BLE";
  private active = false;
  private listeners: Set<(signal: PositioningSignal) => void> = new Set();

  public async isAvailable(): Promise<boolean> {
    return typeof navigator !== "undefined" && "bluetooth" in navigator;
  }

  public start(): void {
    this.active = true;
    // Real Web Bluetooth beacon scanning stub for hardware deployment
  }

  public stop(): void {
    this.active = false;
  }

  public subscribe(callback: (signal: PositioningSignal) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
}

export class WiFiRTTProvider implements PositioningProvider {
  public readonly id = "wifi-rtt-provider";
  public readonly name = "Wi-Fi Fine Ranging (IEEE 802.11mc / RTT) Provider";
  public readonly type = "WIFI_RTT";
  private active = false;
  private listeners: Set<(signal: PositioningSignal) => void> = new Set();

  public async isAvailable(): Promise<boolean> {
    return false; // Hardware Wi-Fi RTT requires native Android RTT API adapter
  }

  public start(): void {
    this.active = true;
  }

  public stop(): void {
    this.active = false;
  }

  public subscribe(callback: (signal: PositioningSignal) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
}

export class UWBPositionProvider implements PositioningProvider {
  public readonly id = "uwb-provider";
  public readonly name = "Ultra-Wideband (UWB) Sub-Meter Ranging Provider";
  public readonly type = "UWB";
  private active = false;
  private listeners: Set<(signal: PositioningSignal) => void> = new Set();

  public async isAvailable(): Promise<boolean> {
    return false; // Native UWB chip integration for iOS / Android Ultra Wideband
  }

  public start(): void {
    this.active = true;
  }

  public stop(): void {
    this.active = false;
  }

  public subscribe(callback: (signal: PositioningSignal) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
}
