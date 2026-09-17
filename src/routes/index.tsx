import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  Compass,
  Footprints,
  GraduationCap,
  MapPin,
  MessageSquareText,
  Navigation,
  Printer,
  QrCode,
  Route as RouteIcon,
  Search,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { QrCodeCanvas } from "@/components/QrCodeCanvas";
import { CATEGORIES, type Location, useLocations } from "@/lib/locations";
import { clearEntryPoint, useEntryPoint } from "@/lib/entry-point";
import { getAbsoluteQrUrl } from "@/lib/url-utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Campus Navigator — Indoor QR Wayfinding System" },
      {
        name: "description",
        content:
          "Scan the QR code at the entrance, search your purpose or destination room, and follow indoor walking directions.",
      },
      { property: "og:title", content: "Smart Campus Navigator" },
      {
        property: "og:description",
        content: "Purpose-based indoor navigation system starting from QR checkpoints.",
      },
    ],
  }),
  component: Home,
});

const QUICK_SEARCH_CHIPS = [
  { label: "1st Bedroom", query: "1st Bedroom" },
  { label: "Kitchen", query: "Kitchen" },
  { label: "Dining Room", query: "Dining Room" },
  { label: "Bhagwan Room", query: "Bhagwan Room" },
  { label: "Bathroom", query: "Bathroom" },
  { label: "2nd Bedroom", query: "2nd Bedroom" },
];

const PURPOSES = [
  { label: "Rest & Study", query: "Bedroom", hint: "1st & 2nd Bedrooms", icon: Building2 },
  { label: "Food & Dining", query: "Food", hint: "Dining Room & Kitchen", icon: UserRound },
  { label: "Prayer & Peace", query: "Prayer", hint: "Bhagwan Room", icon: GraduationCap },
  { label: "Freshen Up", query: "Utility", hint: "Bathroom Route", icon: MessageSquareText },
  { label: "Sitting Area", query: "Living", hint: "Hall & Porch", icon: Search },
  { label: "Kitchen Access", query: "Kitchen", hint: "Shortest route via Dining", icon: MapPin },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Scan Checkpoint QR",
    text: "Scan the QR code placed at the main gate, entrance door, or hall checkpoint.",
    icon: QrCode,
  },
  {
    step: "02",
    title: "Search Room or Purpose",
    text: "Type where you want to go or pick a purpose (e.g. food, prayer, admissions, rest).",
    icon: Search,
  },
  {
    step: "03",
    title: "Follow Indoor Route",
    text: "Follow live Google Maps-style directional arrows, measured distances, and voice guidance.",
    icon: Navigation,
  },
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

  const qrTarget = getAbsoluteQrUrl("/qr/main-gate", originUrl);

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
    <div className="min-h-screen bg-[#F8FAFC] pb-24 text-[#12203A]">
      <AppHeader />

      {/* Pilot Context Bar */}
      <div className="border-b border-[#12203A]/10 bg-[#12203A] py-2 text-[#F7F5F0]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 text-xs font-sans">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#E8944A] animate-pulse" />
            <span className="font-semibold">PROOF-OF-CONCEPT DEMO:</span>
            <span className="text-[#8B98AD]">Home Pilot Layout (Scaling to SGSITS 35-Acre Campus)</span>
          </div>
          {entry && (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[#8B98AD]">Active Checkpoint:</span>
              <span className="font-display font-bold text-[#E8944A]">{entry.name}</span>
              <button
                onClick={() => clearEntryPoint()}
                className="text-[10px] text-[#8B98AD] hover:text-white underline ml-1"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 pt-6 space-y-10">
        {/* Modern Friendly Hero Section */}
        <section className="rounded-2xl border border-[#12203A]/12 bg-white p-6 sm:p-10 shadow-sm">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#12203A]/15 bg-[#F7F5F0] px-3 py-1 font-mono text-xs font-semibold text-[#12203A]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#E8944A]" />
              SMART CAMPUS INDOOR WAYFINDING
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-[#12203A] sm:text-5xl lg:text-5xl leading-tight">
              Find Any Room, Department, or Person — Instantly.
            </h1>
            <p className="mt-3 font-sans text-base text-[#5B6472] leading-relaxed">
              Outdoor maps stop at the gate. Smart Navigator guides visitors inside buildings using entrance QR checkpoints, intent-based search, and step-by-step physical distance routing.
            </p>
          </div>

          {/* Prominent Centerpiece Search Bar */}
          <div className="mt-8 rounded-xl border-2 border-[#12203A]/15 bg-[#F8FAFC] p-3 shadow-md focus-within:border-[#E8944A] transition-colors">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 shrink-0 text-[#E8944A]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Where do you want to go? (e.g. Kitchen, 1st Bedroom, Bhagwan Room)..."
                className="min-w-0 flex-1 bg-transparent font-sans text-sm font-medium text-[#12203A] placeholder:text-[#5B6472]/70 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="rounded-full p-1 text-[#5B6472] hover:bg-[#12203A]/10"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Quick Autocomplete Chips */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-[#12203A]/10 pt-2.5">
              <span className="font-display text-xs font-bold uppercase text-[#5B6472] mr-1">
                Quick Suggestions:
              </span>
              {QUICK_SEARCH_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => setQuery(chip.query)}
                  className={`rounded-md border px-2.5 py-1 font-sans text-xs font-medium transition-colors ${
                    query === chip.query
                      ? "border-[#12203A] bg-[#12203A] text-white"
                      : "border-[#12203A]/15 bg-white text-[#5B6472] hover:border-[#E8944A] hover:text-[#12203A]"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Action Split: Checkpoint QR Scanner + Architectural Floor Plan */}
        <section className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          {/* Main Gate QR Checkpoint Card */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#12203A]/12 bg-white p-6 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-display text-xs font-bold uppercase tracking-wider text-[#5B6472]">
                  ENTRY CHECKPOINT
                </span>
                <span className="rounded bg-[#E8944A]/15 px-2 py-0.5 font-mono text-[10px] font-bold text-[#E8944A]">
                  SCAN READY
                </span>
              </div>
              <h2 className="mt-1 font-display text-xl font-bold text-[#12203A]">Main Gate Signage</h2>
              <p className="mt-1 font-sans text-xs text-[#5B6472]">
                Placed at the entrance. Scanning opens the app with Main Gate set as your starting point.
              </p>

              <Link
                to="/qr/$id"
                params={{ id: "main-gate" }}
                title="Click to simulate QR scan"
                className="mt-4 grid place-items-center rounded-xl border border-[#12203A]/10 bg-[#F8FAFC] p-4 transition-transform hover:scale-102 shadow-xs"
              >
                <QrCodeCanvas value={qrTarget} size={190} label="Main Gate QR Code" />
              </Link>
              <div className="mt-2 text-center font-mono text-[11px] text-[#5B6472]">
                /qr/main-gate
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <Link
                to="/qr/$id"
                params={{ id: "main-gate" }}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-[#E8944A] px-4 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[#d88237]"
              >
                <Compass className="h-4 w-4" /> Simulate Entry Scan
              </Link>
              <Link
                to="/admin/qr"
                className="flex w-full items-center justify-center gap-2 rounded-md border border-[#12203A]/15 bg-[#F8FAFC] px-4 py-2 font-display text-xs font-bold uppercase tracking-wider text-[#12203A] hover:bg-[#12203A] hover:text-white"
              >
                <Printer className="h-3.5 w-3.5 text-[#E8944A]" /> Export Printable QRs
              </Link>
            </div>
          </div>

          {/* Interactive Architectural Blueprint Map */}
          <div className="rounded-2xl border border-[#12203A]/12 bg-[#12203A] p-6 text-[#F7F5F0] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-display text-xs font-bold uppercase tracking-widest text-[#8B98AD]">
                  BUILDING MAP GRAPH
                </span>
                <span className="font-mono text-xs text-[#E8944A]">{locations.length} LOCATIONS</span>
              </div>
              <h2 className="mt-1 font-display text-xl font-bold text-[#F7F5F0]">Home Layout Blueprint</h2>
              <p className="mt-1 font-sans text-xs text-[#8B98AD]">
                Connected rooms with measured indoor distances. Click any pin to view room specs or navigate.
              </p>
            </div>

            <div className="mt-4">
              <HomeMap locations={locations} />
            </div>
          </div>
        </section>

        {/* Purpose Cards Grid */}
        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-[#12203A]">Search by Visitors Purpose</h2>
              <p className="font-sans text-xs text-[#5B6472]">
                Visitors don&apos;t need to know room numbers — select your goal to calculate the shortest path.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PURPOSES.map((item) => {
              const Icon = item.icon;
              const isSelected = purpose === item.query;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setPurpose(isSelected ? "All" : item.query);
                    setQuery("");
                  }}
                  className={`flex items-start gap-3.5 rounded-xl border p-4 text-left transition-all ${
                    isSelected
                      ? "border-[#E8944A] bg-[#12203A] text-white shadow-md"
                      : "border-[#12203A]/12 bg-white text-[#12203A] hover:border-[#12203A]/30 hover:shadow-xs"
                  }`}
                >
                  <div
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${
                      isSelected ? "bg-[#E8944A] text-white" : "bg-[#12203A]/8 text-[#12203A]"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display text-sm font-bold">{item.label}</div>
                    <div
                      className={`mt-0.5 font-sans text-xs ${
                        isSelected ? "text-[#8B98AD]" : "text-[#5B6472]"
                      }`}
                    >
                      {item.hint}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Directory & Search Results Section */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#12203A]/10 pb-3">
            <div>
              <h2 className="font-display text-xl font-bold text-[#12203A]">
                {query || purpose !== "All" ? "Matching Search Results" : "Building Locations Directory"}
              </h2>
              <p className="font-sans text-xs text-[#5B6472]">
                Showing registered wayfinding nodes in the building graph.
              </p>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-1.5">
              {["All", ...CATEGORIES].map((c) => {
                const active = cat === c;
                return (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={`rounded-md border px-3 py-1 font-sans text-xs font-medium transition-colors ${
                      active
                        ? "border-[#12203A] bg-[#12203A] text-white"
                        : "border-[#12203A]/15 bg-white text-[#5B6472] hover:text-[#12203A]"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results List / Case B Error Handling */}
          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#E8944A]/40 bg-white p-8 text-center shadow-xs">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#12203A] text-[#E8944A]">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="mt-3 font-display text-base font-bold text-[#12203A]">
                Location &quot;{query || purpose}&quot; is not present in our building system.
              </h3>
              <p className="mt-1 font-sans text-xs text-[#5B6472] max-w-md mx-auto">
                We couldn&apos;t find a registered room or department matching this query in the active graph.
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
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((loc) => (
                <li key={loc.id}>
                  <LocationCard loc={loc} />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* How It Works Section */}
        <section className="rounded-2xl border border-[#12203A]/12 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-[#12203A]">How Smart Navigation Works</h2>
            <p className="mt-1 font-sans text-xs text-[#5B6472]">
              A seamless 3-step experience designed for campus visitors, students, and guests.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {HOW_IT_WORKS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="rounded-xl border border-[#12203A]/10 bg-[#F8FAFC] p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xs font-bold uppercase text-[#E8944A]">
                        STEP {item.step}
                      </span>
                      <div className="grid h-8 w-8 place-items-center rounded-md bg-[#12203A] text-white">
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>
                    <h3 className="mt-3 font-display text-base font-bold text-[#12203A]">{item.title}</h3>
                    <p className="mt-1 font-sans text-xs text-[#5B6472] leading-relaxed">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

function LocationCard({ loc }: { loc: Location }) {
  return (
    <div className="group flex flex-col justify-between rounded-xl border border-[#12203A]/14 bg-white p-4 transition-all hover:border-[#E8944A] hover:shadow-md h-full">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-[#12203A] text-white">
            {loc.image ? (
              <img src={loc.image} alt="" className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <MapPin className="h-5 w-5 text-[#E8944A]" />
            )}
          </div>
          <div className="flex flex-wrap justify-end gap-1">
            <span className="rounded bg-[#12203A]/8 px-2 py-0.5 font-mono text-[10px] font-bold text-[#12203A]">
              {loc.category}
            </span>
            {loc.building && (
              <span className="rounded bg-[#5B6472]/10 px-2 py-0.5 font-mono text-[10px] font-medium text-[#5B6472]">
                {loc.building}
              </span>
            )}
          </div>
        </div>

        <h3 className="mt-3 font-display text-base font-bold text-[#12203A] group-hover:text-[#E8944A] transition-colors">
          {loc.name}
        </h3>
        <p className="mt-1 line-clamp-2 font-sans text-xs text-[#5B6472]">
          {loc.purpose ?? loc.description}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#12203A]/10 pt-3">
        <span className="font-mono text-[10px] font-semibold text-[#5B6472]">
          {loc.floor ?? "Ground Floor"}
        </span>
        <Link
          to="/navigate/$id"
          params={{ id: loc.id }}
          className="inline-flex items-center gap-1 font-display text-xs font-bold uppercase tracking-wider text-[#E8944A] hover:text-[#12203A]"
        >
          Navigate Now <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
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
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="3 3"
        />
        <path
          d="M38 61 L73 86 M38 61 L27 38 M38 61 L36 27 L31 15"
          fill="none"
          stroke="#8B98AD"
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
          to="/navigate/$id"
          params={{ id: loc.id }}
          className="absolute grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white bg-[#E8944A] text-white shadow-sm transition-transform hover:scale-110"
          style={{ left: `${loc.mapX}%`, top: `${loc.mapY}%` }}
          title={`Navigate to ${loc.name}`}
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
