import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUp,
  ArrowUpLeft,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Footprints,
  MapPin,
  Mic,
  MicOff,
  Navigation,
  Pause,
  Play,
  Ruler,
  Volume2,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useLocations } from "@/lib/locations";
import { useEntryPoint } from "@/lib/entry-point";
import {
  buildDetailedRouteSteps,
  calculateHomeRoute,
  DEFAULT_ENTRY_ID,
  formatMetres,
  type TurnAction,
} from "@/lib/home-navigation";
import { speakDirection, stopSpeech } from "@/lib/speech";

export const Route = createFileRoute("/navigate/$id")({
  head: () => ({
    meta: [{ title: "Guided Route - Smart Navigator" }],
  }),
  component: NavigatePage,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">
      Destination not found
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-6 text-center text-sm text-destructive">{error.message}</div>
  ),
});

function NavigatePage() {
  const { id } = Route.useParams();
  const all = useLocations();
  const dest = all.find((l) => l.id === id);

  if (!dest) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] pb-24">
        <AppHeader />
        <div className="mx-auto max-w-3xl px-4 pt-12 text-center">
          <h1 className="font-display text-xl font-bold text-[#12203A]">Destination Not Found</h1>
          <p className="mt-2 font-sans text-xs text-[#5B6472]">
            The requested target location is not available in our building graph.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block rounded-md bg-[#12203A] px-4 py-2 font-display text-xs font-bold uppercase text-white shadow-sm hover:bg-[#1E2D4A]"
          >
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  const entryId = useEntryPoint();
  const entry =
    all.find((l) => l.id === entryId) ?? all.find((l) => l.id === DEFAULT_ENTRY_ID) ?? all[0];
  const [started, setStarted] = useState(false);
  const [voice, setVoice] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const [simulating, setSimulating] = useState(false);

  const route = useMemo(
    () => calculateHomeRoute(entry?.id ?? DEFAULT_ENTRY_ID, dest.id),
    [entry?.id, dest.id],
  );
  const routeLocations = useMemo(
    () =>
      route.nodes
        .map((nodeId) => all.find((loc) => loc.id === nodeId))
        .filter(Boolean) as typeof all,
    [all, route.nodes],
  );

  const detailedSteps = useMemo(
    () => buildDetailedRouteSteps(route, all),
    [route, all],
  );

  const minutes = Math.max(1, Math.ceil(route.totalMetres / 60));
  const activeStepObj = detailedSteps[Math.min(stepIndex, detailedSteps.length - 1)];
  const currentStepText = activeStepObj?.text ?? "Follow indoor route";
  const progressPercent = activeStepObj?.progressPercent ?? 0;
  const remainingMetres = activeStepObj?.remainingMetres ?? route.totalMetres;

  // Speak directions when step changes or when started
  useEffect(() => {
    if (started && voice && currentStepText) {
      speakDirection(currentStepText);
    }
  }, [stepIndex, started, voice, currentStepText]);

  // Handle Auto-Play Simulation Mode
  useEffect(() => {
    if (!simulating) return;
    setStarted(true);
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= detailedSteps.length - 1) {
          setSimulating(false);
          return prev;
        }
        return prev + 1;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [simulating, detailedSteps.length]);

  // Current active map coordinate for animated location dot
  const currentLocNode = routeLocations[Math.min(stepIndex, routeLocations.length - 1)];
  const currentPos = {
    x: currentLocNode?.mapX ?? 50,
    y: currentLocNode?.mapY ?? 50,
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] pb-24">
      <AppHeader />

      <div className="mx-auto max-w-5xl px-4 pt-4">
        <Link
          to="/location/$id"
          params={{ id: dest.id }}
          className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-[#5B6472] hover:text-[#12203A]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to {dest.name}
        </Link>
      </div>

      <main className="mx-auto mt-3 grid max-w-5xl gap-4 px-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="overflow-hidden rounded-xl border border-[#12203A]/20 bg-[#12203A] text-[#F7F5F0] shadow-md">
          <div className="relative h-[480px] bg-grid-dark text-white">
            {dest.image && (
              <img
                src={dest.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-20"
              />
            )}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_0,rgba(18,32,58,0.3)_34%,rgba(18,32,58,0.95)_80%)]" />

            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3.5 z-10">
              <div className="flex items-center gap-2 rounded-md border border-[#F7F5F0]/20 bg-[#1E2D4A]/90 px-3 py-1 font-mono text-[11px] font-semibold text-[#F7F5F0] backdrop-blur">
                <Navigation className="h-3.5 w-3.5 text-[#E8944A]" />
                GOOGLE MAPS INDOOR NAV • {entry?.building ?? "HOME"}
              </div>
              <button
                onClick={() => {
                  const nextVoice = !voice;
                  setVoice(nextVoice);
                  if (!nextVoice) stopSpeech();
                }}
                className={`flex items-center gap-1.5 rounded-md border px-3 py-1 font-mono text-xs font-semibold backdrop-blur transition-colors ${
                  voice
                    ? "border-[#E8944A] bg-[#E8944A] text-white"
                    : "border-[#F7F5F0]/20 bg-[#1E2D4A] text-[#8B98AD]"
                }`}
                aria-label={voice ? "Turn voice off" : "Turn voice on"}
              >
                {voice ? <Volume2 className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
                <span>{voice ? "Voice ON" : "Muted"}</span>
              </button>
            </div>

            {/* Turn Action Indicator Header */}
            <div className="absolute left-1/2 top-[30%] -translate-x-1/2 text-center w-11/12 max-w-sm z-10">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border-2 border-white bg-[#E8944A] text-white shadow-xl transition-all">
                <TurnIcon action={activeStepObj?.action ?? "straight"} />
              </div>
              <div className="mt-3 rounded-xl border border-[#F7F5F0]/20 bg-[#12203A]/95 p-4 backdrop-blur shadow-lg">
                <div className="flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-widest text-[#E8944A]">
                  <span>DIRECTION STEP 0{stepIndex + 1}</span>
                  <span>{activeStepObj?.metres ? `${activeStepObj.metres} m` : ""}</span>
                </div>
                <div className="mt-1.5 font-sans text-sm font-bold leading-snug text-[#F7F5F0]">
                  {currentStepText}
                </div>
              </div>
            </div>

            {/* Target Destination & Progress Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-3.5 z-10">
              <div className="rounded-xl border border-[#12203A]/20 bg-white p-4 text-[#12203A] shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-[10px] font-bold uppercase tracking-widest text-[#5B6472]">
                        DESTINATION
                      </span>
                      <span className="rounded bg-[#E8944A]/15 px-2 py-0.5 font-mono text-[10px] font-bold text-[#E8944A]">
                        {remainingMetres} m REMAINING
                      </span>
                    </div>
                    <h1 className="mt-0.5 truncate font-display text-lg font-bold text-[#12203A]">
                      {dest.name}
                    </h1>
                    <p className="font-sans text-xs text-[#5B6472]">
                      From {entry?.name ?? "Main Gate"} ({dest.building ?? "Home"} • {dest.floor ?? "Ground"})
                    </p>
                  </div>
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[#12203A] text-[#E8944A]">
                    <MapPin className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F7F5F0]">
                  <div
                    className="h-full rounded-full bg-[#E8944A] transition-all duration-500"
                    style={{ width: `${started ? progressPercent : 5}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-3.5">
          <div className="grid grid-cols-2 gap-2.5">
            <Stat
              icon={<Ruler className="h-4 w-4 text-[#E8944A]" />}
              label="Remaining"
              value={`${remainingMetres} m`}
            />
            <Stat
              icon={<Footprints className="h-4 w-4 text-[#E8944A]" />}
              label="Est. Walk Time"
              value={`${minutes} min`}
            />
          </div>

          <div className="rounded-xl border border-[#12203A]/14 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xs font-bold uppercase tracking-wider text-[#12203A]">
                Turn-by-Turn Directions
              </h2>
              <span className="font-mono text-[10px] font-semibold text-[#5B6472]">
                {detailedSteps.length} STOPS
              </span>
            </div>
            <ol className="mt-3 space-y-2.5">
              {detailedSteps.map((step, index) => {
                const isCurrent = index === stepIndex && started;
                const isPassed = index < stepIndex && started;
                return (
                  <li key={step.text} className="flex items-start gap-2.5">
                    <button
                      onClick={() => {
                        setStarted(true);
                        setStepIndex(index);
                      }}
                      className={`font-display grid h-7 w-7 shrink-0 place-items-center rounded text-xs font-bold transition-colors ${
                        isCurrent
                          ? "bg-[#E8944A] text-white ring-2 ring-[#E8944A]/30"
                          : isPassed
                          ? "bg-[#7A9B76] text-white"
                          : "bg-[#12203A]/8 text-[#12203A]"
                      }`}
                      aria-label={`Select step ${index + 1}`}
                    >
                      0{index + 1}
                    </button>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="font-sans text-xs font-semibold text-[#12203A]">{step.text}</div>
                      <div className="flex items-center gap-2 font-mono text-[10px] text-[#5B6472]">
                        <span>{index === 0 ? "START CHECKPOINT" : index === detailedSteps.length - 1 ? "DESTINATION" : `LEG 0${index}`}</span>
                        <span>•</span>
                        <span>{step.remainingMetres} m left</span>
                      </div>
                    </div>
                    <ChevronRight className="mt-1 h-3.5 w-3.5 shrink-0 text-[#5B6472]" />
                  </li>
                );
              })}
            </ol>
          </div>

          <GoogleMiniMap
            from={{ x: entry?.mapX ?? 10, y: entry?.mapY ?? 84, label: entry?.name ?? "Entry" }}
            to={{ x: dest.mapX ?? 70, y: dest.mapY ?? 30, label: dest.name }}
            route={routeLocations.map((loc) => ({
              x: loc.mapX ?? 50,
              y: loc.mapY ?? 50,
              label: loc.name,
            }))}
            currentPos={currentPos}
          />

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setStarted((s) => !s);
                if (!started) setStepIndex(0);
              }}
              className="flex items-center justify-center gap-1.5 rounded-md bg-[#12203A] px-3 py-3 font-display text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#1E2D4A]"
            >
              {started ? <Pause className="h-4 w-4 text-[#E8944A]" /> : <Play className="h-4 w-4 text-[#E8944A]" />}
              {started ? "Pause Route" : "Start Route"}
            </button>

            <button
              onClick={() => {
                const nextSim = !simulating;
                setSimulating(nextSim);
                if (nextSim) {
                  setStarted(true);
                  setStepIndex(0);
                }
              }}
              className={`flex items-center justify-center gap-1.5 rounded-md border px-3 py-3 font-display text-xs font-bold uppercase tracking-wider shadow-sm transition-all ${
                simulating
                  ? "border-[#E8944A] bg-[#E8944A] text-white"
                  : "border-[#12203A]/20 bg-white text-[#12203A] hover:border-[#E8944A]"
              }`}
            >
              <Navigation className="h-4 w-4" />
              {simulating ? "Simulating..." : "Auto Walkthrough"}
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}

function TurnIcon({ action }: { action: TurnAction }) {
  switch (action) {
    case "turn-right":
      return <ArrowUpRight className="h-10 w-10" />;
    case "turn-left":
      return <ArrowUpLeft className="h-10 w-10" />;
    case "stairs":
    case "lift":
      return <Footprints className="h-10 w-10" />;
    case "arrive":
      return <CheckCircle2 className="h-10 w-10 text-[#7A9B76]" />;
    default:
      return <ArrowUp className="h-10 w-10" />;
  }
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#12203A]/14 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-1.5 font-display text-[10px] font-bold uppercase tracking-wider text-[#5B6472]">
        {icon} {label}
      </div>
      <div className="mt-1 font-display text-lg font-bold text-[#12203A]">{value}</div>
    </div>
  );
}

function GoogleMiniMap({
  from,
  to,
  route,
  currentPos,
}: {
  from: { x: number; y: number; label: string };
  to: { x: number; y: number; label: string };
  route: { x: number; y: number; label: string }[];
  currentPos: { x: number; y: number };
}) {
  const path = route.length
    ? route.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ")
    : `M ${from.x} ${from.y} L ${to.x} ${to.y}`;

  return (
    <div className="relative h-52 overflow-hidden rounded-xl border border-[#12203A]/14 bg-[#12203A] shadow-sm">
      <div className="absolute inset-0 bg-grid-dark" />
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <path
          d={path}
          fill="none"
          stroke="#E8944A"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="4 2"
          className="transition-all duration-700 ease-in-out"
        />
        <rect x="12" y="47" width="56" height="24" rx="2" fill="rgba(247, 245, 240, 0.08)" stroke="rgba(247, 245, 240, 0.2)" strokeWidth="0.5" />
        <rect x="58" y="72" width="32" height="18" rx="2" fill="rgba(247, 245, 240, 0.08)" stroke="rgba(247, 245, 240, 0.2)" strokeWidth="0.5" />
        <rect x="60" y="47" width="30" height="17" rx="2" fill="rgba(247, 245, 240, 0.08)" stroke="rgba(247, 245, 240, 0.2)" strokeWidth="0.5" />
        <rect x="58" y="25" width="32" height="21" rx="2" fill="rgba(247, 245, 240, 0.08)" stroke="rgba(247, 245, 240, 0.2)" strokeWidth="0.5" />
      </svg>

      {/* Static Route Checkpoint Pins */}
      <Pin x={from.x} y={from.y} label={from.label} tone="accent" />
      <Pin x={to.x} y={to.y} label={to.label} tone="primary" />

      {/* Live Animated Location Dot (Google Maps Style) */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out z-20"
        style={{ left: `${currentPos.x}%`, top: `${currentPos.y}%` }}
      >
        <div className="relative flex items-center justify-center">
          <div className="absolute h-8 w-8 animate-ping rounded-full bg-[#E8944A]/60" />
          <div className="grid h-5 w-5 place-items-center rounded-full border-2 border-white bg-[#E8944A] text-white shadow-lg">
            <div className="h-2 w-2 rounded-full bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Pin({
  x,
  y,
  label,
  tone,
}: {
  x: number;
  y: number;
  label: string;
  tone: "primary" | "accent";
}) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div
        className={`mx-auto grid h-5 w-5 place-items-center rounded-full border border-white ${
          tone === "primary" ? "bg-[#E8944A] text-white" : "bg-[#12203A] text-white"
        }`}
      >
        <MapPin className="h-3 w-3" />
      </div>
      <div className="mt-1 max-w-24 truncate rounded bg-[#12203A]/90 px-1.5 py-0.5 font-mono text-[9px] font-medium text-[#F7F5F0] shadow-sm">
        {label}
      </div>
    </div>
  );
}

