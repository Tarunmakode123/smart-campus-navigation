import { MapPin, QrCode } from "lucide-react";
import type { QRLocation } from "@/lib/wayfindr-types";

export function LocationBanner({ qrContext }: { qrContext: QRLocation }) {
  return (
    <div className="rounded-xl border border-[#111827]/12 bg-white p-4 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 font-display text-[10px] font-extrabold uppercase tracking-widest text-[#F97316]">
            <MapPin className="h-3.5 w-3.5" /> YOU ARE AT
          </div>
          <h1 className="mt-0.5 truncate font-display text-xl font-extrabold uppercase tracking-tight text-[#111827]">
            {qrContext.locationName}
          </h1>
          <p className="mt-0.5 font-mono text-xs font-semibold text-[#6B7280]">
            {qrContext.floorName} • {qrContext.buildingName}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1">
          <div className="flex items-center gap-1 rounded bg-[#F97316]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#F97316]">
            <QrCode className="h-3 w-3" /> QR VERIFIED
          </div>
        </div>
      </div>
      <p className="mt-2 border-t border-[#111827]/8 pt-2 font-sans text-[11px] text-[#6B7280]">
        Starting location established from entrance QR checkpoint.
      </p>
    </div>
  );
}
