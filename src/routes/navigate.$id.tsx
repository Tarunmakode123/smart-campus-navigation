import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Footprints,
  MapPin,
  Mic,
  MicOff,
  Navigation,
  Play,
  Ruler,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useLocations } from "@/lib/locations";
import { useEntryPoint } from "@/lib/entry-point";
import {
  buildRouteSteps,
  calculateHomeRoute,
  DEFAULT_ENTRY_ID,
  formatMetres,
} from "@/lib/home-navigation";

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
  if (!dest) throw notFound();

  const entryId = useEntryPoint();
  const entry =
    all.find((l) => l.id === entryId) ?? all.find((l) => l.id === DEFAULT_ENTRY_ID) ?? all[0];
  const [started, setStarted] = useState(false);
  const [voice, setVoice] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);

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
  const steps = buildRouteSteps(route, all);
  const minutes = Math.max(1, Math.ceil(route.totalMetres / 60));
  const currentStep = steps[Math.min(stepIndex, steps.length - 1)];
  const progress = Math.round(((stepIndex + 1) / steps.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-subtle pb-24">
      <AppHeader />

      <div className="mx-auto max-w-5xl px-4 pt-4">
        <Link
          to="/location/$id"
          params={{ id: dest.id }}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to {dest.name}
        </Link>
      </div>

      <main className="mx-auto mt-4 grid max-w-5xl gap-4 px-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="overflow-hidden rounded-xl border border-[#12203A]/20 bg-[#12203A] text-[#F7F5F0] shadow-md">
          <div className="relative h-[480px] bg-grid-dark text-white">
            {dest.image && (
              <img
                src={dest.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-25"
              />
            )}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_0,rgba(18,32,58,0.3)_34%,rgba(18,32,58,0.95)_80%)]" />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3.5">
              <div className="rounded-md border border-[#F7F5F0]/20 bg-[#1E2D4A]/90 px-3 py-1 font-mono text-[11px] font-semibold text-[#F7F5F0] backdrop-blur">
                WAYFINDING TERMINAL • {entry?.building ?? "HOME"}
              </div>
              <button
                onClick={() => setVoice((v) => !v)}
                className="grid h-9 w-9 place-items-center rounded-md border border-[#F7F5F0]/20 bg-[#1E2D4A] text-[#F7F5F0] backdrop-blur hover:bg-[#E8944A]"
                aria-label={voice ? "Turn voice guidance off" : "Turn voice guidance on"}
              >
                {voice ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </button>
            </div>

            <div className="absolute left-1/2 top-[34%] -translate-x-1/2 text-center w-11/12 max-w-sm">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-white/20 bg-[#E8944A] text-white shadow-lg">
                <Navigation className="h-9 w-9" />
              </div>
              <div className="mt-3 rounded-lg border border-[#F7F5F0]/20 bg-[#12203A]/90 p-3 backdrop-blur">
                <div className="font-display text-[10px] font-bold uppercase tracking-widest text-[#8B98AD]">
                  CURRENT DIRECTION STEP
                </div>
                <div className="mt-1 font-sans text-base font-bold text-[#F7F5F0]">{currentStep}</div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-3.5">
              <div className="rounded-xl border border-[#12203A]/20 bg-white p-4 text-[#12203A] shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-display text-[10px] font-bold uppercase tracking-widest text-[#5B6472]">
                      TARGET DESTINATION
                    </div>
                    <h1 className="mt-0.5 truncate font-display text-lg font-bold text-[#12203A]">{dest.name}</h1>
                    <p className="mt-0.5 font-sans text-xs text-[#5B6472]">
                      From {entry?.name ?? "Main Gate"} ({dest.building ?? "Home"} • {dest.floor ?? "Ground Floor"})
                    </p>
                  </div>
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[#12203A] text-[#E8944A]">
                    <MapPin className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F7F5F0]">
                  <div
                    className="h-full rounded-full bg-[#E8944A] transition-all duration-500"
                    style={{ width: `${started ? progress : 10}%` }}
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
              label="Distance"
              value={formatMetres(route.totalMetres)}
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
                Physical Route Steps
              </h2>
              <span className="font-mono text-[10px] font-semibold text-[#5B6472]">{steps.length} STOPS</span>
            </div>
            <ol className="mt-3 space-y-2.5">
              {steps.map((step, index) => {
                const isCurrent = index === stepIndex && started;
                const isPassed = index < stepIndex && started;
                return (
                  <li key={step} className="flex items-start gap-2.5">
                    <button
                      onClick={() => {
                        setStarted(true);
                        setStepIndex(index);
                      }}
                      className={`font-display grid h-7 w-7 shrink-0 place-items-center rounded text-xs font-bold transition-colors ${
                        isCurrent
                          ? "bg-[#E8944A] text-white"
                          : isPassed
                          ? "bg-[#7A9B76] text-white"
                          : "bg-[#12203A]/8 text-[#12203A]"
                      }`}
                      aria-label={`Select step ${index + 1}`}
                    >
                      0{index + 1}
                    </button>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="font-sans text-xs font-semibold text-[#12203A]">{step}</div>
                      <div className="font-mono text-[10px] text-[#5B6472]">
                        {index === 0 ? "START CHECKPOINT" : index === steps.length - 1 ? "FINAL DESTINATION" : `LEG 0${index}`}
                      </div>
                    </div>
                    <ChevronRight className="mt-1 h-3.5 w-3.5 shrink-0 text-[#5B6472]" />
                  </li>
                );
              })}
            </ol>
          </div>

          <MiniMap
            from={{ x: entry?.mapX ?? 10, y: entry?.mapY ?? 84, label: entry?.name ?? "Entry" }}
            to={{ x: dest.mapX ?? 70, y: dest.mapY ?? 30, label: dest.name }}
            route={routeLocations.map((loc) => ({
              x: loc.mapX ?? 50,
              y: loc.mapY ?? 50,
              label: loc.name,
            }))}
          />

          <button
            onClick={() => {
              setStarted((s) => !s);
              if (!started) setStepIndex(0);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-[#E8944A] px-4 py-3 font-display text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#d88237] active:scale-[0.98]"
          >
            {started ? <Navigation className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {started ? "Navigation Active" : "Start Guided Navigation"}
          </button>
        </aside>
      </main>
    </div>
  );
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

function MiniMap({
  from,
  to,
  route,
}: {
  from: { x: number; y: number; label: string };
  to: { x: number; y: number; label: string };
  route: { x: number; y: number; label: string }[];
}) {
  const path = route.length
    ? route.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ")
    : `M ${from.x} ${from.y} L ${to.x} ${to.y}`;

  return (
    <div className="relative h-48 overflow-hidden rounded-xl border border-[#12203A]/14 bg-[#12203A] shadow-sm">
      <div className="absolute inset-0 bg-grid-dark" />
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <path
          d={path}
          fill="none"
          stroke="#E8944A"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="4 2"
          className="transition-all duration-700 ease-in-out"
        />
        <rect x="12" y="47" width="56" height="24" rx="2" fill="rgba(247, 245, 240, 0.08)" stroke="rgba(247, 245, 240, 0.2)" strokeWidth="0.5" />
        <rect x="58" y="72" width="32" height="18" rx="2" fill="rgba(247, 245, 240, 0.08)" stroke="rgba(247, 245, 240, 0.2)" strokeWidth="0.5" />
        <rect x="60" y="47" width="30" height="17" rx="2" fill="rgba(247, 245, 240, 0.08)" stroke="rgba(247, 245, 240, 0.2)" strokeWidth="0.5" />
        <rect x="58" y="25" width="32" height="21" rx="2" fill="rgba(247, 245, 240, 0.08)" stroke="rgba(247, 245, 240, 0.2)" strokeWidth="0.5" />
      </svg>
      {route.slice(1, -1).map((point) => (
        <Pin key={point.label} x={point.x} y={point.y} label={point.label} tone="accent" />
      ))}
      <Pin x={from.x} y={from.y} label={from.label} tone="accent" />
      <Pin x={to.x} y={to.y} label={to.label} tone="primary" />
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
        className={`mx-auto grid h-6 w-6 place-items-center rounded-full border border-white ${
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

