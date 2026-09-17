import { useState, useEffect } from "react";
import { Compass, RefreshCw, AlertCircle, CheckCircle2, Info, X, HelpCircle } from "lucide-react";
import { positioningService } from "@/services/positioning/PositioningService";

export function LocationPermissionBanner({
  onPermissionChange,
}: {
  onPermissionChange: (granted: boolean) => void;
}) {
  const [status, setStatus] = useState<"prompt" | "granted" | "denied" | "unsupported">("prompt");
  const [isLoading, setIsLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Check browser geolocation permission status on mount & listen for updates
  useEffect(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setStatus("unsupported");
      onPermissionChange(false);
      return;
    }

    if ("permissions" in navigator) {
      navigator.permissions
        .query({ name: "geolocation" as PermissionName })
        .then((permissionStatus) => {
          updateStatusFromState(permissionStatus.state);

          permissionStatus.onchange = () => {
            updateStatusFromState(permissionStatus.state);
          };
        })
        .catch(() => {});
    }
  }, [onPermissionChange]);

  const updateStatusFromState = (state: PermissionState) => {
    if (state === "granted") {
      setStatus("granted");
      setShowHelp(false);
      positioningService.startBrowserGeolocation();
      onPermissionChange(true);
    } else if (state === "denied") {
      setStatus("denied");
      onPermissionChange(false);
    } else {
      setStatus("prompt");
      onPermissionChange(false);
    }
  };

  const requestPermission = () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setStatus("unsupported");
      onPermissionChange(false);
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      () => {
        setIsLoading(false);
        setStatus("granted");
        setShowHelp(false);
        positioningService.startBrowserGeolocation();
        onPermissionChange(true);
      },
      (err) => {
        setIsLoading(false);
        setStatus("denied");
        setShowHelp(true);
        onPermissionChange(false);
        console.warn("Geolocation permission error:", err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  if (dismissed) return null;

  if (status === "granted") {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-[#10B981]/30 bg-[#10B981]/10 p-3 shadow-xs text-left">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
            <span className="font-display text-xs font-bold text-[#111827]">
              Live Device Location Granted
            </span>
          </div>
          <span className="font-mono text-[10px] font-bold text-[#10B981]">GPS ACTIVE</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-3 rounded-2xl border-2 border-[#F97316]/40 bg-white p-4 text-left shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#111827] text-[#F97316]">
            <Compass className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-xs font-extrabold uppercase tracking-wide text-[#111827]">
                {status === "denied"
                  ? "Live Location Currently Unavailable"
                  : "Enable Live Location Tracking"}
              </h3>
            </div>
            <p className="font-sans text-[11px] text-[#6B7280] leading-snug mt-0.5">
              {status === "denied"
                ? "Live location was blocked or unavailable. Tap 'Retry Location' below to trigger the browser prompt again."
                : "Allow location access to update navigation as you walk from the Main Gate."}
            </p>
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="rounded-lg p-1 text-[#9CA3AF] hover:bg-[#F8FAFC] hover:text-[#111827]"
          title="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#111827]/8">
        <button
          onClick={requestPermission}
          disabled={isLoading}
          className="flex items-center gap-1.5 rounded-xl bg-[#F97316] px-4 py-2 font-display text-xs font-extrabold uppercase tracking-wider text-white shadow-sm hover:bg-[#ea580c] active:scale-[0.98] disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>{isLoading ? "Requesting..." : status === "denied" ? "Retry Location" : "Enable Location"}</span>
        </button>

        {status === "denied" && (
          <button
            onClick={() => setShowHelp((prev) => !prev)}
            className="flex items-center gap-1 rounded-xl border border-[#111827]/15 bg-[#F8FAFC] px-3 py-2 font-mono text-xs font-bold text-[#111827] hover:bg-[#111827] hover:text-white transition-colors"
          >
            <HelpCircle className="h-3.5 w-3.5 text-[#F97316]" />
            <span>{showHelp ? "Hide Help" : "How to Unblock"}</span>
          </button>
        )}

        <button
          onClick={() => setDismissed(true)}
          className="ml-auto font-mono text-[10px] font-semibold text-[#6B7280] hover:text-[#111827] underline"
        >
          Use QR Anchor Only
        </button>
      </div>

      {/* Step-by-Step Browser Unblock Guide Accordion */}
      {showHelp && (
        <div className="rounded-xl border border-[#111827]/12 bg-[#F8FAFC] p-3 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-display text-[11px] font-bold text-[#111827]">
            <Info className="h-4 w-4 text-[#F97316]" />
            <span>How to allow location in browser settings:</span>
          </div>
          <ol className="list-decimal pl-4 space-y-1 font-sans text-[11px] text-[#4B5563]">
            <li>Tap the <strong>Lock / Tune icon</strong> next to the web address (URL) bar at the top.</li>
            <li>Tap <strong>Permissions</strong> or <strong>Site Settings</strong>.</li>
            <li>Change <strong>Location</strong> from <i>Block</i> to <strong>Allow</strong>.</li>
            <li>Return here and tap <strong>Retry Location</strong> above.</li>
          </ol>
        </div>
      )}
    </div>
  );
}
