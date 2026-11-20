"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import gsap from "gsap";
import PagePreloader from "@/components/smoothui/page-preloader";
import ThemeToggle from "@/components/smoothui/theme-toggle";
import AIOrbFace from "@/components/smoothui/ai-orb-face";
import LearnMoreLink from "@/components/orynvai/LearnMoreLink";
import ContinuousProductFilm from "@/components/orynvai/ContinuousProductFilm";
import VisualCostComparison from "@/components/orynvai/VisualCostComparison";
import {
  ConversationalIntelligenceVisual,
  EcosystemSyncVisual,
  PipelineVelocityVisual,
} from "@/components/orynvai/FeatureVisuals";
import BookingModal from "@/components/orynvai/BookingModal";
import VapiVoiceModal from "@/components/orynvai/VapiVoiceModal";
import { SITE_CONTENT } from "@/content/site";
import {
  Menu,
  X,
  Mic,
  Calendar,
} from "lucide-react";

const DynamicKineticTypeScroll = dynamic(
  () => import("@/components/smoothui/kinetic-type-scroll"),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        className="mx-auto max-w-[820px] text-center text-[30px] font-semibold leading-[1.16] tracking-[-0.025em] text-[var(--ink)] opacity-75 sm:text-[44px]"
      >
        {SITE_CONTENT.kineticBand.join(" ")}
      </div>
    ),
  }
);

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [showPreloader, setShowPreloader] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [orbSize, setOrbSize] = useState(310);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [vapiModalOpen, setVapiModalOpen] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);

  const openBookingModal = useCallback(() => {
    setBookingModalOpen(true);
    setNavOpen(false);
  }, []);

  const openVapiModal = useCallback(() => {
    setVapiModalOpen(true);
    setNavOpen(false);
  }, []);

  // Initialize preloader, saved theme preference, and responsive orb sizing
  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      const savedTheme = localStorage.getItem("orynvai_theme") || localStorage.getItem("sandipai_theme");
      if (savedTheme === "dark" || savedTheme === "light") {
        setTheme(savedTheme);
        document.documentElement.classList.toggle("dark", savedTheme === "dark");
      }

      const hasSeenPreloader = sessionStorage.getItem("orynvai_preloader_seen");
      if (!hasSeenPreloader) {
        setShowPreloader(true);
        sessionStorage.setItem("orynvai_preloader_seen", "true");
      } else {
        setHeroReady(true);
      }
    });

    const updateOrbSize = () => {
      const w = window.innerWidth;
      if (w >= 768) {
        setNavOpen(false);
      }
      if (w >= 1280) {
        setOrbSize(330);
      } else if (w >= 1024) {
        setOrbSize(300);
      } else if (w >= 640) {
        setOrbSize(250);
      } else {
        setOrbSize(Math.max(180, Math.min(220, w - 64)));
      }
    };
    updateOrbSize();
    window.addEventListener("resize", updateOrbSize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updateOrbSize);
    };
  }, []);

  // Choreographed GSAP Hero Entrance (runs once when hero is ready, respects reduced motion)
  useEffect(() => {
    if (!heroReady || !heroRef.current) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      tl.from(".hero-kicker", {
        y: 12,
        opacity: 0,
        duration: 0.45,
        clearProps: "transform,opacity",
      })
        .from(
          ".hero-title-line",
          {
            y: 20,
            opacity: 0,
            duration: 0.62,
            stagger: 0.09,
            clearProps: "transform,opacity",
          },
          "-=0.28"
        )
        .from(
          ".hero-body",
          {
            y: 14,
            opacity: 0,
            duration: 0.52,
            clearProps: "transform,opacity",
          },
          "-=0.38"
        )
        .from(
          ".hero-actions",
          {
            y: 12,
            opacity: 0,
            duration: 0.48,
            clearProps: "transform,opacity",
          },
          "-=0.34"
        )
        .from(
          ".hero-orb-stage",
          {
            scale: 0.95,
            opacity: 0,
            duration: 0.72,
            ease: "power2.out",
            clearProps: "transform,opacity",
          },
          "-=0.52"
        );
    }, heroRef);

    return () => ctx.revert();
  }, [heroReady]);

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
    const resolved = newTheme === "dark" ? "dark" : "light";
    setTheme(resolved);
    document.documentElement.classList.toggle("dark", resolved === "dark");
    localStorage.setItem("orynvai_theme", resolved);
  };

  const orbColors = useMemo(
    () =>
      theme === "dark"
        ? {
            body: "#0a84ff",
            bodyEdge: "#d6ebff",
            feature: "#0b1220",
          }
        : {
            body: "#2b8af7",
            bodyEdge: "#f3f8ff",
            feature: "#1d1d1f",
          },
    [theme]
  );

  const headlineLines = useMemo(
    () => SITE_CONTENT.product.headline.split("\n"),
    []
  );

  return (
    <div className="bg-subtle-grain relative min-h-screen max-w-full overflow-x-clip bg-[var(--canvas)] text-[var(--ink)]">
      {/* Skip link for keyboard accessibility */}
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[110] focus:rounded-full focus:bg-[var(--pill-blue)] focus:px-4 focus:py-2 focus:text-xs focus:font-medium focus:text-white"
        href="#main-content"
      >
        Skip to content
      </a>

      {/* Page Preloader: Clean, fast, session-gated */}
      {showPreloader && (
        <PagePreloader
          background="bg-[var(--canvas)]"
          duration={1100}
          onComplete={() => {
            setShowPreloader(false);
            setHeroReady(true);
          }}
          variant="words"
          words={["Qualify.", "Convert.", "Revenue."]}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          1. STICKY GLOBAL NAVIGATION (48px authoritative bar, brand & CTAs + Theme in Top-Right)
          ═══════════════════════════════════════════════════════════════════════ */}
      <nav
        aria-label="Global"
        className="sticky inset-x-0 top-0 z-50 h-[48px] border-b border-[var(--nav-border)] bg-[var(--nav-surface)] backdrop-blur-md transition-colors"
      >
        <div className="mx-auto flex h-full max-w-[1080px] items-center justify-between px-4 sm:px-6">
          <a
            className="flex items-center gap-2.5 text-[17px] font-bold tracking-[-0.03em] text-[var(--ink)] transition-opacity hover:opacity-85"
            href="#hero"
          >
            <div className="relative size-6 shrink-0">
              <Image
                alt="ORYNVAI logo"
                className="size-6 object-contain dark:hidden"
                height={24}
                priority
                src="/orynvai-logo-black.png"
                width={24}
              />
              <Image
                alt="ORYNVAI logo"
                className="hidden size-6 object-contain dark:block"
                height={24}
                priority
                src="/orynvai-logo-white.png"
                width={24}
              />
            </div>
            <span className="font-semibold tracking-[0.02em]">
              {SITE_CONTENT.globalNav.brand}
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-8 md:flex">
            {SITE_CONTENT.globalNav.links.map((link) => (
              <a
                className="apple-nav-link text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Conversion Buttons + Far Top-Right Theme Toggle */}
          <div className="hidden items-center gap-3 md:flex">
            <button
              className="apple-outline-pill-btn flex items-center gap-1.5 py-1.5 text-[12px]"
              onClick={openVapiModal}
              type="button"
            >
              <Mic className="size-3 text-[var(--link)]" />
              <span>{SITE_CONTENT.globalNav.ctaVapi}</span>
            </button>
            <button
              className="apple-pill-btn py-1.5 text-[12px]"
              onClick={openBookingModal}
              type="button"
            >
              {SITE_CONTENT.globalNav.ctaBooking}
            </button>
            <div className="ml-1 pl-2 border-l border-[var(--dividers)]">
              <ThemeToggle
                onThemeChange={handleThemeChange}
                showSystem={false}
                size="sm"
                theme={theme}
                variant="sun-moon"
              />
            </div>
          </div>

          {/* Mobile Far Top-Right Container: Theme Toggle + Menu Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle
              onThemeChange={handleThemeChange}
              showSystem={false}
              size="sm"
              theme={theme}
              variant="sun-moon"
            />
            <button
              aria-controls="mobile-nav-menu"
              aria-expanded={navOpen}
              aria-label={navOpen ? "Close menu" : "Open menu"}
              className="flex h-[44px] w-[44px] items-center justify-center text-[var(--ink)] transition-colors hover:text-[var(--link)]"
              onClick={() => setNavOpen(!navOpen)}
              type="button"
            >
              <div className="relative flex size-6 items-center justify-center">
                <Menu
                  className={`absolute inset-0 size-6 transition-all duration-200 motion-reduce:transition-none ${
                    navOpen
                      ? "rotate-90 scale-75 opacity-0"
                      : "rotate-0 scale-100 opacity-100"
                  }`}
                />
                <X
                  className={`absolute inset-0 size-6 transition-all duration-200 motion-reduce:transition-none ${
                    navOpen
                      ? "rotate-0 scale-100 opacity-100"
                      : "-rotate-90 scale-75 opacity-0"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Sheet Menu */}
        {navOpen && (
          <>
            <div
              aria-hidden="true"
              className="fixed inset-0 top-[48px] z-40 bg-black/20 backdrop-blur-sm md:hidden"
              onClick={() => setNavOpen(false)}
            />
            <div
              className="mobile-sheet-animation absolute inset-x-0 top-[48px] z-50 border-b border-[var(--nav-border)] bg-[var(--nav-sheet)] px-6 py-6 backdrop-blur-[20px] md:hidden"
              id="mobile-nav-menu"
            >
              <div className="flex flex-col gap-5">
                <div className="flex flex-col">
                  {SITE_CONTENT.globalNav.links.map((link, idx) => (
                    <React.Fragment key={link.href}>
                      {idx > 0 && (
                        <div className="h-[1px] w-full bg-[var(--hairline)]" />
                      )}
                      <a
                        className="flex h-[48px] items-center text-[17px] font-medium text-[var(--ink)] transition-colors hover:text-[var(--link)]"
                        href={link.href}
                        onClick={() => setNavOpen(false)}
                      >
                        {link.label}
                      </a>
                    </React.Fragment>
                  ))}
                </div>

                <div className="flex flex-col gap-2.5 pt-2">
                  <button
                    className="apple-pill-btn flex h-[44px] w-full items-center justify-center gap-2 text-[14px]"
                    onClick={openBookingModal}
                    type="button"
                  >
                    <Calendar className="size-4" />
                    <span>{SITE_CONTENT.globalNav.ctaBooking}</span>
                  </button>
                  <button
                    className="apple-outline-pill-btn flex h-[44px] w-full items-center justify-center gap-2 text-[14px]"
                    onClick={openVapiModal}
                    type="button"
                  >
                    <Mic className="size-4 text-[var(--link)]" />
                    <span>{SITE_CONTENT.globalNav.ctaVapi}</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </nav>

      <main id="main-content">
        {/* ═════════════════════════════════════════════════════════════════════
            2. OUTCOME-LED HERO SECTION (The customer is the hero)
            ═════════════════════════════════════════════════════════════════════ */}
        <section
          className="bg-micro-grid relative overflow-hidden px-4 pt-12 pb-16 [contain:paint] sm:px-6 md:flex md:min-h-[min(calc(100svh-48px),780px)] md:items-center md:py-16 lg:px-8"
          id="hero"
          ref={heroRef}
        >
          <div aria-hidden="true" className="hero-grid-lines" />

          <div className="relative z-10 mx-auto grid w-full max-w-[1080px] grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-8 lg:gap-12">
            {/* Left Column: Composed Outcome Headline & Dual CTAs */}
            <div className="flex flex-col items-start text-left md:col-span-7">
              <p className="hero-kicker apple-kicker mb-4 text-[var(--text-secondary)]">
                {SITE_CONTENT.product.kicker}
              </p>

              <h1 className="apple-hero-headline mb-5 text-left text-[var(--ink)]">
                {headlineLines.map((line, i) => (
                  <span
                    className={`hero-title-line block ${
                      i === 1 ? "text-[var(--ink-muted)]" : "text-[var(--ink)]"
                    }`}
                    key={line}
                  >
                    {line}
                  </span>
                ))}
              </h1>

              <p className="hero-body apple-body mb-8 max-w-[540px] text-left text-[var(--text-secondary)]">
                {SITE_CONTENT.product.heroBody}
              </p>

              {/* Dual Action Conversion Strip */}
              <div className="hero-actions flex flex-wrap items-center gap-4">
                <button
                  className="apple-pill-btn flex items-center gap-2 px-6 py-3.5 text-[14px]"
                  onClick={openBookingModal}
                  type="button"
                >
                  <Calendar className="size-4" />
                  <span>{SITE_CONTENT.globalNav.ctaBooking}</span>
                </button>

                <button
                  className="apple-outline-pill-btn flex items-center gap-2 px-5 py-3.5 text-[14px]"
                  onClick={openVapiModal}
                  type="button"
                >
                  <Mic className="size-4 text-[var(--link)]" />
                  <span>{SITE_CONTENT.globalNav.ctaVapi}</span>
                </button>

                <div className="mt-2 w-full sm:mt-0 sm:w-auto">
                  <LearnMoreLink href={SITE_CONTENT.product.heroLinks[0].href}>
                    {SITE_CONTENT.product.heroLinks[0].label}
                  </LearnMoreLink>
                </div>
              </div>
            </div>

            {/* Right Column: Signature ORYNVAI Optical Character & Operational Capsule */}
            <div className="hero-orb-stage flex w-full max-w-full flex-col items-center justify-center md:col-span-5">
              <div
                className="flex max-w-full items-center justify-center"
                style={{ height: orbSize, width: orbSize }}
              >
                <AIOrbFace
                  aria-label="ORYNVAI autonomous revenue agent visual signature"
                  colors={orbColors}
                  gaze={true}
                  interactive={true}
                  showRing={true}
                  size={orbSize}
                  state="idle"
                />
              </div>

              {/* Coverage Indicator: Replaced pricing capsule with operational outcome */}
              <div className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-[var(--dividers)] bg-[var(--surface)] px-4 py-1.5 text-[12px] font-medium text-[var(--text-secondary)] shadow-sm">
                <span className="size-2 animate-pulse rounded-full bg-[var(--success)]" />
                <span className="tabular-nums text-[var(--ink)]">
                  {SITE_CONTENT.product.coverageBadge}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════════
            3. HOW IT WORKS — Continuous Interactive Product Film
            ═════════════════════════════════════════════════════════════════════ */}
        <section
          className="scroll-mt-[56px] bg-[var(--alt-band)] px-4 py-[88px] sm:px-6 lg:py-[104px]"
          id="how-it-works"
        >
          <div className="mx-auto max-w-[1080px]">
            <div className="mb-10 flex flex-col justify-between gap-4 border-b border-[var(--dividers)] pb-8 sm:flex-row sm:items-end">
              <div>
                <p className="apple-kicker mb-2 text-[var(--text-secondary)]">
                  {SITE_CONTENT.howItWorks.kicker}
                </p>
                <h2 className="apple-feature-heading text-[var(--ink)]">
                  {SITE_CONTENT.howItWorks.heading}
                </h2>
                <p className="mt-2 text-[16px] text-[var(--text-secondary)]">
                  {SITE_CONTENT.howItWorks.subheading}
                </p>
              </div>
              <LearnMoreLink href={SITE_CONTENT.howItWorks.actionLink.href}>
                {SITE_CONTENT.howItWorks.actionLink.label}
              </LearnMoreLink>
            </div>

            <ContinuousProductFilm />
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════════
            4. EDITORIAL FEATURE STORIES + KINETIC TYPOGRAPHY STATEMENT
            ═════════════════════════════════════════════════════════════════════ */}
        <section
          className="scroll-mt-[56px] bg-[var(--canvas)] px-4 py-[96px] sm:px-6 lg:py-[112px]"
          id="features"
        >
          <div className="mx-auto max-w-[1080px] space-y-[96px] lg:space-y-[120px]">
            {/* Feature 1: Conversational Intelligence */}
            <div
              className="grid scroll-mt-[72px] grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12"
              id="conversations"
            >
              <div className="lg:col-span-5">
                <p className="apple-kicker mb-2.5 text-[var(--text-secondary)]">
                  {SITE_CONTENT.editorialSections[0].kicker}
                </p>
                <h3 className="apple-feature-heading mb-4 text-[var(--ink)]">
                  {SITE_CONTENT.editorialSections[0].heading}
                </h3>
                <p className="apple-body mb-6 text-[var(--text-secondary)]">
                  {SITE_CONTENT.editorialSections[0].body}
                </p>
                <LearnMoreLink href={SITE_CONTENT.editorialSections[0].linkHref}>
                  {SITE_CONTENT.editorialSections[0].linkText}
                </LearnMoreLink>
              </div>
              <div className="lg:col-span-7">
                <ConversationalIntelligenceVisual
                  statsBadge={SITE_CONTENT.editorialSections[0].statsBadge}
                />
              </div>
            </div>

            {/* Editorial Kinetic Typography Moment */}
            <div className="border-y border-[var(--dividers)] py-16 sm:py-20">
              <div className="mx-auto max-w-[880px]">
                <DynamicKineticTypeScroll
                  align="center"
                  className="text-[30px] font-semibold leading-[1.15] tracking-[-0.028em] text-[var(--ink)] sm:text-[42px] lg:text-[48px]"
                  words={SITE_CONTENT.kineticBand}
                />
              </div>
            </div>

            {/* Feature 2: Pipeline Velocity */}
            <div
              className="grid scroll-mt-[72px] grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12"
              id="pipeline"
            >
              <div className="order-2 lg:order-1 lg:col-span-7">
                <PipelineVelocityVisual
                  statsBadge={SITE_CONTENT.editorialSections[1].statsBadge}
                />
              </div>
              <div className="order-1 lg:order-2 lg:col-span-5">
                <p className="apple-kicker mb-2.5 text-[var(--text-secondary)]">
                  {SITE_CONTENT.editorialSections[1].kicker}
                </p>
                <h3 className="apple-feature-heading mb-4 text-[var(--ink)]">
                  {SITE_CONTENT.editorialSections[1].heading}
                </h3>
                <p className="apple-body mb-6 text-[var(--text-secondary)]">
                  {SITE_CONTENT.editorialSections[1].body}
                </p>
                <LearnMoreLink href={SITE_CONTENT.editorialSections[1].linkHref}>
                  {SITE_CONTENT.editorialSections[1].linkText}
                </LearnMoreLink>
              </div>
            </div>

            {/* Feature 3: Ecosystem Sync */}
            <div
              className="grid scroll-mt-[72px] grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12"
              id="integrations"
            >
              <div className="lg:col-span-5">
                <p className="apple-kicker mb-2.5 text-[var(--text-secondary)]">
                  {SITE_CONTENT.editorialSections[2].kicker}
                </p>
                <h3 className="apple-feature-heading mb-4 text-[var(--ink)]">
                  {SITE_CONTENT.editorialSections[2].heading}
                </h3>
                <p className="apple-body mb-6 text-[var(--text-secondary)]">
                  {SITE_CONTENT.editorialSections[2].body}
                </p>
                <LearnMoreLink href={SITE_CONTENT.editorialSections[2].linkHref}>
                  {SITE_CONTENT.editorialSections[2].linkText}
                </LearnMoreLink>
              </div>
              <div className="lg:col-span-7">
                <EcosystemSyncVisual
                  statsBadge={SITE_CONTENT.editorialSections[2].statsBadge}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════════
            5. HUMAN VS ORYNVAI COST COMPARISON (Visual 24/7 Dial & Economic Value)
            ═════════════════════════════════════════════════════════════════════ */}
        <section
          className="scroll-mt-[56px] border-t border-[var(--dividers)] bg-[var(--alt-band)] px-4 py-[96px] sm:px-6 lg:py-[112px]"
          id="comparison"
        >
          <VisualCostComparison onOpenBookingModal={openBookingModal} />
        </section>

        {/* ═════════════════════════════════════════════════════════════════════
            6. CUSTOMER REVIEWS (Clean Non-Overlapping Responsive Grid)
            ═════════════════════════════════════════════════════════════════════ */}
        <section
          className="scroll-mt-[56px] bg-[var(--canvas)] px-4 py-[96px] sm:px-6 lg:py-[112px]"
          id="customers"
        >
          <div className="mx-auto max-w-[1080px]">
            <div className="mb-12 text-center">
              <p className="apple-kicker mb-2.5 text-[var(--text-secondary)]">
                Customer Proof
              </p>
              <h2 className="apple-feature-heading mb-4 text-[var(--ink)]">
                Proven on modern revenue floors.
              </h2>
              <p className="apple-body mx-auto max-w-[540px] text-[var(--text-secondary)]">
                Browse verified qualification metrics from revenue teams scaling inbound capacity.
              </p>
            </div>

            {/* Clean 2x2 Non-Overlapping Responsive Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {SITE_CONTENT.stories.map((story, idx) => {
                const indexLabel = String(idx + 1).padStart(2, "0");
                const metricParts = story.metric.split(" ");
                const metricValue = metricParts[0];
                const metricRest = metricParts.slice(1).join(" ");

                return (
                  <article
                    className="flex flex-col justify-between rounded-[14px] border border-[var(--dividers)] bg-[var(--surface)] p-6 text-left shadow-sm transition-colors hover:border-[var(--outlines)] sm:p-7"
                    key={story.id}
                  >
                    <div>
                      {/* Card Header Bar */}
                      <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-3">
                        <span className="font-mono text-[10.5px] font-semibold tracking-[0.08em] text-[var(--text-secondary)]">
                          CASE {indexLabel} / 04 · {story.company}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--pill-blue-soft)] px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-[var(--link)]">
                          Verified Outcome
                        </span>
                      </div>

                      {/* Pull Quote */}
                      <blockquote className="my-5 text-[16px] font-normal leading-[1.55] tracking-[-0.012em] text-[var(--ink)] sm:text-[17.5px]">
                        &ldquo;{story.quote}&rdquo;
                      </blockquote>

                      {/* Future Video Testimonial Extension Hook (Clean, no empty box or dead button) */}
                      {story.video?.available && story.video.videoUrl && (
                        <div className="my-4 overflow-hidden rounded-[8px] border border-[var(--hairline)]">
                          <video
                            className="w-full"
                            controls
                            poster={story.video.posterUrl}
                            src={story.video.videoUrl}
                          />
                        </div>
                      )}
                    </div>

                    {/* Card Footer: Metrics and Attribution */}
                    <footer className="mt-4 flex flex-wrap items-end justify-between gap-4 border-t border-[var(--hairline)] pt-4">
                      <div>
                        <p className="text-[14px] font-semibold text-[var(--ink)]">
                          {story.author}
                        </p>
                        <p className="text-[12px] text-[var(--text-secondary)]">
                          {story.role} · {story.company}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[26px] font-semibold leading-none tracking-[-0.03em] tabular-nums text-[var(--link)] sm:text-[30px]">
                          {metricValue}
                        </p>
                        <p className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)]">
                          {metricRest}
                        </p>
                      </div>
                    </footer>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════════
            7. FINAL CTA — Cohesive Closing Statement with Dual Action Paths
            ═════════════════════════════════════════════════════════════════════ */}
        <section
          className="relative scroll-mt-[56px] overflow-hidden border-t border-[var(--hairline)] bg-[var(--alt-band)] px-4 py-[96px] text-center sm:px-6 lg:py-[120px]"
          id="cta"
        >
          <div aria-hidden="true" className="cta-radial-lines" />

          <div className="relative z-10 mx-auto flex max-w-[780px] flex-col items-center">
            <div className="mb-8 flex size-[120px] items-center justify-center">
              <AIOrbFace
                aria-label="ORYNVAI signature emblem"
                colors={orbColors}
                gaze={true}
                interactive={true}
                showRing={true}
                size={120}
                state="idle"
              />
            </div>

            <h2 className="apple-cta-headline mb-5 text-[var(--ink)]">
              {SITE_CONTENT.finalCta.headline}
            </h2>

            <p className="apple-body mx-auto mb-8 max-w-[540px] text-[var(--text-secondary)]">
              {SITE_CONTENT.finalCta.body}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                className="apple-pill-btn flex items-center gap-2 px-8 py-3.5 text-[14px]"
                onClick={openBookingModal}
                type="button"
              >
                <Calendar className="size-4" />
                <span>{SITE_CONTENT.finalCta.ctaBooking}</span>
              </button>

              <button
                className="apple-outline-pill-btn flex items-center gap-2 px-6 py-3.5 text-[14px]"
                onClick={openVapiModal}
                type="button"
              >
                <Mic className="size-4 text-[var(--link)]" />
                <span>{SITE_CONTENT.finalCta.ctaVapi}</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════════════════════════════════════════════
          8. SIMPLIFIED FOOTER — Clean, Compact & Essential
          ═══════════════════════════════════════════════════════════════════════ */}
      <footer
        className="border-t border-[var(--dividers)] bg-[var(--surface)] px-4 py-12 text-[var(--text-secondary)] sm:px-6"
        id="footer"
      >
        <div className="mx-auto max-w-[1080px]">
          {/* Main Footer Row */}
          <div className="flex flex-col justify-between gap-8 pb-8 md:flex-row md:items-center">
            <div className="max-w-[420px]">
              <div className="flex items-center gap-2.5 text-[17px] font-bold tracking-[-0.03em] text-[var(--ink)]">
                <div className="relative size-6 shrink-0">
                  <Image
                    alt="ORYNVAI logo"
                    className="size-6 object-contain dark:hidden"
                    height={24}
                    src="/orynvai-logo-black.png"
                    width={24}
                  />
                  <Image
                    alt="ORYNVAI logo"
                    className="hidden size-6 object-contain dark:block"
                    height={24}
                    src="/orynvai-logo-white.png"
                    width={24}
                  />
                </div>
                <span>{SITE_CONTENT.footer.brand}</span>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-[var(--text-secondary)]">
                {SITE_CONTENT.footer.description}
              </p>
            </div>

            {/* Essential Nav Links */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {SITE_CONTENT.footer.essentialLinks.map((link) => (
                <a
                  className="text-[13px] text-[var(--text-secondary)] transition-colors hover:text-[var(--ink)]"
                  href={link.href}
                  key={link.label}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Legal Bar (Theme toggle strictly moved to top-right header) */}
          <div className="flex flex-col items-start justify-between gap-4 border-t border-[var(--hairline)] pt-6 text-[12px] md:flex-row md:items-center">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="font-medium text-[var(--ink-muted)]">
                {SITE_CONTENT.footer.legal.copyright}
              </span>
              {SITE_CONTENT.footer.legal.links.map((item) => (
                <a
                  className="text-[var(--text-secondary)] transition-colors hover:text-[var(--ink)]"
                  href={item.href}
                  key={item.label}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Option A: Book a Sales Call Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />

      {/* Option B: Talk to ORYNVAI Voice Modal */}
      <VapiVoiceModal
        isOpen={vapiModalOpen}
        onClose={() => setVapiModalOpen(false)}
      />
    </div>
  );
}
