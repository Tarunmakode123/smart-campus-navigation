import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { LocationForm } from "@/components/LocationForm";

export const Route = createFileRoute("/admin/new")({
  head: () => ({ meta: [{ title: "New location — Smart Navigator" }] }),
  component: NewLocation,
});

function NewLocation() {
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
        <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-[#12203A]">New Location Registration</h1>
        <p className="mb-6 font-sans text-xs text-[#5B6472]">
          Register a new point in the building wayfinding graph.
        </p>
        <LocationForm />
      </div>
    </div>
  );
}
