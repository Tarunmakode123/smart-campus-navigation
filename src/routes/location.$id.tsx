import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  Clock,
  MapPin,
  Navigation,
  Phone,
  UserRound,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { getLocation, useLocations } from "@/lib/locations";

export const Route = createFileRoute("/location/$id")({
  head: ({ params }) => {
    const loc = typeof window !== "undefined" ? getLocation(params.id) : undefined;
    const title = loc ? `${loc.name} - Smart Navigator` : "Location - Smart Navigator";
    return {
      meta: [
        { title },
        { name: "description", content: loc?.description ?? "Location details" },
      ],
    };
  },
  component: LocationPage,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <h1 className="text-xl font-semibold">Location not found</h1>
        <Link to="/" className="mt-3 inline-block text-sm text-primary underline">
          Back to search
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-6 text-center text-sm text-destructive">{error.message}</div>
  ),
});

function LocationPage() {
  const { id } = Route.useParams();
  const all = useLocations();
  const loc = all.find((l) => l.id === id);

  if (!loc) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] pb-24">
        <AppHeader />
        <div className="mx-auto max-w-3xl px-4 pt-12 text-center">
          <h1 className="font-display text-xl font-bold text-[#12203A]">Location Not Found</h1>
          <p className="mt-2 font-sans text-xs text-[#5B6472]">
            The requested location could not be found in our building directory.
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

  return (
    <div className="min-h-screen bg-[#F7F5F0] pb-24">
      <AppHeader />

      <div className="mx-auto max-w-3xl px-4 pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-[#5B6472] hover:text-[#12203A]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Directory
        </Link>
      </div>

      <article className="mx-auto mt-3 max-w-3xl px-4">
        <div className="overflow-hidden rounded-xl border border-[#12203A]/14 bg-white shadow-sm">
          <div className="relative h-52 w-full bg-[#12203A] text-white sm:h-64">
            {loc.image && (
              <img src={loc.image} alt={loc.name} className="h-full w-full object-cover opacity-60" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#12203A] via-[#12203A]/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded bg-[#E8944A] px-2 py-0.5 font-mono text-[10px] font-bold text-white uppercase tracking-wider">
                  {loc.category}
                </span>
                {loc.building && (
                  <span className="rounded bg-white/20 px-2 py-0.5 font-mono text-[10px] font-medium text-white backdrop-blur">
                    BUILDING: {loc.building.toUpperCase()}
                  </span>
                )}
                {loc.floor && (
                  <span className="rounded bg-white/20 px-2 py-0.5 font-mono text-[10px] font-medium text-white backdrop-blur">
                    FLOOR: {loc.floor.toUpperCase()}
                  </span>
                )}
              </div>
              <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#F7F5F0] sm:text-3xl">
                {loc.name}
              </h1>
              {loc.department && <p className="mt-0.5 font-sans text-xs text-[#8B98AD]">{loc.department}</p>}
            </div>
          </div>

          <div className="space-y-4 p-5">
            <p className="font-sans text-sm leading-relaxed text-[#5B6472]">{loc.description}</p>

            <div className="grid gap-2 sm:grid-cols-2">
              {loc.purpose && (
                <InfoRow
                  icon={<BriefcaseBusiness className="h-4 w-4 text-[#E8944A]" />}
                  label="Work / Purpose"
                  value={loc.purpose}
                />
              )}
              {loc.person && (
                <InfoRow icon={<UserRound className="h-4 w-4 text-[#E8944A]" />} label="Contact Person" value={loc.person} />
              )}
              {loc.department && (
                <InfoRow
                  icon={<Building2 className="h-4 w-4 text-[#E8944A]" />}
                  label="Department"
                  value={loc.department}
                />
              )}
              {loc.floor && (
                <InfoRow icon={<Building2 className="h-4 w-4 text-[#E8944A]" />} label="Floor Level" value={loc.floor} />
              )}
              {loc.hours && (
                <InfoRow icon={<Clock className="h-4 w-4 text-[#E8944A]" />} label="Operating Hours" value={loc.hours} />
              )}
              {loc.contact && (
                <InfoRow icon={<Phone className="h-4 w-4 text-[#E8944A]" />} label="Phone / Extensions" value={loc.contact} />
              )}
              {loc.latitude != null && loc.longitude != null && (
                <InfoRow
                  icon={<MapPin className="h-4 w-4 text-[#E8944A]" />}
                  label="GPS Coordinates"
                  value={`${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}`}
                />
              )}
            </div>

            {loc.routeHint && (
              <div className="rounded-lg border border-[#E8944A]/30 bg-[#E8944A]/10 p-4">
                <div className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-[#12203A]">
                  <Navigation className="h-4 w-4 text-[#E8944A]" />
                  Route Preview & Walking Hint
                </div>
                <p className="mt-1.5 font-sans text-xs leading-relaxed text-[#5B6472]">{loc.routeHint}</p>
              </div>
            )}

            <Link
              to="/navigate/$id"
              params={{ id: loc.id }}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-[#E8944A] px-4 py-3 font-display text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#d88237] active:scale-[0.98]"
            >
              <Navigation className="h-4 w-4" />
              Start Guided Navigation
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-[#12203A]/14 bg-[#F7F5F0] p-3">
      <div className="grid h-7 w-7 shrink-0 place-items-center rounded bg-white text-[#12203A] border border-[#12203A]/10">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="font-display text-[10px] font-bold uppercase tracking-wider text-[#5B6472]">
          {label}
        </div>
        <div className="truncate font-sans text-xs font-semibold text-[#12203A]">{value}</div>
      </div>
    </div>
  );
}
