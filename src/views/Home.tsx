"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import PagePreloader from "@/components/smoothui/page-preloader";
import ThemeToggle from "@/components/smoothui/theme-toggle";
import AIOrbFace from "@/components/smoothui/ai-orb-face";
import type { CoverflowCarouselItem } from "@/components/smoothui/coverflow-carousel";
import LearnMoreLink from "@/components/sandip/LearnMoreLink";
import ProductHighlightsStage from "@/components/sandip/ProductHighlightsStage";
import {
  ConversationalIntelligenceVisual,
  EcosystemSyncVisual,
  PipelineVelocityVisual,
} from "@/components/sandip/FeatureVisuals";
import DemoModal from "@/components/sandip/DemoModal";
import { SITE_CONTENT } from "@/content/site";
import { Check, Menu, X } from "lucide-react";

const DynamicCoverflowCarousel = dynamic(
  () => import("@/components/smoothui/coverflow-carousel"),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        className="mx-auto flex h-[340px] w-full max-w-[520px] items-center justify-center rounded-[28px] border border-[var(--hairline)] bg-[var(--surface)] text-sm text-[var(--text-secondary)]"
      >
        Loading customer stories…
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
        className="mx-auto max-w-[820px] text-center text-[30px] font-semibold leading-[1.16] tracking-[-0.025em] text-[var(--ink)] opacity-75 sm:text-[44px]"
      >
        {SITE_CONTENT.kineticBand.join(" ")}
      </div>
    ),
  }
);

const PLAN_LABEL_MAP: Record<string, string> = {
  "plan-growth": "Growth ($1,490/mo)",
  "plan-scale": "Scale ($3,490/mo)",
  "plan-enterprise": "Enterprise (Custom)",
};

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [showPreloader, setShowPreloader] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [orbSize, setOrbSize] = useState(310);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("Scale ($3,490/mo)");
  const heroRef = useRef<HTMLElement | null>(null);

  const openDemoModal = useCallback((planName = "Scale ($3,490/mo)") => {
    setSelectedPlan(planName);
    setDemoModalOpen(true);
    setNavOpen(false);
  }, []);

  // Initialize preloader, saved theme preference, and responsive orb sizing
  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      const savedTheme = localStorage.getItem("sandipai_theme");
      if (savedTheme === "dark" || savedTheme === "light") {
        setTheme(savedTheme);
        document.documentElement.classList.toggle("dark", savedTheme === "dark");
      }

      const hasSeenPreloader = sessionStorage.getItem("sandipai_apple_preloader_seen");
      if (!hasSeenPreloader) {
        setShowPreloader(true);
        sessionStorage.setItem("sandipai_apple_preloader_seen", "true");
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
    localStorage.setItem("sandipai_theme", resolved);
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

  const carouselItems: CoverflowCarouselItem[] = useMemo(
    () =>
      SITE_CONTENT.stories.map((story) => ({
        id: story.id,
        content: (
          <article className="flex h-full w-full flex-col justify-between rounded-[28px] border border-[var(--dividers)] bg-[var(--surface)] p-6 text-left sm:p-8">
            <div>
              <div className="mb-4 flex items-center justify-between gap-2">
                <span className="inline-flex items-center rounded-full border border-[var(--hairline)] bg-[var(--pill-blue-soft)] px-3 py-1 text-[12px] font-semibold tabular-nums text-[var(--link)]">
                  {story.metric}
                </span>
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  {story.company}
                </span>
              </div>
              <blockquote className="text-[17px] font-normal leading-[1.5] tracking-[-0.015em] text-[var(--ink)] sm:text-[19px]">
                &ldquo;{story.quote}&rdquo;
              </blockquote>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-[var(--hairline)] pt-4">
              <div>
                <p className="text-[14px] font-semibold text-[var(--ink)]">
                  {story.author}
                </p>
                <p className="text-[12px] text-[var(--text-secondary)]">
                  {story.role} · {story.company}
                </p>
              </div>
              <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--outlines)]">
                Design Partner
              </span>
            </div>
          </article>
        ),
      })),
    []
  );

  return (
    <div className="relative min-h-screen max-w-full overflow-x-clip bg-[var(--canvas)] text-[var(--ink)]">
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
          words={["Qualify.", "Convert.", "Close."]}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          1. STICKY GLOBAL NAVIGATION (44px, single authoritative bar)
          ═══════════════════════════════════════════════════════════════════════ */}
      <nav
        aria-label="Global"
        className="sticky inset-x-0 top-0 z-50 h-[48px] border-b border-[var(--nav-border)] bg-[var(--nav-surface)] backdrop-blur-md transition-colors"
      >
        <div className="mx-auto flex h-full max-w-[1080px] items-center justify-between px-4 sm:px-6">
          <a
            className="flex items-center gap-2 text-[17px] font-semibold tracking-[-0.02em] text-[var(--ink)] transition-opacity hover:opacity-80"
            href="#hero"
          >
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-[var(--pill-blue)]"
            />
            {SITE_CONTENT.globalNav.brand}
          </a>

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

          <div className="hidden items-center gap-3 md:flex">
            <button
              className="apple-pill-btn py-1.5 text-[12px]"
              onClick={() => openDemoModal()}
              type="button"
            >
              Get a demo
            </button>
          </div>

          <button
            aria-controls="mobile-nav-menu"
            aria-expanded={navOpen}
            aria-label={navOpen ? "Close menu" : "Open menu"}
            className="-mr-2 flex h-[44px] w-[44px] items-center justify-center text-[var(--ink)] transition-colors hover:text-[var(--link)] md:hidden"
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

        {/* Mobile Sheet */}
        {navOpen && (
          <>
            <div
              aria-hidden="true"
              className="fixed inset-0 top-[48px] z-40 bg-black/15 md:hidden"
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

                <div className="pt-1">
                  <button
                    className="apple-pill-btn h-[44px] w-full text-[14px]"
                    onClick={() => openDemoModal()}
                    type="button"
                  >
                    Get a demo
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </nav>

      <main id="main-content">
        {/* ═════════════════════════════════════════════════════════════════════
            2. HERO SECTION (Editorial typography + signature SandipAI optical orb)
            ═════════════════════════════════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden bg-[var(--canvas)] px-4 pt-12 pb-16 [contain:paint] sm:px-6 md:flex md:min-h-[min(calc(100svh-48px),780px)] md:items-center md:py-16 lg:px-8"
          id="hero"
          ref={heroRef}
        >
          <div aria-hidden="true" className="hero-grid-lines" />

          <div className="relative z-10 mx-auto grid w-full max-w-[1080px] grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-8 lg:gap-12">
            {/* Left Column: Composed Headline, Body & Actions */}
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

              <p className="hero-body apple-body mb-8 max-w-[520px] text-left text-[var(--text-secondary)]">
                {SITE_CONTENT.product.heroBody}
              </p>

              <div className="hero-actions flex flex-wrap items-center gap-x-6 gap-y-3">
                <button
                  className="apple-pill-btn px-6 py-3 text-[14px]"
                  onClick={() => openDemoModal()}
                  type="button"
                >
                  {SITE_CONTENT.product.pricingCallout.ctaText}
                </button>
                <LearnMoreLink href={SITE_CONTENT.product.heroLinks[0].href}>
                  {SITE_CONTENT.product.heroLinks[0].label}
                </LearnMoreLink>
              </div>
            </div>

            {/* Right Column: SandipAI Optical Character & Pricing Capsule */}
            <div className="hero-orb-stage flex w-full max-w-full flex-col items-center justify-center md:col-span-5">
              <div
                className="flex max-w-full items-center justify-center"
                style={{ height: orbSize, width: orbSize }}
              >
                <AIOrbFace
                  aria-label="SandipAI autonomous sales agent visual signature"
                  colors={orbColors}
                  gaze={true}
                  interactive={true}
                  showRing={true}
                  size={orbSize}
                  state="idle"
                />
              </div>

              <div className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-[var(--dividers)] bg-[var(--alt-band)] px-4 py-1.5 text-[12px] font-medium text-[var(--text-secondary)]">
                <span className="size-1.5 rounded-full bg-[var(--success)]" />
                <span className="tabular-nums">
                  {SITE_CONTENT.product.pricingCallout.priceText}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════════
            3. PRODUCT HIGHLIGHTS — Connected 4-Stage Interactive Sales Story
            ═════════════════════════════════════════════════════════════════════ */}
        <section
          className="scroll-mt-[56px] bg-[var(--alt-band)] px-4 py-[88px] sm:px-6 lg:py-[104px]"
          id="how-it-works"
        >
          <div className="mx-auto max-w-[1080px]">
            <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="apple-feature-heading text-[var(--ink)]">
                  {SITE_CONTENT.highlights.heading}
                </h2>
                <p className="mt-2 text-[16px] text-[var(--text-secondary)]">
                  Follow one enterprise inquiry from first question to booked calendar invite.
                </p>
              </div>
              <LearnMoreLink href={SITE_CONTENT.highlights.actionLink.href}>
                {SITE_CONTENT.highlights.actionLink.label}
              </LearnMoreLink>
            </div>

            <ProductHighlightsStage />
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
            5. CUSTOMER IMPACT — Balanced Coverflow Carousel
            ═════════════════════════════════════════════════════════════════════ */}
        <section
          className="scroll-mt-[56px] bg-[var(--alt-band)] px-4 py-[96px] text-center sm:px-6 lg:py-[112px]"
          id="customers"
        >
          <div className="mx-auto max-w-[1080px]">
            <p className="apple-kicker mb-2.5 text-[var(--text-secondary)]">
              Customer Impact
            </p>
            <h2 className="apple-feature-heading mb-4 text-[var(--ink)]">
              Proven on modern sales floors.
            </h2>
            <p className="apple-body mx-auto mb-12 max-w-[540px] text-[var(--text-secondary)]">
              Browse real-world qualification metrics from revenue teams scaling
              pipeline volume.
            </p>

            <div className="w-full max-w-full overflow-hidden [touch-action:pan-y]">
              <DynamicCoverflowCarousel
                autoplay={true}
                autoplayDelay={5500}
                className="py-2"
                depth={130}
                items={carouselItems}
                loop={true}
                rotation={18}
                scaleStep={0.11}
                spacing={370}
              />
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════════
            6. PRICING — Crisp Three-Tier Architecture
            ═════════════════════════════════════════════════════════════════════ */}
        <section
          className="scroll-mt-[56px] bg-[var(--canvas)] px-4 py-[96px] sm:px-6 lg:py-[112px]"
          id="pricing"
        >
          <div className="mx-auto max-w-[1080px]">
            <div className="mb-14 text-center">
              <p className="apple-kicker mb-2.5 text-[var(--text-secondary)]">
                Simple Pricing
              </p>
              <h2 className="apple-feature-heading mb-3 text-[var(--ink)]">
                Choose the plan that fits your growth.
              </h2>
              <p className="apple-body mx-auto max-w-[540px] text-[var(--text-secondary)]">
                All plans include autonomous meeting booking and bi-directional
                CRM sync.
              </p>
            </div>

            <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
              {SITE_CONTENT.pricing.map((plan) => (
                <div
                  className={`flex flex-col justify-between rounded-[28px] p-7 transition-colors ${
                    plan.recommended
                      ? "border-2 border-[var(--pill-blue)] bg-[var(--surface)]"
                      : "border border-[var(--dividers)] bg-[var(--surface-subtle)] hover:border-[var(--outlines)]"
                  }`}
                  key={plan.id}
                >
                  <div>
                    <div className="mb-3 flex h-6 items-center justify-between">
                      <h3 className="text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">
                        {plan.name}
                      </h3>
                      {plan.recommended && (
                        <span className="rounded-full bg-[var(--pill-blue-soft)] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--link)]">
                          Recommended
                        </span>
                      )}
                    </div>

                    <p className="min-h-[44px] text-[14px] leading-[1.5] text-[var(--text-secondary)]">
                      {plan.description}
                    </p>

                    <div className="my-6 flex items-baseline gap-1.5">
                      <span className="text-[42px] font-semibold leading-none tracking-[-0.03em] tabular-nums text-[var(--ink)]">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-[15px] text-[var(--text-secondary)]">
                          {plan.period}
                        </span>
                      )}
                    </div>

                    <ul className="space-y-3 border-t border-[var(--hairline)] pt-6">
                      {plan.features.map((feature) => (
                        <li
                          className="flex items-start gap-2.5 text-[14px] leading-[1.45] text-[var(--ink)]"
                          key={feature}
                        >
                          <Check className="mt-0.5 size-4 shrink-0 text-[var(--pill-blue)]" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-2">
                    <button
                      className={
                        plan.recommended
                          ? "apple-pill-btn w-full py-3 text-[13px]"
                          : "apple-outline-pill-btn w-full py-3 text-[13px]"
                      }
                      onClick={() =>
                        openDemoModal(PLAN_LABEL_MAP[plan.id] ?? plan.name)
                      }
                      type="button"
                    >
                      {plan.ctaText}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════════
            7. FINAL CTA — Cohesive Closing Statement with Signature Mark
            ═════════════════════════════════════════════════════════════════════ */}
        <section
          className="relative scroll-mt-[56px] overflow-hidden border-t border-[var(--hairline)] bg-[var(--canvas)] px-4 py-[96px] text-center sm:px-6 lg:py-[120px]"
          id="cta"
        >
          <div aria-hidden="true" className="cta-radial-lines" />

          <div className="relative z-10 mx-auto flex max-w-[780px] flex-col items-center">
            <div className="mb-8 flex size-[132px] items-center justify-center">
              <AIOrbFace
                aria-label="SandipAI signature emblem"
                colors={orbColors}
                gaze={true}
                interactive={true}
                showRing={true}
                size={132}
                state="idle"
              />
            </div>

            <h2 className="apple-cta-headline mb-5 text-[var(--ink)]">
              {SITE_CONTENT.finalCta.headline}
            </h2>

            <p className="apple-body mx-auto mb-8 max-w-[540px] text-[var(--text-secondary)]">
              {SITE_CONTENT.finalCta.body}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-5">
              <button
                className="apple-pill-btn px-8 py-3.5 text-[14px]"
                onClick={() => openDemoModal()}
                type="button"
              >
                {SITE_CONTENT.finalCta.ctaText}
              </button>
              <LearnMoreLink href="#pricing">Compare plans</LearnMoreLink>
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════════════════════════════════════════════
          8. FOOTER — Comfortable Readability, Working Anchors & Theme Toggle
          ═══════════════════════════════════════════════════════════════════════ */}
      <footer
        className="border-t border-[var(--dividers)] bg-[var(--alt-band)] px-4 pt-12 pb-16 text-[var(--text-secondary)] sm:px-6"
        id="footer"
      >
        <div className="mx-auto max-w-[1080px]">
          {/* Numbered Footnotes */}
          <div className="space-y-2.5 border-b border-[var(--dividers)] pb-8 text-[12px] leading-[1.6]">
            {SITE_CONTENT.footer.notes.map((note, idx) => (
              <p key={idx}>{note}</p>
            ))}
          </div>

          {/* Directory Columns */}
          <div className="grid grid-cols-2 gap-8 border-b border-[var(--dividers)] py-10 md:grid-cols-4">
            {SITE_CONTENT.footer.directory.map((col) => (
              <div key={col.title}>
                <h4 className="mb-3.5 text-[13px] font-semibold text-[var(--ink)]">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={`${col.title}-${link.label}`}>
                      <a
                        className="text-[13px] text-[var(--text-secondary)] transition-colors hover:text-[var(--ink)] hover:underline hover:underline-offset-4"
                        href={link.href}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Legal Bar & Appearance Toggle */}
          <div className="flex flex-col items-start justify-between gap-5 pt-7 text-[12px] md:flex-row md:items-center">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="font-medium text-[var(--ink-muted)]">
                {SITE_CONTENT.footer.legal.copyright}
              </span>
              {SITE_CONTENT.footer.legal.links.map((item) => (
                <a
                  className="text-[var(--text-secondary)] transition-colors hover:text-[var(--ink)] hover:underline"
                  href={item.href}
                  key={item.label}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                Appearance
              </span>
              <ThemeToggle
                onThemeChange={handleThemeChange}
                showSystem={false}
                size="sm"
                theme={theme}
                variant="sun-moon"
              />
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Live Demo Modal */}
      <DemoModal
        initialPlan={selectedPlan}
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />
    </div>
  );
}
