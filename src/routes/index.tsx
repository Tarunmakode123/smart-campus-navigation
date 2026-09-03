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
  const [originUrl, setOriginUrl] = useState("");
  const [query, setQuery] = useState("");
  const [purpose, setPurpose] = useState<string>("All");
  const [cat, setCat] = useState<string>("All");
  const [showMapDirectory, setShowMapDirectory] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOriginUrl(window.location.origin);
    }
  }, []);

  const qrTarget = originUrl ? `${originUrl}/qr/main-gate` : "/qr/main-gate";

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
        <section className="overflow-hidden rounded-2xl bg-[#12203A] text-[#F7F5F0] border border-[#12203A]/20 shadow-md">
          <div className="relative bg-grid-dark grid min-h-[calc(100vh-6.5rem)] gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-center lg:p-8">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-md border border-[#F7F5F0]/20 bg-[#1E2D4A] px-3 py-1 text-xs font-mono tracking-wide text-[#F7F5F0]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#E8944A]" />
                INDOOR WAYFINDING SYSTEM • PILOT V1
              </div>
              <h1 className="mt-4 font-display max-w-3xl text-3xl font-bold leading-tight sm:text-5xl lg:text-6xl text-[#F7F5F0]">
                Scan once. Find the right place. Follow the route.
              </h1>
              <p className="mt-4 max-w-2xl font-sans text-sm leading-relaxed text-[#8B98AD] sm:text-base">
                Smart Navigator turns complex campuses and buildings into QR-based walking guidance. Scan at the entrance, select your purpose or destination, and get clear step-by-step physical directions.
              </p>

              <div className="mt-6 grid gap-2.5 sm:grid-cols-3">
                {PILOT_STEPS.map((step, index) => (
                  <div
                    key={step}
                    className="rounded-lg border border-[#F7F5F0]/15 bg-[#1E2D4A]/80 p-3"
                  >
                    <div className="font-display grid h-7 w-7 place-items-center rounded bg-[#E8944A] text-xs font-bold text-white">
                      0{index + 1}
                    </div>
                    <div className="mt-2 font-sans text-xs font-semibold text-[#F7F5F0]">{step}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <Link
                  to="/qr/$id"
                  params={{ id: "main-gate" }}
                  className="inline-flex items-center gap-2 rounded-md bg-[#E8944A] px-4 py-2.5 text-xs font-bold tracking-wider uppercase text-white shadow-sm transition-colors hover:bg-[#d88237] active:scale-[0.98]"
                >
                  <Smartphone className="h-4 w-4" />
                  Try Main Gate Scan
                </Link>
                <Link
                  to="/admin/qr"
                  className="inline-flex items-center gap-2 rounded-md border border-[#F7F5F0]/20 bg-[#1E2D4A] px-4 py-2.5 text-xs font-bold tracking-wider uppercase text-[#F7F5F0] transition-colors hover:bg-[#F7F5F0]/10"
                >
                  <QrCode className="h-4 w-4" />
                  Print QR Codes
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-xl border border-[#F7F5F0]/15 bg-[#FFFFFF] p-4 text-[#12203A]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-display text-[10px] font-bold uppercase tracking-widest text-[#5B6472]">
                      ENTRY CHECKPOINT
                    </div>
                    <div className="font-display text-lg font-bold text-[#12203A]">Main Gate Entry</div>
                  </div>
                  <div className="grid h-9 w-9 place-items-center rounded bg-[#12203A] text-[#E8944A]">
                    <QrCode className="h-4 w-4" />
                  </div>
                </div>
                <Link
                  to="/qr/$id"
                  params={{ id: "main-gate" }}
                  title="Click to simulate QR scan"
                  className="mt-3 grid place-items-center rounded-lg border border-[#12203A]/10 bg-[#F7F5F0] p-3 transition-transform hover:scale-105"
                >
                  <QrCodeCanvas value={qrTarget} size={190} label="Main Gate navigation QR" />
                </Link>
                <Link
                  to="/qr/$id"
                  params={{ id: "main-gate" }}
                  className="mt-2 block font-mono text-center text-[10px] text-[#5B6472] hover:text-[#E8944A] hover:underline"
                >
                  /qr/main-gate (Click to Test)
                </Link>
              </div>
              <HomeMap locations={locations} />
            </div>
          </div>
        </section>

        {entry && (
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-[#E8944A]/40 bg-[#E8944A]/10 p-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded bg-[#E8944A] text-white">
              <QrCode className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-display text-[10px] font-bold uppercase tracking-wider text-[#12203A]/70">
                ACTIVE ENTRY POINT
              </div>
              <div className="truncate font-sans text-sm font-semibold text-[#12203A]">{entry.name}</div>
            </div>
            <button
              onClick={() => clearEntryPoint()}
              className="grid h-7 w-7 shrink-0 place-items-center rounded text-[#5B6472] hover:bg-[#12203A]/10 hover:text-[#12203A]"
              aria-label="Clear entry point"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <section className="mt-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="font-display text-xs font-bold uppercase tracking-widest text-[#E8944A]">
              WAYFINDING ARCHITECTURE
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#12203A] sm:text-3xl">
              People get lost because indoor spaces lack readable signage.
            </h2>
            <p className="mt-2 font-sans text-sm leading-relaxed text-[#5B6472] sm:text-base">
              Outdoor GPS stops at the building entrance. Smart Navigator uses QR checkpoints, mapped locations, and precise walking distances to guide visitors inside any campus.
            </p>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {VALUE_POINTS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-xl border border-[#12203A]/14 bg-white p-4 shadow-sm">
                  <div className="grid h-9 w-9 place-items-center rounded bg-[#12203A] text-[#E8944A]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="mt-3 font-display text-base font-bold text-[#12203A]">{item.title}</h3>
                  <p className="mt-1.5 font-sans text-xs leading-relaxed text-[#5B6472]">{item.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 rounded-xl border border-[#12203A]/14 bg-white p-4 shadow-sm">
            <div className="mb-2.5 flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-[#12203A]">
              <Search className="h-4 w-4 text-[#E8944A]" />
              Directory Search
            </div>
            <div className="flex items-center gap-2 rounded-md border border-[#12203A]/20 bg-[#F7F5F0] p-1.5 focus-within:border-[#E8944A]">
              <Search className="ml-2 h-4 w-4 shrink-0 text-[#5B6472]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search room, building, department or purpose..."
                className="min-w-0 flex-1 bg-transparent py-1.5 font-sans text-sm text-[#12203A] placeholder:text-[#5B6472] focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-[#12203A]">Where do you want to go?</h2>
              <p className="font-sans text-xs text-[#5B6472]">
                Select a purpose or filter by category below.
              </p>
            </div>
            {purpose !== "All" && (
              <button
                onClick={() => setPurpose("All")}
                className="font-mono text-xs font-semibold text-[#E8944A] hover:underline"
              >
                Reset Filter
              </button>
            )}
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {PURPOSES.map((item) => {
              const Icon = item.icon;
              const active = purpose === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => setPurpose(item.label)}
                  className={`flex min-h-16 items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                    active
                      ? "border-[#E8944A] bg-[#12203A] text-white shadow-sm"
                      : "border-[#12203A]/14 bg-white text-[#12203A] hover:border-[#12203A]/30"
                  }`}
                >
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded ${
                      active ? "bg-[#E8944A] text-white" : "bg-[#12203A]/8 text-[#12203A]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-xs font-bold">{item.label}</span>
                    <span
                      className={`mt-0.5 block font-sans text-[11px] ${
                        active ? "text-[#8B98AD]" : "text-[#5B6472]"
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

        <section className="mt-8">
          <div className="-mx-4 mb-4 overflow-x-auto px-4">
            <div className="flex gap-1.5">
              {["All", ...CATEGORIES].map((c) => {
                const active = cat === c;
                return (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={`shrink-0 rounded-md border px-3 py-1 font-sans text-xs font-medium transition-all ${
                      active
                        ? "border-[#12203A] bg-[#12203A] text-white"
                        : "border-[#12203A]/14 bg-white text-[#5B6472] hover:text-[#12203A] hover:border-[#12203A]/30"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-[#12203A]">
              {query || purpose !== "All" ? "Matching Locations" : "Campus & Building Directory"}
            </h2>
            <span className="font-mono text-xs text-[#5B6472]">{results.length} locations</span>
          </div>

          {results.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#E8944A]/40 bg-[#E8944A]/5 p-8 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#12203A] text-[#E8944A]">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="mt-3 font-display text-base font-bold text-[#12203A]">
                Location &quot;{query || purpose}&quot; is not present in our building system.
              </h3>
              <p className="mt-1 font-sans text-xs text-[#5B6472]">
                We couldn&apos;t find an exact match for this room or department in our active graph.
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <button
                  onClick={() => setShowMapDirectory((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-md bg-[#12203A] px-4 py-2 font-display text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#1E2D4A]"
                >
                  <RouteIcon className="h-4 w-4 text-[#E8944A]" />
                  {showMapDirectory ? "Hide Interactive Map" : "View Interactive Map Directory"}
                </button>
                <button
                  onClick={() => {
                    setQuery("");
                    setPurpose("All");
                    setCat("All");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[#12203A]/20 bg-white px-3.5 py-2 font-sans text-xs font-semibold text-[#5B6472] hover:text-[#12203A]"
                >
                  Clear Search
                </button>
              </div>

              {showMapDirectory && (
                <div className="mt-6 text-left">
                  <div className="mb-2 font-display text-xs font-bold uppercase text-[#12203A]">
                    Select Available Location From Blueprint Map:
                  </div>
                  <HomeMap locations={locations} />
                </div>
              )}
            </div>
          ) : (
            <ul className="grid gap-2.5 md:grid-cols-2">
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
      className="group grid h-full grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-[#12203A]/14 bg-white p-3 transition-all hover:border-[#E8944A] hover:shadow-sm"
    >
      <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-md bg-[#12203A] text-[#F7F5F0]">
        {loc.image ? (
          <img src={loc.image} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <MapPin className="h-5 w-5 text-[#E8944A]" />
        )}
      </div>
      <div className="min-w-0">
        <div className="truncate font-display text-xs font-bold text-[#12203A]">{loc.name}</div>
        <div className="mt-0.5 truncate font-sans text-xs text-[#5B6472]">
          {loc.purpose ?? loc.description}
        </div>
        <div className="mt-1.5 flex flex-wrap gap-1">
          <span className="rounded bg-[#12203A]/8 px-2 py-0.5 font-mono text-[10px] font-medium text-[#12203A]">
            {loc.category}
          </span>
          {loc.building && (
            <span className="rounded bg-[#5B6472]/10 px-2 py-0.5 font-mono text-[10px] font-medium text-[#5B6472]">
              {loc.building}
            </span>
          )}
          {loc.floor && (
            <span className="rounded bg-[#5B6472]/10 px-2 py-0.5 font-mono text-[10px] font-medium text-[#5B6472]">
              {loc.floor}
            </span>
          )}
        </div>
      </div>
      <div className="grid h-8 w-8 place-items-center rounded bg-[#F7F5F0] text-[#12203A] transition-colors group-hover:bg-[#E8944A] group-hover:text-white">
        <ArrowRight className="h-3.5 w-3.5" />
      </div>
    </Link>
  );
}

function HomeMap({ locations }: { locations: Location[] }) {
  const plotted = locations.filter((l) => l.mapX != null && l.mapY != null);

  return (
    <div className="relative min-h-72 overflow-hidden rounded-xl border border-[#F7F5F0]/15 bg-[#12203A]">
      <div className="absolute inset-0 bg-grid-dark" />
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <path
          d="M34 93 L38 61 L73 61 L77 58 L72 34 L72 15"
          fill="none"
          stroke="#E8944A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="3 3"
        />
        <path
          d="M38 61 L73 86 M38 61 L27 38 M38 61 L36 27 L31 15"
          fill="none"
          stroke="#5B6472"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="2 2"
        />
        <rect x="12" y="47" width="56" height="24" rx="2" fill="rgba(247, 245, 240, 0.08)" stroke="rgba(247, 245, 240, 0.2)" strokeWidth="0.5" />
        <rect x="58" y="72" width="32" height="18" rx="2" fill="rgba(247, 245, 240, 0.08)" stroke="rgba(247, 245, 240, 0.2)" strokeWidth="0.5" />
        <rect x="60" y="47" width="30" height="17" rx="2" fill="rgba(247, 245, 240, 0.08)" stroke="rgba(247, 245, 240, 0.2)" strokeWidth="0.5" />
        <rect x="58" y="25" width="32" height="21" rx="2" fill="rgba(247, 245, 240, 0.08)" stroke="rgba(247, 245, 240, 0.2)" strokeWidth="0.5" />
      </svg>
      <div className="absolute left-3 top-3">
        <p className="font-display text-[10px] font-bold uppercase tracking-widest text-[#8B98AD]">
          ARCHITECTURAL MAP VIEW
        </p>
        <h2 className="font-display text-base font-bold text-[#F7F5F0]">Main Gate to Rooms</h2>
      </div>
      {plotted.map((loc) => (
        <Link
          key={loc.id}
          to="/location/$id"
          params={{ id: loc.id }}
          className="absolute grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white bg-[#E8944A] text-white shadow-sm transition-transform hover:scale-110"
          style={{ left: `${loc.mapX}%`, top: `${loc.mapY}%` }}
          title={loc.name}
        >
          <MapPin className="h-3 w-3" />
        </Link>
      ))}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 rounded-md border border-[#F7F5F0]/15 bg-[#1E2D4A]/90 p-2.5 text-xs text-[#F7F5F0] backdrop-blur">
        <div>
          <div className="font-display text-xs font-bold text-[#F7F5F0]">Scan • Select • Navigate</div>
          <div className="font-sans text-[11px] text-[#8B98AD]">Indoor routing graph powered by verified metres.</div>
        </div>
        <Navigation className="h-4 w-4 shrink-0 text-[#E8944A]" />
      </div>
    </div>
  );
}
