"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import PagePreloader from "@/components/smoothui/page-preloader";
import ThemeToggle from "@/components/smoothui/theme-toggle";
import AIOrbFace from "@/components/smoothui/ai-orb-face";
import AIConversation from "@/components/smoothui/ai-conversation";
import AIMessage from "@/components/smoothui/ai-message";
import AIReasoning from "@/components/smoothui/ai-reasoning";
import AIToolCall from "@/components/smoothui/ai-tool-call";
import AITaskList from "@/components/smoothui/ai-task-list";
import GridLoader from "@/components/smoothui/grid-loader";
import TiltCard from "@/components/smoothui/tilt-card";
import type { CoverflowCarouselItem } from "@/components/smoothui/coverflow-carousel";
import { SITE_CONTENT } from "@/content/site";
import {
  Menu,
  X,
  Play,
  Pause,
  ChevronRight,
  Check,
} from "lucide-react";

// Lazy-load below-the-fold heavy components with ssr: false and matched-height placeholders
const DynamicSiriOrb = dynamic(() => import("@/components/smoothui/siri-orb"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="w-[180px] h-[180px] rounded-full bg-[#f5f5f7] border border-[#d6d6d6]"
    />
  ),
});

const DynamicAIOrbFace = dynamic(() => import("@/components/smoothui/ai-orb-face"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="w-[180px] h-[180px] rounded-full bg-[#f5f5f7] border border-[#d6d6d6]"
    />
  ),
});

const DynamicCoverflowCarousel = dynamic(
  () => import("@/components/smoothui/coverflow-carousel"),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        className="w-full h-[320px] rounded-2xl bg-[#f5f5f7] border border-[#e6e6e8] flex items-center justify-center text-[#707070] text-sm"
      >
        Loading stories...
      </div>
    ),
  }
);

const DynamicKineticTypeScroll = dynamic(
  () => import("@/components/smoothui/kinetic-type-scroll"),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        className="min-h-[44px] flex items-center justify-center text-center apple-feature-heading text-[#1d1d1f] opacity-60"
      >
        {SITE_CONTENT.kineticBand.join(" ")}
      </div>
    ),
  }
);

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [showPreloader, setShowPreloader] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [activeHighlightIndex, setActiveHighlightIndex] = useState(0);
  const [isCarouselPlaying, setIsCarouselPlaying] = useState(true);
  const [orbSize, setOrbSize] = useState(280);
  const carouselTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if preloader has already played in this browser session
    const hasSeenPreloader = sessionStorage.getItem("sandipai_apple_preloader_seen");
    if (!hasSeenPreloader) {
      setShowPreloader(true);
      sessionStorage.setItem("sandipai_apple_preloader_seen", "true");
    }

    const updateOrbSize = () => {
      const w = window.innerWidth;
      if (w >= 768) {
        setNavOpen(false);
      }
      if (w >= 1024) {
        setOrbSize(280);
      } else if (w >= 640) {
        setOrbSize(230);
      } else {
        // Never larger than the column width on mobile
        setOrbSize(Math.max(140, Math.min(180, w - 48)));
      }
    };
    updateOrbSize();
    window.addEventListener("resize", updateOrbSize);
    return () => window.removeEventListener("resize", updateOrbSize);
  }, []);

  // Close mobile navigation on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && navOpen) {
        setNavOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navOpen]);

  // Lock body scroll while mobile navigation menu is open
  useEffect(() => {
    if (navOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [navOpen]);

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  // Highlights autoplay carousel loop
  useEffect(() => {
    if (!isCarouselPlaying) {
      if (carouselTimerRef.current) clearInterval(carouselTimerRef.current);
      return;
    }

    carouselTimerRef.current = setInterval(() => {
      setActiveHighlightIndex((prev) => (prev + 1) % SITE_CONTENT.highlights.cards.length);
    }, 5500);

    return () => {
      if (carouselTimerRef.current) clearInterval(carouselTimerRef.current);
    };
  }, [isCarouselPlaying]);

  const carouselItems: CoverflowCarouselItem[] = SITE_CONTENT.stories.map((story) => ({
    id: story.id,
    content: (
      <div className="flex h-full w-full flex-col justify-between p-7 bg-white border border-[#d6d6d6] rounded-[28px] text-left shadow-none">
        <div>
          <span className="inline-block px-3 py-1 text-[11px] font-semibold text-[#0066cc] bg-[#f5f5f7] border border-[#d6d6d6] rounded-full mb-3">
            {story.metric}
          </span>
          <p className="text-[15px] text-[#1d1d1f] line-clamp-4 leading-[1.47] tracking-[-0.2px] font-normal">
            &ldquo;{story.quote}&rdquo;
          </p>
        </div>
        <div className="border-t border-[#e6e6e8] pt-3 mt-2">
          <p className="text-[13px] font-semibold text-[#1d1d1f]">{story.author}</p>
          <p className="text-[11px] text-[#707070]">{story.role} · {story.company}</p>
        </div>
      </div>
    ),
  }));

  return (
    <div className="relative min-h-screen bg-white text-[#1d1d1f] selection:bg-[#0071e3]/20 overflow-x-clip max-w-full">
      {/* ── Page Preloader: White background, Ink text, under 1.5s on mobile ── */}
      {showPreloader && (
        <PagePreloader
          variant="words"
          words={["Qualify.", "Convert.", "Close."]}
          duration={1200}
          background="bg-white"
          onComplete={() => setShowPreloader(false)}
        />
      )}

      {/* ═════════════════════════════════════════════════════════════════════════
          1. SINGLE STICKY GLOBAL NAVIGATION (44px, ONLY bar on page)
          ═════════════════════════════════════════════════════════════════════════ */}
      <nav
        aria-label="Global"
        className="sticky top-0 inset-x-0 z-50 h-[44px] bg-white/90 backdrop-blur-md border-b border-[#e6e6e8] transition-colors"
      >
        <div className="max-w-[1024px] mx-auto h-full px-4 flex items-center justify-between text-[12px] font-normal tracking-[-0.01em]">
          {/* Left: SandipAI Wordmark (small, 17px/600) */}
          <a
            href="#hero"
            className="text-[17px] font-semibold tracking-tight text-[#1d1d1f] hover:opacity-80 transition-opacity"
          >
            {SITE_CONTENT.globalNav.brand}
          </a>

          {/* Center (Desktop only): 4 links (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-8 text-[#1d1d1f]">
            {SITE_CONTENT.globalNav.links.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="apple-nav-link text-[#1d1d1f] hover:text-[#0066cc] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right (Desktop only): filled #0071e3 pill (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#pricing"
              className="apple-pill-btn"
            >
              Get a demo
            </a>
          </div>

          {/* Right (Mobile only): 24px hamburger icon with 44x44px tap target */}
          <button
            type="button"
            aria-label={navOpen ? "Close menu" : "Open menu"}
            aria-expanded={navOpen}
            aria-controls="mobile-nav-menu"
            onClick={() => setNavOpen(!navOpen)}
            className="md:hidden flex items-center justify-center w-[44px] h-[44px] -mr-2 text-[#1d1d1f] hover:text-[#0066cc] focus:outline-none transition-colors"
          >
            <div className="relative size-6 flex items-center justify-center">
              <Menu
                className={`size-6 absolute inset-0 transition-all duration-200 motion-reduce:transition-none ${
                  navOpen ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"
                }`}
              />
              <X
                className={`size-6 absolute inset-0 transition-all duration-200 motion-reduce:transition-none ${
                  navOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Open State: Full-width sheet directly under bar, #fafafc, 1px #e6e6e8 edge, blur(20px), no shadow */}
        {navOpen && (
          <>
            {/* Backdrop to capture outside taps and close menu */}
            <div
              className="md:hidden fixed inset-0 top-[44px] z-40 bg-black/5"
              onClick={() => setNavOpen(false)}
              aria-hidden="true"
            />
            <div
              id="mobile-nav-menu"
              className="md:hidden absolute top-[44px] inset-x-0 z-50 bg-[#fafafc] border-b border-[#e6e6e8] backdrop-blur-[20px] px-6 py-6 shadow-none mobile-sheet-animation"
            >
              <div className="flex flex-col gap-5">
                <div className="flex flex-col">
                  {SITE_CONTENT.globalNav.links.map((link, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <div className="h-[1px] bg-[#e6e6e8] w-full" />}
                      <a
                        href={link.href}
                        onClick={() => setNavOpen(false)}
                        className="flex items-center h-[44px] text-[17px] font-medium text-[#1d1d1f] hover:text-[#0066cc] transition-colors"
                      >
                        {link.label}
                      </a>
                    </React.Fragment>
                  ))}
                </div>

                <div className="pt-2">
                  <a
                    href="#pricing"
                    onClick={() => setNavOpen(false)}
                    className="flex items-center justify-center w-full h-[44px] rounded-full bg-[#0071e3] text-white text-[12px] font-medium hover:bg-[#0077ed] transition-colors"
                  >
                    Get a demo
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </nav>

      <main>
        {/* ═════════════════════════════════════════════════════════════════════════
            2. HERO SECTION (Two columns on desktop, 100svh, background grid lines with mask)
            ═════════════════════════════════════════════════════════════════════════ */}
        <section
          id="hero"
          className="relative bg-white pt-6 pb-12 md:py-0 md:min-h-[calc(100svh-44px)] md:flex md:items-center md:justify-center px-4 sm:px-6 lg:px-8 overflow-hidden [contain:paint]"
        >
          {/* Subtle line grid behind hero: 1px in #d6d6d6, 64px cells, radial fade centered on character */}
          <div className="hero-grid-lines" aria-hidden="true" />

          <div className="relative z-10 max-w-[1080px] w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 lg:gap-12 items-center">
            {/* LEFT COLUMN: Kicker, Headline, Body, CTAs (all left-aligned) */}
            <div className="md:col-span-7 flex flex-col items-start text-left">
              {/* Short descriptive kicker */}
              <p className="apple-kicker text-[#707070] mb-3">
                {SITE_CONTENT.product.kicker}
              </p>

              {/* Headline: clamp(40px, 6vw, 80px), weight 600, tracking -1.2px */}
              <h1 className="apple-hero-headline text-[#1d1d1f] mb-4 whitespace-pre-line text-left">
                {SITE_CONTENT.product.headline}
              </h1>

              {/* Body paragraph */}
              <p className="apple-body text-[#707070] max-w-xl mb-6 text-left">
                {SITE_CONTENT.product.heroBody}
              </p>

              {/* Two CTAs: filled #0071e3 pill + #0066cc text link */}
              <div className="flex flex-wrap items-center gap-5">
                <a
                  href="#pricing"
                  className="apple-pill-btn px-5 py-2 text-[12px]"
                >
                  Get a demo
                </a>
                <a
                  href="#how-it-works"
                  className="apple-text-link"
                >
                  <span>Watch how it works</span>
                  <ChevronRight className="size-3.5 mt-0.5" />
                </a>
              </div>
            </div>

            {/* RIGHT COLUMN: AI Character (ai-orb-face) large, centered, gaze-tracking */}
            <div className="md:col-span-5 flex flex-col items-center justify-center w-full max-w-full overflow-hidden">
              <div
                className="flex items-center justify-center p-2 max-w-full overflow-hidden"
                style={{ width: orbSize, height: orbSize }}
              >
                <AIOrbFace
                  size={orbSize}
                  state="idle"
                  gaze={true}
                  colors={{
                    body: "oklch(75% 0.16 230)",
                    bodyEdge: "oklch(96% 0.02 230)",
                    feature: "#1d1d1f",
                  }}
                />
              </div>

              {/* Small subtle pricing callout placed small beneath the character */}
              <div className="mt-2 inline-flex items-center px-3.5 py-1 rounded-full bg-[#f5f5f7] border border-[#d6d6d6] text-[12px] text-[#707070]">
                {SITE_CONTENT.product.pricingCallout.priceText}
              </div>
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════════════
            3. HIGHLIGHTS BAND (Full-width #f5f5f7, 28px white cards, carousel controls)
            ═════════════════════════════════════════════════════════════════════════ */}
        <section id="how-it-works" className="scroll-mt-[56px] bg-[#f5f5f7] py-[90px] px-4">
          <div className="max-w-[1024px] mx-auto">
            {/* Highlights Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <h2 className="apple-feature-heading text-[#1d1d1f]">
                {SITE_CONTENT.highlights.heading}
              </h2>
              <a
                href={SITE_CONTENT.highlights.actionLink.href}
                className="apple-text-link"
              >
                <span>{SITE_CONTENT.highlights.actionLink.label}</span>
                <ChevronRight className="size-3.5 mt-0.5" />
              </a>
            </div>

            {/* Highlights Card Stage (Large 28px white card, NO shadow) */}
            <div className="apple-card bg-white border border-[#e6e6e8] min-h-[520px] flex flex-col justify-between overflow-hidden max-w-full [touch-action:pan-y]">
              {/* Card Title & Content */}
              <div className="mb-6">
                <span className="text-[14px] font-semibold uppercase tracking-wider text-[#707070]">
                  {SITE_CONTENT.highlights.cards[activeHighlightIndex].kicker}
                </span>
                <h3 className="apple-feature-heading text-[#1d1d1f] mt-2 mb-3">
                  {SITE_CONTENT.highlights.cards[activeHighlightIndex].title}
                </h3>
                <p className="apple-body text-[#707070] max-w-2xl">
                  {SITE_CONTENT.highlights.cards[activeHighlightIndex].description}
                </p>
              </div>

              {/* Dynamic Visual Content depending on active tab */}
              <div className="w-full bg-[#f5f5f7] rounded-[20px] p-6 border border-[#e6e6e8] min-h-[300px] flex items-center justify-center">
                {activeHighlightIndex === 0 && (
                  <div className="w-full max-w-2xl bg-white rounded-2xl p-4 border border-[#d6d6d6]">
                    <div className="flex items-center justify-between pb-3 border-b border-[#e6e6e8] mb-3">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-[#30d158]" />
                        <span className="text-[13px] font-semibold text-[#1d1d1f]">Live Inbound Sales Dialogue</span>
                      </div>
                      <GridLoader size={14} color="#0071e3" pattern="plus-hollow" />
                    </div>
                    <AIConversation className="h-[200px] space-y-3">
                      <AIMessage from="user" timestamp="10:14 AM" copyText="Can SandipAI handle SOC 2 compliance questions?">
                        Can SandipAI handle SOC 2 compliance questions and schedule a technical demo?
                      </AIMessage>
                      <AIMessage from="assistant" timestamp="10:14 AM" copyText="Yes! We are SOC 2 Type II certified.">
                        Yes, absolutely. SandipAI is SOC 2 Type II certified and trained on security documentation. I have verified our Solutions Engineer is available Thursday at 2:00 PM EST. Would you like me to book that slot?
                      </AIMessage>
                    </AIConversation>
                  </div>
                )}

                {activeHighlightIndex === 1 && (
                  <div className="w-full max-w-xl bg-white rounded-2xl p-5 border border-[#d6d6d6]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[12px] font-semibold text-[#707070] uppercase">
                        Reasoning Engine Verification
                      </span>
                      <GridLoader size={14} color="#0071e3" pattern="breathing" />
                    </div>
                    <AIReasoning defaultOpen={true} duration={1.2}>
                      <div className="space-y-2 py-1 text-[13px] text-[#1d1d1f]">
                        <p>1. Analyzing prospect inquiry: Company sizing (60 seats) indicates Enterprise tier.</p>
                        <p>2. Checking compliance requirement: SOC 2 Type II whitepaper verified in knowledge base.</p>
                        <p>3. Calling Google Calendar API: Found open slot on Thursday at 2:00 PM EST.</p>
                      </div>
                    </AIReasoning>
                  </div>
                )}

                {activeHighlightIndex === 2 && (
                  <div className="w-full max-w-xl bg-white rounded-2xl p-5 border border-[#d6d6d6] overflow-hidden">
                    <AIToolCall
                      name="crm_lookup_and_calendar_schedule"
                      summary="2 operations executed · 180ms"
                      status="success"
                      defaultOpen={true}
                      args={
                        <pre className="text-[12px] p-2 bg-[#f5f5f7] rounded border border-[#d6d6d6] text-[#1d1d1f] max-w-full overflow-x-auto whitespace-pre-wrap break-all">
                          {`{ "lead": "team@acmecorp.com", "seats": 60, "targetSlot": "Thursday 14:00 EST" }`}
                        </pre>
                      }
                      result={
                        <pre className="text-[12px] p-2 bg-[#f5f5f7] rounded border border-[#d6d6d6] text-[#0066cc] max-w-full overflow-x-auto whitespace-pre-wrap break-all">
                          {`{ "meetingConfirmed": true, "salesforceOpportunity": "$72,000 ARR" }`}
                        </pre>
                      }
                    />
                  </div>
                )}

                {activeHighlightIndex === 3 && (
                  <div className="w-full max-w-xl bg-white rounded-2xl p-5 border border-[#d6d6d6]">
                    <AITaskList
                      label="Autonomous Pipeline Plan"
                      tasks={[
                        { id: "t1", label: "Enrich domain & firmographic score", note: "98/100", status: "done" },
                        { id: "t2", label: "Verify SOC 2 and GDPR boundary requirements", note: "Confirmed", status: "done" },
                        { id: "t3", label: "Check Solutions Architect calendar slots", note: "2 slots found", status: "done" },
                        { id: "t4", label: "Dispatch Google Meet calendar invite", note: "Sent", status: "done" },
                        { id: "t5", label: "Sync enriched opportunity record to Salesforce", note: "Logged", status: "done" },
                      ]}
                      className="border-0 p-0 bg-transparent"
                    />
                  </div>
                )}
              </div>

              {/* Translucent Playback Control Pill (dots + play/pause) */}
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-[#e6e6e8]">
                <div className="flex items-center gap-2">
                  {SITE_CONTENT.highlights.cards.map((_, idx) => (
                    <button
                      key={idx}
                      aria-label={`Jump to slide ${idx + 1}`}
                      onClick={() => setActiveHighlightIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        activeHighlightIndex === idx
                          ? "w-8 bg-[#1d1d1f]"
                          : "w-2 bg-[#d6d6d6] hover:bg-[#86868b]"
                      }`}
                    />
                  ))}
                </div>

                <div className="inline-flex items-center gap-3 bg-white border border-[#d6d6d6] rounded-full px-3 py-1.5 text-[12px]">
                  <span className="text-[#707070] font-medium">
                    {activeHighlightIndex + 1} of {SITE_CONTENT.highlights.cards.length}
                  </span>
                  <button
                    aria-label={isCarouselPlaying ? "Pause carousel" : "Play carousel"}
                    onClick={() => setIsCarouselPlaying(!isCarouselPlaying)}
                    className="p-1 rounded-full text-[#1d1d1f] hover:text-[#0066cc]"
                  >
                    {isCarouselPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════════════
            4. FEATURES / EDITORIAL SECTIONS (White canvas, kicker, 40px statement, tilt-card visual)
            ═════════════════════════════════════════════════════════════════════════ */}
        <section id="features" className="scroll-mt-[56px] bg-white py-[90px] px-4">
          <div className="max-w-[1024px] mx-auto space-y-[90px]">
            {/* Section 1: Visual Right */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="apple-kicker text-[#707070] mb-2">
                  {SITE_CONTENT.editorialSections[0].kicker}
                </p>
                <h3 className="apple-feature-heading text-[#1d1d1f] mb-4">
                  {SITE_CONTENT.editorialSections[0].heading}
                </h3>
                <p className="apple-body text-[#707070] mb-6">
                  {SITE_CONTENT.editorialSections[0].body}
                </p>
                <a href={SITE_CONTENT.editorialSections[0].linkHref} className="apple-text-link">
                  <span>{SITE_CONTENT.editorialSections[0].linkText}</span>
                  <ChevronRight className="size-3.5 mt-0.5" />
                </a>
              </div>
              <div className="flex justify-center">
                <TiltCard
                  maxTilt={8}
                  glare={false}
                  className="w-full max-w-[420px] bg-[#f5f5f7] border border-[#d6d6d6] rounded-[28px] p-8 flex flex-col items-center justify-center text-center shadow-none"
                >
                  <div className="w-[180px] h-[180px] flex items-center justify-center">
                    <DynamicSiriOrb size="180px" state="idle" />
                  </div>
                  <span className="mt-6 inline-block px-3.5 py-1 text-[12px] font-semibold text-[#0066cc] bg-white border border-[#d6d6d6] rounded-full">
                    {SITE_CONTENT.editorialSections[0].statsBadge}
                  </span>
                </TiltCard>
              </div>
            </div>

            {/* Kinetic Type Scroll: Single statement band between sections (Ink on White) */}
            <div className="py-12 border-y border-[#d6d6d6] text-center max-w-full overflow-hidden">
              <DynamicKineticTypeScroll
                words={SITE_CONTENT.kineticBand}
                align="center"
                className="apple-feature-heading text-[#1d1d1f]"
              />
            </div>

            {/* Section 2: Visual Left */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 flex justify-center">
                <TiltCard
                  maxTilt={8}
                  glare={false}
                  className="w-full max-w-[420px] bg-[#f5f5f7] border border-[#d6d6d6] rounded-[28px] p-8 flex flex-col items-center justify-center text-center shadow-none"
                >
                  <div className="w-[180px] h-[180px] flex items-center justify-center">
                    <DynamicAIOrbFace
                      size={180}
                      state="streaming"
                      gaze={false}
                      colors={{
                        body: "oklch(75% 0.16 230)",
                        bodyEdge: "oklch(96% 0.02 230)",
                        feature: "#1d1d1f",
                      }}
                    />
                  </div>
                  <span className="mt-6 inline-block px-3.5 py-1 text-[12px] font-semibold text-[#0066cc] bg-white border border-[#d6d6d6] rounded-full">
                    {SITE_CONTENT.editorialSections[1].statsBadge}
                  </span>
                </TiltCard>
              </div>
              <div className="order-1 md:order-2">
                <p className="apple-kicker text-[#707070] mb-2">
                  {SITE_CONTENT.editorialSections[1].kicker}
                </p>
                <h3 className="apple-feature-heading text-[#1d1d1f] mb-4">
                  {SITE_CONTENT.editorialSections[1].heading}
                </h3>
                <p className="apple-body text-[#707070] mb-6">
                  {SITE_CONTENT.editorialSections[1].body}
                </p>
                <a href={SITE_CONTENT.editorialSections[1].linkHref} className="apple-text-link">
                  <span>{SITE_CONTENT.editorialSections[1].linkText}</span>
                  <ChevronRight className="size-3.5 mt-0.5" />
                </a>
              </div>
            </div>

            {/* Section 3: Visual Right */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="apple-kicker text-[#707070] mb-2">
                  {SITE_CONTENT.editorialSections[2].kicker}
                </p>
                <h3 className="apple-feature-heading text-[#1d1d1f] mb-4">
                  {SITE_CONTENT.editorialSections[2].heading}
                </h3>
                <p className="apple-body text-[#707070] mb-6">
                  {SITE_CONTENT.editorialSections[2].body}
                </p>
                <a href={SITE_CONTENT.editorialSections[2].linkHref} className="apple-text-link">
                  <span>{SITE_CONTENT.editorialSections[2].linkText}</span>
                  <ChevronRight className="size-3.5 mt-0.5" />
                </a>
              </div>
              <div className="flex justify-center">
                <TiltCard
                  maxTilt={8}
                  glare={false}
                  className="w-full max-w-[420px] bg-[#f5f5f7] border border-[#d6d6d6] rounded-[28px] p-8 flex flex-col items-center justify-center text-center shadow-none"
                >
                  <div className="w-[180px] h-[180px] flex items-center justify-center">
                    <DynamicSiriOrb size="180px" state="done" />
                  </div>
                  <span className="mt-6 inline-block px-3.5 py-1 text-[12px] font-semibold text-[#0066cc] bg-white border border-[#d6d6d6] rounded-full">
                    {SITE_CONTENT.editorialSections[2].statsBadge}
                  </span>
                </TiltCard>
              </div>
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════════════
            5. CUSTOMER STORIES (#f5f5f7 band with coverflow-carousel)
            ═════════════════════════════════════════════════════════════════════════ */}
        <section id="customers" className="scroll-mt-[56px] bg-[#f5f5f7] py-[90px] px-4 text-center">
          <div className="max-w-[1024px] mx-auto">
            <p className="apple-kicker text-[#707070] mb-2">Customer Impact</p>
            <h2 className="apple-feature-heading text-[#1d1d1f] mb-4">
              Proven on modern sales floors.
            </h2>
            <p className="apple-body text-[#707070] max-w-lg mx-auto mb-12">
              Browse real-world qualification metrics from revenue teams scaling pipeline volume.
            </p>

            <div className="w-full max-w-full overflow-hidden [touch-action:pan-y]">
              <DynamicCoverflowCarousel
                items={carouselItems}
                depth={120}
                rotation={28}
                spacing={250}
                autoplay={true}
                loop={true}
                className="py-4"
              />
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════════════
            6. PRICING (Three white 28px cards on white canvas, NO shadows)
            ═════════════════════════════════════════════════════════════════════════ */}
        <section id="pricing" className="scroll-mt-[56px] bg-white py-[90px] px-4">
          <div className="max-w-[1024px] mx-auto">
            <div className="text-center mb-16">
              <p className="apple-kicker text-[#707070] mb-2">Simple Pricing</p>
              <h2 className="apple-feature-heading text-[#1d1d1f] mb-3">
                Choose the plan that fits your growth.
              </h2>
              <p className="apple-body text-[#707070]">
                All plans include autonomous meeting booking and bi-directional CRM sync.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 items-stretch">
              {SITE_CONTENT.pricing.map((plan) => (
                <div
                  key={plan.id}
                  className={`apple-card bg-white rounded-[28px] p-[28px] border flex flex-col justify-between ${
                    plan.recommended
                      ? "border-2 border-[#0071e3]"
                      : "border-[#d6d6d6]"
                  }`}
                >
                  <div>
                    {plan.recommended && (
                      <span className="inline-block text-[11px] font-semibold text-[#0071e3] uppercase tracking-wider mb-2">
                        Recommended
                      </span>
                    )}
                    <h3 className="text-[24px] font-semibold text-[#1d1d1f]">
                      {plan.name}
                    </h3>
                    <p className="text-[13px] text-[#707070] mt-1 mb-6 min-h-[38px]">
                      {plan.description}
                    </p>

                    <div className="flex items-baseline gap-1 my-4">
                      <span className="text-[44px] font-semibold tracking-tight text-[#1d1d1f]">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-[15px] text-[#707070]">{plan.period}</span>
                      )}
                    </div>

                    <div className="space-y-3 pt-6 border-t border-[#e6e6e8]">
                      {plan.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-[13px] text-[#1d1d1f]">
                          <Check className="size-4 shrink-0 text-[#0071e3] mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <a
                      href="#pricing"
                      className={
                        plan.recommended
                          ? "apple-pill-btn w-full text-center py-2.5 text-[12px]"
                          : "apple-outline-pill-btn w-full text-center py-2.5 text-[12px]"
                      }
                    >
                      {plan.ctaText}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════════════
            7. FINAL CTA (Centered 80px statement, filled pill, siri-orb below)
            ═════════════════════════════════════════════════════════════════════════ */}
        <section id="cta" className="scroll-mt-[56px] bg-white py-[90px] px-4 text-center">
          <div className="max-w-[840px] mx-auto flex flex-col items-center">
            <h2 className="apple-hero-headline text-[#1d1d1f] mb-6">
              {SITE_CONTENT.finalCta.headline}
            </h2>

            <p className="apple-body text-[#707070] max-w-xl mx-auto mb-8">
              {SITE_CONTENT.finalCta.body}
            </p>

            <a href="#pricing" className="apple-pill-btn px-8 py-3 text-[14px] mb-12">
              {SITE_CONTENT.finalCta.ctaText}
            </a>

            {/* Siri Orb centerpiece below the button */}
            <div className="pt-4 flex items-center justify-center">
              <div className="w-[160px] h-[160px] flex items-center justify-center">
                <DynamicSiriOrb size="160px" state="idle" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ═════════════════════════════════════════════════════════════════════════
          10. FOOTER (#f5f5f7, small 12px links in columns, legal text in #707070)
          ═════════════════════════════════════════════════════════════════════════ */}
      <footer id="footer" className="bg-[#f5f5f7] border-t border-[#d6d6d6] pt-10 pb-16 px-4 text-[12px] text-[#707070]">
        <div className="max-w-[1024px] mx-auto">
          {/* Numbered Footnotes */}
          <div className="space-y-2 pb-8 border-b border-[#d6d6d6] text-[11px] leading-[1.4]">
            {SITE_CONTENT.footer.notes.map((note, idx) => (
              <p key={idx}>{note}</p>
            ))}
          </div>

          {/* Directory Links Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-b border-[#d6d6d6]">
            {SITE_CONTENT.footer.directory.map((col, idx) => (
              <div key={idx}>
                <h4 className="text-[12px] font-semibold text-[#1d1d1f] mb-3">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <a href={link.href} className="text-[#707070] hover:text-[#1d1d1f] hover:underline">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Copyright, Legal & Theme Toggle (in footer) */}
          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>{SITE_CONTENT.footer.legal.copyright}</span>
              {SITE_CONTENT.footer.legal.links.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className="hover:text-[#1d1d1f] hover:underline"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Theme Toggle placed in Footer */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#707070]">Appearance:</span>
              <ThemeToggle
                variant="sun-moon"
                size="sm"
                theme={theme}
                onThemeChange={handleThemeChange}
                showSystem={false}
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
