import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Globe, Info, Printer, QrCode } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { QrCodeCanvas } from "@/components/QrCodeCanvas";
import { useLocations } from "@/lib/locations";
import { getAbsoluteQrUrl } from "@/lib/url-utils";

export const Route = createFileRoute("/admin/qr")({
  head: () => ({ meta: [{ title: "QR Codes — Smart Navigator" }] }),
  component: QrCodesPage,
});

function QrCodesPage() {
  const locations = useLocations();
  const [filterMode, setFilterMode] = useState<"entry" | "all">("entry");
  const [hostUrl, setHostUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHostUrl(window.location.origin);
    }
  }, []);

  const displayLocations =
    filterMode === "entry"
      ? locations.filter((loc) => loc.id === "main-gate" || loc.category === "Entry")
      : locations;

  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

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

      <main className="mx-auto max-w-3xl px-4 pt-3">
        <div className="rounded-xl border border-[#12203A]/14 bg-white p-4 shadow-sm print:hidden">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-[#12203A]">
                <QrCode className="h-5 w-5 text-[#E8944A]" /> Wayfinding QR Signage Exporter
              </h1>
              <p className="font-sans text-xs text-[#5B6472]">
                Print checkpoint QR codes for your home or campus entrances.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#E8944A] px-3.5 py-2 font-display text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#d88237]"
            >
              <Printer className="h-4 w-4" /> Print Signage
            </button>
          </div>

          <div className="mt-4 rounded-lg border border-[#12203A]/15 bg-[#F7F5F0] p-3 space-y-2">
            <div className="flex items-center gap-2 font-display text-xs font-bold uppercase text-[#12203A]">
              <Globe className="h-4 w-4 text-[#E8944A]" />
              Target Network Host URL (Required for Phone Camera Scanning)
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={hostUrl}
                onChange={(e) => setHostUrl(e.target.value)}
                placeholder="e.g. http://192.168.1.15:3000 or https://smart-campus.vercel.app"
                className="min-w-0 flex-1 rounded border border-[#12203A]/20 bg-white px-3 py-1.5 font-mono text-xs text-[#12203A] focus:border-[#E8944A] focus:outline-none"
              />
              <button
                onClick={() => setHostUrl(typeof window !== "undefined" ? window.location.origin : "")}
                className="rounded border border-[#12203A]/20 bg-white px-2.5 py-1.5 font-sans text-xs font-semibold text-[#5B6472] hover:text-[#12203A]"
              >
                Reset to Current
              </button>
            </div>
            {isLocalhost && (
              <div className="flex items-start gap-1.5 font-sans text-[11px] text-[#E8944A]">
                <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span>
                  <strong>Important for phone scanning:</strong> You are currently on <code>localhost</code>. To scan from a phone on your home Wi-Fi, replace <code>localhost</code> above with your laptop&apos;s Wi-Fi IP address (e.g. <code>http://192.168.1.X:3000</code>) or your Vercel deployment link!
                </span>
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-[#12203A]/10 pt-3">
            <div className="font-display text-xs font-bold text-[#12203A]">Filter Signage Output:</div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterMode("entry")}
                className={`rounded px-3 py-1 font-sans text-xs font-medium ${
                  filterMode === "entry"
                    ? "bg-[#12203A] text-white"
                    : "bg-[#F7F5F0] text-[#5B6472] hover:text-[#12203A]"
                }`}
              >
                Main Gate & Entry Only
              </button>
              <button
                onClick={() => setFilterMode("all")}
                className={`rounded px-3 py-1 font-sans text-xs font-medium ${
                  filterMode === "all"
                    ? "bg-[#12203A] text-white"
                    : "bg-[#F7F5F0] text-[#5B6472] hover:text-[#12203A]"
                }`}
              >
                All Room Checkpoints ({locations.length})
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {displayLocations.map((loc) => {
            const fullTargetUrl = getAbsoluteQrUrl(`/qr/${loc.id}`, hostUrl);
            return (
              <div
                key={loc.id}
                className="flex flex-col items-center rounded-xl border border-[#12203A]/14 bg-white p-5 text-center shadow-sm print:break-inside-avoid print:border-0 print:shadow-none"
              >
                <Link
                  to="/qr/$id"
                  params={{ id: loc.id }}
                  title="Click to simulate scan in browser"
                  className="rounded-lg border border-[#12203A]/10 bg-[#F7F5F0] p-3 shadow-sm transition-transform hover:scale-105 print:shadow-none"
                >
                  <QrCodeCanvas value={fullTargetUrl} size={200} label={`QR code for ${loc.name}`} />
                </Link>
                <div className="mt-3 font-display text-base font-bold text-[#12203A]">{loc.name}</div>
                <div className="font-mono text-[10px] text-[#5B6472]">
                  {loc.building ?? "Home"} • {loc.floor ?? "Ground Floor"}
                </div>
                <div className="mt-2 w-full break-all rounded bg-[#12203A]/5 p-1.5 font-mono text-[10px] text-[#12203A]">
                  {fullTargetUrl}
                </div>
                <Link
                  to="/qr/$id"
                  params={{ id: loc.id }}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-[#12203A]/20 bg-[#12203A] px-3 py-1.5 font-display text-xs font-bold uppercase tracking-wider text-white print:hidden hover:bg-[#1E2D4A]"
                >
                  <QrCode className="h-3.5 w-3.5 text-[#E8944A]" />
                  Simulate QR Scan
                </Link>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
