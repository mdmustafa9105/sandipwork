"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeftRight,
  Calendar,
  Check,
  Clock,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════════════════════════════════════
   1. CONVERSATIONAL INTELLIGENCE — Interactive Objection & Safety Studio
   ═══════════════════════════════════════════════════════════════════════════ */

const OBJECTION_SCENARIOS = [
  {
    id: "compliance",
    label: "Security & SOC 2",
    prospect: "Our InfoSec team requires SOC 2 Type II and strict GDPR data boundaries before any pilot.",
    reply: "SandipAI is SOC 2 Type II certified with full GDPR compliance and optional private VPC deployment on AWS, GCP, or on-prem. I can share our security review packet and include our Solutions Architect on Thursday's call.",
    intent: "Compliance Review",
    boundary: "Verified · Policy Safe",
    nextAction: "Attach Security Pack",
  },
  {
    id: "pricing",
    label: "Pricing & Volume",
    prospect: "We handle roughly 6,000 inbound threads monthly across web and email. Which tier fits?",
    reply: "Scale covers up to 10,000 autonomous conversations per month across Web Chat, Email, and SMS at $3,490/mo — including Salesforce Enterprise sync and custom LLM fine-tuning on your winning calls.",
    intent: "Commercial Sizing",
    boundary: "Approved Rate Card",
    nextAction: "Route to Scale AE",
  },
  {
    id: "deployment",
    label: "CRM Handover",
    prospect: "Will our reps have to copy transcripts manually or maintain another tool?",
    reply: "Zero manual logging. Every qualified lead, full transcript summary, and booked calendar invite syncs bi-directionally to Salesforce and HubSpot in real time before your rep joins the call.",
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
  const [selectedId, setSelectedId] = useState<(typeof OBJECTION_SCENARIOS)[number]["id"]>("compliance");
  const active =
    OBJECTION_SCENARIOS.find((s) => s.id === selectedId) ?? OBJECTION_SCENARIOS[0];

  return (
    <div className="w-full rounded-[28px] border border-[var(--hairline)] bg-[var(--alt-band)] p-5 sm:p-6">
      {/* Top Scenario Selector */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div
          aria-label="Objection handling scenarios"
          className="inline-flex flex-wrap items-center gap-1 rounded-full border border-[var(--hairline)] bg-[var(--surface)] p-1"
          role="tablist"
        >
          {OBJECTION_SCENARIOS.map((item) => {
            const isActive = item.id === selectedId;
            return (
              <button
                aria-selected={isActive}
                className={`relative cursor-pointer rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-[var(--text-secondary)] hover:text-[var(--ink)]"
                }`}
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                role="tab"
                type="button"
              >
                {isActive && (
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-[var(--pill-blue)]"
                    layoutId="ci-scenario-pill"
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }
                    }
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>

        {statsBadge && (
          <span className="rounded-full border border-[var(--dividers)] bg-[var(--surface)] px-3 py-1 text-[11px] font-semibold text-[var(--link)]">
            {statsBadge}
          </span>
        )}
      </div>

      {/* Live Dialogue Surface */}
      <div className="rounded-[20px] border border-[var(--dividers)] bg-[var(--surface)] p-4 sm:p-5">
        <AnimatePresence mode="wait">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
            key={active.id}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Prospect bubble */}
            <div className="flex justify-end">
              <div className="max-w-[88%] rounded-[18px] rounded-br-[6px] bg-[var(--ink)] px-4 py-3 text-[13.5px] leading-[1.48] text-[var(--canvas)]">
                {active.prospect}
              </div>
            </div>

            {/* SandipAI verified reply */}
            <div className="flex justify-start">
              <div className="max-w-[92%] rounded-[18px] rounded-bl-[6px] border border-[var(--hairline)] bg-[var(--alt-band)] px-4 py-3.5 text-[13.5px] leading-[1.52] text-[var(--ink)]">
                <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-[var(--link)]">
                  <ShieldCheck className="size-3.5" />
                  <span>SandipAI · Verified Knowledge Response</span>
                </div>
                <p>{active.reply}</p>
              </div>
            </div>

            {/* Quiet Semantic Analysis Row */}
            <div className="grid grid-cols-3 gap-2 border-t border-[var(--hairline)] pt-3.5 text-left">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.06em] text-[var(--text-secondary)]">
                  Detected Intent
                </p>
                <p className="mt-0.5 text-[12px] font-semibold text-[var(--ink)]">
                  {active.intent}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.06em] text-[var(--text-secondary)]">
                  Guardrail Check
                </p>
                <p className="mt-0.5 text-[12px] font-semibold text-[var(--success)]">
                  {active.boundary}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.06em] text-[var(--text-secondary)]">
                  Next Action
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
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. PIPELINE VELOCITY — Sub-30s Inquiry-to-Booked Timeline & Calendar Lock
   ═══════════════════════════════════════════════════════════════════════════ */

const VELOCITY_STEPS = [
  { time: "00:00", title: "High-intent buyer arrives", detail: "Enterprise pricing page · Organic" },
  { time: "00:06", title: "Stack & seat scope qualified", detail: "60 seats · Salesforce Enterprise" },
  { time: "00:14", title: "Technical objection resolved", detail: "SOC 2 Type II & VPC verified" },
  { time: "00:22", title: "Calendar slot confirmed", detail: "Thu 2:00 PM EST · Google Meet sent" },
] as const;

const WEEK_DAYS = [
  { day: "Tue", date: "17", active: false },
  { day: "Wed", date: "18", active: false },
  { day: "Thu", date: "19", active: true },
  { day: "Fri", date: "20", active: false },
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
        { opacity: 0.25, x: -6 },
        {
          opacity: 1,
          x: 0,
          duration: 0.36,
          stagger: 0.38,
          ease: "power2.out",
        },
        0
      );

      tl.to(
        counter,
        {
          val: 22,
          duration: 1.55,
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

  const handleReplay = () => {
    setPlayCount((c) => c + 1);
    runSequence();
  };

  return (
    <div
      className="w-full rounded-[28px] border border-[var(--hairline)] bg-[var(--alt-band)] p-5 sm:p-6"
      ref={rootRef}
    >
      {/* Top Telemetry Bar */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--hairline)] bg-[var(--surface)] px-3 py-1 text-[12px] font-medium tabular-nums text-[var(--ink)]">
          <Clock className="size-3.5 text-[var(--link)]" />
          <span>Elapsed: 00:{String(elapsed).padStart(2, "0")}</span>
        </div>

        <div className="flex items-center gap-2">
          {statsBadge && (
            <span className="rounded-full border border-[var(--dividers)] bg-[var(--surface)] px-3 py-1 text-[11px] font-semibold text-[var(--link)]">
              {statsBadge}
            </span>
          )}
          <button
            aria-label="Replay booking sequence"
            className="inline-flex size-7 cursor-pointer items-center justify-center rounded-full border border-[var(--dividers)] bg-[var(--surface)] text-[var(--text-secondary)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
            key={playCount}
            onClick={handleReplay}
            title="Replay sequence"
            type="button"
          >
            <RotateCcw className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Main Split Timeline + Mini Calendar Invite */}
      <div className="grid grid-cols-1 gap-4 rounded-[20px] border border-[var(--dividers)] bg-[var(--surface)] p-4 sm:p-5">
        {/* Chronological steps */}
        <ol className="divide-y divide-[var(--hairline)]">
          {VELOCITY_STEPS.map((step, idx) => (
            <li
              className="pv-step flex items-start gap-3 py-3 first:pt-0 last:pb-0"
              key={step.time}
            >
              <span className="mt-0.5 shrink-0 rounded-md bg-[var(--alt-band)] px-2 py-0.5 font-mono text-[11px] font-medium tabular-nums text-[var(--text-secondary)]">
                {step.time}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-semibold leading-snug text-[var(--ink)]">
                  {step.title}
                </p>
                <p className="mt-0.5 text-[12px] text-[var(--text-secondary)]">
                  {step.detail}
                </p>
              </div>
              <span
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
                  idx === VELOCITY_STEPS.length - 1 && booked
                    ? "bg-[var(--pill-blue)] text-white"
                    : "bg-[var(--success-soft)] text-[var(--success)]"
                }`}
              >
                <Check className="size-3" />
              </span>
            </li>
          ))}
        </ol>

        {/* Calendar Confirmation Strip */}
        <div className="rounded-[16px] border border-[var(--hairline)] bg-[var(--alt-band)] p-3.5">
          <div className="mb-2.5 flex items-center justify-between text-[11px] font-semibold text-[var(--text-secondary)]">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-3.5 text-[var(--link)]" />
              Solutions Engineer Availability
            </span>
            <span className="text-[var(--success)]">
              {booked ? "Invite Dispatched" : "Reserving slot…"}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {WEEK_DAYS.map((d) => (
              <div
                className={`rounded-xl border px-2 py-2 text-center transition-colors duration-300 ${
                  d.active && booked
                    ? "border-[var(--pill-blue)] bg-[var(--pill-blue)] text-white"
                    : "border-[var(--hairline)] bg-[var(--surface)] text-[var(--ink)]"
                }`}
                key={d.day}
              >
                <p
                  className={`text-[10px] font-medium uppercase ${
                    d.active && booked
                      ? "text-white/80"
                      : "text-[var(--text-secondary)]"
                  }`}
                >
                  {d.day}
                </p>
                <p className="text-[14px] font-semibold tabular-nums">
                  {d.date}
                </p>
                <p
                  className={`mt-0.5 text-[10px] font-medium tabular-nums ${
                    d.active && booked
                      ? "text-white"
                      : "text-[var(--text-secondary)]"
                  }`}
                >
                  {d.active ? "2:00 PM" : "Open"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. ECOSYSTEM SYNC — Bi-Directional CRM & Workspace Architecture
   (Strictly uses the 4 tools named in site.ts: Salesforce, HubSpot, Slack, Google Workspace)
   ═══════════════════════════════════════════════════════════════════════════ */

const ECOSYSTEM_NODES = [
  {
    id: "salesforce",
    name: "Salesforce",
    category: "CRM Opportunity",
    status: "Synced · 140ms",
    fields: [
      { label: "Opportunity", value: "Acme Corp · $72,000 ARR" },
      { label: "Qualification", value: "98/100 · Enterprise" },
      { label: "Transcript", value: "Attached cleanly" },
    ],
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "Contact Lifecycle",
    status: "Synced · 120ms",
    fields: [
      { label: "Lifecycle Stage", value: "Sales Qualified Lead" },
      { label: "Lead Source", value: "Autonomous Web Agent" },
      { label: "Owner Routing", value: "Enterprise Pod A" },
    ],
  },
  {
    id: "slack",
    name: "Slack",
    category: "AE Instant Brief",
    status: "Posted · 95ms",
    fields: [
      { label: "Channel", value: "#enterprise-inbound" },
      { label: "Summary", value: "60 seats · SOC 2 verified" },
      { label: "Booked Slot", value: "Thu 2:00 PM EST" },
    ],
  },
  {
    id: "workspace",
    name: "Google Workspace",
    category: "Calendar & Meet",
    status: "Confirmed · 180ms",
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
  const [selectedId, setSelectedId] = useState<(typeof ECOSYSTEM_NODES)[number]["id"]>("salesforce");
  const [inView, setInView] = useState(true);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) setInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const activeNode =
    ECOSYSTEM_NODES.find((n) => n.id === selectedId) ?? ECOSYSTEM_NODES[0];

  return (
    <div
      className="w-full rounded-[28px] border border-[var(--hairline)] bg-[var(--alt-band)] p-5 sm:p-6"
      ref={wrapRef}
    >
      {/* Top Status Bar */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--ink)]">
          <ArrowLeftRight className="size-3.5 text-[var(--link)]" />
          Bi-Directional Sync Engine
        </span>
        {statsBadge && (
          <span className="rounded-full border border-[var(--dividers)] bg-[var(--surface)] px-3 py-1 text-[11px] font-semibold text-[var(--link)]">
            {statsBadge}
          </span>
        )}
      </div>

      {/* Hub + 4 Connected Destinations */}
      <div className="rounded-[20px] border border-[var(--dividers)] bg-[var(--surface)] p-4 sm:p-5">
        {/* Top SandipAI Core Hub */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[var(--pill-blue)] bg-[var(--pill-blue-soft)] px-4 py-1.5">
            <span className="size-2 rounded-full bg-[var(--pill-blue)]" />
            <span className="text-[12.5px] font-semibold text-[var(--ink)]">
              SandipAI Autonomous Core
            </span>
          </div>
        </div>

        {/* Desktop 4-way Hairline SVG Architecture Branches */}
        <svg
          aria-hidden="true"
          className="mx-auto my-1 hidden h-12 w-full max-w-[380px] overflow-visible sm:block"
          fill="none"
          viewBox="0 0 380 48"
        >
          {[48, 142, 238, 332].map((targetX, idx) => {
            const d = `M 190 0 C 190 24, ${targetX} 22, ${targetX} 48`;
            const isSelected = ECOSYSTEM_NODES[idx].id === selectedId;
            return (
              <g key={targetX}>
                <path
                  d={d}
                  stroke={isSelected ? "var(--pill-blue)" : "var(--dividers)"}
                  strokeOpacity={isSelected ? 0.9 : 0.75}
                  strokeWidth={isSelected ? 1.5 : 1}
                />
                {!shouldReduceMotion && (
                  <path
                    className={`sync-pulse-path ${!inView ? "sync-pulse-path-paused" : ""}`}
                    d={d}
                    stroke="var(--pill-blue)"
                    strokeLinecap="round"
                    strokeWidth={isSelected ? 2 : 1.3}
                    style={{ animationDelay: `${idx * 0.45}s` }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Mobile compact connector stem */}
        <div aria-hidden="true" className="my-2 flex justify-center sm:hidden">
          <div className="h-5 w-px bg-[var(--dividers)]" />
        </div>

        {/* 4 Clickable Destination Nodes */}
        <div
          aria-label="Supported integrations"
          className="grid grid-cols-2 gap-2 sm:grid-cols-4"
          role="tablist"
        >
          {ECOSYSTEM_NODES.map((node) => {
            const isSelected = node.id === selectedId;
            return (
              <button
                aria-selected={isSelected}
                className={`cursor-pointer rounded-[14px] border px-2.5 py-2.5 text-left transition-colors ${
                  isSelected
                    ? "border-[var(--pill-blue)] bg-[var(--pill-blue-soft)]"
                    : "border-[var(--hairline)] bg-[var(--alt-band)] hover:border-[var(--outlines)]"
                }`}
                key={node.id}
                onClick={() => setSelectedId(node.id)}
                role="tab"
                type="button"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="truncate text-[12px] font-semibold text-[var(--ink)]">
                    {node.name}
                  </span>
                  <span
                    className={`size-1.5 shrink-0 rounded-full ${
                      isSelected ? "bg-[var(--pill-blue)]" : "bg-[var(--success)]"
                    }`}
                  />
                </div>
                <p className="mt-0.5 truncate text-[10.5px] text-[var(--text-secondary)]">
                  {node.category}
                </p>
              </button>
            );
          })}
        </div>

        {/* Live Synced Record Inspector */}
        <div className="mt-4 rounded-[16px] border border-[var(--hairline)] bg-[var(--alt-band)] p-3.5">
          <div className="mb-2.5 flex items-center justify-between border-b border-[var(--hairline)] pb-2 text-[11px]">
            <span className="font-semibold text-[var(--ink)]">
              {activeNode.name} · Synced Record
            </span>
            <span className="font-mono font-medium tabular-nums text-[var(--success)]">
              {activeNode.status}
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 gap-2.5 sm:grid-cols-3"
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -3 }}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
              key={activeNode.id}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeNode.fields.map((field) => (
                <div key={field.label}>
                  <p className="text-[10px] uppercase tracking-[0.06em] text-[var(--text-secondary)]">
                    {field.label}
                  </p>
                  <p className="mt-0.5 text-[12px] font-medium text-[var(--ink)]">
                    {field.value}
                  </p>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

