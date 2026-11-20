"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SITE_CONTENT } from "@/content/site";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  RotateCcw,
  ChevronRight,
  Play,
} from "lucide-react";

/**
 * ContinuousProductFilm — Timed, auto-playing product walkthrough.
 *
 * Plays once when visible (IntersectionObserver), advances every 4s.
 * No scroll-scrubbing. No GSAP ScrollTrigger. Replay button at end.
 * All content is illustrative demo data, explicitly labelled.
 */

const STAGE_DURATION_MS = 4200;

export default function ContinuousProductFilm() {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const [activeStage, setActiveStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stages = SITE_CONTENT.howItWorks.stages;

  // Clear any running interval
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Start the timed sequence
  const startPlayback = useCallback(() => {
    clearTimer();
    setActiveStage(0);
    setIsPlaying(true);
    setHasCompleted(false);
    setHasStarted(true);

    let current = 0;
    timerRef.current = setInterval(() => {
      current += 1;
      if (current >= stages.length) {
        clearTimer();
        setIsPlaying(false);
        setHasCompleted(true);
      } else {
        setActiveStage(current);
      }
    }, STAGE_DURATION_MS);
  }, [stages.length, clearTimer]);

  // Auto-play when visible (once)
  useEffect(() => {
    if (!containerRef.current || hasStarted) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startPlayback();
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasStarted, startPlayback]);

  // Cleanup on unmount
  useEffect(() => () => clearTimer(), [clearTimer]);

  // Manual stage jump (pauses auto-play)
  const jumpToStage = (index: number) => {
    clearTimer();
    setIsPlaying(false);
    setHasStarted(true);
    setHasCompleted(index === stages.length - 1);
    setActiveStage(Math.max(0, Math.min(stages.length - 1, index)));
  };

  // Progress bar width
  const progressPct = ((activeStage + 1) / stages.length) * 100;

  return (
    <div className="relative mx-auto w-full max-w-[1100px]" ref={containerRef}>
      {/* ── Progress Bar ─────────────────────────────────────────────── */}
      <div className="mb-6">
        <div className="h-[3px] w-full overflow-hidden rounded-full bg-[var(--hairline)]">
          <div
            className="h-full rounded-full bg-[var(--link)] transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-[12px]">
          <div className="flex items-center gap-3">
            {stages.map((st, idx) => (
              <button
                aria-label={`Step ${idx + 1}: ${st.shortTitle}`}
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-medium transition-all ${
                  idx === activeStage
                    ? "bg-[var(--pill-blue)] text-white"
                    : idx < activeStage
                    ? "text-[var(--link)]"
                    : "text-[var(--text-secondary)]"
                }`}
                key={st.id}
                onClick={() => jumpToStage(idx)}
                type="button"
              >
                <span className="font-mono text-[10px]">{st.step}</span>
                <span className="hidden sm:inline">{st.shortTitle}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {hasCompleted && (
              <button
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--dividers)] bg-[var(--surface)] px-3 py-1 text-[11.5px] font-medium text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
                onClick={startPlayback}
                type="button"
              >
                <RotateCcw className="size-3" />
                <span>Replay</span>
              </button>
            )}
            {!isPlaying && !hasStarted && (
              <button
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--pill-blue)] px-3 py-1 text-[11.5px] font-medium text-white"
                onClick={startPlayback}
                type="button"
              >
                <Play className="size-3" />
                <span>Play</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Visual Stage Arena ────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-[20px] border border-[var(--dividers)] bg-[var(--surface)] p-6 shadow-sm md:p-10">
        {/* Subtle grid background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-micro-grid opacity-40"
        />

        {/* Stage headline */}
        <div className="relative z-10 mb-6 max-w-[620px]">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--link)]">
            Step {stages[activeStage].step} of {String(stages.length).padStart(2, "0")}
          </p>
          <h3 className="mt-2 text-[24px] font-bold tracking-[-0.025em] text-[var(--ink)] sm:text-[28px]">
            {stages[activeStage].headline}
          </h3>
          <p className="mt-1.5 text-[14.5px] text-[var(--text-secondary)]">
            {stages[activeStage].description}
          </p>
        </div>

        {/* ── Stage visuals ───────────────────────────────────────────── */}
        <div className="relative z-10 flex min-h-[400px] items-center justify-center sm:min-h-[440px]">
          <AnimatePresence mode="wait">
            {/* STAGE 01: LEAD ARRIVES */}
            {activeStage === 0 && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[520px]"
                exit={{ opacity: 0, y: -12 }}
                initial={{ opacity: 0, y: 12 }}
                key="stage-01"
                transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
              >
                <div className="rounded-[16px] border border-[var(--dividers)] bg-[var(--surface)] p-6 shadow-lg">
                  <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative flex size-3">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex size-3 rounded-full bg-emerald-500" />
                      </div>
                      <span className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[var(--ink)]">
                        New Inbound Lead
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-[var(--text-secondary)]">
                      After Hours
                    </span>
                  </div>

                  {/* Illustrative prospect */}
                  <div className="mt-5 rounded-[12px] border border-[var(--hairline)] bg-[var(--surface-subtle)] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-[var(--ink)] text-[13px] font-bold text-white">
                        ?
                      </div>
                      <div>
                        <p className="text-[14.5px] font-semibold text-[var(--ink)]">
                          Enterprise Prospect
                        </p>
                        <p className="text-[12px] text-[var(--text-secondary)]">
                          Inquiring via your website
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Inquiry */}
                  <div className="mt-4 rounded-[12px] border-l-4 border-l-[var(--link)] border border-[var(--hairline)] bg-[var(--surface)] p-4">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)]">
                      Prospect Inquiry
                    </p>
                    <p className="mt-1.5 text-[15px] font-medium leading-[1.5] text-[var(--ink)]">
                      &ldquo;We get hundreds of inbound leads over weekends and lose buyers because nobody is online. Can you help?&rdquo;
                    </p>
                  </div>

                  <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
                    Illustrative demonstration
                  </p>
                </div>
              </motion.div>
            )}

            {/* STAGE 02: ORYNVAI RESPONDS */}
            {activeStage === 1 && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[540px]"
                exit={{ opacity: 0, y: -12 }}
                initial={{ opacity: 0, y: 12 }}
                key="stage-02"
                transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
              >
                <div className="rounded-[16px] border border-[var(--dividers)] bg-[var(--surface)] p-6 shadow-lg">
                  {/* Previous context */}
                  <div className="rounded-[10px] border border-[var(--hairline)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[13px] text-[var(--text-secondary)]">
                    <span className="font-semibold text-[var(--ink)]">Prospect:</span> &ldquo;Can you help us capture weekend leads?&rdquo;
                  </div>

                  {/* ORYNVAI response */}
                  <div className="mt-4 rounded-[14px] border border-[var(--dividers)] bg-[var(--surface)] p-5 shadow-sm">
                    <div className="flex items-center gap-2.5 pb-3">
                      <img
                        alt="ORYNVAI logo"
                        className="size-5 object-contain dark:invert"
                        src="/orynvai-logo-black.png"
                      />
                      <span className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.06em] text-[var(--link)]">
                        ORYNVAI
                      </span>
                    </div>

                    <p className="text-[14.5px] leading-[1.6] text-[var(--ink)]">
                      &ldquo;Absolutely. ORYNVAI engages prospects continuously — answering technical questions, checking rep availability, and booking meetings directly into your calendar.&rdquo;
                    </p>

                    <div className="mt-3.5 rounded-[10px] border border-[var(--hairline)] bg-[var(--surface-subtle)] p-3.5">
                      <p className="text-[13.5px] font-medium text-[var(--ink)]">
                        &ldquo;I see your team has availability this week. Would you like me to book a walkthrough?&rdquo;
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
                    Illustrative demonstration
                  </p>
                </div>
              </motion.div>
            )}

            {/* STAGE 03: INTENT QUALIFIED */}
            {activeStage === 2 && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[520px]"
                exit={{ opacity: 0, y: -12 }}
                initial={{ opacity: 0, y: 12 }}
                key="stage-03"
                transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
              >
                <div className="rounded-[16px] border border-[var(--dividers)] bg-[var(--surface)] p-6 shadow-lg">
                  {/* Buyer agrees */}
                  <div className="flex items-center justify-between rounded-[12px] border border-[var(--hairline)] bg-[var(--surface-subtle)] p-4">
                    <div>
                      <span className="font-mono text-[10px] uppercase text-[var(--text-secondary)]">
                        Buyer Acceptance
                      </span>
                      <p className="mt-1 text-[14.5px] font-semibold text-[var(--ink)]">
                        &ldquo;That time works for our team.&rdquo;
                      </p>
                    </div>
                    <span className="flex size-7 items-center justify-center rounded-full bg-emerald-500/15 font-bold text-emerald-600">
                      ✓
                    </span>
                  </div>

                  {/* Qualified lead card */}
                  <div className="mt-5 rounded-[14px] border-2 border-[var(--link)] bg-[var(--surface)] p-5 shadow-sm">
                    <div className="flex items-center gap-2 border-b border-[var(--hairline)] pb-3">
                      <CheckCircle2 className="size-4 text-[var(--link)]" />
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--ink)]">
                        Opportunity Qualified
                      </span>
                    </div>

                    <div className="mt-3.5 space-y-2 text-[13px]">
                      <div className="flex justify-between border-b border-[var(--hairline)] py-1">
                        <span className="text-[var(--text-secondary)]">Need:</span>
                        <span className="font-semibold text-[var(--ink)]">Continuous inbound coverage</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-[var(--text-secondary)]">Next:</span>
                        <span className="font-semibold text-[var(--link)]">Book calendar meeting</span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
                    Illustrative demonstration
                  </p>
                </div>
              </motion.div>
            )}

            {/* STAGE 04: MEETING BOOKED (Calendar) */}
            {activeStage === 3 && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[540px]"
                exit={{ opacity: 0, y: -12 }}
                initial={{ opacity: 0, y: 12 }}
                key="stage-04"
                transition={{ duration: shouldReduceMotion ? 0 : 0.35 }}
              >
                <div
                  className="relative rounded-[20px] border border-[#d2d2d7] bg-gradient-to-b from-white to-[#fbfbfd] p-7 shadow-2xl dark:border-[#3a3a42] dark:from-[#1c1c20] dark:to-[#141417]"
                  style={{
                    transformStyle: "preserve-3d",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  {/* Spiral binding rings */}
                  <div
                    aria-hidden="true"
                    className="absolute -top-3.5 inset-x-8 flex justify-between px-4"
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((ring) => (
                      <div
                        className="h-7 w-2.5 rounded-full border border-gray-400 bg-gradient-to-r from-gray-200 via-white to-gray-300 shadow-sm dark:border-gray-600 dark:from-gray-700 dark:via-gray-500 dark:to-gray-800"
                        key={ring}
                      />
                    ))}
                  </div>

                  {/* Month banner */}
                  <div className="mt-2 flex items-center justify-between border-b border-[var(--hairline)] pb-4">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="size-4 text-[var(--link)]" />
                      <span className="text-[16px] font-bold tracking-tight text-[var(--ink)]">
                        Calendar
                      </span>
                    </div>
                    <span className="rounded-full bg-[var(--pill-blue-soft)] px-3 py-1 font-mono text-[10.5px] font-semibold text-[var(--link)]">
                      Representative Availability
                    </span>
                  </div>

                  {/* Day grid */}
                  <div className="my-5 grid grid-cols-5 gap-2 text-center">
                    {[
                      { day: "MON", date: "—", available: false },
                      { day: "TUE", date: "—", available: true },
                      { day: "WED", date: "—", available: false },
                      { day: "THU", date: "✓", available: true, selected: true },
                      { day: "FRI", date: "—", available: true },
                    ].map((col) => (
                      <div
                        className={`rounded-[12px] p-2.5 transition-all ${col.selected
                            ? "border-2 border-[var(--pill-blue)] bg-[var(--pill-blue-soft)] shadow-sm scale-105"
                            : "border border-[var(--hairline)] bg-[var(--surface-subtle)]"
                          }`}
                        key={col.day}
                      >
                        <p className="font-mono text-[10px] text-[var(--text-secondary)]">
                          {col.day}
                        </p>
                        <p
                          className={`mt-1 text-[17px] font-bold ${col.selected ? "text-[var(--link)]" : "text-[var(--ink)]"
                            }`}
                        >
                          {col.date}
                        </p>
                        {col.selected && (
                          <span className="mt-1 block font-mono text-[9px] font-bold uppercase text-[var(--link)]">
                            Selected
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Confirmation */}
                  <div className="flex items-center justify-between rounded-[12px] bg-emerald-500 px-4 py-3 text-white shadow-md">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="size-5 shrink-0" />
                      <div>
                        <p className="text-[13px] font-bold leading-tight">
                          Meeting Confirmed
                        </p>
                        <p className="text-[11.5px] text-white/80">
                          Calendar invite with video link dispatched
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
                    Illustrative demonstration
                  </p>
                </div>
              </motion.div>
            )}

            {/* STAGE 05: CONNECTED SYSTEMS */}
            {activeStage === 4 && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[580px]"
                exit={{ opacity: 0, y: -12 }}
                initial={{ opacity: 0, y: 12 }}
                key="stage-05"
                transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
              >
                <div className="rounded-[16px] border border-[var(--dividers)] bg-[var(--surface)] p-6 shadow-lg sm:p-8">
                  {/* Central dispatch header */}
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--dividers)] bg-[var(--alt-band)] px-4 py-1.5 shadow-sm">
                      <img
                        alt="ORYNVAI logo"
                        className="size-4 object-contain dark:invert"
                        src="/orynvai-logo-black.png"
                      />
                      <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--ink)]">
                        Systems Updated
                      </span>
                    </div>
                  </div>

                  {/* Official brand integration cards */}
                  <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {[
                      {
                        name: "Salesforce",
                        logo: "/brands/salesforce.svg",
                        action: "Opportunity record created",
                        hoverColor: "hover:border-[#00A1E0]",
                      },
                      {
                        name: "HubSpot",
                        logo: "/brands/hubspot.svg",
                        action: "Contact timeline updated",
                        hoverColor: "hover:border-[#FF7A59]",
                      },
                      {
                        name: "Slack",
                        logo: "/brands/slack.svg",
                        action: "Team notification dispatched",
                        hoverColor: "hover:border-[#4A154B]",
                      },
                      {
                        name: "Google Workspace",
                        logo: "/brands/google-workspace.svg",
                        action: "Calendar invite generated",
                        hoverColor: "hover:border-[#4285F4]",
                      },
                    ].map((integration) => (
                      <div
                        className={`flex items-start gap-3.5 rounded-[14px] border border-[var(--dividers)] bg-[var(--surface-subtle)] p-4 transition-all ${integration.hoverColor}`}
                        key={integration.name}
                      >
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white p-2 shadow-sm">
                          <img
                            alt={`${integration.name} logo`}
                            className="size-7 object-contain"
                            src={integration.logo}
                          />
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-[var(--ink)]">
                            {integration.name}
                          </p>
                          <p className="mt-0.5 text-[11.5px] text-[var(--text-secondary)]">
                            {integration.action}
                          </p>
                          <span className="mt-1.5 inline-block font-mono text-[9.5px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                            ✓ Synced
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
                    Illustrative demonstration · Official integration logos shown
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Bottom navigation ───────────────────────────────────────── */}
        <div className="relative z-10 mt-6 flex items-center justify-between border-t border-[var(--hairline)] pt-4 text-[12px]">
          <span className="text-[var(--text-secondary)]">
            {hasCompleted ? "Workflow complete" : `Step ${activeStage + 1} of ${stages.length}`}
          </span>
          {hasCompleted ? (
            <button
              className="inline-flex items-center gap-1.5 font-semibold text-[var(--ink)] hover:text-[var(--link)]"
              onClick={startPlayback}
              type="button"
            >
              <RotateCcw className="size-3" />
              <span>Replay</span>
            </button>
          ) : (
            <button
              className="inline-flex items-center gap-1 font-semibold text-[var(--ink)] hover:text-[var(--link)]"
              onClick={() => jumpToStage(activeStage + 1)}
              type="button"
            >
              <span>Next</span>
              <ChevronRight className="size-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
