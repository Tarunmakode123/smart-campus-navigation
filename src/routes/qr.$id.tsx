import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, MapPin, Navigation, Search } from "lucide-react";
import { useLocations } from "@/lib/locations";
import { setEntryPoint } from "@/lib/entry-point";

export const Route = createFileRoute("/qr/$id")({
  head: () => ({ meta: [{ title: "Welcome — Smart Navigator" }] }),
  component: QrLanding,
  errorComponent: ({ error }) => (
    <div className="p-6 text-center text-sm text-destructive">{error.message}</div>
  ),
});

function QrLanding() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const all = useLocations();
  const loc = all.find((l) => l.id === id);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");
  const [showMapModal, setShowMapModal] = useState(false);

  useEffect(() => {
    if (loc) setEntryPoint(loc.id);
    setReady(true);
  }, [loc]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return all.filter((l) => {
      const haystack = [l.name, l.description, l.category, l.purpose, l.person, l.department]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [all, query]);

  if (!ready) return null;
  if (!loc) return <Navigate to="/" />;

  return (
    <div className="grid min-h-screen place-items-center bg-[#12203A] bg-grid-dark p-4 text-[#F7F5F0]">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border-2 border-white/20 bg-[#E8944A] text-white shadow-xl">
          <MapPin className="h-7 w-7" />
        </div>
        <p className="mt-4 font-display text-xs font-bold uppercase tracking-widest text-[#8B98AD]">
          YOU ARE AT CHECKPOINT
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-[#F7F5F0]">{loc.name}</h1>
        <p className="mt-1 font-sans text-xs text-[#8B98AD]">
          Scan verified at {loc.building ?? "Home"} ({loc.floor ?? "Ground Floor"}). Where do you want to go?
        </p>

        {/* Instant Search Bar */}
        <div className="mt-5 rounded-xl border border-[#F7F5F0]/20 bg-[#1E2D4A] p-2 text-left shadow-lg">
          <div className="flex items-center gap-2 rounded-md border border-[#F7F5F0]/15 bg-[#12203A] p-2 focus-within:border-[#E8944A]">
            <Search className="h-4 w-4 shrink-0 text-[#8B98AD]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type destination (e.g. Kitchen, Bhagwan Room)..."
              className="min-w-0 flex-1 bg-transparent font-sans text-xs text-[#F7F5F0] placeholder:text-[#8B98AD] focus:outline-none"
            />
          </div>

          {/* Search Results / Case A vs Case B */}
          {query.trim() !== "" && (
            <div className="mt-2.5 space-y-1.5 border-t border-[#F7F5F0]/10 pt-2.5">
              {searchResults.length > 0 ? (
                /* Case A: Location Found */
                <div>
                  <div className="mb-1 font-display text-[10px] font-bold uppercase tracking-wider text-[#8B98AD]">
                    Matching Destinations Found ({searchResults.length}):
                  </div>
                  <div className="space-y-1">
                    {searchResults.map((dest) => (
                      <Link
                        key={dest.id}
                        to="/navigate/$id"
                        params={{ id: dest.id }}
                        className="flex items-center justify-between rounded-md border border-[#F7F5F0]/10 bg-[#12203A] p-2.5 transition-colors hover:border-[#E8944A] hover:bg-[#1E2D4A]"
                      >
                        <div className="min-w-0 text-left">
                          <div className="font-display text-xs font-bold text-[#F7F5F0]">{dest.name}</div>
                          <div className="font-sans text-[10px] text-[#8B98AD]">{dest.purpose ?? dest.category}</div>
                        </div>
                        <div className="flex items-center gap-1 font-display text-[10px] font-bold uppercase text-[#E8944A]">
                          Navigate <ArrowRight className="h-3 w-3" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                /* Case B: Location NOT Present Error Card */
                <div className="rounded-md border border-[#E8944A]/40 bg-[#E8944A]/10 p-3 text-center">
                  <div className="font-display text-xs font-bold text-[#F7F5F0]">
                    Location &quot;{query}&quot; is not present in our building system.
                  </div>
                  <p className="mt-1 font-sans text-[11px] text-[#8B98AD]">
                    This location is not registered in our indoor routing graph.
                  </p>
                  <button
                    onClick={() => setShowMapModal((v) => !v)}
                    className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded bg-[#E8944A] py-2 font-display text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#d88237]"
                  >
                    <Navigation className="h-3.5 w-3.5" />
                    {showMapModal ? "Hide Map Directory" : "View Interactive Map Directory"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Map Directory View when toggled */}
        {showMapModal && (
          <div className="mt-4 rounded-xl border border-[#F7F5F0]/20 bg-[#1E2D4A] p-3 text-left">
            <div className="mb-2 font-display text-xs font-bold uppercase text-[#F7F5F0]">
              All Registered Building Locations:
            </div>
            <div className="grid gap-1.5 max-h-48 overflow-y-auto pr-1">
              {all.map((item) => (
                <Link
                  key={item.id}
                  to="/navigate/$id"
                  params={{ id: item.id }}
                  className="flex items-center justify-between rounded border border-[#F7F5F0]/10 bg-[#12203A] p-2 font-sans text-xs text-[#F7F5F0] hover:border-[#E8944A]"
                >
                  <span>{item.name} ({item.category})</span>
                  <ArrowRight className="h-3 w-3 text-[#E8944A]" />
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 space-y-2">
          <Link
            to="/"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-[#E8944A] px-4 py-3 font-display text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[#d88237]"
          >
            <Search className="h-4 w-4" /> Browse Full Directory
          </Link>
          <Link
            to="/location/$id"
            params={{ id: loc.id }}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-[#F7F5F0]/20 bg-[#1E2D4A] px-4 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-[#F7F5F0] transition-colors hover:bg-[#F7F5F0]/10"
          >
            <Navigation className="h-4 w-4 text-[#E8944A]" /> About {loc.name}
          </Link>
        </div>
      </div>
    </div>
  );
}
