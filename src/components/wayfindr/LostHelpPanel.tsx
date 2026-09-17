import { HelpCircle, MapPin, Navigation, Phone, Search, X } from "lucide-react";

export function LostHelpPanel({
  onClose,
  onResetToEntrance,
  onSearchFocus,
}: {
  onClose: () => void;
  onResetToEntrance: () => void;
  onSearchFocus: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#111827]/80 p-4 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-2xl border border-[#111827]/15 bg-white p-6 shadow-2xl space-y-4 text-center">
        <div className="flex items-center justify-between border-b border-[#111827]/10 pb-3">
          <div className="flex items-center gap-2 font-display text-base font-extrabold text-[#111827]">
            <HelpCircle className="h-5 w-5 text-[#F97316]" />
            <span>Need Help Finding Something?</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-[#6B7280] hover:bg-[#111827]/10"
            aria-label="Close help"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="font-sans text-xs text-[#6B7280] text-left">
          If you are lost or unsure of your position, pick one of the quick recovery options below:
        </p>

        <div className="space-y-2">
          <button
            onClick={() => {
              onSearchFocus();
              onClose();
            }}
            className="flex w-full items-center justify-start gap-3 rounded-xl border border-[#111827]/12 bg-[#F8FAFC] p-3 text-left transition-colors hover:border-[#F97316] hover:bg-white"
          >
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#111827] text-[#F97316]">
              <Search className="h-4 w-4" />
            </div>
            <div>
              <div className="font-display text-xs font-bold text-[#111827]">Search Destination</div>
              <div className="font-sans text-[11px] text-[#6B7280]">Type a room or office name</div>
            </div>
          </button>

          <button
            onClick={() => {
              onResetToEntrance();
              onClose();
            }}
            className="flex w-full items-center justify-start gap-3 rounded-xl border border-[#111827]/12 bg-[#F8FAFC] p-3 text-left transition-colors hover:border-[#F97316] hover:bg-white"
          >
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#F97316] text-white">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <div className="font-display text-xs font-bold text-[#111827]">Return to Main Gate</div>
              <div className="font-sans text-[11px] text-[#6B7280]">Reset position to entrance QR</div>
            </div>
          </button>

          <div className="flex w-full items-center justify-start gap-3 rounded-xl border border-[#111827]/12 bg-[#F8FAFC] p-3 text-left opacity-75">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#6B7280] text-white">
              <Phone className="h-4 w-4" />
            </div>
            <div>
              <div className="font-display text-xs font-bold text-[#111827]">Call Campus Help Desk</div>
              <div className="font-sans text-[11px] text-[#6B7280]">Emergency Support (Ext. 101)</div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-2 w-full rounded-xl bg-[#111827] py-2.5 font-display text-xs font-bold uppercase tracking-wider text-white shadow-xs"
        >
          Close Help
        </button>
      </div>
    </div>
  );
}
