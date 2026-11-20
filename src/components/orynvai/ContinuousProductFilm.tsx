"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SITE_CONTENT } from "@/content/site";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ContinuousProductFilm() {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const [activeStage, setActiveStage] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const filmStageRef = useRef<HTMLDivElement | null>(null);

  const stages = SITE_CONTENT.howItWorks.stages;

  // Jump directly to a stage
  const setStage = useCallback((index: number) => {
    setActiveStage(Math.max(0, Math.min(stages.length - 1, index)));
  }, [stages.length]);

  // Next handler
  const nextStage = () => setStage((activeStage + 1) % stages.length);

  // GSAP ScrollTrigger synchronization on desktop
  useEffect(() => {
    if (shouldReduceMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 70%",
        end: "bottom 30%",
        onUpdate: (self) => {
          // Map scroll progress (0 to 1) to stage index (0 to 4)
          const stepIndex = Math.min(
            stages.length - 1,
            Math.floor(self.progress * stages.length)
          );
          setActiveStage(stepIndex);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [shouldReduceMotion, stages.length]);

  return (
    <div className="relative mx-auto w-full max-w-[1100px]" ref={containerRef}>
      {/* ── Top Scrubber / Timeline Bar ───────────────────────────────── */}
      <div className="mb-8 flex flex-col items-center justify-between gap-4 border-b border-[var(--dividers)] pb-6 md:flex-row">
        {/* Stage Progress Pills */}
        <div
          aria-label="Product Workflow Stages"
          className="flex w-full flex-wrap items-center justify-center gap-1.5 sm:justify-start md:w-auto"
          role="tablist"
        >
          {stages.map((st, idx) => {
            const isActive = idx === activeStage;
            const isCompleted = idx < activeStage;

            return (
              <button
                aria-selected={isActive}
                className={`relative flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-all ${
                  isActive
                    ? "bg-[var(--pill-blue)] text-white shadow-sm"
                    : isCompleted
                    ? "bg-[var(--surface-subtle)] text-[var(--ink)] hover:bg-[var(--surface)]"
                    : "bg-transparent text-[var(--text-secondary)] hover:text-[var(--ink)]"
                }`}
                key={st.id}
                onClick={() => setStage(idx)}
                role="tab"
                type="button"
              >
                <span
                  className={`flex size-4 items-center justify-center rounded-full text-[10px] font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : isCompleted
                      ? "bg-[var(--link)] text-white"
                      : "bg-[var(--hairline)] text-[var(--text-secondary)]"
                  }`}
                >
                  {isCompleted ? "✓" : idx + 1}
                </span>
                <span className="hidden sm:inline">{st.shortTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Stage Indicator & Controls */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] font-semibold text-[var(--text-secondary)]">
            STAGE 0{activeStage + 1} OF 0{stages.length}
          </span>
          {activeStage === stages.length - 1 && (
            <button
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--dividers)] bg-[var(--surface)] px-3 py-1 text-[11.5px] font-medium text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
              onClick={() => setStage(0)}
              type="button"
            >
              <RotateCcw className="size-3" />
              <span>Replay process</span>
            </button>
          )}
        </div>
      </div>

      {/* ── One Continuous Visual Product Scene ───────────────────────── */}
      <div
        className="relative overflow-hidden rounded-[20px] border border-[var(--dividers)] bg-[var(--surface)] p-6 shadow-sm md:p-10"
        ref={filmStageRef}
      >
        {/* Subtle Architectural Grid Background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 bg-micro-grid"
        />

        {/* Stage Headline & Short Benefit */}
        <div className="relative z-10 mb-8 max-w-[620px]">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--pill-blue-soft)] px-3 py-1 font-mono text-[11px] font-semibold uppercase text-[var(--link)]">
            <Sparkles className="size-3" />
            <span>{stages[activeStage].badge}</span>
          </div>
          <h3 className="mt-3 text-[24px] font-bold tracking-[-0.025em] text-[var(--ink)] sm:text-[28px]">
            {stages[activeStage].headline}
          </h3>
          <p className="mt-1.5 text-[14.5px] text-[var(--text-secondary)]">
            {stages[activeStage].description}
          </p>
        </div>

        {/* ── Continuous Transforming Arena (min height 480px) ────────── */}
        <div className="relative z-10 flex min-h-[460px] items-center justify-center sm:min-h-[500px]">
          <AnimatePresence mode="wait">
            {/* ═════════════════════════════════════════════════════════════
                STAGE 01: LEAD ARRIVES
                ═════════════════════════════════════════════════════════════ */}
            {activeStage === 0 && (
              <motion.div
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-[560px]"
                exit={{ opacity: 0, scale: 0.96, y: -16 }}
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                key="stage-01"
                transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: "easeOut" }}
              >
                <div className="rounded-[16px] border border-[var(--dividers)] bg-[var(--surface)] p-6 shadow-lg sm:p-7">
                  {/* Inbound Beacon Header */}
                  <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative flex size-3">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex size-3 rounded-full bg-emerald-500" />
                      </div>
                      <span className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[var(--ink)]">
                        New Inbound Lead Detected
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-[var(--text-secondary)]">
                      10:42 PM (After Hours)
                    </span>
                  </div>

                  {/* Prospect Identity Card */}
                  <div className="mt-5 flex items-center justify-between rounded-[12px] border border-[var(--hairline)] bg-[var(--surface-subtle)] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-[var(--ink)] font-bold text-white text-[13px]">
                        MV
                      </div>
                      <div>
                        <p className="text-[14.5px] font-semibold text-[var(--ink)]">
                          Marcus Vance
                        </p>
                        <p className="text-[12px] text-[var(--text-secondary)]">
                          VP of Global Sales • Apex Cloud (400+ employees)
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-[var(--pill-blue-soft)] px-2.5 py-1 font-mono text-[10px] font-semibold uppercase text-[var(--link)]">
                      Direct Web
                    </span>
                  </div>

                  {/* Incoming Buyer Inquiry */}
                  <div className="mt-4 rounded-[12px] border-l-4 border-l-[var(--link)] border border-[var(--hairline)] bg-[var(--surface)] p-4.5">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)]">
                      Prospect Inquiry
                    </p>
                    <p className="mt-1.5 text-[15px] font-medium leading-[1.5] text-[var(--ink)]">
                      &ldquo;Hi! We get hundreds of inbound leads over weekends and lose high-intent buyers because no one is online. Can ORYNVAI answer technical questions and book meetings into rep calendars 24/7?&rdquo;
                    </p>
                  </div>

                  {/* Pulse Footer */}
                  <div className="mt-5 flex items-center justify-between border-t border-[var(--hairline)] pt-3.5 text-[12px] text-[var(--text-secondary)]">
                    <span className="text-[var(--link)] font-medium flex items-center gap-1.5">
                      <Zap className="size-3.5" />
                      Inquiry captured at peak intent
                    </span>
                    <button
                      className="inline-flex items-center gap-1 text-[var(--ink)] font-semibold hover:text-[var(--link)]"
                      onClick={nextStage}
                      type="button"
                    >
                      <span>Watch ORYNVAI respond</span>
                      <ChevronRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═════════════════════════════════════════════════════════════
                STAGE 02: ORYNVAI RESPONDS
                ═════════════════════════════════════════════════════════════ */}
            {activeStage === 1 && (
              <motion.div
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-[580px]"
                exit={{ opacity: 0, scale: 0.96, y: -16 }}
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                key="stage-02"
                transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: "easeOut" }}
              >
                <div className="rounded-[16px] border border-[var(--dividers)] bg-[var(--surface)] p-6 shadow-lg sm:p-7">
                  {/* Lead Context Snippet */}
                  <div className="rounded-[10px] border border-[var(--hairline)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[13px] text-[var(--text-secondary)]">
                    <span className="font-semibold text-[var(--ink)]">Marcus (Apex Cloud):</span> &ldquo;Can ORYNVAI answer technical questions and book meetings 24/7?&rdquo;
                  </div>

                  {/* ORYNVAI Autonomous Response Plate */}
                  <div className="mt-4 rounded-[14px] border border-[var(--dividers)] bg-[var(--surface)] p-5 shadow-sm">
                    <div className="flex items-center justify-between pb-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          alt="ORYNVAI logo"
                          className="size-5 object-contain dark:invert"
                          src="/orynvai-logo-black.png"
                        />
                        <span className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.06em] text-[var(--link)]">
                          ORYNVAI Autonomous Agent
                        </span>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        12s Response Time
                      </span>
                    </div>

                    <p className="text-[14.5px] leading-[1.6] text-[var(--ink)]">
                      &ldquo;Hello Marcus! Yes, absolutely. ORYNVAI operates 24/7 with zero off-hours latency, answering questions with verified technical accuracy and checking rep availability directly via Google Calendar or Outlook.&rdquo;
                    </p>

                    <div className="mt-3.5 rounded-[10px] border border-[var(--hairline)] bg-[var(--surface-subtle)] p-3.5">
                      <p className="text-[13.5px] font-medium text-[var(--ink)]">
                        &ldquo;I have verified our Solutions Engineer is available. Would you like to reserve a 20-minute walkthrough this Thursday at 2:00 PM EST?&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Natural Qualification Metrics */}
                  <div className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
                    <div className="rounded-[10px] border border-[var(--hairline)] bg-[var(--surface-subtle)] p-3">
                      <span className="font-mono text-[10px] uppercase text-[var(--text-secondary)]">
                        Policy Check
                      </span>
                      <p className="mt-0.5 font-semibold text-emerald-600 dark:text-emerald-400">
                        ✓ SOC 2 Compliant
                      </p>
                    </div>
                    <div className="rounded-[10px] border border-[var(--hairline)] bg-[var(--surface-subtle)] p-3">
                      <span className="font-mono text-[10px] uppercase text-[var(--text-secondary)]">
                        Rep Availability
                      </span>
                      <p className="mt-0.5 font-semibold text-[var(--ink)]">
                        ✓ Thursday Openings
                      </p>
                    </div>
                  </div>

                  {/* Stage 2 Action Link */}
                  <div className="mt-5 flex items-center justify-between border-t border-[var(--hairline)] pt-3.5 text-[12px] text-[var(--text-secondary)]">
                    <span>Understands enterprise needs in real-time</span>
                    <button
                      className="inline-flex items-center gap-1 text-[var(--ink)] font-semibold hover:text-[var(--link)]"
                      onClick={nextStage}
                      type="button"
                    >
                      <span>See opportunity progression</span>
                      <ChevronRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═════════════════════════════════════════════════════════════
                STAGE 03: THE OPPORTUNITY BECOMES CLEAR
                ═════════════════════════════════════════════════════════════ */}
            {activeStage === 2 && (
              <motion.div
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-[560px]"
                exit={{ opacity: 0, scale: 0.96, y: -16 }}
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                key="stage-03"
                transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: "easeOut" }}
              >
                <div className="rounded-[16px] border border-[var(--dividers)] bg-[var(--surface)] p-6 shadow-lg sm:p-7">
                  {/* Buyer Agreement */}
                  <div className="flex items-center justify-between rounded-[12px] border border-[var(--hairline)] bg-[var(--surface-subtle)] p-4">
                    <div>
                      <span className="font-mono text-[10px] uppercase text-[var(--text-secondary)]">
                        Marcus (Buyer Acceptance)
                      </span>
                      <p className="mt-1 text-[14.5px] font-semibold text-[var(--ink)]">
                        &ldquo;Thursday at 2:00 PM works great for our team.&rdquo;
                      </p>
                    </div>
                    <span className="flex size-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 font-bold">
                      ✓
                    </span>
                  </div>

                  {/* Qualified Deal Elevation Card */}
                  <div className="mt-5 rounded-[14px] border-2 border-[var(--link)] bg-[var(--surface)] p-5 shadow-sm">
                    <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-3">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="size-4 text-[var(--link)]" />
                        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--ink)]">
                          Opportunity Intent Verified
                        </span>
                      </div>
                      <span className="rounded-full bg-[var(--pill-blue-soft)] px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-[var(--link)]">
                        High-Value Pipeline
                      </span>
                    </div>

                    <div className="mt-3.5 space-y-2 text-[13px]">
                      <div className="flex justify-between py-1 border-b border-[var(--hairline)]">
                        <span className="text-[var(--text-secondary)]">Account:</span>
                        <span className="font-semibold text-[var(--ink)]">Apex Cloud (B2B SaaS)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[var(--hairline)]">
                        <span className="text-[var(--text-secondary)]">Primary Objective:</span>
                        <span className="font-semibold text-[var(--ink)]">24/7 Weekend Inbound Coverage</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-[var(--text-secondary)]">Next Action:</span>
                        <span className="font-semibold text-[var(--link)]">Dispatch Calendar Booking</span>
                      </div>
                    </div>
                  </div>

                  {/* Visual Pathway Trigger */}
                  <div className="mt-5 flex items-center justify-between border-t border-[var(--hairline)] pt-3.5 text-[12px] text-[var(--text-secondary)]">
                    <span>Transitioning to physical calendar reservation</span>
                    <button
                      className="inline-flex items-center gap-1 text-[var(--ink)] font-semibold hover:text-[var(--link)]"
                      onClick={nextStage}
                      type="button"
                    >
                      <span>Open 3D Calendar</span>
                      <ChevronRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═════════════════════════════════════════════════════════════
                STAGE 04: THE THREE-DIMENSIONAL CALENDAR OBJECT (MAJOR PRIORITY)
                ═════════════════════════════════════════════════════════════ */}
            {activeStage === 3 && (
              <motion.div
                animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
                className="w-full max-w-[580px] [perspective:1400px]"
                exit={{ opacity: 0, scale: 0.94, rotateX: 10, y: -20 }}
                initial={{ opacity: 0, scale: 0.94, rotateX: -10, y: 20 }}
                key="stage-04"
                transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: "easeOut" }}
              >
                {/* 3D Physical Studio Calendar Object */}
                <div
                  className="relative rounded-[20px] border border-[#d2d2d7] bg-gradient-to-b from-white to-[#fbfbfd] p-7 shadow-2xl dark:border-[#3a3a42] dark:from-[#1c1c20] dark:to-[#141417]"
                  style={{
                    transformStyle: "preserve-3d",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  {/* Physical Spiral Binding Rings on Top */}
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

                  {/* Calendar Month & Navigation Banner */}
                  <div className="mt-2 flex items-center justify-between border-b border-[var(--hairline)] pb-4">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="size-4 text-[var(--link)]" />
                      <span className="font-bold text-[16px] tracking-tight text-[var(--ink)]">
                        October 2026
                      </span>
                    </div>
                    <span className="rounded-full bg-[var(--pill-blue-soft)] px-3 py-1 font-mono text-[10.5px] font-semibold text-[var(--link)]">
                      Representative Availability
                    </span>
                  </div>

                  {/* Days of the Week Grid */}
                  <div className="my-5 grid grid-cols-5 gap-2 text-center">
                    {[
                      { day: "MON", date: "11", available: false },
                      { day: "TUE", date: "12", available: true },
                      { day: "WED", date: "13", available: false },
                      { day: "THU", date: "14", available: true, selected: true },
                      { day: "FRI", date: "15", available: true },
                    ].map((col) => (
                      <div
                        className={`rounded-[12px] p-2.5 transition-all ${
                          col.selected
                            ? "border-2 border-[var(--pill-blue)] bg-[var(--pill-blue-soft)] shadow-sm scale-105"
                            : "border border-[var(--hairline)] bg-[var(--surface-subtle)]"
                        }`}
                        key={col.day}
                      >
                        <p className="font-mono text-[10px] text-[var(--text-secondary)]">
                          {col.day}
                        </p>
                        <p
                          className={`mt-1 text-[17px] font-bold ${
                            col.selected ? "text-[var(--link)]" : "text-[var(--ink)]"
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

                  {/* Time Slot Selection Highlight */}
                  <div className="rounded-[14px] border border-[var(--dividers)] bg-[var(--surface)] p-4 shadow-sm">
                    <div className="flex items-center justify-between pb-2 text-[12px]">
                      <span className="font-mono uppercase text-[var(--text-secondary)]">
                        Select Appointment Slot
                      </span>
                      <span className="font-mono text-[var(--link)] font-semibold">
                        Eastern Time (US)
                      </span>
                    </div>

                    <div className="mt-2 grid grid-cols-3 gap-2">
                      <div className="rounded-lg border border-[var(--hairline)] bg-[var(--surface-subtle)] p-2 text-center text-[12.5px] text-[var(--text-secondary)] line-through">
                        11:00 AM
                      </div>
                      <div className="rounded-lg border-2 border-emerald-500 bg-emerald-500/10 p-2 text-center text-[13px] font-bold text-emerald-600 dark:text-emerald-400 shadow-sm">
                        ✓ 2:00 PM EST
                      </div>
                      <div className="rounded-lg border border-[var(--hairline)] bg-[var(--surface-subtle)] p-2 text-center text-[12.5px] text-[var(--text-secondary)]">
                        4:30 PM
                      </div>
                    </div>
                  </div>

                  {/* Final Tactile Confirmation Ticket */}
                  <div className="mt-4 flex items-center justify-between rounded-[12px] bg-emerald-500 px-4 py-3 text-white shadow-md">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="size-5 shrink-0" />
                      <div>
                        <p className="text-[13px] font-bold leading-tight">
                          Meeting Confirmed & Dispatched
                        </p>
                        <p className="text-[11.5px] text-white/80">
                          Thursday, Oct 14 • 2:00 PM – 2:20 PM EST (Google Meet Attached)
                        </p>
                      </div>
                    </div>
                    <span className="hidden sm:inline font-mono text-[10px] uppercase font-bold tracking-wider rounded bg-white/20 px-2 py-1">
                      Locked
                    </span>
                  </div>

                  {/* Stage 4 Action to Systems */}
                  <div className="mt-5 flex items-center justify-between border-t border-[var(--hairline)] pt-3 text-[12px] text-[var(--text-secondary)]">
                    <span>Tactile booking complete with zero manual follow-up</span>
                    <button
                      className="inline-flex items-center gap-1 text-[var(--ink)] font-semibold hover:text-[var(--link)]"
                      onClick={nextStage}
                      type="button"
                    >
                      <span>Connect to business systems</span>
                      <ChevronRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═════════════════════════════════════════════════════════════
                STAGE 05: CONNECTED BUSINESS SYSTEMS (REAL LOGOS)
                ═════════════════════════════════════════════════════════════ */}
            {activeStage === 4 && (
              <motion.div
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-[620px]"
                exit={{ opacity: 0, scale: 0.96, y: -16 }}
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                key="stage-05"
                transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: "easeOut" }}
              >
                <div className="rounded-[16px] border border-[var(--dividers)] bg-[var(--surface)] p-6 shadow-lg sm:p-8">
                  {/* Central ORYNVAI Dispatch Origin */}
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--dividers)] bg-[var(--alt-band)] px-4 py-1.5 shadow-sm">
                      <img
                        alt="ORYNVAI logo"
                        className="size-4 object-contain dark:invert"
                        src="/orynvai-logo-black.png"
                      />
                      <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--ink)]">
                        ORYNVAI CORE DISPATCH ⇄ 4 SYSTEMS
                      </span>
                    </div>
                  </div>

                  {/* 4 Official Verified Brand SVG Plates */}
                  <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* 1. Salesforce */}
                    <div className="flex items-start gap-3.5 rounded-[14px] border border-[var(--dividers)] bg-[var(--surface-subtle)] p-4 transition-all hover:border-[#00A1E0]">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white p-2 shadow-sm border border-gray-100">
                        <img
                          alt="Salesforce logo"
                          className="size-7 object-contain"
                          src="/brands/salesforce.svg"
                        />
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-[var(--ink)]">Salesforce</p>
                        <p className="mt-0.5 text-[11.5px] text-[var(--text-secondary)]">
                          Opportunity & deal stage updated automatically.
                        </p>
                        <span className="mt-1.5 inline-block font-mono text-[9.5px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                          ✓ Sync Confirmed
                        </span>
                      </div>
                    </div>

                    {/* 2. HubSpot */}
                    <div className="flex items-start gap-3.5 rounded-[14px] border border-[var(--dividers)] bg-[var(--surface-subtle)] p-4 transition-all hover:border-[#FF7A59]">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white p-2 shadow-sm border border-gray-100">
                        <img
                          alt="HubSpot logo"
                          className="size-7 object-contain"
                          src="/brands/hubspot.svg"
                        />
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-[var(--ink)]">HubSpot</p>
                        <p className="mt-0.5 text-[11.5px] text-[var(--text-secondary)]">
                          Contact timeline logged with full conversation brief.
                        </p>
                        <span className="mt-1.5 inline-block font-mono text-[9.5px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                          ✓ Record Enriched
                        </span>
                      </div>
                    </div>

                    {/* 3. Slack */}
                    <div className="flex items-start gap-3.5 rounded-[14px] border border-[var(--dividers)] bg-[var(--surface-subtle)] p-4 transition-all hover:border-[#4A154B]">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white p-2 shadow-sm border border-gray-100">
                        <img
                          alt="Slack logo"
                          className="size-7 object-contain"
                          src="/brands/slack.svg"
                        />
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-[var(--ink)]">Slack</p>
                        <p className="mt-0.5 text-[11.5px] text-[var(--text-secondary)]">
                          Immediate rep notification dispatched to #sales-leads.
                        </p>
                        <span className="mt-1.5 inline-block font-mono text-[9.5px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                          ✓ Notification Sent
                        </span>
                      </div>
                    </div>

                    {/* 4. Google Workspace */}
                    <div className="flex items-start gap-3.5 rounded-[14px] border border-[var(--dividers)] bg-[var(--surface-subtle)] p-4 transition-all hover:border-[#4285F4]">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white p-2 shadow-sm border border-gray-100">
                        <img
                          alt="Google Workspace logo"
                          className="size-7 object-contain"
                          src="/brands/google-workspace.svg"
                        />
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-[var(--ink)]">Google Workspace</p>
                        <p className="mt-0.5 text-[11.5px] text-[var(--text-secondary)]">
                          Calendar invite & Google Meet link generated.
                        </p>
                        <span className="mt-1.5 inline-block font-mono text-[9.5px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                          ✓ Calendar Locked
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Outcome Card */}
                  <div className="mt-6 rounded-[12px] border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
                    <p className="text-[13.5px] font-semibold text-emerald-700 dark:text-emerald-300">
                      Total elapsed time: 24 seconds. Zero human intervention.
                    </p>
                  </div>

                  {/* Stage 5 Navigation / Reset */}
                  <div className="mt-6 flex items-center justify-between border-t border-[var(--hairline)] pt-3.5 text-[12px] text-[var(--text-secondary)]">
                    <span>Workflow Complete</span>
                    <button
                      className="inline-flex items-center gap-1.5 text-[var(--ink)] font-semibold hover:text-[var(--link)]"
                      onClick={() => setStage(0)}
                      type="button"
                    >
                      <RotateCcw className="size-3" />
                      <span>Replay entire workflow</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
