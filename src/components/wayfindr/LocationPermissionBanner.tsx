import { useState, useEffect } from "react";
import { Compass, RefreshCw, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { positioningService } from "@/services/positioning/PositioningService";

export function LocationPermissionBanner({
  startingLocationName = "Main Gate",
  onPermissionChange,
  onContinueWithoutLocation,
}: {
  startingLocationName?: string;
  onPermissionChange?: (granted: boolean) => void;
  onContinueWithoutLocation?: () => void;
}) {
  const [status, setStatus] = useState<"prompt" | "granted" | "denied" | "unsupported">("prompt");
  const [isLoading, setIsLoading] = useState(false);
  const [showUnblockInstructions, setShowUnblockInstructions] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Check browser geolocation permission state on mount & set up change listener
  useEffect(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setStatus("unsupported");
      onPermissionChange?.(false);
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
      setShowUnblockInstructions(false);
      positioningService.startBrowserGeolocation();
      onPermissionChange?.(true);
    } else if (state === "denied") {
      setStatus("denied");
      onPermissionChange?.(false);
    } else {
      setStatus("prompt");
      onPermissionChange?.(false);
    }
  };

  const requestPermission = () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setStatus("unsupported");
      onPermissionChange?.(false);
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      () => {
        setIsLoading(false);
        setStatus("granted");
        setShowUnblockInstructions(false);
        positioningService.startBrowserGeolocation();
        onPermissionChange?.(true);
      },
      (err) => {
        setIsLoading(false);
        setStatus("denied");
        onPermissionChange?.(false);
        if (err.code === err.PERMISSION_DENIED) {
          setShowUnblockInstructions(true);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleTryAgain = () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setStatus("unsupported");
      return;
    }

    setIsLoading(true);

    if ("permissions" in navigator) {
      navigator.permissions
        .query({ name: "geolocation" as PermissionName })
        .then((perm) => {
          setIsLoading(false);
          if (perm.state === "granted") {
            setStatus("granted");
            setShowUnblockInstructions(false);
            positioningService.startBrowserGeolocation();
            onPermissionChange?.(true);
          } else if (perm.state === "denied") {
            // Still denied in browser settings -> show unblock steps
            setShowUnblockInstructions(true);
          } else {
            // "prompt" state -> trigger browser prompt
            requestPermission();
          }
        })
        .catch(() => {
          requestPermission();
        });
    } else {
      requestPermission();
    }
  };

  const handleContinueWithout = () => {
    setDismissed(true);
    onContinueWithoutLocation?.();
  };

  if (dismissed) return null;

  // STATE 1 — LOCATION GRANTED
  if (status === "granted") {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-[#10B981]/30 bg-[#10B981]/10 p-3.5 shadow-xs text-left">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
            <span className="font-display text-xs font-bold text-[#111827]">
              ✓ LOCATION ACCESS ENABLED
            </span>
          </div>
          <span className="font-mono text-[10px] font-bold text-[#10B981]">
            Live positioning available
          </span>
        </div>
      </div>
    );
  }

  // STATE 3 — LOCATION DENIED
  if (status === "denied") {
    return (
      <div className="mx-auto max-w-lg space-y-3 rounded-2xl border-2 border-amber-500/40 bg-amber-50/20 p-4 text-left shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-500 text-white">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <h3 className="font-display text-xs font-extrabold uppercase tracking-wide text-[#111827]">
                ⚠️ LOCATION ACCESS OFF
              </h3>
              <p className="font-sans text-[11px] text-[#4B5563] leading-snug">
                Your browser is currently blocking live device location.
              </p>
              <div className="mt-1 flex items-center gap-1 font-mono text-xs font-bold text-[#111827]">
                <span>Your QR starting point is still confirmed as:</span>
                <span className="rounded bg-[#F97316]/15 px-1.5 py-0.5 text-[#F97316]">
                  📍 {startingLocationName}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleContinueWithout}
            className="rounded-lg p-1 text-[#9CA3AF] hover:bg-white hover:text-[#111827]"
            title="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Browser Settings Guidance Accordion */}
        {showUnblockInstructions && (
          <div className="rounded-xl border border-amber-500/30 bg-white p-3 text-xs space-y-1.5 shadow-xs">
            <div className="font-display font-extrabold text-amber-600 text-[11px]">
              Location access is blocked for this site.
            </div>
            <p className="font-sans text-[11px] text-[#6B7280]">To enable it in browser settings:</p>
            <ol className="list-decimal pl-4 font-sans text-[11px] text-[#374151] space-y-0.5">
              <li>Open your browser's site permissions (Lock/Tune icon near URL).</li>
              <li>Allow Location for WayFindr.</li>
              <li>Return to WayFindr.</li>
              <li>Press "Check Again" below.</li>
            </ol>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#111827]/8">
          <button
            onClick={handleTryAgain}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-xl bg-[#111827] px-4 py-2 font-display text-xs font-extrabold uppercase tracking-wider text-white shadow-sm hover:bg-[#111827]/90 active:scale-[0.98] disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>{showUnblockInstructions ? "CHECK AGAIN" : "TRY AGAIN"}</span>
          </button>

          <button
            onClick={handleContinueWithout}
            className="rounded-xl border border-[#111827]/15 bg-white px-3.5 py-2 font-display text-xs font-bold text-[#111827] hover:bg-[#111827] hover:text-white transition-colors"
          >
            CONTINUE WITHOUT LIVE LOCATION
          </button>
        </div>
      </div>
    );
  }

  // STATE 2 — LOCATION NOT YET DECIDED / PROMPT
  return (
    <div className="mx-auto max-w-lg space-y-3 rounded-2xl border-2 border-[#F97316]/40 bg-white p-4 text-left shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#111827] text-[#F97316]">
            <Compass className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-xs font-extrabold uppercase tracking-wide text-[#111827]">
              📍 Enable live location
            </h3>
            <p className="font-sans text-[11px] text-[#6B7280] leading-snug mt-0.5">
              Allow location access to improve live navigation while you move through the premises.
            </p>
          </div>
        </div>

        <button
          onClick={handleContinueWithout}
          className="rounded-lg p-1 text-[#9CA3AF] hover:bg-[#F8FAFC] hover:text-[#111827]"
          title="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#111827]/8">
        <button
          onClick={requestPermission}
          disabled={isLoading}
          className="flex items-center gap-1.5 rounded-xl bg-[#F97316] px-4 py-2 font-display text-xs font-extrabold uppercase tracking-wider text-white shadow-sm hover:bg-[#ea580c] active:scale-[0.98] disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>{isLoading ? "Requesting..." : "ENABLE LOCATION"}</span>
        </button>

        <button
          onClick={handleContinueWithout}
          className="rounded-xl border border-[#111827]/15 bg-[#F8FAFC] px-3.5 py-2 font-display text-xs font-bold text-[#111827] hover:bg-[#111827] hover:text-white transition-colors"
        >
          CONTINUE WITHOUT IT
        </button>
      </div>
    </div>
  );
}
