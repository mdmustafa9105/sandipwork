"use client";

import AIConversation from "@/components/smoothui/ai-conversation";
import AIMessage from "@/components/smoothui/ai-message";
import AIReasoning from "@/components/smoothui/ai-reasoning";
import AITaskList, { type AITask } from "@/components/smoothui/ai-task-list";
import AIToolCall, { type AIToolCallStatus } from "@/components/smoothui/ai-tool-call";
import GridLoader from "@/components/smoothui/grid-loader";
import { SITE_CONTENT } from "@/content/site";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  CalendarCheck2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const STAGE_LABELS = [
  "Conversation",
  "Reasoning",
  "Live Booking",
  "Pipeline Sync",
] as const;

const STREAM_REPLY_TEXT =
  "Yes, absolutely. SandipAI is SOC 2 Type II certified and trained on security documentation. I have verified our Solutions Engineer is available Thursday at 2:00 PM EST. Would you like me to book that slot?";

const INITIAL_PIPELINE_TASKS: AITask[] = [
  { id: "t1", label: "Enrich domain & firmographic score", note: "98/100", status: "pending" },
  { id: "t2", label: "Verify SOC 2 and GDPR boundary requirements", note: "Confirmed", status: "pending" },
  { id: "t3", label: "Check Solutions Architect calendar slots", note: "2 slots found", status: "pending" },
  { id: "t4", label: "Dispatch Google Meet calendar invite", note: "Sent", status: "pending" },
  { id: "t5", label: "Sync enriched opportunity record to Salesforce", note: "Logged", status: "pending" },
];

const AUTOPLAY_INTERVAL_MS = 6800;

/**
 * Connected 4-stage interactive product story for SandipAI.
 * Follows one realistic inbound buyer (Acme Corp · 60 seats) from first
 * message through reasoning, live Calendar/CRM tool execution, and full
 * autonomous pipeline sync.
 */
export default function ProductHighlightsStage() {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Stage 1: Conversation progressive reveal (typing shimmer -> streamed reply)
  const [chatPhase, setChatPhase] = useState<"thinking" | "streaming" | "done">("done");
  const [visibleWordCount, setVisibleWordCount] = useState<number>(999);
  const replyWords = useMemo(() => STREAM_REPLY_TEXT.split(" "), []);

  // Stage 2: Reasoning progressive step reveal
  const [reasoningStep, setReasoningStep] = useState<number>(3);

  // Stage 3: Live tool call status (running -> success)
  const [toolStatus, setToolStatus] = useState<AIToolCallStatus>("success");

  // Stage 4: Pipeline autopilot sequential task ticks
  const [completedTasks, setCompletedTasks] = useState<number>(5);

  // Pause autoplay and micro-loops when scrolled off-screen
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

  // Autoplay loop across the 4 connected stages
  useEffect(() => {
    if (!isPlaying || shouldReduceMotion || !isVisible) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SITE_CONTENT.highlights.cards.length);
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isPlaying, shouldReduceMotion, isVisible]);

  // Stage-specific authentic micro-choreography whenever activeIndex changes
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
              }, idx * 42)
            );
          });
        }, 720)
      );
    } else if (activeIndex === 1) {
      timers.push(setTimeout(() => setReasoningStep(1), 0));
      timers.push(setTimeout(() => setReasoningStep(2), 520));
      timers.push(setTimeout(() => setReasoningStep(3), 1080));
    } else if (activeIndex === 2) {
      timers.push(setTimeout(() => setToolStatus("running"), 0));
      timers.push(setTimeout(() => setToolStatus("success"), 820));
    } else if (activeIndex === 3) {
      timers.push(setTimeout(() => setCompletedTasks(0), 0));
      [1, 2, 3, 4, 5].forEach((count, i) => {
        timers.push(setTimeout(() => setCompletedTasks(count), 320 + i * 420));
      });
    }

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [activeIndex, replyWords, shouldReduceMotion]);

  const liveTasks: AITask[] = useMemo(
    () =>
      INITIAL_PIPELINE_TASKS.map((task, idx) => {
        if (idx < completedTasks) {
          return { ...task, status: "done" };
        }
        if (idx === completedTasks) {
          return { ...task, status: "running" };
        }
        return { ...task, status: "pending" };
      }),
    [completedTasks]
  );

  const activeCard = SITE_CONTENT.highlights.cards[activeIndex];
  const totalSlides = SITE_CONTENT.highlights.cards.length;

  const selectStage = (idx: number) => {
    setActiveIndex(idx);
  };

  return (
    <div
      className="rounded-[28px] border border-[var(--hairline)] bg-[var(--surface)] p-5 sm:p-8 [touch-action:pan-y]"
      ref={sectionRef}
    >
      {/* Top Connected Stage Switcher (transitions.dev sliding pill concept via Motion layoutId) */}
      <div className="mb-7 flex flex-col gap-4 border-b border-[var(--hairline)] pb-5 md:flex-row md:items-center md:justify-between">
        <div
          aria-label="Sales workflow stages"
          className="grid grid-cols-2 gap-1 rounded-2xl border border-[var(--hairline)] bg-[var(--alt-band)] p-1 sm:inline-flex sm:flex-wrap sm:items-center sm:gap-1.5 sm:rounded-full"
          role="tablist"
        >
          {STAGE_LABELS.map((label, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                aria-selected={isActive}
                className={`relative cursor-pointer rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                  isActive
                    ? "text-[var(--ink)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--ink)]"
                }`}
                key={label}
                onClick={() => selectStage(idx)}
                role="tab"
                type="button"
              >
                {isActive && (
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full border border-[var(--dividers)] bg-[var(--surface)]"
                    layoutId="highlights-active-pill"
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }
                    }
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <span
                    className={`size-1.5 rounded-full transition-colors ${
                      isActive ? "bg-[var(--pill-blue)]" : "bg-[var(--dividers)]"
                    }`}
                  />
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between gap-2 md:justify-end">
          <span className="text-[12px] font-medium tabular-nums text-[var(--text-secondary)]">
            Stage {activeIndex + 1} of {totalSlides}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              aria-label="Previous stage"
              className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-[var(--dividers)] bg-[var(--surface)] text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
              onClick={() =>
                selectStage((activeIndex - 1 + totalSlides) % totalSlides)
              }
              type="button"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <button
              aria-label={isPlaying ? "Pause sequence" : "Play sequence"}
              className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-[var(--dividers)] bg-[var(--surface)] text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
              onClick={() => setIsPlaying((p) => !p)}
              type="button"
            >
              {isPlaying ? (
                <Pause className="size-3.5" />
              ) : (
                <Play className="size-3.5" />
              )}
            </button>
            <button
              aria-label="Next stage"
              className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-[var(--dividers)] bg-[var(--surface)] text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
              onClick={() => selectStage((activeIndex + 1) % totalSlides)}
              type="button"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Editorial + Interactive Product Canvas */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
        {/* Left: Editorial Context */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              key={activeCard.id}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.28,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--link)]">
                {activeCard.kicker}
              </p>
              <h3 className="mt-2.5 text-[26px] font-semibold leading-[1.15] tracking-[-0.022em] text-[var(--ink)] sm:text-[32px]">
                {activeCard.title}
              </h3>
              <p className="mt-3.5 text-[16px] leading-[1.55] text-[var(--text-secondary)]">
                {activeCard.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Persistent Prospect Thread Context Card */}
          <div className="mt-7 rounded-[18px] border border-[var(--hairline)] bg-[var(--alt-band)] p-4">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)]">
              <span>Active Prospect Thread</span>
              <span className="inline-flex items-center gap-1.5 text-[var(--success)]">
                <span className="size-1.5 rounded-full bg-[var(--success)]" />
                Live
              </span>
            </div>
            <div className="mt-2.5 grid grid-cols-3 gap-2 text-left">
              <div>
                <p className="text-[11px] text-[var(--text-secondary)]">Lead</p>
                <p className="truncate text-[13px] font-medium text-[var(--ink)]">
                  Acme Corp
                </p>
              </div>
              <div>
                <p className="text-[11px] text-[var(--text-secondary)]">Scope</p>
                <p className="text-[13px] font-medium tabular-nums text-[var(--ink)]">
                  60 seats
                </p>
              </div>
              <div>
                <p className="text-[11px] text-[var(--text-secondary)]">Target</p>
                <p className="text-[13px] font-medium tabular-nums text-[var(--ink)]">
                  $72k ARR
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Interactive Live Product Viewport */}
        <div className="lg:col-span-7">
          <div className="min-h-[348px] rounded-[22px] border border-[var(--hairline)] bg-[var(--alt-band)] p-4 sm:p-6 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {/* STAGE 1: AUTONOMOUS CONVERSATION */}
              {activeIndex === 0 && (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full rounded-[18px] border border-[var(--dividers)] bg-[var(--surface)] p-4 sm:p-5"
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  key="stage-0"
                  transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="mb-3.5 flex items-center justify-between border-b border-[var(--hairline)] pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="size-2 rounded-full bg-[var(--success)]" />
                      <span className="text-[13px] font-semibold text-[var(--ink)]">
                        Live Inbound Sales Dialogue
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[var(--pill-blue-soft)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--link)]">
                        Enterprise · 60 seats
                      </span>
                      <GridLoader
                        color="#0071e3"
                        pattern="plus-hollow"
                        size={14}
                        static={chatPhase === "done"}
                      />
                    </div>
                  </div>

                  <AIConversation className="min-h-[215px] space-y-3.5">
                    <AIMessage
                      copyText="Can SandipAI handle SOC 2 compliance questions and schedule a technical demo?"
                      from="user"
                      timestamp="10:14 AM"
                    >
                      Can SandipAI handle SOC 2 compliance questions and schedule a technical demo?
                    </AIMessage>

                    {chatPhase === "thinking" ? (
                      <div className="flex items-center gap-2.5 rounded-2xl rounded-bl-md bg-[var(--alt-band)] px-4 py-3 text-[13px]">
                        <GridLoader color="#0071e3" pattern="breathing" size={13} />
                        <span
                          className="t-shimmer-label font-medium"
                          data-text="Checking SOC 2 Type II docs & SE calendar…"
                        >
                          Checking SOC 2 Type II docs & SE calendar…
                        </span>
                      </div>
                    ) : (
                      <AIMessage
                        copyText={STREAM_REPLY_TEXT}
                        from="assistant"
                        timestamp="10:14 AM"
                      >
                        <p className="leading-relaxed">
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
                      </AIMessage>
                    )}
                  </AIConversation>
                </motion.div>
              )}

              {/* STAGE 2: TRANSPARENT REASONING */}
              {activeIndex === 1 && (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full rounded-[18px] border border-[var(--dividers)] bg-[var(--surface)] p-4 sm:p-5"
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  key="stage-1"
                  transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="mb-3 flex items-center justify-between border-b border-[var(--hairline)] pb-3">
                    <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)]">
                      Reasoning Engine Verification
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium tabular-nums text-[var(--text-secondary)]">
                        180ms total
                      </span>
                      <GridLoader
                        color="#0071e3"
                        pattern="breathing"
                        size={14}
                        static={reasoningStep >= 3}
                      />
                    </div>
                  </div>

                  <AIReasoning
                    collapseWhenDone={false}
                    defaultOpen={true}
                    duration={1.2}
                    isStreaming={reasoningStep < 3}
                  >
                    <div className="space-y-3 py-1.5 text-[13px] text-[var(--ink)]">
                      {[
                        {
                          step: "1",
                          text: "Analyzing prospect inquiry: Company sizing (60 seats) indicates Enterprise tier.",
                          latency: "18ms",
                        },
                        {
                          step: "2",
                          text: "Checking compliance requirement: SOC 2 Type II whitepaper verified in knowledge base.",
                          latency: "42ms",
                        },
                        {
                          step: "3",
                          text: "Calling Google Calendar API: Found open slot on Thursday at 2:00 PM EST.",
                          latency: "120ms",
                        },
                      ].map((row, idx) => {
                        const revealed = idx < reasoningStep;
                        return (
                          <motion.div
                            animate={{
                              opacity: revealed ? 1 : 0.25,
                              y: revealed ? 0 : 4,
                            }}
                            className="flex items-start justify-between gap-3 rounded-xl border border-[var(--hairline)] bg-[var(--alt-band)] px-3.5 py-2.5"
                            key={row.step}
                            transition={{
                              duration: shouldReduceMotion ? 0 : 0.26,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                          >
                            <div className="flex items-start gap-2.5">
                              <CheckCircle2
                                className={`mt-0.5 size-4 shrink-0 ${
                                  revealed
                                    ? "text-[var(--success)]"
                                    : "text-[var(--dividers)]"
                                }`}
                              />
                              <span className="leading-snug">{row.text}</span>
                            </div>
                            <span className="shrink-0 font-mono text-[11px] tabular-nums text-[var(--text-secondary)]">
                              {row.latency}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </AIReasoning>
                </motion.div>
              )}

              {/* STAGE 3: LIVE TOOL EXECUTION */}
              {activeIndex === 2 && (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full rounded-[18px] border border-[var(--dividers)] bg-[var(--surface)] p-4 sm:p-5"
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  key="stage-2"
                  transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="mb-3 flex items-center justify-between border-b border-[var(--hairline)] pb-3">
                    <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)]">
                      Direct Calendar &amp; CRM Execution
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--link)]">
                      <CalendarCheck2 className="size-3.5" />
                      {toolStatus === "running" ? "Executing API…" : "Slot Confirmed"}
                    </span>
                  </div>

                  <AIToolCall
                    args={
                      <div className="grid grid-cols-1 gap-2 rounded-xl border border-[var(--hairline)] bg-[var(--alt-band)] p-3 sm:grid-cols-3">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
                            Lead
                          </p>
                          <p className="mt-0.5 truncate font-mono text-[12px] text-[var(--ink)]">
                            team@acmecorp.com
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
                            Seats
                          </p>
                          <p className="mt-0.5 font-mono text-[12px] tabular-nums text-[var(--ink)]">
                            60
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
                            Target Slot
                          </p>
                          <p className="mt-0.5 font-mono text-[12px] text-[var(--ink)]">
                            Thu 14:00 EST
                          </p>
                        </div>
                      </div>
                    }
                    className="border-[var(--hairline)] bg-[var(--surface)]"
                    defaultOpen={true}
                    name="crm_lookup_and_calendar_schedule"
                    result={
                      <div className="grid grid-cols-1 gap-2 rounded-xl border border-[var(--hairline)] bg-[var(--alt-band)] p-3 sm:grid-cols-2">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
                            Meeting Confirmed
                          </p>
                          <p className="mt-0.5 font-mono text-[12px] font-semibold text-[var(--success)]">
                            true · Google Meet sent
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
                            Salesforce Opportunity
                          </p>
                          <p className="mt-0.5 font-mono text-[12px] font-semibold tabular-nums text-[var(--link)]">
                            $72,000 ARR
                          </p>
                        </div>
                      </div>
                    }
                    status={toolStatus}
                    summary="2 operations · 180ms"
                  />
                </motion.div>
              )}

              {/* STAGE 4: PIPELINE AUTOPILOT */}
              {activeIndex === 3 && (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full rounded-[18px] border border-[var(--dividers)] bg-[var(--surface)] p-4 sm:p-5"
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  key="stage-3"
                  transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="mb-3 flex items-center justify-between border-b border-[var(--hairline)] pb-3">
                    <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)]">
                      End-to-End Pipeline Sync
                    </span>
                    <span className="rounded-full bg-[var(--success-soft)] px-2.5 py-0.5 text-[11px] font-semibold tabular-nums text-[var(--success)]">
                      {completedTasks === 5 ? "All synced" : `Running ${completedTasks}/5`}
                    </span>
                  </div>

                  <AITaskList
                    className="border-0 bg-transparent p-0"
                    label="Autonomous Pipeline Plan"
                    tasks={liveTasks}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
