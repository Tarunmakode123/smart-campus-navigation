import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Printer, QrCode } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { QrCodeCanvas } from "@/components/QrCodeCanvas";
import { useLocations } from "@/lib/locations";

export const Route = createFileRoute("/admin/qr")({
  head: () => ({ meta: [{ title: "QR Codes — Smart Navigator" }] }),
  component: QrCodesPage,
});

function QrCodesPage() {
  const locations = useLocations();
  const entryLocations = locations.filter((loc) => loc.id === "main-gate");
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="min-h-screen bg-[#F7F5F0] pb-24">
      <AppHeader showAdmin={false} />

      <div className="mx-auto max-w-3xl px-4 pt-4 print:hidden">
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-[#5B6472] hover:text-[#12203A]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Directory Admin
        </Link>
      </div>

      <main className="mx-auto max-w-2xl px-4 pt-3">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 print:hidden">
          <div className="min-w-0">
            <h1 className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-[#12203A]">
              <QrCode className="h-5 w-5 text-[#E8944A]" /> Wayfinding QR Signage Exporter
            </h1>
            <p className="font-sans text-xs text-[#5B6472]">
              Print and position this checkpoint QR code at the Main Entrance or Building Gate.
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[#E8944A] px-3.5 py-2 font-display text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#d88237]"
          >
            <Printer className="h-4 w-4" /> Print Signage
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4">
          {entryLocations.map((loc) => {
            const target = origin ? `${origin}/qr/${loc.id}` : `/qr/${loc.id}`;
            return (
              <div
                key={loc.id}
                className="flex flex-col items-center rounded-xl border border-[#12203A]/14 bg-white p-6 text-center shadow-sm print:break-inside-avoid print:border-0 print:shadow-none"
              >
                <div className="rounded-lg border border-[#12203A]/10 bg-[#F7F5F0] p-4 shadow-sm print:shadow-none">
                  <QrCodeCanvas value={target} size={256} label={`QR code for ${loc.name}`} />
                </div>
                <div className="mt-4 font-display text-xl font-bold text-[#12203A]">{loc.name}</div>
                <div className="font-sans text-xs text-[#5B6472]">Scan checkpoint to initiate indoor wayfinding</div>
                <div className="mt-1 font-mono text-[10px] text-[#5B6472] print:hidden">
                  /qr/{loc.id}
                </div>
                <Link
                  to="/qr/$id"
                  params={{ id: loc.id }}
                  className="mt-4 inline-flex items-center gap-2 rounded-md border border-[#12203A]/20 bg-[#12203A] px-4 py-2 font-display text-xs font-bold uppercase tracking-wider text-white print:hidden hover:bg-[#1E2D4A]"
                >
                  <QrCode className="h-4 w-4 text-[#E8944A]" />
                  Simulate QR Scan Landing
                </Link>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
