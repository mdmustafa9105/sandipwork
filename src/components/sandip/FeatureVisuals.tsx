"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeftRight,
  ArrowRight,
  Check,
  RotateCcw,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════════════════════════════════════
   1. CONVERSATIONAL INTELLIGENCE — Asymmetrical Sales Intelligence Dossier
   No outer box-in-box tray. Left numbered scenario rail + right editorial
   objection/response sheet with oversized metric anchor.
   ═══════════════════════════════════════════════════════════════════════════ */

const OBJECTION_SCENARIOS = [
  {
    id: "compliance",
    index: "01",
    label: "Security & SOC 2",
    prospect:
      "Our InfoSec team requires SOC 2 Type II and strict GDPR data boundaries before any pilot.",
    reply:
      "ORYNVAI is SOC 2 Type II certified with full GDPR compliance and optional private VPC deployment on AWS, GCP, or on-prem. I can share our security review packet and include our Solutions Architect on Thursday's call.",
    intent: "Compliance Review",
    boundary: "Verified · Policy Safe",
    nextAction: "Attach Security Pack",
  },
  {
    id: "pricing",
    index: "02",
    label: "Pricing & Volume",
    prospect:
      "We handle roughly 6,000 inbound threads monthly across web and email. Which tier fits?",
    reply:
      "ORYNVAI covers 6,000+ monthly inbound threads across Web Chat, Email, and SMS with Salesforce Enterprise sync and custom model fine-tuning on your winning calls. I can schedule a consultation to size your custom deployment.",
    intent: "Commercial Sizing",
    boundary: "Approved Rate Card",
    nextAction: "Route to Scale AE",
  },
  {
    id: "deployment",
    index: "03",
    label: "CRM Handover",
    prospect:
      "Will our reps have to copy transcripts manually or maintain another tool?",
    reply:
      "Zero manual logging. Every qualified lead, full transcript summary, and booked calendar invite syncs bi-directionally to Salesforce and HubSpot in real time before your rep joins the call.",
    intent: "Workflow Fit",
    boundary: "Verified Integration",
    nextAction: "Confirm CRM Sync",
  },
] as const;

export function ConversationalIntelligenceVisual({
  statsBadge,
}: {
  statsBadge?: string;
}) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const [selectedId, setSelectedId] =
    useState<(typeof OBJECTION_SCENARIOS)[number]["id"]>("compliance");
  const active =
    OBJECTION_SCENARIOS.find((s) => s.id === selectedId) ?? OBJECTION_SCENARIOS[0];

  return (
    <div className="w-full overflow-hidden rounded-[12px] border border-[var(--dividers)] bg-[var(--surface)]">
      {/* Top Dossier Index Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--dividers)] bg-[var(--alt-band)] px-5 py-3">
        <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.09em] text-[var(--text-secondary)]">
          OBJECTION INTELLIGENCE // INTERACTIVE EXAMPLE
        </span>
        {statsBadge && (
          <span className="font-mono text-[11px] font-semibold text-[var(--link)]">
            {statsBadge.toUpperCase()}
          </span>
        )}
      </div>

      {/* Asymmetrical Split Dossier: Left Selector Rail + Right Editorial Analysis */}
      <div className="grid grid-cols-1 divide-y divide-[var(--hairline)] sm:grid-cols-12 sm:divide-x sm:divide-y-0">
        {/* Left Narrow Index Rail */}
        <div
          aria-label="Objection handling scenarios"
          className="flex flex-row overflow-x-auto sm:col-span-4 sm:flex-col sm:divide-y sm:divide-[var(--hairline)]"
          role="tablist"
        >
          {OBJECTION_SCENARIOS.map((item) => {
            const isActive = item.id === selectedId;
            return (
              <button
                aria-selected={isActive}
                className={`relative flex shrink-0 cursor-pointer flex-col items-start px-4 py-3.5 text-left transition-colors sm:w-full ${
                  isActive
                    ? "bg-[var(--surface)] text-[var(--ink)]"
                    : "bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--ink)]"
                }`}
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                role="tab"
                type="button"
              >
                {isActive && (
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 hidden w-[3px] bg-[var(--pill-blue)] sm:block"
                    layoutId="ci-rail-indicator"
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }
                    }
                  />
                )}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-[2px] bg-[var(--pill-blue)] sm:hidden"
                  />
                )}
                <span className="font-mono text-[10px] font-semibold tracking-[0.08em] text-[var(--text-secondary)]">
                  CASE {item.index}
                </span>
                <span className="mt-1 text-[13px] font-semibold">{item.label}</span>
              </button>
            );
          })}

          {/* Oversized Metric Anchor in bottom-left negative space (desktop) */}
          <div className="mt-auto hidden flex-col justify-end bg-[var(--surface-subtle)] p-4 sm:flex">
            <span className="text-[36px] font-semibold leading-none tracking-[-0.04em] tabular-nums text-[var(--ink)]">
              94%
            </span>
            <span className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--text-secondary)]">
              OBJECTION RESOLUTION
            </span>
          </div>
        </div>

        {/* Right Editorial Response Canvas */}
        <div className="flex flex-col justify-between p-5 sm:col-span-8 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="flex h-full flex-col justify-between space-y-5"
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 5 }}
              key={active.id}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.22,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Prospect Objection Block */}
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  PROSPECT OBJECTION
                </p>
                <p className="mt-1.5 text-[15px] font-medium leading-[1.5] text-[var(--ink)]">
                  &ldquo;{active.prospect}&rdquo;
                </p>
              </div>

              {/* Calibrated ORYNVAI Response (left architectural rule, no chat bubble) */}
              <div className="border-l-2 border-[var(--pill-blue)] pl-4">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--link)]">
                  ORYNVAI VERIFIED RESPONSE
                </p>
                <p className="mt-1.5 text-[14px] leading-[1.6] text-[var(--ink-muted)]">
                  {active.reply}
                </p>
              </div>

              {/* Structured Classification Ledger Footer */}
              <div className="grid grid-cols-1 gap-3 border-t border-[var(--hairline)] pt-4 sm:grid-cols-3">
                <div>
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.06em] text-[var(--text-secondary)]">
                    INTENT
                  </p>
                  <p className="mt-0.5 text-[12px] font-semibold text-[var(--ink)]">
                    {active.intent}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.06em] text-[var(--text-secondary)]">
                    STATUS
                  </p>
                  <p className="mt-0.5 text-[12px] font-semibold text-[var(--success)]">
                    {active.boundary}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.06em] text-[var(--text-secondary)]">
                    ACTION
                  </p>
                  <p className="mt-0.5 text-[12px] font-semibold text-[var(--ink)]">
                    {active.nextAction}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. PIPELINE VELOCITY — Chronological Run-Sheet + Detached Dark Booking Slip
   Asymmetric editorial composition with oversized 00:22 chronometer readout
   and GSAP ScrollTrigger choreography.
   ═══════════════════════════════════════════════════════════════════════════ */

const VELOCITY_STEPS = [
  { time: "00:00", phase: "INBOUND", title: "High-intent buyer arrives", detail: "Enterprise pricing page · Organic" },
  { time: "00:06", phase: "QUALIFY", title: "Stack & seat scope qualified", detail: "60 seats · Salesforce Enterprise" },
  { time: "00:14", phase: "RESOLVE", title: "Technical objection resolved", detail: "SOC 2 Type II & VPC verified" },
  { time: "00:22", phase: "CONFIRM", title: "Calendar slot confirmed", detail: "Thu 2:00 PM EST · Google Meet sent" },
] as const;

const WEEK_DAYS = [
  { day: "TUE", date: "17", active: false },
  { day: "WED", date: "18", active: false },
  { day: "THU", date: "19", active: true },
  { day: "FRI", date: "20", active: false },
] as const;

export function PipelineVelocityVisual({
  statsBadge,
}: {
  statsBadge?: string;
}) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [elapsed, setElapsed] = useState(22);
  const [booked, setBooked] = useState(true);
  const [playCount, setPlayCount] = useState(0);

  const runSequence = useCallback(() => {
    const el = rootRef.current;
    if (!el || shouldReduceMotion) {
      setElapsed(22);
      setBooked(true);
      return;
    }

    setBooked(false);
    setElapsed(0);

    const counter = { val: 0 };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        ".pv-step",
        { opacity: 0.22, x: -6 },
        {
          opacity: 1,
          x: 0,
          duration: 0.36,
          stagger: 0.36,
          ease: "power2.out",
        },
        0
      );

      tl.to(
        counter,
        {
          val: 22,
          duration: 1.5,
          ease: "power1.out",
          onUpdate: () => setElapsed(Math.round(counter.val)),
          onComplete: () => setBooked(true),
        },
        0
      );
    }, rootRef);

    return () => ctx.revert();
  }, [shouldReduceMotion]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || shouldReduceMotion) return;

    let cleanupAnim: (() => void) | undefined;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 78%",
        once: true,
        onEnter: () => {
          cleanupAnim = runSequence();
        },
      });
    }, rootRef);

    return () => {
      cleanupAnim?.();
      ctx.revert();
    };
  }, [runSequence, shouldReduceMotion]);

  return (
    <div className="w-full space-y-3" ref={rootRef}>
      {/* Upper Chronological Run-Sheet (sharp editorial top-left, asymmetrical structure) */}
      <div className="overflow-hidden rounded-[12px] border border-[var(--dividers)] bg-[var(--alt-band)]">
        {/* Oversized Chronometer Header */}
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--dividers)] bg-[var(--surface)] px-5 py-4 sm:px-6">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-secondary)]">
              ILLUSTRATIVE INQUIRY-TO-BOOKING FLOW
            </p>
            <div className="mt-1 flex flex-wrap items-baseline gap-2.5">
              <span className="font-mono text-[40px] font-semibold leading-none tracking-[-0.04em] tabular-nums text-[var(--ink)] sm:text-[42px]">
                00:{String(elapsed).padStart(2, "0")}
              </span>
              <span className="font-mono text-[11px] font-semibold uppercase text-[var(--link)]">
                {statsBadge ?? "< 30S MEDIAN"}
              </span>
            </div>
          </div>

          <button
            aria-label="Replay booking sequence"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-[var(--dividers)] bg-[var(--surface-subtle)] px-2.5 py-1.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.06em] text-[var(--text-secondary)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
            key={playCount}
            onClick={() => {
              setPlayCount((c) => c + 1);
              runSequence();
            }}
            type="button"
          >
            <RotateCcw className="size-3" />
            Replay
          </button>
        </div>

        {/* Chronological Timeline Entries */}
        <ol className="divide-y divide-[var(--hairline)] bg-[var(--surface)] px-5 sm:px-6">
          {VELOCITY_STEPS.map((step, idx) => (
            <li
              className="pv-step grid grid-cols-12 items-center gap-2 py-3.5"
              key={step.time}
            >
              <span className="col-span-3 font-mono text-[12px] font-semibold tabular-nums text-[var(--ink)] sm:col-span-2">
                {step.time}
              </span>
              <span className="col-span-2 hidden font-mono text-[9.5px] font-semibold tracking-[0.08em] text-[var(--text-secondary)] sm:inline">
                {step.phase}
              </span>
              <div className="col-span-8 min-w-0 sm:col-span-7">
                <p className="text-[13.5px] font-semibold text-[var(--ink)]">
                  {step.title}
                </p>
                <p className="text-[12px] text-[var(--text-secondary)]">
                  {step.detail}
                </p>
              </div>
              <div className="col-span-1 flex justify-end">
                <span
                  className={`flex size-5 items-center justify-center rounded-full ${
                    idx === VELOCITY_STEPS.length - 1 && booked
                      ? "bg-[var(--pill-blue)] text-white"
                      : "bg-[var(--success-soft)] text-[var(--success)]"
                  }`}
                >
                  <Check className="size-3" />
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Lower Detached Booking Confirmation Slip (intentional tonal contrast) */}
      <div className="overflow-hidden rounded-[12px] border border-[#2c2c30] bg-[#141416] p-4 text-[#f5f5f7] sm:px-6 sm:py-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.09em]">
          <span className="text-[#a1a1a6]">SAMPLE BOOKING · SOLUTIONS ENGINEER</span>
          <span className="text-[#30d158]">
            {booked ? "INVITE DISPATCHED" : "RESERVING SLOT…"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {WEEK_DAYS.map((d) => {
            const isConfirmed = d.active && booked;
            return (
              <div
                className={`rounded-[8px] border px-3 py-2 text-left transition-colors duration-300 ${
                  isConfirmed
                    ? "border-[#0071e3] bg-[#0071e3] text-white"
                    : "border-[#26262a] bg-[#1c1c20] text-[#a1a1a6]"
                }`}
                key={d.day}
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[10px] tracking-[0.06em]">
                    {d.day}
                  </span>
                  <span className="font-mono text-[13px] font-semibold tabular-nums text-white">
                    {d.date}
                  </span>
                </div>
                <p
                  className={`mt-1 font-mono text-[10.5px] tabular-nums ${
                    isConfirmed ? "font-semibold text-white" : "text-[#a1a1a6]"
                  }`}
                >
                  {d.active ? "14:00 EST" : "Open"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. ECOSYSTEM SYNC — Structured Operational Endpoint Matrix & Record Ledger
   Zero floating logos + glowing lines. Treats Salesforce, HubSpot, Slack,
   and Google Workspace as connected operational data endpoints.
   ═══════════════════════════════════════════════════════════════════════════ */

const ECOSYSTEM_NODES = [
  {
    id: "salesforce",
    code: "SFDC",
    name: "Salesforce",
    category: "CRM Opportunity",
    direction: "Bi-dir",
    syncMode: "Real-time",
    fields: [
      { label: "Opportunity", value: "Acme Corp · $72,000 ARR" },
      { label: "Qualification", value: "98/100 · Enterprise" },
      { label: "Transcript", value: "Attached cleanly" },
    ],
  },
  {
    id: "hubspot",
    code: "HUBS",
    name: "HubSpot",
    category: "Contact Lifecycle",
    direction: "Bi-dir",
    syncMode: "Real-time",
    fields: [
      { label: "Lifecycle Stage", value: "Sales Qualified Lead" },
      { label: "Lead Source", value: "Autonomous Web Agent" },
      { label: "Owner Routing", value: "Enterprise Pod A" },
    ],
  },
  {
    id: "slack",
    code: "SLCK",
    name: "Slack",
    category: "AE Instant Brief",
    direction: "Push",
    syncMode: "Instant",
    fields: [
      { label: "Channel", value: "#enterprise-inbound" },
      { label: "Summary", value: "60 seats · SOC 2 verified" },
      { label: "Booked Slot", value: "Thu 2:00 PM EST" },
    ],
  },
  {
    id: "workspace",
    code: "GWS",
    name: "Google Workspace",
    category: "Calendar & Meet",
    direction: "Bi-dir",
    syncMode: "Real-time",
    fields: [
      { label: "Calendar Event", value: "Technical Walkthrough" },
      { label: "Meeting Link", value: "Google Meet generated" },
      { label: "Attendees", value: "Prospect + Solutions Eng." },
    ],
  },
] as const;

export function EcosystemSyncVisual({
  statsBadge,
}: {
  statsBadge?: string;
}) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const [selectedId, setSelectedId] =
    useState<(typeof ECOSYSTEM_NODES)[number]["id"]>("salesforce");

  const activeNode =
    ECOSYSTEM_NODES.find((n) => n.id === selectedId) ?? ECOSYSTEM_NODES[0];

  return (
    <div className="w-full overflow-hidden rounded-[12px] border border-[var(--dividers)] bg-[var(--surface)]">
      {/* Top Architecture Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--dividers)] bg-[var(--alt-band)] px-5 py-3">
        <div className="flex items-center gap-2 font-mono text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--ink)]">
          <ArrowLeftRight className="size-3.5 text-[var(--link)]" />
          <span>ORYNVAI CORE ⇄ 4 ENDPOINTS</span>
        </div>
        {statsBadge && (
          <span className="font-mono text-[11px] font-semibold text-[var(--success)]">
            {statsBadge.toUpperCase()}
          </span>
        )}
      </div>

      {/* Connected Operational Endpoint Table */}
      <div
        aria-label="Connected sales endpoints"
        className="divide-y divide-[var(--hairline)]"
        role="tablist"
      >
        {ECOSYSTEM_NODES.map((node) => {
          const isSelected = node.id === selectedId;
          return (
            <button
              aria-selected={isSelected}
              className={`relative grid w-full cursor-pointer grid-cols-12 items-center gap-2 px-5 py-3.5 text-left transition-colors ${
                isSelected
                  ? "bg-[var(--pill-blue-soft)]"
                  : "bg-[var(--surface)] hover:bg-[var(--surface-subtle)]"
              }`}
              key={node.id}
              onClick={() => setSelectedId(node.id)}
              role="tab"
              type="button"
            >
              {isSelected && (
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-[3px] bg-[var(--pill-blue)]"
                />
              )}

              <div className="col-span-5 flex items-center gap-2.5 sm:col-span-4">
                <span className="hidden font-mono text-[10px] font-semibold tracking-[0.06em] text-[var(--text-secondary)] sm:inline">
                  {node.code}
                </span>
                <span className="truncate text-[13.5px] font-semibold text-[var(--ink)]">
                  {node.name}
                </span>
              </div>

              <span className="col-span-4 truncate text-[12px] text-[var(--text-secondary)] sm:col-span-4">
                {node.category}
              </span>

              <span className="hidden font-mono text-[10.5px] uppercase text-[var(--text-secondary)] sm:col-span-2 sm:inline">
                {node.direction === "Bi-dir" ? (
                  <span className="inline-flex items-center gap-1">
                    <ArrowLeftRight className="size-3 text-[var(--link)]" />
                    Bi-dir
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1">
                    <ArrowRight className="size-3 text-[var(--link)]" />
                    Push
                  </span>
                )}
              </span>

              <div className="col-span-3 flex items-center justify-end gap-2 sm:col-span-2">
                <span className="font-mono text-[10.5px] font-medium uppercase text-[var(--success)]">
                  {node.syncMode}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Live Synced Record Inspector (flush ledger band) */}
      <div className="border-t border-[var(--dividers)] bg-[var(--surface-subtle)] p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.08em]">
          <span className="font-semibold text-[var(--ink)]">
            SAMPLE RECORD // {activeNode.name.toUpperCase()}
          </span>
          <span className="text-[var(--success)]">AUTOMATED LOGGING</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 divide-y divide-[var(--hairline)] border-t border-[var(--hairline)] sm:grid-cols-3 sm:divide-x sm:divide-y-0"
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -3 }}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
            key={activeNode.id}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {activeNode.fields.map((field, idx) => (
              <div
                className={`py-2.5 sm:py-3 ${
                  idx === 0
                    ? "sm:pr-4"
                    : idx === 1
                      ? "sm:px-4"
                      : "sm:pl-4"
                }`}
                key={field.label}
              >
                <p className="font-mono text-[9.5px] uppercase tracking-[0.06em] text-[var(--text-secondary)]">
                  {field.label}
                </p>
                <p className="mt-1 text-[12.5px] font-semibold text-[var(--ink)]">
                  {field.value}
                </p>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
