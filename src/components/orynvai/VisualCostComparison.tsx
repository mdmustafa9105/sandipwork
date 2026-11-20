"use client";

import { SITE_CONTENT } from "@/content/site";
import {
  Clock,
  Users,
  ShieldCheck,
  AlertTriangle,
  Zap,
  CheckCircle2,
  Calendar,
} from "lucide-react";

export interface VisualCostComparisonProps {
  onOpenBookingModal: () => void;
}

export default function VisualCostComparison({
  onOpenBookingModal,
}: VisualCostComparisonProps) {
  const content = SITE_CONTENT.costComparison;

  return (
    <div className="mx-auto w-full max-w-[1080px]">
      {/* ── Section Header ────────────────────────────────────────────── */}
      <div className="mb-12 flex flex-col justify-between gap-4 border-b border-[var(--dividers)] pb-8 md:flex-row md:items-end">
        <div>
          <p className="apple-kicker mb-2 text-[var(--text-secondary)]">
            {content.kicker}
          </p>
          <h2 className="apple-feature-heading text-[var(--ink)]">
            {content.heading}
          </h2>
          <p className="mt-2 text-[16px] text-[var(--text-secondary)]">
            {content.subheading}
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 md:items-end">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--dividers)] bg-[var(--surface)] px-3 py-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[var(--link)] shadow-sm">
            <ShieldCheck className="size-3.5" />
            <span>Configurable Economic Baseline</span>
          </span>
        </div>
      </div>

      {/* ── Two Large Visual Systems (Human vs ORYNVAI) ────────────────── */}
      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
        {/* ═════════════════════════════════════════════════════════════
            SYSTEM A: HUMAN SALES OPERATION (40 Hours / Week)
            ═════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col justify-between rounded-[20px] border border-[var(--dividers)] bg-[var(--surface)] p-6 shadow-sm sm:p-8">
          <div>
            {/* Header Tag */}
            <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-4">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-[var(--text-secondary)]" />
                <h3 className="font-bold text-[17px] text-[var(--ink)]">
                  Human Sales Operation
                </h3>
              </div>
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 font-mono text-[10.5px] font-semibold text-amber-600 dark:text-amber-400">
                40 hrs / week
              </span>
            </div>

            {/* Circular 24-Hour Working Shifts Clock Visual */}
            <div className="my-6 flex flex-col items-center justify-center">
              <div className="relative flex size-48 items-center justify-center sm:size-56">
                {/* 24-Hour Dial SVG */}
                <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                  {/* Uncovered Arc: 76% (Nights, Weekends, Holidays) */}
                  <circle
                    className="text-amber-500/20"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r="40"
                    stroke="currentColor"
                    strokeDasharray="251.2"
                    strokeDashoffset="0"
                    strokeWidth="12"
                  />
                  {/* Covered Arc: 24% (9am - 5pm, 8 hours of 24h day) */}
                  <circle
                    className="text-gray-400 dark:text-gray-600"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r="40"
                    stroke="currentColor"
                    strokeDasharray="60 251.2"
                    strokeDashoffset="0"
                    strokeWidth="12"
                  />
                </svg>

                {/* Clock Center Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                  <Clock className="size-6 text-[var(--text-secondary)]" />
                  <p className="mt-1 text-[22px] font-bold tracking-tight text-[var(--ink)]">
                    40 hrs
                  </p>
                  <p className="font-mono text-[10px] uppercase text-amber-600 dark:text-amber-400 font-semibold">
                    76% Unattended
                  </p>
                </div>
              </div>

              {/* Working Shifts Legend */}
              <div className="mt-4 flex flex-wrap justify-center gap-4 text-[12px]">
                <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                  <span className="size-2 rounded-full bg-gray-400" />
                  Covered: 9am – 5pm (M-F)
                </span>
                <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
                  <span className="size-2 rounded-full bg-amber-500" />
                  Uncovered: Nights & Weekends
                </span>
              </div>
            </div>

            {/* Operating Constraints List */}
            <div className="space-y-2.5 rounded-[12px] border border-[var(--hairline)] bg-[var(--surface-subtle)] p-4 text-[13px]">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" />
                <p className="text-[var(--ink-muted)]">
                  <strong className="text-[var(--ink)]">70% Lead Drop-off:</strong> High-intent buyers arriving after hours or on weekends wait hours for follow-up.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <Users className="mt-0.5 size-4 shrink-0 text-[var(--text-secondary)]" />
                <p className="text-[var(--ink-muted)]">
                  <strong className="text-[var(--ink)]">Linear Headcount:</strong> Scaling coverage requires multiple shifts, additional managers, and equipment.
                </p>
              </div>
            </div>
          </div>

          {/* Human Cost Footprint */}
          <div className="mt-6 border-t border-[var(--hairline)] pt-4">
            <span className="font-mono text-[10.5px] uppercase text-[var(--text-secondary)]">
              Annual Operating Footprint per Rep
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-[30px] font-bold tabular-nums text-[var(--ink)]">
                $95,000 – $130,000+
              </span>
              <span className="font-mono text-[11px] text-[var(--text-secondary)]">
                Base + 25% benefits + ramp
              </span>
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════
            SYSTEM B: ORYNVAI CONTINUOUS AGENT (168 Hours / Week)
            ═════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col justify-between rounded-[20px] border-2 border-[var(--pill-blue)] bg-[var(--surface)] p-6 shadow-md sm:p-8">
          <div>
            {/* Header Tag */}
            <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-4">
              <div className="flex items-center gap-2.5">
                <img
                  alt="ORYNVAI logo"
                  className="size-5 object-contain dark:invert"
                  src="/orynvai-logo-black.png"
                />
                <h3 className="font-bold text-[17px] text-[var(--ink)]">
                  ORYNVAI Autonomous System
                </h3>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-3 py-0.5 font-mono text-[10.5px] font-semibold text-emerald-600 dark:text-emerald-400">
                168 hrs / week
              </span>
            </div>

            {/* Circular 24-Hour Continuous Timeline Visual */}
            <div className="my-6 flex flex-col items-center justify-center">
              <div className="relative flex size-48 items-center justify-center sm:size-56">
                {/* 24-Hour Continuous 360 Dial SVG */}
                <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                  {/* Glowing 360 Full Coverage Arc */}
                  <circle
                    className="text-[var(--pill-blue)]"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r="40"
                    stroke="currentColor"
                    strokeDasharray="251.2"
                    strokeDashoffset="0"
                    strokeWidth="12"
                  />
                  {/* Subtle pulsing tick markers for inquiries at 2am, 8am, 2pm, 11pm */}
                  <circle cx="50" cy="10" fill="#248a3d" r="3" />
                  <circle cx="90" cy="50" fill="#248a3d" r="3" />
                  <circle cx="50" cy="90" fill="#248a3d" r="3" />
                  <circle cx="10" cy="50" fill="#248a3d" r="3" />
                </svg>

                {/* Dial Center Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                  <Zap className="size-6 text-[var(--link)]" />
                  <p className="mt-1 text-[22px] font-bold tracking-tight text-[var(--ink)]">
                    168 hrs
                  </p>
                  <p className="font-mono text-[10px] uppercase text-emerald-600 dark:text-emerald-400 font-semibold">
                    100% Continuous Coverage
                  </p>
                </div>
              </div>

              {/* ORYNVAI Legend */}
              <div className="mt-4 flex flex-wrap justify-center gap-4 text-[12px]">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Inbound Engagement: 24/7/365
                </span>
                <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                  <span className="size-2 rounded-full bg-[var(--pill-blue)]" />
                  Instant Calendar Booking
                </span>
              </div>
            </div>

            {/* Operational Strengths List */}
            <div className="space-y-2.5 rounded-[12px] border border-[var(--hairline)] bg-[var(--surface-subtle)] p-4 text-[13px]">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                <p className="text-[var(--ink-muted)]">
                  <strong className="text-[var(--ink)]">Sub-30s Speed to Lead:</strong> Every prospect is qualified and booked at peak interest, even at 2:00 AM on Sunday.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                <p className="text-[var(--ink-muted)]">
                  <strong className="text-[var(--ink)]">Elastic Capacity:</strong> Handles traffic spikes with unlimited concurrent dialogues and zero queue delays.
                </p>
              </div>
            </div>
          </div>

          {/* ORYNVAI Cost Footprint */}
          <div className="mt-6 border-t border-[var(--hairline)] pt-4">
            <span className="font-mono text-[10.5px] uppercase text-[var(--text-secondary)]">
              Operational Cost Model
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-[30px] font-bold text-[var(--link)]">
                Usage-based service
              </span>
              <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                $0 recruiter fees • $0 benefits
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Visual Advantage Highlights Strip ─────────────────────────── */}
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-[14px] border border-[var(--dividers)] bg-[var(--surface)] p-5 text-center">
          <p className="font-mono text-[11px] font-semibold uppercase text-[var(--text-secondary)]">
            Active Coverage Window
          </p>
          <p className="mt-1.5 text-[28px] font-bold tracking-tight text-[var(--link)]">
            4.2x
          </p>
          <p className="mt-1 text-[12.5px] text-[var(--text-secondary)]">
            168 hours vs 40 hours weekly
          </p>
        </div>

        <div className="rounded-[14px] border border-[var(--dividers)] bg-[var(--surface)] p-5 text-center">
          <p className="font-mono text-[11px] font-semibold uppercase text-[var(--text-secondary)]">
            Speed to Lead Engagement
          </p>
          <p className="mt-1.5 text-[28px] font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            &lt; 30s
          </p>
          <p className="mt-1 text-[12.5px] text-[var(--text-secondary)]">
            Eliminates lead decay latency
          </p>
        </div>

        <div className="rounded-[14px] border border-[var(--dividers)] bg-[var(--surface)] p-5 text-center">
          <p className="font-mono text-[11px] font-semibold uppercase text-[var(--text-secondary)]">
            Ramp & Deployment Lag
          </p>
          <p className="mt-1.5 text-[28px] font-bold tracking-tight text-[var(--ink)]">
            &lt; 1 hour
          </p>
          <p className="mt-1 text-[12.5px] text-[var(--text-secondary)]">
            Pre-trained on your sales collateral
          </p>
        </div>
      </div>

      {/* ── Client Configuration Notice & ROI Callout Strip ────────────── */}
      <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-[14px] border border-[var(--dividers)] bg-[var(--alt-band)] p-6 sm:flex-row sm:p-7">
        <div className="max-w-[620px]">
          <p className="text-[15px] font-bold text-[var(--ink)]">
            Ready to model your exact pipeline ROI?
          </p>
          <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
            {content.configurationNotice}
          </p>
        </div>

        <button
          className="apple-pill-btn shrink-0 flex items-center gap-2 px-6 py-3 text-[13.5px]"
          onClick={onOpenBookingModal}
          type="button"
        >
          <Calendar className="size-4" />
          <span>Book a sales call to calculate ROI</span>
        </button>
      </div>
    </div>
  );
}
