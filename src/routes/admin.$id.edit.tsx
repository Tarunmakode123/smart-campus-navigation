import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { LocationForm } from "@/components/LocationForm";
import { useLocations } from "@/lib/locations";

export const Route = createFileRoute("/admin/$id/edit")({
  head: () => ({ meta: [{ title: "Edit location — Smart Navigator" }] }),
  component: EditLocation,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center text-sm">Not found</div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-6 text-center text-sm text-destructive">{error.message}</div>
  ),
});

function EditLocation() {
  const { id } = Route.useParams();
  const all = useLocations();
  const loc = all.find((l) => l.id === id);
  if (!loc) throw notFound();

  return (
    <div className="min-h-screen bg-[#F7F5F0] pb-24">
      <AppHeader showAdmin={false} />
      <div className="mx-auto max-w-2xl px-4 pt-4">
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-[#5B6472] hover:text-[#12203A]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Directory Admin
        </Link>
        <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-[#12203A]">Edit Location: {loc.name}</h1>
        <p className="mb-6 font-sans text-xs text-[#5B6472]">Update coordinates, details, and metadata.</p>
        <LocationForm initial={loc} />
      </div>
    </div>
  );
}
