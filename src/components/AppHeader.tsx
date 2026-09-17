import { Link } from "@tanstack/react-router";
import { Compass, QrCode, Settings } from "lucide-react";

export function AppHeader({ showAdmin = true }: { showAdmin?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#12203A]/10 bg-white/95 backdrop-blur text-[#12203A] shadow-xs">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#12203A] text-[#E8944A] shadow-xs group-hover:bg-[#E8944A] group-hover:text-white transition-colors">
            <Compass className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base font-bold tracking-tight text-[#12203A]">
              Smart Campus Navigator
            </span>
            <span className="text-[10px] font-mono text-[#5B6472] uppercase tracking-wider leading-none">
              Indoor Wayfinding Platform
            </span>
          </div>
        </Link>
        {showAdmin && (
          <div className="flex items-center gap-2">
            <Link
              to="/admin/qr"
              className="inline-flex items-center gap-1.5 rounded-md border border-[#12203A]/15 bg-[#F7F5F0] px-3 py-1.5 font-display text-xs font-semibold text-[#12203A] transition-colors hover:bg-[#12203A] hover:text-white"
            >
              <QrCode className="h-3.5 w-3.5 text-[#E8944A]" />
              <span className="hidden sm:inline">QR Signage</span>
            </Link>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#12203A] px-3.5 py-1.5 font-display text-xs font-bold uppercase tracking-wider text-white shadow-xs transition-colors hover:bg-[#1E2D4A]"
            >
              <Settings className="h-3.5 w-3.5 text-[#E8944A]" />
              <span>Admin</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
