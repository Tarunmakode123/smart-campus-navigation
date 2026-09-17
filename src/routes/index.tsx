import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Compass,
  QrCode,
  MapPin,
  Search,
  Navigation,
  Sparkles,
  ArrowRight,
  Menu,
  X,
  CheckCircle2,
  XCircle,
  Building2,
  Stethoscope,
  Hotel,
  Plane,
  Briefcase,
  Landmark,
  Layers,
  Volume2,
  Smartphone,
  Accessibility,
  Footprints,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WayFindr — Find Your Way. Instantly." },
      {
        name: "description",
        content:
          "Enterprise QR-based indoor navigation and wayfinding platform. Turn every entrance into a smart navigation experience.",
      },
    ],
  }),
  component: WayFindrHomepage,
});

function WayFindrHomepage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#111827] antialiased">
      {/* ================================================== */}
      {/* HEADER / NAVBAR */}
      {/* ================================================== */}
      <header className="sticky top-0 z-50 border-b border-[#111827]/10 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#F97316] text-white shadow-sm transition-transform group-hover:scale-105">
              <Compass className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-black tracking-tight text-[#111827]">
                WAYFINDR
              </span>
              <span className="text-[9px] font-mono uppercase tracking-wider text-[#6B7280] leading-none">
                Indoor Wayfinding
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#4B5563]">
            <a href="#how-it-works" className="hover:text-[#F97316] transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-[#F97316] transition-colors">
              Features
            </a>
            <a href="#use-cases" className="hover:text-[#F97316] transition-colors">
              Use Cases
            </a>
            <a href="#technology" className="hover:text-[#F97316] transition-colors">
              Technology
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/navigate"
              search={{ location: "main-gate" }}
              className="flex items-center gap-1.5 rounded-xl border border-[#111827]/15 bg-white px-4 py-2 text-xs font-bold text-[#111827] shadow-xs hover:border-[#F97316] hover:bg-[#F8FAFC] transition-all"
            >
              <Navigation className="h-3.5 w-3.5 text-[#F97316]" />
              <span>Try Demo</span>
            </Link>

            <a
              href="#get-started"
              className="rounded-xl bg-[#F97316] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-white shadow-sm hover:bg-[#ea580c] transition-all active:scale-95"
            >
              Get Started
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="md:hidden rounded-lg p-2 text-[#111827] hover:bg-[#F8FAFC]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#111827]/10 bg-white px-4 py-4 space-y-3">
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-semibold text-[#111827] py-1"
            >
              How It Works
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-semibold text-[#111827] py-1"
            >
              Features
            </a>
            <a
              href="#use-cases"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-semibold text-[#111827] py-1"
            >
              Use Cases
            </a>
            <a
              href="#technology"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-semibold text-[#111827] py-1"
            >
              Technology
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/navigate"
                search={{ location: "main-gate" }}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#111827]/20 py-2.5 font-bold text-[#111827]"
              >
                <Navigation className="h-4 w-4 text-[#F97316]" /> Try Interactive Demo
              </Link>
              <a
                href="#get-started"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center rounded-xl bg-[#F97316] py-2.5 font-extrabold uppercase text-white"
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ================================================== */}
      {/* HERO SECTION */}
      {/* ================================================== */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Subtle Background Glow & Grid */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-full max-w-7xl bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.12),transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Column: Copy & CTA */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#F97316]/30 bg-[#F97316]/10 px-3.5 py-1 font-mono text-xs font-bold text-[#F97316]">
                <QrCode className="h-3.5 w-3.5" />
                <span>QR-POWERED INDOOR NAVIGATION</span>
              </div>

              <h1 className="font-display text-4xl font-extrabold tracking-tight text-[#111827] sm:text-5xl lg:text-6xl leading-[1.1]">
                Never Get Lost{" "}
                <span className="text-[#F97316] underline decoration-[#F97316]/30 underline-offset-4">
                  Indoors Again.
                </span>
              </h1>

              <p className="max-w-2xl mx-auto lg:mx-0 text-base text-[#4B5563] sm:text-lg leading-relaxed">
                WayFindr helps visitors instantly find their destination inside campuses, hospitals,
                hotels, offices, and large facilities — simply by scanning an entrance QR code.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/navigate"
                  search={{ location: "main-gate" }}
                  className="flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#F97316] px-6 py-3 font-display text-sm font-extrabold uppercase tracking-wider text-white shadow-lg transition-all hover:bg-[#ea580c] active:scale-[0.98]"
                >
                  <Navigation className="h-4 w-4" />
                  <span>Try Interactive Demo</span>
                </Link>

                <a
                  href="#how-it-works"
                  className="flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-[#111827]/15 bg-white px-6 py-3 font-display text-sm font-bold text-[#111827] shadow-xs hover:bg-[#F8FAFC] transition-colors"
                >
                  <span>See How It Works</span>
                  <ArrowRight className="h-4 w-4 text-[#F97316]" />
                </a>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-mono text-[#6B7280]">
                <ShieldCheck className="h-4 w-4 text-[#10B981]" />
                <span>No app download required • Works on any browser</span>
              </div>
            </div>

            {/* Right Column: Stylized Product Concept Visualization Mockup */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Smartphone Mockup */}
                <div className="relative z-20 mx-auto w-full max-w-[310px] sm:max-w-[340px] rounded-[36px] border-8 border-[#111827] bg-[#F8FAFC] p-3 shadow-2xl">
                  {/* Notch */}
                  <div className="mx-auto h-4 w-28 rounded-b-xl bg-[#111827]" />

                  {/* Phone Screen Display */}
                  <div className="mt-2 space-y-3 rounded-2xl bg-white p-3.5 shadow-inner">
                    {/* Header inside phone */}
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="font-display text-xs font-extrabold text-[#111827]">
                        WAYFINDR
                      </span>
                      <span className="rounded bg-[#10B981]/15 px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#10B981]">
                        GPS LIVE
                      </span>
                    </div>

                    {/* Checkpoint Origin inside phone */}
                    <div className="rounded-lg bg-[#F8FAFC] p-2 border border-[#111827]/10 text-left">
                      <div className="font-mono text-[9px] font-bold text-[#F97316]">
                        📍 YOU ARE AT
                      </div>
                      <div className="font-display text-xs font-extrabold text-[#111827]">
                        Main Gate Entrance
                      </div>
                    </div>

                    {/* Vector Map Preview inside phone */}
                    <div className="relative h-44 overflow-hidden rounded-xl border border-[#111827]/12 bg-[#F8FAFC]">
                      <svg viewBox="0 0 100 100" className="h-full w-full">
                        <rect x="10" y="10" width="80" height="80" rx="3" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
                        <path d="M20 75 H80 M50 20 V80" fill="none" stroke="#E2E8F0" strokeWidth="6" />
                        {/* Animated Orange Route */}
                        <path
                          d="M 20 75 L 50 75 L 50 35 L 75 35"
                          fill="none"
                          stroke="#F97316"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray="4 2"
                        />
                        <circle cx="20" cy="75" r="3" fill="#F97316" />
                        <circle cx="75" cy="35" r="3" fill="#111827" />
                      </svg>
                      {/* Floating Destination Banner */}
                      <div className="absolute bottom-2 left-2 right-2 rounded-md bg-[#111827]/90 p-2 text-white backdrop-blur">
                        <div className="flex items-center justify-between font-mono text-[9px] text-[#F97316]">
                          <span>TO: LIBRARY</span>
                          <span>120 m • ~2 min</span>
                        </div>
                      </div>
                    </div>

                    {/* Direction Card inside phone */}
                    <div className="rounded-lg bg-[#111827] p-2.5 text-white text-left flex items-center justify-between">
                      <div className="min-w-0">
                        <div className="font-mono text-[8px] text-[#F97316]">STEP 01 OF 03</div>
                        <div className="font-display text-xs font-bold truncate">Walk straight 45 m to Central Hall</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[#F97316]" />
                    </div>
                  </div>
                </div>

                {/* Floating Decorative Cards */}
                {/* Floating QR Card */}
                <div className="absolute -top-4 -left-4 sm:-left-8 z-30 hidden sm:flex items-center gap-3 rounded-2xl border border-[#111827]/12 bg-white/95 p-3.5 shadow-xl backdrop-blur">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#111827] text-[#F97316]">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-display text-xs font-extrabold text-[#111827]">
                      SCAN TO NAVIGATE
                    </div>
                    <div className="font-mono text-[10px] text-[#6B7280]">Entrance Checkpoint</div>
                  </div>
                </div>

                {/* Floating Location Found Card */}
                <div className="absolute -bottom-4 -right-4 sm:-right-8 z-30 hidden sm:flex items-center gap-3 rounded-2xl border border-[#111827]/12 bg-white/95 p-3.5 shadow-xl backdrop-blur">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#F97316] text-white">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-display text-xs font-extrabold text-[#111827]">
                      📍 Location Found
                    </div>
                    <div className="font-mono text-[10px] text-[#6B7280]">Main Gate Entrance</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* TRUST / MICRO VALUE STRIP */}
      {/* ================================================== */}
      <section className="border-y border-[#111827]/10 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 text-center">
            <div className="flex items-center justify-center gap-2 p-2">
              <QrCode className="h-5 w-5 text-[#F97316]" />
              <span className="font-display text-xs sm:text-sm font-bold text-[#111827]">
                QR-Powered Navigation
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 p-2">
              <Smartphone className="h-5 w-5 text-[#F97316]" />
              <span className="font-display text-xs sm:text-sm font-bold text-[#111827]">
                No App Download
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 p-2">
              <Layers className="h-5 w-5 text-[#F97316]" />
              <span className="font-display text-xs sm:text-sm font-bold text-[#111827]">
                Multi-Floor Routing
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 p-2">
              <Footprints className="h-5 w-5 text-[#F97316]" />
              <span className="font-display text-xs sm:text-sm font-bold text-[#111827]">
                Turn-by-Turn Guidance
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 p-2">
              <Volume2 className="h-5 w-5 text-[#F97316]" />
              <span className="font-display text-xs sm:text-sm font-bold text-[#111827]">
                Hands-Free Voice API
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* SECTION: THE PROBLEM */}
      {/* ================================================== */}
      <section className="py-16 sm:py-24 bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="font-display text-3xl font-extrabold text-[#111827] sm:text-4xl">
              Indoor Spaces Are Easy to Enter. <br className="hidden sm:inline" />
              Not Always Easy to Navigate.
            </h2>
            <p className="text-base text-[#4B5563]">
              Visitors can find the building using outdoor GPS. The real challenge starts once they are inside.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1 */}
            <div className="rounded-2xl border border-[#111827]/10 bg-white p-6 shadow-xs hover:border-[#F97316]/50 transition-all">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#F97316]/10 text-[#F97316]">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-[#111827]">
                &quot;Where am I?&quot;
              </h3>
              <p className="mt-2 text-xs text-[#6B7280] leading-relaxed">
                Visitors step through complex entrances without knowing their exact indoor location or starting node.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-[#111827]/10 bg-white p-6 shadow-xs hover:border-[#F97316]/50 transition-all">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#F97316]/10 text-[#F97316]">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-[#111827]">
                &quot;Where do I go?&quot;
              </h3>
              <p className="mt-2 text-xs text-[#6B7280] leading-relaxed">
                Static wall signboards and outdated physical wall directories fail to answer room-level visitor queries.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-[#111827]/10 bg-white p-6 shadow-xs hover:border-[#F97316]/50 transition-all">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#F97316]/10 text-[#F97316]">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-[#111827]">
                &quot;How do I get there?&quot;
              </h3>
              <p className="mt-2 text-xs text-[#6B7280] leading-relaxed">
                Navigating across multi-floor wings, staircases, and elevators causes hesitation and lost time.
              </p>
            </div>

            {/* Card 4 */}
            <div className="rounded-2xl border border-[#111827]/10 bg-white p-6 shadow-xs hover:border-[#F97316]/50 transition-all">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#F97316]/10 text-[#F97316]">
                <Smartphone className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-[#111827]">
                &quot;Do I need an app?&quot;
              </h3>
              <p className="mt-2 text-xs text-[#6B7280] leading-relaxed">
                Guests refuse to download heavy mobile applications just to find a single meeting room or cabin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* SECTION: HOW WAYFINDR WORKS */}
      {/* ================================================== */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-white border-t border-[#111827]/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="font-mono text-xs font-bold uppercase text-[#F97316] tracking-widest">
              4-STEP WORKFLOW
            </div>
            <h2 className="font-display text-3xl font-extrabold text-[#111827] sm:text-4xl">
              From QR Scan to Destination in Seconds.
            </h2>
            <p className="text-base text-[#4B5563]">
              A frictionless indoor wayfinding experience built for modern smartphones.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 relative">
            {/* Step 01 */}
            <div className="relative rounded-2xl border border-[#111827]/12 bg-[#F8FAFC] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-black text-[#F97316]">STEP 01</span>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#111827] text-white">
                  <QrCode className="h-5 w-5" />
                </div>
              </div>
              <h3 className="font-display text-xl font-bold text-[#111827]">SCAN</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Visitor scans a physical WayFindr QR checkpoint sticker placed at an entrance or reception lobby.
              </p>
              <div className="rounded-lg border border-[#111827]/10 bg-white p-2.5 text-center font-mono text-[10px] text-[#6B7280]">
                Scan QR Code on Phone
              </div>
            </div>

            {/* Step 02 */}
            <div className="relative rounded-2xl border border-[#111827]/12 bg-[#F8FAFC] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-black text-[#F97316]">STEP 02</span>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#111827] text-white">
                  <MapPin className="h-5 w-5" />
                </div>
              </div>
              <h3 className="font-display text-xl font-bold text-[#111827]">KNOW LOCATION</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                WayFindr immediately identifies the scanned origin without relying on external GPS signals.
              </p>
              <div className="rounded-lg border border-[#111827]/10 bg-white p-2.5 text-left font-mono text-[10px] text-[#111827]">
                📍 You are at: <span className="font-bold text-[#F97316]">Main Gate Entrance</span>
              </div>
            </div>

            {/* Step 03 */}
            <div className="relative rounded-2xl border border-[#111827]/12 bg-[#F8FAFC] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-black text-[#F97316]">STEP 03</span>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#111827] text-white">
                  <Search className="h-5 w-5" />
                </div>
              </div>
              <h3 className="font-display text-xl font-bold text-[#111827]">SELECT TARGET</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Visitor searches room name or selects quick categories (Library, Admissions, Faculty Cabins).
              </p>
              <div className="rounded-lg border border-[#111827]/10 bg-white p-2.5 text-left font-mono text-[10px] text-[#111827] flex items-center justify-between">
                <span>📚 Library</span>
                <span className="text-[#F97316]">Select →</span>
              </div>
            </div>

            {/* Step 04 */}
            <div className="relative rounded-2xl border border-[#111827]/12 bg-[#F8FAFC] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-black text-[#F97316]">STEP 04</span>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#111827] text-white">
                  <Navigation className="h-5 w-5" />
                </div>
              </div>
              <h3 className="font-display text-xl font-bold text-[#111827]">FOLLOW ROUTE</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                WayFindr renders an interactive vector map with precise physical distance and turn-by-turn steps.
              </p>
              <div className="rounded-lg bg-[#111827] p-2.5 text-left font-mono text-[10px] text-white">
                → Walk straight 45 m to Library
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* SECTION: PRODUCT EXPERIENCE SHOWCASE */}
      {/* ================================================== */}
      <section id="technology" className="py-16 sm:py-24 bg-[#F8FAFC] border-t border-[#111827]/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="font-display text-3xl font-extrabold text-[#111827] sm:text-4xl">
              Everything a Visitor Needs. Nothing They Don&apos;t.
            </h2>
            <p className="text-base text-[#4B5563]">
              Designed with laser focus on clarity, accuracy, and ease of use.
            </p>
          </div>

          <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Column: UI Showcase Card */}
            <div className="lg:col-span-6 rounded-3xl border border-[#111827]/15 bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2 font-display text-sm font-black text-[#111827]">
                  <Compass className="h-4 w-4 text-[#F97316]" />
                  <span>WAYFINDR ENGINE PREVIEW</span>
                </div>
                <span className="font-mono text-[10px] font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded">
                  MOBILE OPTIMIZED
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-xl bg-[#F8FAFC] p-3 border border-[#111827]/10">
                  <div className="font-mono text-[10px] font-bold text-[#F97316]">📍 YOU ARE AT</div>
                  <div className="font-display text-sm font-extrabold text-[#111827]">
                    Main Gate Entrance • Ground Floor
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-[#111827]/10 bg-white p-2.5 font-display text-xs font-bold text-[#111827] flex items-center gap-2">
                    <span className="text-[#F97316]">🎓</span> Admissions
                  </div>
                  <div className="rounded-lg border border-[#111827]/10 bg-white p-2.5 font-display text-xs font-bold text-[#111827] flex items-center gap-2">
                    <span className="text-[#F97316]">📚</span> Library
                  </div>
                </div>

                <div className="rounded-xl border border-[#111827]/15 bg-[#111827] p-4 text-white space-y-2">
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#F97316]">
                    <span>LEG 01 • TURN RIGHT</span>
                    <span>120 m LEFT</span>
                  </div>
                  <div className="font-display text-sm font-bold">
                    Turn right at Reception Lobby, then proceed 35 m straight to Library Entrance.
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: 6 Feature Explanations */}
            <div className="lg:col-span-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <div className="font-mono text-xs font-bold text-[#F97316]">01</div>
                  <h3 className="font-display text-base font-bold text-[#111827]">
                    Instant Location Awareness
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    Knows exactly where the visitor started the moment they scan the QR code.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="font-mono text-xs font-bold text-[#F97316]">02</div>
                  <h3 className="font-display text-base font-bold text-[#111827]">
                    Simple Destination Search
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    Fuzzy search matching room numbers, department names, or purpose.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="font-mono text-xs font-bold text-[#F97316]">03</div>
                  <h3 className="font-display text-base font-bold text-[#111827]">
                    Interactive Vector Maps
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    Clear visual floor layouts with corridors, doors, and destination pins.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="font-mono text-xs font-bold text-[#F97316]">04</div>
                  <h3 className="font-display text-base font-bold text-[#111827]">
                    Turn-by-Turn Guidance
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    Step-by-step physical distance routing through hallways and doors.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="font-mono text-xs font-bold text-[#F97316]">05</div>
                  <h3 className="font-display text-base font-bold text-[#111827]">
                    Multi-Floor Routing
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    Seamless floor switching using staircases and elevator connections.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="font-mono text-xs font-bold text-[#F97316]">06</div>
                  <h3 className="font-display text-base font-bold text-[#111827]">
                    Voice Guidance API
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    Natural Web Speech API audio synthesis for hands-free navigation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* SECTION: USE CASES */}
      {/* ================================================== */}
      <section id="use-cases" className="py-16 sm:py-24 bg-white border-t border-[#111827]/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="font-mono text-xs font-bold uppercase text-[#F97316] tracking-widest">
              ENTERPRISE DEPLOYMENTS
            </div>
            <h2 className="font-display text-3xl font-extrabold text-[#111827] sm:text-4xl">
              Built for Places People Get Lost.
            </h2>
            <p className="text-base text-[#4B5563]">
              Deploy WayFindr across any complex indoor infrastructure.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Campus */}
            <div className="rounded-2xl border border-[#111827]/12 bg-[#F8FAFC] p-6 space-y-3 hover:border-[#F97316] transition-all">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#111827] text-[#F97316]">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#111827]">Colleges & Campuses</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Help students, parents, and visitors find Admissions, Faculty Cabins, Labs, Libraries, and Hostels.
              </p>
            </div>

            {/* Hospitals */}
            <div className="rounded-2xl border border-[#111827]/12 bg-[#F8FAFC] p-6 space-y-3 hover:border-[#F97316] transition-all">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#111827] text-[#F97316]">
                <Stethoscope className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#111827]">Hospitals & Medical Centers</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Guide patients directly to OPD clinics, Diagnostic Labs, Pharmacies, Patient Wards, and Emergency.
              </p>
            </div>

            {/* Hotels */}
            <div className="rounded-2xl border border-[#111827]/12 bg-[#F8FAFC] p-6 space-y-3 hover:border-[#F97316] transition-all">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#111827] text-[#F97316]">
                <Hotel className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#111827]">Hotels & Resorts</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Help hotel guests navigate to Guest Suites, Dining Restaurants, Conference Halls, and Amenities.
              </p>
            </div>

            {/* Airports */}
            <div className="rounded-2xl border border-[#111827]/12 bg-[#F8FAFC] p-6 space-y-3 hover:border-[#F97316] transition-all">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#111827] text-[#F97316]">
                <Plane className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#111827]">Airports & Transit Hubs</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Help travelers locate Departure Gates, Airline Lounges, Check-in Counters, Baggage Claim, and Restrooms.
              </p>
            </div>

            {/* Offices */}
            <div className="rounded-2xl border border-[#111827]/12 bg-[#F8FAFC] p-6 space-y-3 hover:border-[#F97316] transition-all">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#111827] text-[#F97316]">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#111827]">Corporate Offices</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Guide corporate clients and interview candidates to Conference Rooms, Department Blocks, and Executive Cabins.
              </p>
            </div>

            {/* Large Facilities */}
            <div className="rounded-2xl border border-[#111827]/12 bg-[#F8FAFC] p-6 space-y-3 hover:border-[#F97316] transition-all">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#111827] text-[#F97316]">
                <Landmark className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#111827]">Large Facilities</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                For Convention Centers, Government Complex Buildings, Institutions, and Residential Townships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* SECTION: BEFORE VS AFTER */}
      {/* ================================================== */}
      <section className="py-16 sm:py-24 bg-[#F8FAFC] border-t border-[#111827]/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="font-display text-3xl font-extrabold text-[#111827] sm:text-4xl">
              Replace Confusion With Direction.
            </h2>
            <p className="text-base text-[#4B5563]">
              Upgrade from static signage to dynamic digital wayfinding.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {/* Left: Traditional */}
            <div className="rounded-3xl border border-red-200 bg-white p-8 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 font-display text-lg font-bold text-red-600">
                <XCircle className="h-6 w-6" />
                <span>Traditional Indoor Wayfinding</span>
              </div>
              <ul className="space-y-3 text-sm text-[#4B5563]">
                <li className="flex items-center gap-2">
                  <X className="h-4 w-4 text-red-500 shrink-0" />
                  <span>Static physical wall signs that visitors miss or misread</span>
                </li>
                <li className="flex items-center gap-2">
                  <X className="h-4 w-4 text-red-500 shrink-0" />
                  <span>Visitors interrupting staff and security for directions</span>
                </li>
                <li className="flex items-center gap-2">
                  <X className="h-4 w-4 text-red-500 shrink-0" />
                  <span>Confusing multi-building layout maps with no current position pin</span>
                </li>
                <li className="flex items-center gap-2">
                  <X className="h-4 w-4 text-red-500 shrink-0" />
                  <span>Difficult multi-floor transitions via staircases</span>
                </li>
              </ul>
            </div>

            {/* Right: WayFindr */}
            <div className="rounded-3xl border-2 border-[#F97316] bg-[#111827] p-8 space-y-4 text-white shadow-xl">
              <div className="flex items-center gap-2 font-display text-lg font-bold text-[#F97316]">
                <CheckCircle2 className="h-6 w-6" />
                <span>With WayFindr Platform</span>
              </div>
              <ul className="space-y-3 text-sm text-white/90">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#F97316] shrink-0" />
                  <span>Scan entrance QR code on smartphone instantly</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#F97316] shrink-0" />
                  <span>Know exact starting location without GPS delay</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#F97316] shrink-0" />
                  <span>Search destination by room name or purpose</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#F97316] shrink-0" />
                  <span>Follow interactive vector route line with turn-by-turn guidance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* SECTION: DEMO */}
      {/* ================================================== */}
      <section className="py-16 sm:py-24 bg-white border-t border-[#111827]/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border-2 border-[#111827]/15 bg-[#111827] p-8 sm:p-12 text-white shadow-2xl">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#F97316]/20 px-3 py-1 font-mono text-xs font-bold text-[#F97316]">
                  <Sparkles className="h-3.5 w-3.5" /> LIVE DEMO INTERACTION
                </div>
                <h2 className="font-display text-3xl font-extrabold sm:text-4xl text-white">
                  See WayFindr in Action.
                </h2>
                <p className="text-sm sm:text-base text-[#9CA3AF] leading-relaxed">
                  Scan, search, and navigate — experience the exact indoor wayfinding journey your visitors will use.
                </p>

                <div className="pt-2">
                  <Link
                    to="/navigate"
                    search={{ location: "main-gate" }}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#F97316] px-6 py-3 font-display text-sm font-extrabold uppercase tracking-wider text-white shadow-lg transition-all hover:bg-[#ea580c] active:scale-95"
                  >
                    <Navigation className="h-4 w-4" />
                    <span>Open Navigation Demo</span>
                  </Link>
                </div>
              </div>

              {/* Demo Card Right */}
              <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="font-mono text-xs font-bold text-[#F97316]">DEMO CHECKPOINT</span>
                  <span className="rounded bg-[#10B981]/20 px-2 py-0.5 font-mono text-[10px] font-bold text-[#10B981]">
                    MAIN GATE
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="font-display text-sm font-bold text-white">📍 Main Gate Entrance</div>
                  <div className="font-mono text-xs text-[#9CA3AF]">↓ Navigating to Library</div>
                  <div className="font-display text-lg font-extrabold text-[#F97316]">
                    120 m • ~2 min
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* FINAL CTA SECTION */}
      {/* ================================================== */}
      <section id="get-started" className="py-16 sm:py-24 bg-[#F8FAFC]">
        <div className="mx-auto max-w-4xl px-4 text-center space-y-6">
          <h2 className="font-display text-3xl font-extrabold text-[#111827] sm:text-5xl">
            Make Your Building Easier to Navigate.
          </h2>
          <p className="text-base sm:text-lg text-[#4B5563] max-w-2xl mx-auto">
            Give every visitor a clear, stress-free path from entrance to destination.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/navigate"
              search={{ location: "main-gate" }}
              className="flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#F97316] px-8 py-3.5 font-display text-sm font-extrabold uppercase tracking-wider text-white shadow-xl hover:bg-[#ea580c] transition-all"
            >
              <Navigation className="h-4 w-4" />
              <span>Try Interactive Demo</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* FOOTER */}
      {/* ================================================== */}
      <footer className="border-t border-[#111827]/10 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {/* Logo Column */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#F97316] text-white">
                  <Compass className="h-4 w-4" />
                </div>
                <span className="font-display text-lg font-black text-[#111827]">WAYFINDR</span>
              </div>
              <p className="text-xs text-[#6B7280] max-w-sm leading-relaxed">
                Find Your Way. Instantly. Real-world QR-based indoor navigation and wayfinding platform for enterprise facilities.
              </p>
            </div>

            {/* Product Column */}
            <div className="space-y-2">
              <div className="font-display text-xs font-extrabold uppercase text-[#111827]">Product</div>
              <ul className="space-y-1.5 text-xs text-[#6B7280]">
                <li>
                  <a href="#how-it-works" className="hover:text-[#F97316]">How It Works</a>
                </li>
                <li>
                  <a href="#features" className="hover:text-[#F97316]">Features</a>
                </li>
                <li>
                  <Link to="/navigate" search={{ location: "main-gate" }} className="hover:text-[#F97316]">
                    Live Demo
                  </Link>
                </li>
              </ul>
            </div>

            {/* Solutions Column */}
            <div className="space-y-2">
              <div className="font-display text-xs font-extrabold uppercase text-[#111827]">Solutions</div>
              <ul className="space-y-1.5 text-xs text-[#6B7280]">
                <li><a href="#use-cases" className="hover:text-[#F97316]">Campuses</a></li>
                <li><a href="#use-cases" className="hover:text-[#F97316]">Hospitals</a></li>
                <li><a href="#use-cases" className="hover:text-[#F97316]">Hotels</a></li>
                <li><a href="#use-cases" className="hover:text-[#F97316]">Offices</a></li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="space-y-2">
              <div className="font-display text-xs font-extrabold uppercase text-[#111827]">Company</div>
              <ul className="space-y-1.5 text-xs text-[#6B7280]">
                <li><span className="hover:text-[#F97316] cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-[#F97316] cursor-pointer">Terms of Service</span></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-[#111827]/10 pt-6 text-center font-mono text-[11px] text-[#9CA3AF]">
            © 2026 WayFindr. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
