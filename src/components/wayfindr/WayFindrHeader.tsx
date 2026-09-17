import { Compass, HelpCircle, Volume2, VolumeX } from "lucide-react";

export function WayFindrHeader({
  onOpenLostModal,
  voiceEnabled,
  onToggleVoice,
}: {
  onOpenLostModal: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#111827]/10 bg-white/95 backdrop-blur px-4 py-2.5 shadow-xs">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        {/* Minimalist Logo & Tagline */}
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-[#F97316] text-white shadow-xs">
            <Compass className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base font-extrabold tracking-tight text-[#111827]">
              WAYFINDR
            </span>
            <span className="text-[9px] font-mono tracking-wider uppercase text-[#6B7280] leading-none">
              Find Your Way. Instantly.
            </span>
          </div>
        </div>

        {/* Compact Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleVoice}
            className={`flex items-center gap-1 rounded-md border px-2.5 py-1.5 font-mono text-xs font-semibold transition-colors ${
              voiceEnabled
                ? "border-[#F97316] bg-[#F97316]/10 text-[#F97316]"
                : "border-[#111827]/15 bg-[#F8FAFC] text-[#6B7280]"
            }`}
            title={voiceEnabled ? "Mute Voice Guidance" : "Enable Voice Guidance"}
          >
            {voiceEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{voiceEnabled ? "Voice ON" : "Muted"}</span>
          </button>

          <button
            onClick={onOpenLostModal}
            className="flex items-center gap-1 rounded-md border border-[#111827]/15 bg-[#F8FAFC] px-2.5 py-1.5 font-display text-xs font-bold text-[#111827] transition-colors hover:bg-[#111827] hover:text-white"
          >
            <HelpCircle className="h-3.5 w-3.5 text-[#F97316]" />
            <span>I&apos;m Lost</span>
          </button>
        </div>
      </div>
    </header>
  );
}
