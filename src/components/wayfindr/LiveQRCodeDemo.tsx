import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { QrCode, Navigation, Sparkles, Smartphone, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import QRCode from "qrcode";
import { getAbsoluteQrUrl } from "@/lib/url-utils";

export function LiveQRCodeDemo() {
  const [qrUrl, setQrUrl] = useState<string>("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    // Dynamically construct navigation URL from current window origin
    const targetUrl = getAbsoluteQrUrl("/navigate?location=main-gate");
    setQrUrl(targetUrl);

    // Generate real scannable QR Code data URL with High Error Correction (H)
    QRCode.toDataURL(targetUrl, {
      width: 260,
      margin: 2,
      color: {
        dark: "#111827",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "H",
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR Code generation error:", err));
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-white border-t border-[#111827]/10 relative overflow-hidden">
      {/* Decorative Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#F97316]/5 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border-2 border-[#111827]/12 bg-[#F8FAFC] p-6 sm:p-10 lg:p-12 shadow-xl">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            
            {/* LEFT COLUMN: Copy & 3-Step Process */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#F97316]/30 bg-[#F97316]/10 px-3.5 py-1 font-mono text-xs font-bold text-[#F97316]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>LIVE WAYFINDR DEMO</span>
              </div>

              <h2 className="font-display text-3xl font-extrabold text-[#111827] sm:text-4xl lg:text-5xl leading-tight">
                Scan. Start. Navigate.
              </h2>

              <p className="text-base text-[#4B5563] leading-relaxed max-w-xl">
                Try WayFindr from a real starting point. Scan the QR code below with your phone camera to instantly launch the indoor navigation application.
              </p>

              {/* 3-Step Demonstration Explanation */}
              <div className="grid gap-4 sm:grid-cols-3 pt-2">
                <div className="rounded-xl border border-[#111827]/10 bg-white p-4 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between font-mono text-xs font-black text-[#F97316]">
                    <span>01</span>
                    <Smartphone className="h-4 w-4 text-[#111827]" />
                  </div>
                  <div className="font-display text-xs font-bold text-[#111827]">SCAN THE QR</div>
                  <p className="text-[11px] text-[#6B7280] leading-snug">
                    Scan the checkpoint code with your smartphone camera.
                  </p>
                </div>

                <div className="rounded-xl border border-[#111827]/10 bg-white p-4 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between font-mono text-xs font-black text-[#F97316]">
                    <span>02</span>
                    <MapPin className="h-4 w-4 text-[#111827]" />
                  </div>
                  <div className="font-display text-xs font-bold text-[#111827]">CHOOSE DESTINATION</div>
                  <p className="text-[11px] text-[#6B7280] leading-snug">
                    Search Library, Admissions, Faculty, or Kitchen.
                  </p>
                </div>

                <div className="rounded-xl border border-[#111827]/10 bg-white p-4 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between font-mono text-xs font-black text-[#F97316]">
                    <span>03</span>
                    <Navigation className="h-4 w-4 text-[#111827]" />
                  </div>
                  <div className="font-display text-xs font-bold text-[#111827]">FOLLOW THE ROUTE</div>
                  <p className="text-[11px] text-[#6B7280] leading-snug">
                    Follow the orange indoor vector route with voice guidance.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Real Scannable QR Code Card */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-sm rounded-3xl border-2 border-[#111827] bg-white p-6 shadow-2xl text-center space-y-4">
                
                {/* Status Indicator Bar */}
                <div className="flex items-center justify-between border-b border-[#111827]/10 pb-3">
                  <div className="flex items-center gap-2 font-display text-xs font-extrabold uppercase text-[#111827]">
                    <QrCode className="h-4 w-4 text-[#F97316]" />
                    <span>TRY THE LIVE DEMO</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-[#10B981]/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#10B981]">
                    <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
                    <span>LIVE DEMO</span>
                  </div>
                </div>

                {/* Location Metadata */}
                <div className="rounded-xl bg-[#F8FAFC] p-3 border border-[#111827]/10 text-center">
                  <div className="font-display text-sm font-extrabold text-[#111827] flex items-center justify-center gap-1.5">
                    <MapPin className="h-4 w-4 text-[#F97316]" />
                    <span>Main Gate Entrance</span>
                  </div>
                  <div className="font-mono text-[11px] font-semibold text-[#6B7280] mt-0.5">
                    Ground Floor • Building A
                  </div>
                </div>

                {/* REAL GENERATED SCANNABLE QR CODE CONTAINER */}
                <div className="relative mx-auto grid place-items-center rounded-2xl border-2 border-[#111827]/15 bg-white p-3 shadow-inner">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Scan QR code to open WayFindr indoor navigation demo"
                      aria-label="Scan QR code to open WayFindr indoor navigation demo"
                      width={220}
                      height={220}
                      className="block h-[200px] w-[200px] sm:h-[220px] sm:w-[220px] object-contain rounded-lg transition-transform hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="grid h-[200px] w-[200px] sm:h-[220px] sm:w-[220px] place-items-center rounded-lg bg-[#F8FAFC] font-mono text-xs text-[#6B7280]">
                      Generating QR...
                    </div>
                  )}
                </div>

                {/* Camera Scan Instruction */}
                <p className="font-mono text-xs font-semibold text-[#6B7280]">
                  Scan with your phone camera
                </p>

                {/* Fallback Direct Link Button for Desktop or Touch Users */}
                <Link
                  to="/navigate"
                  search={{ location: "main-gate" }}
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#111827] px-4 py-3 font-display text-xs font-extrabold uppercase tracking-wider text-white shadow-md hover:bg-[#111827]/90 active:scale-[0.98] transition-all"
                >
                  <Navigation className="h-4 w-4 text-[#F97316]" />
                  <span>OPEN DEMO</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Link>

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
