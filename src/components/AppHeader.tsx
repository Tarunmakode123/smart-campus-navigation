import { Link } from "@tanstack/react-router";
import { Compass, Settings } from "lucide-react";

export function AppHeader({ showAdmin = true }: { showAdmin?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#12203A]/20 bg-[#12203A] text-[#F7F5F0] shadow-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-[#E8944A] text-white shadow-sm">
            <Compass className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-sm font-bold tracking-wider uppercase text-[#F7F5F0]">
              Smart Navigator
            </span>
            <span className="text-[10px] font-sans text-[#8B98AD] uppercase tracking-widest leading-none">
              Wayfinding System
            </span>
          </div>
        </Link>
        {showAdmin && (
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 rounded-md border border-[#F7F5F0]/20 bg-[#1E2D4A] px-3 py-1.5 text-xs font-medium text-[#F7F5F0] transition-colors hover:bg-[#E8944A] hover:border-[#E8944A]"
          >
            <Settings className="h-3.5 w-3.5" />
            <span>Directory Admin</span>
          </Link>
        )}
      </div>
    </header>
  );
}
