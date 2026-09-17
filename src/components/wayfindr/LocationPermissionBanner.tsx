import { useState, useEffect } from "react";
import { Compass, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import { positioningService } from "@/services/positioning/PositioningService";

export function LocationPermissionBanner({
  onPermissionChange,
}: {
  onPermissionChange: (granted: boolean) => void;
}) {
  const [status, setStatus] = useState<"prompt" | "granted" | "denied" | "unsupported">("prompt");

  useEffect(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setStatus("unsupported");
      onPermissionChange(false);
      return;
    }

    if ("permissions" in navigator) {
      navigator.permissions
        .query({ name: "geolocation" as PermissionName })
        .then((res) => {
          if (res.state === "granted") {
            setStatus("granted");
            positioningService.startBrowserGeolocation();
            onPermissionChange(true);
          } else if (res.state === "denied") {
            setStatus("denied");
            onPermissionChange(false);
          }
        })
        .catch(() => {});
    }
  }, [onPermissionChange]);

  const requestPermission = () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setStatus("unsupported");
      onPermissionChange(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setStatus("granted");
        positioningService.startBrowserGeolocation();
        onPermissionChange(true);
      },
      (err) => {
        console.warn("Geolocation permission notice:", err.message);
        setStatus("denied");
        onPermissionChange(false);
      },
      { enableHighAccuracy: true }
    );
  };

  if (status === "granted") return null;

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-[#111827]/12 bg-white p-4 shadow-xs text-left">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#111827] text-[#F97316]">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display text-xs font-bold text-[#111827]">
              {status === "prompt"
                ? "Enable Device Location Tracking"
                : "Live Indoor Location Signal Status"}
            </div>
            <p className="font-sans text-[11px] text-[#6B7280] leading-snug">
              {status === "prompt"
                ? "WayFindr uses device location to update your navigation as you move."
                : "Live location is unavailable. Navigation will use the QR starting point and available positioning signals."}
            </p>
          </div>
        </div>

        {status === "prompt" && (
          <button
            onClick={requestPermission}
            className="shrink-0 rounded-xl bg-[#111827] px-3.5 py-2 font-display text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-[#111827]/90"
          >
            Allow Location
          </button>
        )}
      </div>
    </div>
  );
}
