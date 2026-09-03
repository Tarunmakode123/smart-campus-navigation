import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  GraduationCap,
  MapPin,
  MessageSquareText,
  Navigation,
  QrCode,
  Route as RouteIcon,
  Search,
  ShieldCheck,
  Smartphone,
  UserRound,
  X,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { QrCodeCanvas } from "@/components/QrCodeCanvas";
import { CATEGORIES, type Location, useLocations } from "@/lib/locations";
import { clearEntryPoint, useEntryPoint } from "@/lib/entry-point";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home Navigation Pilot - Smart Navigator" },
      {
        name: "description",
        content:
          "Scan the Main Gate QR, choose a room or purpose, and get indoor walking directions.",
      },
      { property: "og:title", content: "Home Navigation Pilot" },
      {
        property: "og:description",
        content: "Purpose-based indoor navigation starting from the Main Gate QR.",
      },
    ],
  }),
  component: Home,
});

const PURPOSES = [
  { label: "Rest", hint: "1st Bedroom or 2nd Bedroom", icon: Building2 },
  { label: "Food", hint: "Dining Room and Kitchen", icon: UserRound },
  { label: "Prayer", hint: "Bhagwan Room", icon: GraduationCap },
  { label: "Freshen up", hint: "Bathroom route", icon: MessageSquareText },
  { label: "Sitting area", hint: "Hall and Porch", icon: Search },
  { label: "Kitchen access", hint: "Shortest route via Dining Room", icon: MapPin },
];

const VALUE_POINTS = [
  {
    title: "No more asking directions",
    text: "Visitors scan one QR at the gate and understand where to go without calling someone.",
    icon: QrCode,
  },
  {
    title: "Purpose becomes destination",
    text: "The app can map 'food', 'prayer', 'meet person' or 'department work' to the right place.",
    icon: Search,
  },
  {
    title: "Shortest indoor route",
    text: "Routes are calculated from a real graph of rooms, corridors, gates and QR checkpoints.",
    icon: RouteIcon,
  },
];

const PILOT_STEPS = [
  "Scan Main Gate QR",
  "Choose room or purpose",
  "Follow measured route",
];

function Home() {
  const locations = useLocations();
  const entryId = useEntryPoint();
  const entry = locations.find((l) => l.id === entryId);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const qrTarget = origin ? `${origin}/qr/main-gate` : "/qr/main-gate";
  const [query, setQuery] = useState("");
  const [purpose, setPurpose] = useState<string>("All");
  const [cat, setCat] = useState<string>("All");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return locations.filter((l) => {
      const haystack = [
        l.name,
        l.description,
        l.category,
        l.purpose,
        l.person,
        l.department,
        l.routeHint,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchQ = !q || haystack.includes(q);
      const matchPurpose =
        purpose === "All" || haystack.includes(purpose.toLowerCase());
      const matchC = cat === "All" || l.category === cat;
      return matchQ && matchPurpose && matchC;
    });
  }, [locations, query, purpose, cat]);

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <AppHeader />

      <main className="mx-auto max-w-6xl px-4 pb-10 pt-4">
        <section className="overflow-hidden rounded-3xl bg-[linear-gradient(135deg,oklch(0.18_0.06_245)_0%,oklch(0.34_0.12_255)_48%,oklch(0.35_0.12_185)_100%)] text-white shadow-elegant">
          <div className="grid min-h-[calc(100vh-6.5rem)] gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center lg:p-9">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
                <ShieldCheck className="h-3.5 w-3.5" />
                Indoor navigation for campuses, offices and homes
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">
                Scan once. Find the right place. Follow the route.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/84 sm:text-lg">
                Smart Navigator turns confusing buildings into QR-based walking guidance. A visitor
                scans at the entry gate, chooses their work or destination, and gets the shortest
                indoor route with clear steps.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {PILOT_STEPS.map((step, index) => (
                  <div
                    key={step}
                    className="rounded-2xl border border-white/14 bg-white/10 p-3 backdrop-blur"
                  >
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-white text-primary">
                      {index + 1}
                    </div>
                    <div className="mt-3 text-sm font-semibold">{step}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Link
                  to="/qr/$id"
                  params={{ id: "main-gate" }}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-primary shadow-card transition-transform active:scale-[0.98]"
                >
                  <Smartphone className="h-4 w-4" />
                  Try Main Gate scan
                </Link>
                <Link
                  to="/admin/qr"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  <QrCode className="h-4 w-4" />
                  Print QR code
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl border border-white/15 bg-white p-4 text-foreground shadow-elegant">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Live pilot QR
                    </div>
                    <div className="text-lg font-bold">Main Gate Entry</div>
                  </div>
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
                    <QrCode className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 grid place-items-center rounded-2xl bg-secondary p-4">
                  <QrCodeCanvas value={qrTarget} size={210} label="Main Gate navigation QR" />
                </div>
                <div className="mt-3 break-all text-center text-[11px] text-muted-foreground">
                  /qr/main-gate
                </div>
              </div>
              <HomeMap locations={locations} />
            </div>
          </div>
        </section>

        {entry && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-accent/30 bg-accent/10 p-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
              <QrCode className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                QR scanned entry point
              </div>
              <div className="truncate text-sm font-semibold text-foreground">{entry.name}</div>
            </div>
            <button
              onClick={() => clearEntryPoint()}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Clear entry point"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <section className="mt-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-xs font-semibold uppercase tracking-wide text-primary">
              What we are solving
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              People get lost because buildings do not behave like Google Maps.
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Outdoor GPS stops helping at the gate. This product uses QR checkpoints, mapped
              rooms, and real walking distances to guide people inside private campuses and large
              buildings.
            </p>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {VALUE_POINTS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-2xl border border-border bg-card p-4 shadow-card">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 text-base font-bold tracking-tight">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-4 rounded-3xl border border-border bg-card p-4 shadow-card">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Search className="h-4 w-4 text-primary" />
              Live home pilot search
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-input bg-background p-2">
              <Search className="ml-2 h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search room, work, purpose or area"
                className="min-w-0 flex-1 bg-transparent py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </div>
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold tracking-tight">Where do you want to go?</h2>
              <p className="text-sm text-muted-foreground">
                Choose a purpose, then pick the matching room.
              </p>
            </div>
            {purpose !== "All" && (
              <button
                onClick={() => setPurpose("All")}
                className="text-xs font-medium text-primary hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {PURPOSES.map((item) => {
              const Icon = item.icon;
              const active = purpose === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => setPurpose(item.label)}
                  className={`flex min-h-20 items-center gap-3 rounded-2xl border p-3 text-left transition-all ${
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-elegant"
                      : "border-border bg-card text-foreground shadow-card hover:border-primary/30"
                  }`}
                >
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                      active ? "bg-white/15" : "bg-secondary text-primary"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{item.label}</span>
                    <span
                      className={`mt-0.5 block text-xs ${
                        active ? "text-primary-foreground/80" : "text-muted-foreground"
                      }`}
                    >
                      {item.hint}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-6">
          <div className="-mx-4 mb-4 overflow-x-auto px-4">
            <div className="flex gap-2">
              {["All", ...CATEGORIES].map((c) => {
                const active = cat === c;
                return (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                      active
                        ? "border-primary bg-primary text-primary-foreground shadow-card"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              {query || purpose !== "All" ? "Matching rooms" : "Home directory"}
            </h2>
            <span className="text-xs text-muted-foreground">{results.length} points</span>
          </div>

          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <MapPin className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                No room matches this search. Try a purpose, area or room name.
              </p>
            </div>
          ) : (
            <ul className="grid gap-3 md:grid-cols-2">
              {results.map((loc) => (
                <li key={loc.id}>
                  <LocationCard loc={loc} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

function LocationCard({ loc }: { loc: Location }) {
  return (
    <Link
      to="/location/$id"
      params={{ id: loc.id }}
      className="group grid h-full grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-elegant"
    >
      <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-hero text-primary-foreground">
        {loc.image ? (
          <img src={loc.image} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <MapPin className="h-5 w-5" />
        )}
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-foreground">{loc.name}</div>
        <div className="mt-1 truncate text-xs text-muted-foreground">
          {loc.purpose ?? loc.description}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
            {loc.category}
          </span>
          {loc.person && (
            <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
              {loc.person}
            </span>
          )}
        </div>
      </div>
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-primary transition-transform group-hover:translate-x-0.5">
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}

function HomeMap({ locations }: { locations: Location[] }) {
  const plotted = locations.filter((l) => l.mapX != null && l.mapY != null);

  return (
    <div className="relative min-h-80 overflow-hidden rounded-3xl border border-border bg-card shadow-card">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,oklch(0.94_0.012_240)_1px,transparent_1px),linear-gradient(0deg,oklch(0.94_0.012_240)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <path
          d="M34 93 L38 61 L73 61 L77 58 L72 34 L72 15"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray="3 3"
        />
        <path
          d="M38 61 L73 86 M38 61 L27 38 M38 61 L36 27 L31 15"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeDasharray="3 3"
        />
        <rect x="12" y="47" width="56" height="24" rx="2" fill="oklch(0.91 0.02 240 / 0.7)" />
        <rect x="58" y="72" width="32" height="18" rx="2" fill="oklch(0.91 0.02 240 / 0.7)" />
        <rect x="60" y="47" width="30" height="17" rx="2" fill="oklch(0.88 0.035 150 / 0.7)" />
        <rect x="58" y="25" width="32" height="21" rx="2" fill="oklch(0.89 0.04 85 / 0.7)" />
        <rect x="58" y="7" width="32" height="14" rx="2" fill="oklch(0.92 0.035 70 / 0.7)" />
        <rect x="12" y="20" width="42" height="16" rx="2" fill="oklch(0.9 0.035 260 / 0.7)" />
        <rect x="12" y="7" width="42" height="12" rx="2" fill="oklch(0.92 0.035 120 / 0.7)" />
        <rect x="12" y="36" width="24" height="10" rx="2" fill="oklch(0.92 0.035 210 / 0.7)" />
      </svg>
      <div className="absolute left-4 top-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Home pilot map
        </p>
        <h2 className="text-xl font-bold tracking-tight">Main Gate to rooms</h2>
      </div>
      {plotted.map((loc) => (
        <Link
          key={loc.id}
          to="/location/$id"
          params={{ id: loc.id }}
          className="absolute grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow-elegant"
          style={{ left: `${loc.mapX}%`, top: `${loc.mapY}%` }}
          title={loc.name}
        >
          <MapPin className="h-3.5 w-3.5" />
        </Link>
      ))}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-2xl bg-white/90 p-3 text-xs shadow-card backdrop-blur">
        <div>
          <div className="font-semibold text-foreground">Scan, choose work, follow route</div>
          <div className="text-muted-foreground">Routes use your measured distances.</div>
        </div>
        <Navigation className="h-5 w-5 shrink-0 text-primary" />
      </div>
    </div>
  );
}
