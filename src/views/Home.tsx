"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import PagePreloader from "@/components/smoothui/page-preloader";
import ThemeToggle from "@/components/smoothui/theme-toggle";
import AIOrbFace from "@/components/smoothui/ai-orb-face";
import LearnMoreLink from "@/components/orynvai/LearnMoreLink";
import ContinuousProductFilm from "@/components/orynvai/ContinuousProductFilm";
import VisualCostComparison from "@/components/orynvai/VisualCostComparison";
import BookingModal from "@/components/orynvai/BookingModal";
import VapiVoiceModal from "@/components/orynvai/VapiVoiceModal";
import { SITE_CONTENT } from "@/content/site";
import {
  Menu,
  X,
  Mic,
  Calendar,
} from "lucide-react";

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
          1. STICKY GLOBAL NAVIGATION
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
            <div className="ml-1 border-l border-[var(--dividers)] pl-2">
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
            2. OUTCOME-LED HERO SECTION
            ═════════════════════════════════════════════════════════════════════ */}
        <section
          className="bg-micro-grid relative overflow-hidden px-4 pt-12 pb-16 [contain:paint] sm:px-6 md:flex md:min-h-[min(calc(100svh-48px),780px)] md:items-center md:py-16 lg:px-8"
          id="hero"
          ref={heroRef}
        >
          <div aria-hidden="true" className="hero-grid-lines" />

          <div className="relative z-10 mx-auto grid w-full max-w-[1080px] grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-8 lg:gap-12">
            {/* Left Column: Headline & CTAs */}
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

            {/* Right Column: ORYNVAI Orb */}
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

              {/* Coverage Indicator */}
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
            3. HOW IT WORKS — Timed Auto-Playing Product Film
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
            4. COVERAGE COMPARISON (Visual Dial — No fabricated numbers)
            ═════════════════════════════════════════════════════════════════════ */}
        <section
          className="scroll-mt-[56px] border-t border-[var(--dividers)] bg-[var(--alt-band)] px-4 py-[96px] sm:px-6 lg:py-[112px]"
          id="comparison"
        >
          <VisualCostComparison onOpenBookingModal={openBookingModal} />
        </section>

        {/* ═════════════════════════════════════════════════════════════════════
            5. FINAL CTA — Closing Statement with Dual Action Paths
            ═════════════════════════════════════════════════════════════════════ */}
        <section
          className="relative scroll-mt-[56px] overflow-hidden border-t border-[var(--hairline)] bg-[var(--canvas)] px-4 py-[96px] text-center sm:px-6 lg:py-[120px]"
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
          6. SIMPLIFIED FOOTER
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

          {/* Legal Bar */}
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

      {/* Book a Sales Call Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />

      {/* Talk to ORYNVAI Voice Modal */}
      <VapiVoiceModal
        isOpen={vapiModalOpen}
        onClose={() => setVapiModalOpen(false)}
      />
    </div>
  );
}
