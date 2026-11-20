"use client";

import { SITE_CONTENT } from "@/content/site";
import {
  Clock,
  Users,
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
      </div>

      {/* ── Two Visual Systems (Human vs ORYNVAI) ────────────────────── */}
      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
        {/* SYSTEM A: HUMAN SALES OPERATION */}
        <div className="flex flex-col justify-between rounded-[20px] border border-[var(--dividers)] bg-[var(--surface)] p-6 shadow-sm sm:p-8">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-4">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-[var(--text-secondary)]" />
                <h3 className="text-[17px] font-bold text-[var(--ink)]">
                  Human Sales Team
                </h3>
              </div>
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 font-mono text-[10.5px] font-semibold text-amber-600 dark:text-amber-400">
                Standard Hours
              </span>
            </div>

            {/* 24-Hour Clock Visual */}
            <div className="my-6 flex flex-col items-center justify-center">
              <div className="relative flex size-48 items-center justify-center sm:size-56">
                <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                  {/* Full background arc */}
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
                  {/* Business hours arc (~33% of day) */}
                  <circle
                    className="text-gray-400 dark:text-gray-600"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r="40"
                    stroke="currentColor"
                    strokeDasharray="84 251.2"
                    strokeDashoffset="0"
                    strokeWidth="12"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <Clock className="size-6 text-[var(--text-secondary)]" />
                  <p className="mt-1 text-[18px] font-bold tracking-tight text-[var(--ink)]">
                    Business Hours
                  </p>
                  <p className="font-mono text-[10px] font-semibold uppercase text-amber-600 dark:text-amber-400">
                    Limited Window
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-4 text-[12px]">
                <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                  <span className="size-2 rounded-full bg-gray-400" />
                  Covered: Typical M–F working hours
                </span>
                <span className="flex items-center gap-1.5 font-medium text-amber-600 dark:text-amber-400">
                  <span className="size-2 rounded-full bg-amber-500" />
                  Uncovered: Nights, weekends, holidays
                </span>
              </div>
            </div>

            {/* Operating constraints */}
            <div className="space-y-2.5 rounded-[12px] border border-[var(--hairline)] bg-[var(--surface-subtle)] p-4 text-[13px]">
              <div className="flex items-start gap-2.5">
                <Clock className="mt-0.5 size-4 shrink-0 text-amber-500" />
                <p className="text-[var(--ink-muted)]">
                  <strong className="text-[var(--ink)]">Lead Decay:</strong> High-intent buyers arriving outside working hours may wait hours for a response.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <Users className="mt-0.5 size-4 shrink-0 text-[var(--text-secondary)]" />
                <p className="text-[var(--ink-muted)]">
                  <strong className="text-[var(--ink)]">Linear Scaling:</strong> More coverage requires additional headcount, shifts, and management overhead.
                </p>
              </div>
            </div>
          </div>

          {/* Cost summary */}
          <div className="mt-6 border-t border-[var(--hairline)] pt-4">
            <span className="font-mono text-[10.5px] uppercase text-[var(--text-secondary)]">
              Cost Model
            </span>
            <p className="mt-1 text-[18px] font-bold text-[var(--ink)]">
              Salary + benefits + tooling + ramp time
            </p>
          </div>
        </div>

        {/* SYSTEM B: ORYNVAI CONTINUOUS COVERAGE */}
        <div className="flex flex-col justify-between rounded-[20px] border-2 border-[var(--pill-blue)] bg-[var(--surface)] p-6 shadow-md sm:p-8">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-4">
              <div className="flex items-center gap-2.5">
                <img
                  alt="ORYNVAI logo"
                  className="size-5 object-contain dark:invert"
                  src="/orynvai-logo-black.png"
                />
                <h3 className="text-[17px] font-bold text-[var(--ink)]">
                  ORYNVAI
                </h3>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-3 py-0.5 font-mono text-[10.5px] font-semibold text-emerald-600 dark:text-emerald-400">
                Continuous
              </span>
            </div>

            {/* Full coverage clock */}
            <div className="my-6 flex flex-col items-center justify-center">
              <div className="relative flex size-48 items-center justify-center sm:size-56">
                <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                  {/* Full 360° coverage */}
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
                  {/* Activity markers */}
                  <circle cx="50" cy="10" fill="#248a3d" r="3" />
                  <circle cx="90" cy="50" fill="#248a3d" r="3" />
                  <circle cx="50" cy="90" fill="#248a3d" r="3" />
                  <circle cx="10" cy="50" fill="#248a3d" r="3" />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <Zap className="size-6 text-[var(--link)]" />
                  <p className="mt-1 text-[18px] font-bold tracking-tight text-[var(--ink)]">
                    Every Hour
                  </p>
                  <p className="font-mono text-[10px] font-semibold uppercase text-emerald-600 dark:text-emerald-400">
                    Continuous Coverage
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-4 text-[12px]">
                <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
                  Live engagement: days, nights, weekends
                </span>
                <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                  <span className="size-2 rounded-full bg-[var(--pill-blue)]" />
                  Instant calendar booking
                </span>
              </div>
            </div>

            {/* Operational strengths */}
            <div className="space-y-2.5 rounded-[12px] border border-[var(--hairline)] bg-[var(--surface-subtle)] p-4 text-[13px]">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                <p className="text-[var(--ink-muted)]">
                  <strong className="text-[var(--ink)]">Immediate Response:</strong> Every prospect is engaged at peak interest, regardless of time zone or day.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                <p className="text-[var(--ink-muted)]">
                  <strong className="text-[var(--ink)]">Elastic Capacity:</strong> Handles multiple concurrent conversations with no queue or wait time.
                </p>
              </div>
            </div>
          </div>

          {/* Cost summary */}
          <div className="mt-6 border-t border-[var(--hairline)] pt-4">
            <span className="font-mono text-[10.5px] uppercase text-[var(--text-secondary)]">
              Cost Model
            </span>
            <p className="mt-1 text-[18px] font-bold text-[var(--link)]">
              Usage-based service
            </p>
            <p className="mt-0.5 font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              No recruiting · No ramp time · No benefits overhead
            </p>
          </div>
        </div>
      </div>

      {/* ── CTA Strip ───────────────────────────────────────────────── */}
      <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-[14px] border border-[var(--dividers)] bg-[var(--alt-band)] p-6 sm:flex-row sm:p-7">
        <div className="max-w-[620px]">
          <p className="text-[15px] font-bold text-[var(--ink)]">
            See how this applies to your team.
          </p>
          <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
            {content.configurationNotice}
          </p>
        </div>

        <button
          className="apple-pill-btn flex shrink-0 items-center gap-2 px-6 py-3 text-[13.5px]"
          onClick={onOpenBookingModal}
          type="button"
        >
          <Calendar className="size-4" />
          <span>Book a sales call</span>
        </button>
      </div>
    </div>
  );
}
