"use client";

import AIConversation from "@/components/smoothui/ai-conversation";
import AIReasoning from "@/components/smoothui/ai-reasoning";
import AIToolCall, { type AIToolCallStatus } from "@/components/smoothui/ai-tool-call";
import GridLoader from "@/components/smoothui/grid-loader";
import { SITE_CONTENT } from "@/content/site";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const STAGES = [
  { code: "01", label: "Conversation", artifact: "TRANSCRIPT" },
  { code: "02", label: "Reasoning", artifact: "TRACE LOG" },
  { code: "03", label: "Live Booking", artifact: "ITINERARY" },
  { code: "04", label: "Pipeline Sync", artifact: "LEDGER" },
] as const;

const STREAM_REPLY_TEXT =
  "Yes, absolutely. SandipAI is SOC 2 Type II certified and trained on security documentation. I have verified our Solutions Engineer is available Thursday at 2:00 PM EST. Would you like me to book that slot?";

const REASONING_TRACE = [
  {
    op: "OP-01",
    scope: "FIRM_SCORE",
    text: "Analyzing prospect inquiry: Company sizing (60 seats) indicates Enterprise tier.",
    latency: "18ms",
  },
  {
    op: "OP-02",
    scope: "POLICY_CHK",
    text: "Checking compliance requirement: SOC 2 Type II whitepaper verified in knowledge base.",
    latency: "42ms",
  },
  {
    op: "OP-03",
    scope: "CAL_QUERY",
    text: "Calling Google Calendar API: Found open slot on Thursday at 2:00 PM EST.",
    latency: "120ms",
  },
] as const;

const LEDGER_STEPS = [
  { idx: "01", code: "ENRICH", label: "Enrich domain & firmographic score", owner: "Core Agent", note: "98/100" },
  { idx: "02", code: "COMPLY", label: "Verify SOC 2 and GDPR boundary requirements", owner: "Policy Engine", note: "Confirmed" },
  { idx: "03", code: "AVAIL", label: "Check Solutions Architect calendar slots", owner: "Workspace API", note: "2 slots found" },
  { idx: "04", code: "INVITE", label: "Dispatch Google Meet calendar invite", owner: "Scheduler", note: "Sent" },
  { idx: "05", code: "CRM", label: "Sync enriched opportunity record to Salesforce", owner: "CRM Bridge", note: "Logged" },
] as const;

const AUTOPLAY_INTERVAL_MS = 6800;

/**
 * Card Family 1 — Connected 4-Stage Operational Product Console.
 * Eliminates nested box-in-box SaaS frames: each stage renders as its own
 * authentic operational artifact (Editorial Transcript, Dark Trace Inspector,
 * Itinerary Confirmation Ticket, and Pipeline Operations Ledger).
 */
export default function ProductHighlightsStage() {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const [chatPhase, setChatPhase] = useState<"thinking" | "streaming" | "done">("done");
  const [visibleWordCount, setVisibleWordCount] = useState<number>(999);
  const replyWords = useMemo(() => STREAM_REPLY_TEXT.split(" "), []);

  const [reasoningStep, setReasoningStep] = useState<number>(3);
  const [toolStatus, setToolStatus] = useState<AIToolCallStatus>("success");
  const [completedTasks, setCompletedTasks] = useState<number>(5);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isPlaying || shouldReduceMotion || !isVisible) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SITE_CONTENT.highlights.cards.length);
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isPlaying, shouldReduceMotion, isVisible]);

  useEffect(() => {
    const timers: Array<ReturnType<typeof setTimeout>> = [];

    if (shouldReduceMotion) {
      timers.push(
        setTimeout(() => {
          setChatPhase("done");
          setVisibleWordCount(replyWords.length);
          setReasoningStep(3);
          setToolStatus("success");
          setCompletedTasks(5);
        }, 0)
      );
      return () => timers.forEach(clearTimeout);
    }

    if (activeIndex === 0) {
      timers.push(
        setTimeout(() => {
          setChatPhase("thinking");
          setVisibleWordCount(0);
        }, 0)
      );
      timers.push(
        setTimeout(() => {
          setChatPhase("streaming");
          replyWords.forEach((_, idx) => {
            timers.push(
              setTimeout(() => {
                setVisibleWordCount(idx + 1);
                if (idx === replyWords.length - 1) {
                  setChatPhase("done");
                }
              }, idx * 40)
            );
          });
        }, 680)
      );
    } else if (activeIndex === 1) {
      timers.push(setTimeout(() => setReasoningStep(1), 0));
      timers.push(setTimeout(() => setReasoningStep(2), 500));
      timers.push(setTimeout(() => setReasoningStep(3), 1040));
    } else if (activeIndex === 2) {
      timers.push(setTimeout(() => setToolStatus("running"), 0));
      timers.push(setTimeout(() => setToolStatus("success"), 820));
    } else if (activeIndex === 3) {
      timers.push(setTimeout(() => setCompletedTasks(0), 0));
      [1, 2, 3, 4, 5].forEach((count, i) => {
        timers.push(setTimeout(() => setCompletedTasks(count), 300 + i * 400));
      });
    }

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [activeIndex, replyWords, shouldReduceMotion]);

  const activeCard = SITE_CONTENT.highlights.cards[activeIndex];
  const totalSlides = SITE_CONTENT.highlights.cards.length;

  return (
    <div
      className="overflow-hidden rounded-[16px] border border-[var(--dividers)] bg-[var(--surface)] [touch-action:pan-y]"
      ref={sectionRef}
    >
      {/* Top Industrial Console Rail: Indexed Stage Switcher + Controls */}
      <div className="flex flex-col border-b border-[var(--dividers)] md:flex-row md:items-stretch md:justify-between">
        <div
          aria-label="Sales workflow stages"
          className="grid grid-cols-2 divide-x divide-y divide-[var(--hairline)] sm:grid-cols-4 sm:divide-y-0 md:flex-1"
          role="tablist"
        >
          {STAGES.map((stage, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                aria-selected={isActive}
                className={`relative flex cursor-pointer flex-col items-start px-4 py-3.5 text-left transition-colors ${
                  isActive
                    ? "bg-[var(--surface)] text-[var(--ink)]"
                    : "bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--ink)]"
                }`}
                key={stage.code}
                onClick={() => setActiveIndex(idx)}
                role="tab"
                type="button"
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-semibold tracking-[0.08em] text-[var(--outlines)]">
                    {stage.code}
                  </span>
                  <span
                    className={`font-mono text-[9px] tracking-[0.08em] ${
                      isActive ? "text-[var(--link)]" : "text-[var(--outlines)]"
                    }`}
                  >
                    {stage.artifact}
                  </span>
                </div>
                <span className="mt-1 text-[13px] font-semibold tracking-[-0.01em]">
                  {stage.label}
                </span>
                {isActive && (
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-[2px] bg-[var(--pill-blue)]"
                    layoutId="console-stage-rule"
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }
                    }
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Transport Controls */}
        <div className="flex items-center justify-between gap-3 border-t border-[var(--hairline)] bg-[var(--surface-subtle)] px-4 py-2.5 md:border-t-0 md:border-l">
          <span className="font-mono text-[11px] tabular-nums text-[var(--text-secondary)]">
            {String(activeIndex + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-1">
            <button
              aria-label="Previous stage"
              className="flex size-7 cursor-pointer items-center justify-center rounded-md border border-[var(--dividers)] bg-[var(--surface)] text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
              onClick={() =>
                setActiveIndex((activeIndex - 1 + totalSlides) % totalSlides)
              }
              type="button"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <button
              aria-label={isPlaying ? "Pause sequence" : "Play sequence"}
              className="flex size-7 cursor-pointer items-center justify-center rounded-md border border-[var(--dividers)] bg-[var(--surface)] text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
              onClick={() => setIsPlaying((p) => !p)}
              type="button"
            >
              {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            </button>
            <button
              aria-label="Next stage"
              className="flex size-7 cursor-pointer items-center justify-center rounded-md border border-[var(--dividers)] bg-[var(--surface)] text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
              onClick={() => setActiveIndex((activeIndex + 1) % totalSlides)}
              type="button"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Editorial & Domain Artifact Surface */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Editorial Column (flush, separated by clean vertical hairline) */}
        <div className="flex flex-col justify-between border-b border-[var(--hairline)] p-6 sm:p-8 lg:col-span-5 lg:border-r lg:border-b-0">
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
              key={activeCard.id}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.26,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.09em] text-[var(--link)]">
                STAGE {STAGES[activeIndex].code} · {activeCard.kicker}
              </p>
              <h3 className="mt-3 text-[26px] font-semibold leading-[1.14] tracking-[-0.024em] text-[var(--ink)] sm:text-[31px]">
                {activeCard.title}
              </h3>
              <p className="mt-4 text-[15.5px] leading-[1.58] text-[var(--text-secondary)]">
                {activeCard.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Architectural Thread Metadata Strip (no inner rounded box) */}
          <div className="mt-8 border-t border-[var(--dividers)] pt-5">
            <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text-secondary)]">
              <span>THREAD #ACME-204</span>
              <span className="inline-flex items-center gap-1.5 text-[var(--success)]">
                <span className="size-1.5 rounded-full bg-[var(--success)]" />
                ACTIVE SESSION
              </span>
            </div>
            <div className="grid grid-cols-3 divide-x divide-[var(--hairline)]">
              <div className="pr-3">
                <p className="font-mono text-[10px] uppercase text-[var(--outlines)]">Account</p>
                <p className="mt-0.5 truncate text-[13px] font-semibold text-[var(--ink)]">
                  Acme Corp
                </p>
              </div>
              <div className="px-3">
                <p className="font-mono text-[10px] uppercase text-[var(--outlines)]">Scope</p>
                <p className="mt-0.5 text-[13px] font-semibold tabular-nums text-[var(--ink)]">
                  60 seats
                </p>
              </div>
              <div className="pl-3">
                <p className="font-mono text-[10px] uppercase text-[var(--outlines)]">Pipeline</p>
                <p className="mt-0.5 text-[13px] font-semibold tabular-nums text-[var(--ink)]">
                  $72k ARR
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Domain Artifact Stage — Each stage has its own bespoke composition */}
        <div className="flex min-h-[388px] flex-col justify-center bg-[var(--surface-subtle)] p-5 sm:p-7 lg:col-span-7">
          <AnimatePresence mode="wait">
            {/* ── ARTIFACT 01: EDITORIAL CONVERSATION TRANSCRIPT ── */}
            {activeIndex === 0 && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="w-full border-y border-[var(--dividers)] bg-[var(--surface)]"
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
                key="artifact-transcript"
                transition={{ duration: shouldReduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Transcript Header */}
                <div className="flex items-center justify-between border-b border-[var(--hairline)] px-4 py-2.5 sm:px-5">
                  <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                    <span className="size-1.5 rounded-full bg-[var(--success)]" />
                    <span>LIVE TRANSCRIPT · INBOUND WEB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10.5px] text-[var(--link)]">
                      ENT · 60 SEATS
                    </span>
                    <GridLoader
                      color="#0071e3"
                      pattern="plus-hollow"
                      size={12}
                      static={chatPhase === "done"}
                    />
                  </div>
                </div>

                <AIConversation className="min-h-[240px]">
                  <div className="divide-y divide-[var(--hairline)]">
                    {/* Turn 1: Prospect */}
                    <div className="grid grid-cols-1 gap-2 px-4 py-4 sm:grid-cols-12 sm:px-5">
                      <div className="sm:col-span-3">
                        <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)]">
                          Prospect
                        </p>
                        <p className="mt-0.5 font-mono text-[10px] tabular-nums text-[var(--outlines)]">
                          10:14:02 EST
                        </p>
                      </div>
                      <div className="sm:col-span-9">
                        <p className="text-[14.5px] font-medium leading-[1.55] text-[var(--ink)]">
                          Can SandipAI handle SOC 2 compliance questions and schedule a technical demo?
                        </p>
                      </div>
                    </div>

                    {/* Turn 2: SandipAI */}
                    <div className="grid grid-cols-1 gap-2 border-l-2 border-l-[var(--pill-blue)] bg-[var(--surface-subtle)] px-4 py-4 sm:grid-cols-12 sm:px-5">
                      <div className="sm:col-span-3">
                        <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[var(--link)]">
                          SandipAI
                        </p>
                        <p className="mt-0.5 font-mono text-[10px] tabular-nums text-[var(--outlines)]">
                          10:14:03 EST
                        </p>
                      </div>
                      <div className="sm:col-span-9">
                        {chatPhase === "thinking" ? (
                          <div className="flex items-center gap-2.5 py-1 text-[13.5px]">
                            <GridLoader color="#0071e3" pattern="breathing" size={12} />
                            <span
                              className="t-shimmer-label font-medium"
                              data-text="Verifying SOC 2 Type II packet & SE calendar…"
                            >
                              Verifying SOC 2 Type II packet &amp; SE calendar…
                            </span>
                          </div>
                        ) : (
                          <p className="text-[14.5px] leading-[1.58] text-[var(--ink)]">
                            {replyWords.map((word, idx) => (
                              <span
                                className={`t-stream-w ${
                                  idx < visibleWordCount ? "is-in" : ""
                                }`}
                                key={`${word}-${idx}`}
                              >
                                {word}
                                {idx < replyWords.length - 1 ? " " : ""}
                              </span>
                            ))}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </AIConversation>

                {/* Bottom Intent Margin Strip */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--hairline)] px-4 py-2.5 font-mono text-[10.5px] text-[var(--text-secondary)] sm:px-5">
                  <span>INTENT: COMPLIANCE + TECHNICAL DEMO</span>
                  <span className="text-[var(--success)]">QUALIFIED · READY TO BOOK</span>
                </div>
              </motion.div>
            )}

            {/* ── ARTIFACT 02: DARK TECHNICAL EXECUTION TRACE ── */}
            {activeIndex === 1 && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="w-full overflow-hidden rounded-[10px] border border-[#2c2c30] bg-[#141416] text-[#f5f5f7]"
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
                key="artifact-trace"
                transition={{ duration: shouldReduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Technical Trace Header */}
                <div className="flex items-center justify-between border-b border-[#26262a] px-4 py-3 sm:px-5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.09em] text-[#98989d]">
                      TRACE // REASONING ENGINE
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] tabular-nums text-[#2997ff]">
                      180ms total
                    </span>
                    <GridLoader
                      color="#2997ff"
                      pattern="breathing"
                      size={12}
                      static={reasoningStep >= 3}
                    />
                  </div>
                </div>

                {/* Inspectable Reasoning Collapsible */}
                <div className="p-4 sm:p-5">
                  <AIReasoning
                    className="[&_button]:text-[#98989d] [&_button:hover]:text-[#f5f5f7]"
                    collapseWhenDone={false}
                    defaultOpen={true}
                    duration={1.2}
                    isStreaming={reasoningStep < 3}
                  >
                    <div className="space-y-0 divide-y divide-[#232327] py-1">
                      {REASONING_TRACE.map((row, idx) => {
                        const revealed = idx < reasoningStep;
                        return (
                          <motion.div
                            animate={{
                              opacity: revealed ? 1 : 0.22,
                              x: revealed ? 0 : -4,
                            }}
                            className="grid grid-cols-12 items-start gap-2 py-3 first:pt-1 last:pb-1"
                            key={row.op}
                            transition={{
                              duration: shouldReduceMotion ? 0 : 0.25,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                          >
                            <div className="col-span-3 flex flex-col sm:col-span-2">
                              <span className="font-mono text-[10.5px] font-semibold text-[#2997ff]">
                                {row.op}
                              </span>
                              <span className="font-mono text-[9px] text-[#6e6e73]">
                                {row.scope}
                              </span>
                            </div>
                            <p className="col-span-7 text-[13px] leading-[1.5] text-[#e5e5ea] sm:col-span-8">
                              {row.text}
                            </p>
                            <span className="col-span-2 text-right font-mono text-[11px] tabular-nums text-[#30d158]">
                              {row.latency}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </AIReasoning>
                </div>

                {/* Trace Verdict Strip */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#26262a] bg-[#1a1a1d] px-4 py-2.5 font-mono text-[10.5px] text-[#98989d] sm:px-5">
                  <span>VERDICT: POLICY VERIFIED · NO HALLUCINATION FLAGS</span>
                  <span className="text-[#30d158]">ACTION → BOOK_SE_SLOT</span>
                </div>
              </motion.div>
            )}

            {/* ── ARTIFACT 03: ITINERARY / EXECUTIVE BOOKING CONFIRMATION TICKET ── */}
            {activeIndex === 2 && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="w-full overflow-hidden rounded-[12px] border border-[var(--dividers)] bg-[var(--surface)]"
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
                key="artifact-booking"
                transition={{ duration: shouldReduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Ticket Header Band */}
                <div className="flex items-center justify-between border-b border-[var(--hairline)] bg-[var(--ink)] px-5 py-3 text-[var(--canvas)]">
                  <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.1em]">
                    BOOKING CONFIRMATION · GOOGLE MEET
                  </span>
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] opacity-85">
                    {toolStatus === "running" ? "LOCKING SLOT…" : "CONFIRMED"}
                  </span>
                </div>

                {/* Prominent Asymmetric Date & Attendee Block */}
                <div className="grid grid-cols-1 divide-y divide-[var(--hairline)] sm:grid-cols-12 sm:divide-x sm:divide-y-0">
                  <div className="flex flex-col justify-between p-5 sm:col-span-5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text-secondary)]">
                      SCHEDULED WINDOW
                    </span>
                    <div className="my-3 flex items-baseline gap-2.5">
                      <span className="text-[46px] font-semibold leading-none tracking-[-0.04em] tabular-nums text-[var(--ink)]">
                        19
                      </span>
                      <div>
                        <p className="text-[14px] font-semibold text-[var(--ink)]">
                          Thursday
                        </p>
                        <p className="font-mono text-[12px] tabular-nums text-[var(--link)]">
                          14:00 EST · 30m
                        </p>
                      </div>
                    </div>
                    <p className="font-mono text-[10px] text-[var(--text-secondary)]">
                      AUTO-DISPATCHED INVITE
                    </p>
                  </div>

                  <div className="flex flex-col justify-between p-5 sm:col-span-7">
                    <div className="space-y-3">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--outlines)]">
                          PROSPECT ATTENDEE
                        </p>
                        <p className="mt-0.5 text-[14px] font-semibold text-[var(--ink)]">
                          team@acmecorp.com
                        </p>
                        <p className="text-[12px] text-[var(--text-secondary)]">
                          Acme Corp · 60 Seats · Enterprise Technical Demo
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 border-t border-[var(--hairline)] pt-3">
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--outlines)]">
                            ASSIGNED HOST
                          </p>
                          <p className="mt-0.5 text-[12.5px] font-medium text-[var(--ink)]">
                            Solutions Engineer
                          </p>
                        </div>
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--outlines)]">
                            SALESFORCE OPP
                          </p>
                          <p className="mt-0.5 font-mono text-[12.5px] font-semibold tabular-nums text-[var(--link)]">
                            $72,000 ARR
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Perforated Tear-Line + Live Tool Execution Metadata Stub */}
                <div className="border-t border-dashed border-[var(--dividers)] bg-[var(--surface-subtle)] p-4">
                  <AIToolCall
                    args={
                      <div className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] text-[var(--ink)]">
                        <span>lead: team@acmecorp.com</span>
                        <span>seats: 60</span>
                        <span>slot: Thu 14:00 EST</span>
                      </div>
                    }
                    className="rounded-[8px] border-[var(--hairline)] bg-[var(--surface)]"
                    defaultOpen={false}
                    name="crm_lookup_and_calendar_schedule"
                    result={
                      <div className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] text-[var(--success)]">
                        <span>meetingConfirmed: true</span>
                        <span>salesforceOpportunity: $72,000 ARR</span>
                      </div>
                    }
                    status={toolStatus}
                    summary="2 ops · 180ms"
                  />
                </div>
              </motion.div>
            )}

            {/* ── ARTIFACT 04: PIPELINE OPERATIONS LEDGER ── */}
            {activeIndex === 3 && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="w-full overflow-hidden rounded-[10px] border border-[var(--dividers)] bg-[var(--surface)]"
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
                key="artifact-ledger"
                transition={{ duration: shouldReduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Ledger Column Header */}
                <div className="flex items-center justify-between border-b border-[var(--dividers)] bg-[var(--alt-band)] px-4 py-2.5 sm:px-5">
                  <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                    PIPELINE OPERATIONS LEDGER
                  </span>
                  <span className="font-mono text-[11px] font-semibold tabular-nums text-[var(--success)]">
                    {completedTasks} / {LEDGER_STEPS.length} COMPLETED
                  </span>
                </div>

                {/* Indexed Table Rows */}
                <ol className="divide-y divide-[var(--hairline)]">
                  {LEDGER_STEPS.map((row, idx) => {
                    const isDone = idx < completedTasks;
                    const isRunning = idx === completedTasks;
                    return (
                      <li
                        className={`relative grid grid-cols-12 items-center gap-2 px-4 py-3 transition-colors sm:px-5 ${
                          isRunning ? "bg-[var(--pill-blue-soft)]" : ""
                        }`}
                        key={row.idx}
                      >
                        <div className="col-span-2 flex items-center gap-2">
                          <span
                            className={`flex size-4 shrink-0 items-center justify-center rounded-[4px] border text-[10px] transition-colors ${
                              isDone
                                ? "border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)]"
                                : isRunning
                                  ? "border-[var(--pill-blue)] text-[var(--pill-blue)]"
                                  : "border-[var(--dividers)] text-transparent"
                            }`}
                          >
                            {isDone && <Check className="size-2.5 stroke-[2.5]" />}
                          </span>
                          <span className="font-mono text-[10px] font-semibold text-[var(--outlines)]">
                            {row.code}
                          </span>
                        </div>

                        <div className="col-span-7 min-w-0">
                          <p
                            className={`truncate text-[13px] font-medium transition-opacity ${
                              isDone
                                ? "text-[var(--ink)]"
                                : isRunning
                                  ? "font-semibold text-[var(--ink)]"
                                  : "text-[var(--text-secondary)] opacity-60"
                            }`}
                          >
                            {row.label}
                          </p>
                          <p className="font-mono text-[10px] text-[var(--outlines)]">
                            {row.owner}
                          </p>
                        </div>

                        <div className="col-span-3 text-right">
                          <span
                            className={`font-mono text-[11px] font-medium tabular-nums ${
                              isDone
                                ? "text-[var(--ink)]"
                                : isRunning
                                  ? "text-[var(--link)]"
                                  : "text-[var(--outlines)]"
                            }`}
                          >
                            {isDone ? row.note : isRunning ? "Running…" : "Queued"}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
