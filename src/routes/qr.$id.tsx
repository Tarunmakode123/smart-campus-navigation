import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, Navigation, Search } from "lucide-react";
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
  const all = useLocations();
  const loc = all.find((l) => l.id === id);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loc) setEntryPoint(loc.id);
    setReady(true);
  }, [loc]);

  if (!ready) return null;
  if (!loc) return <Navigate to="/" />;

  return (
    <div className="grid min-h-screen place-items-center bg-[#12203A] bg-grid-dark p-6 text-[#F7F5F0]">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-white/20 bg-[#E8944A] text-white shadow-lg">
          <MapPin className="h-7 w-7" />
        </div>
        <p className="mt-4 font-display text-xs font-bold uppercase tracking-widest text-[#8B98AD]">
          YOU ARE AT CHECKPOINT
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-[#F7F5F0]">{loc.name}</h1>
        <p className="mt-2 font-sans text-xs text-[#8B98AD]">
          Welcome to Smart Navigator. Choose your target room or purpose to receive immediate indoor directions.
        </p>

        <div className="mt-6 space-y-2.5">
          <Link
            to="/"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-[#E8944A] px-4 py-3 font-display text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[#d88237]"
          >
            <Search className="h-4 w-4" /> Search Building Directory
          </Link>
          <Link
            to="/location/$id"
            params={{ id: loc.id }}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-[#F7F5F0]/20 bg-[#1E2D4A] px-4 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-[#F7F5F0] transition-colors hover:bg-[#F7F5F0]/10"
          >
            <Navigation className="h-4 w-4 text-[#E8944A]" /> Location Details
          </Link>
        </div>
      </div>
    </div>
  );
}
