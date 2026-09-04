import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Edit3, Plus, QrCode, RotateCcw, Trash2 } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { deleteLocation, resetLocations, useLocations } from "@/lib/locations";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin — Smart Navigator" }] }),
  component: AdminPage,
});

function AdminPage() {
  const locations = useLocations();

  return (
    <div className="min-h-screen bg-[#F7F5F0] pb-24">
      <AppHeader showAdmin={false} />

      <div className="mx-auto max-w-4xl px-4 pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-[#5B6472] hover:text-[#12203A]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Directory
        </Link>
      </div>

      <main className="mx-auto max-w-4xl px-4 pt-3">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-[#12203A]/14 bg-white p-4 shadow-sm">
          <div className="min-w-0">
            <h1 className="font-display text-xl font-bold tracking-tight text-[#12203A]">Directory Admin & Locations</h1>
            <p className="font-sans text-xs text-[#5B6472]">
              {locations.length} registered location{locations.length === 1 ? "" : "s"} in graph
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/admin/qr"
              className="inline-flex items-center gap-1.5 rounded-md border border-[#12203A]/20 bg-[#12203A] px-3.5 py-2 font-display text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#1E2D4A]"
            >
              <QrCode className="h-4 w-4 text-[#E8944A]" /> Export QRs
            </Link>
            <Link
              to="/admin/new"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#E8944A] px-3.5 py-2 font-display text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#d88237]"
            >
              <Plus className="h-4 w-4" /> Add Location
            </Link>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-[#12203A]/14 bg-white p-3 shadow-sm hover:border-[#12203A]/30"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded bg-[#12203A] text-white">
                  {loc.image ? (
                    <img src={loc.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="font-display text-sm font-bold text-[#E8944A]">{loc.name[0]}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="truncate font-display text-xs font-bold text-[#12203A]">{loc.name}</div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-1 font-mono text-[10px] text-[#5B6472]">
                    <span className="rounded bg-[#12203A]/8 px-1.5 py-0.2 text-[#12203A]">{loc.category}</span>
                    <span>•</span>
                    <span>{loc.building ?? "Home"}</span>
                    <span>•</span>
                    <span>{loc.floor ?? "Ground"}</span>
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Link
                  to="/admin/$id/edit"
                  params={{ id: loc.id }}
                  className="grid h-8 w-8 place-items-center rounded border border-[#12203A]/14 bg-[#F7F5F0] text-[#12203A] hover:bg-[#12203A] hover:text-white"
                  aria-label="Edit"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </Link>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${loc.name}"?`)) {
                      deleteLocation(loc.id);
                      toast.success("Location deleted");
                    }
                  }}
                  className="grid h-8 w-8 place-items-center rounded border border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                  aria-label="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            if (confirm("Reset to demo data? Your changes will be lost.")) {
              resetLocations();
              toast.success("Reset to demo data");
            }
          }}
          className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs text-[#5B6472] hover:text-[#12203A]"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset to default seed locations
        </button>
      </main>
    </div>
  );
}
