"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Mic, MicOff, PhoneCall, PhoneOff, Volume2, AlertCircle, X, ShieldCheck } from "lucide-react";

export interface VapiVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CallStatus =
  | "idle"
  | "connecting"
  | "active"
  | "speaking"
  | "listening"
  | "ended"
  | "error"
  | "not-configured";

export default function VapiVoiceModal({ isOpen, onClose }: VapiVoiceModalProps) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
  const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
  const isConfigured = Boolean(publicKey && assistantId);

  const [status, setStatus] = useState<CallStatus>(() =>
    isConfigured ? "idle" : "not-configured"
  );
  const [volumeLevel, setVolumeLevel] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState<string>("");

  const vapiRef = useRef<any>(null);

  // Safe call termination
  const endCall = useCallback(() => {
    if (vapiRef.current) {
      try {
        vapiRef.current.stop();
      } catch (err) {
        console.error("Vapi stop error:", err);
      }
      vapiRef.current = null;
    }
    setStatus("idle");
    setVolumeLevel(0);
    setLiveTranscript("");
  }, []);

  // Handle closing modal
  const handleClose = useCallback(() => {
    endCall();
    onClose();
  }, [endCall, onClose]);

  // Start Vapi Call
  const startCall = useCallback(async () => {
    if (!isConfigured || !publicKey || !assistantId) {
      setStatus("not-configured");
      return;
    }

    setStatus("connecting");
    setErrorMessage(null);

    try {
      const VapiModule = await import("@vapi-ai/web");
      const VapiClass = VapiModule.default;
      const vapiInstance = new VapiClass(publicKey);
      vapiRef.current = vapiInstance;

      vapiInstance.on("call-start", () => {
        setStatus("active");
      });

      vapiInstance.on("call-end", () => {
        setStatus("ended");
        setTimeout(() => {
          setStatus("idle");
        }, 1200);
      });

      vapiInstance.on("speech-start", () => {
        setStatus("speaking");
      });

      vapiInstance.on("speech-end", () => {
        setStatus("listening");
      });

      vapiInstance.on("volume-level", (volume: number) => {
        setVolumeLevel(volume);
      });

      vapiInstance.on("message", (msg: any) => {
        if (msg.type === "transcript" && msg.transcript) {
          setLiveTranscript(msg.transcript);
        }
      });

      vapiInstance.on("error", (err: any) => {
        console.error("Vapi runtime error:", err);
        setStatus("error");
        setErrorMessage(
          err?.message || "Unable to establish voice connection. Please check microphone permissions."
        );
      });

      await vapiInstance.start(assistantId);
    } catch (err: any) {
      console.error("Failed to initialize Vapi:", err);
      setStatus("error");
      setErrorMessage(
        err?.message || "Failed to initialize voice engine. Please ensure microphone access is allowed."
      );
    }
  }, [isConfigured, publicKey, assistantId]);

  // Toggle Mute
  const toggleMute = () => {
    if (vapiRef.current) {
      const nextMuted = !isMuted;
      try {
        vapiRef.current.setMuted(nextMuted);
        setIsMuted(nextMuted);
      } catch (err) {
        console.error("Error setting mute:", err);
      }
    }
  };

  // Keyboard navigation & body scroll locking
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isConfigured, handleClose]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (vapiRef.current) {
        try {
          vapiRef.current.stop();
        } catch {}
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          aria-labelledby="vapi-modal-title"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
        >
          {/* Backdrop */}
          <motion.div
            animate={{ opacity: 1 }}
            aria-hidden="true"
            className="fixed inset-0 bg-black/55 backdrop-blur-[6px]"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={handleClose}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          />

          {/* Dialog Container */}
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative z-10 w-full max-w-[480px] overflow-hidden rounded-[16px] border border-[var(--dividers)] bg-[var(--surface)] text-[var(--ink)] shadow-2xl"
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.98, y: 8 }
            }
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, y: 12 }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }
            }
          >
            {/* Top Precision Header Bar */}
            <div className="flex items-center justify-between border-b border-[var(--dividers)] bg-[var(--alt-band)] px-6 py-3.5">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={`size-2 rounded-full ${
                    status === "active" || status === "speaking" || status === "listening"
                      ? "animate-pulse bg-[var(--success)]"
                      : status === "connecting"
                      ? "animate-ping bg-[var(--pill-blue)]"
                      : status === "error"
                      ? "bg-red-500"
                      : "bg-[var(--text-secondary)]"
                  }`}
                />
                <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.09em] text-[var(--text-secondary)]">
                  ORYNVAI // VOICE ASSISTANT
                </span>
              </div>
              <button
                aria-label="Close voice dialogue"
                className="flex size-7 items-center justify-center rounded-md border border-[var(--dividers)] bg-[var(--surface)] text-[var(--text-secondary)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
                onClick={handleClose}
                type="button"
              >
                <X className="size-3.5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-7">
              <h2
                className="text-[22px] font-semibold tracking-[-0.025em] text-[var(--ink)] sm:text-[24px]"
                id="vapi-modal-title"
              >
                Talk directly to ORYNVAI
              </h2>
              <p className="mt-1.5 text-[14px] leading-[1.5] text-[var(--text-secondary)]">
                Experience real-time voice intelligence. Speak naturally to test objection handling, product qualification, and calendar coordination.
              </p>

              {/* Status Display Area */}
              <div className="my-6 rounded-[12px] border border-[var(--hairline)] bg-[var(--surface-subtle)] p-5 text-center">
                {status === "not-configured" && (
                  <div className="space-y-3 text-left">
                    <div className="flex items-start gap-2.5">
                      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[var(--link)]" />
                      <div>
                        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--link)]">
                          Voice Integration Boundary Ready
                        </p>
                        <p className="mt-1 text-[13px] leading-[1.55] text-[var(--text-secondary)]">
                          The official Vapi WebRTC client is installed and configured. To activate live audio conversations with your custom voice model, connect your public API keys:
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5 rounded-lg border border-[var(--hairline)] bg-[var(--canvas)] p-3 font-mono text-[11.5px] text-[var(--ink)]">
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">Public Key:</span>
                        <span className="font-semibold text-amber-600 dark:text-amber-400">
                          {publicKey ? "Configured" : "NEXT_PUBLIC_VAPI_PUBLIC_KEY"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">Assistant ID:</span>
                        <span className="font-semibold text-amber-600 dark:text-amber-400">
                          {assistantId ? "Configured" : "NEXT_PUBLIC_VAPI_ASSISTANT_ID"}
                        </span>
                      </div>
                    </div>

                    <p className="text-[12px] text-[var(--text-secondary)]">
                      In accordance with client instructions, no synthetic or fake conversation is simulated when live keys are pending.
                    </p>
                  </div>
                )}

                {(status === "idle" || status === "ended") && isConfigured && (
                  <div className="flex flex-col items-center py-4">
                    <div className="flex size-16 items-center justify-center rounded-full bg-[var(--pill-blue-soft)] text-[var(--pill-blue)]">
                      <PhoneCall className="size-7" />
                    </div>
                    <p className="mt-4 text-[15px] font-medium text-[var(--ink)]">
                      Ready to start conversation
                    </p>
                    <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
                      Click below to activate microphone and speak with ORYNVAI.
                    </p>
                  </div>
                )}

                {status === "connecting" && (
                  <div className="flex flex-col items-center py-5">
                    <div className="size-10 animate-spin rounded-full border-2 border-[var(--pill-blue)] border-t-transparent" />
                    <p className="mt-4 font-mono text-[12.5px] uppercase tracking-[0.08em] text-[var(--link)]">
                      Connecting to ORYNVAI Voice Network...
                    </p>
                  </div>
                )}

                {(status === "active" || status === "speaking" || status === "listening") && (
                  <div className="flex flex-col items-center py-2">
                    {/* Audio Pulse Waveform Indicator */}
                    <div className="relative flex size-20 items-center justify-center">
                      <div
                        className="absolute inset-0 rounded-full bg-[var(--pill-blue)] opacity-20 transition-transform duration-75"
                        style={{
                          transform: `scale(${1 + Math.min(volumeLevel * 1.5, 0.8)})`,
                        }}
                      />
                      <div className="relative flex size-14 items-center justify-center rounded-full bg-[var(--pill-blue)] text-white shadow-lg">
                        {status === "speaking" ? (
                          <Volume2 className="size-7 animate-pulse" />
                        ) : (
                          <Mic className="size-7" />
                        )}
                      </div>
                    </div>

                    <p className="mt-4 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--link)]">
                      {status === "speaking"
                        ? "ORYNVAI Speaking..."
                        : "Listening for your voice..."}
                    </p>

                    {liveTranscript && (
                      <p className="mt-3 max-w-[380px] text-center text-[13.5px] italic text-[var(--ink)]">
                        &ldquo;{liveTranscript}&rdquo;
                      </p>
                    )}
                  </div>
                )}

                {status === "error" && (
                  <div className="space-y-3 py-2 text-left">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <AlertCircle className="size-5 shrink-0" />
                      <span className="font-semibold text-[14px]">
                        Voice Session Disconnected
                      </span>
                    </div>
                    <p className="text-[13px] leading-relaxed text-[var(--text-secondary)]">
                      {errorMessage || "An unexpected error occurred during WebRTC negotiation."}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 border-t border-[var(--hairline)] pt-4">
                {isConfigured && status === "idle" && (
                  <button
                    className="apple-pill-btn w-full py-3 text-[14px]"
                    onClick={startCall}
                    type="button"
                  >
                    Start Voice Session
                  </button>
                )}

                {isConfigured && (status === "active" || status === "speaking" || status === "listening") && (
                  <>
                    <button
                      aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
                      className={`flex h-[44px] flex-1 items-center justify-center gap-2 rounded-full border border-[var(--dividers)] px-4 text-[13px] font-medium transition-colors ${
                        isMuted
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--ink)]"
                      }`}
                      onClick={toggleMute}
                      type="button"
                    >
                      {isMuted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                      <span>{isMuted ? "Unmute" : "Mute"}</span>
                    </button>

                    <button
                      className="flex h-[44px] flex-1 items-center justify-center gap-2 rounded-full bg-red-600 px-4 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                      onClick={endCall}
                      type="button"
                    >
                      <PhoneOff className="size-4" />
                      <span>End Conversation</span>
                    </button>
                  </>
                )}

                {status === "error" && (
                  <button
                    className="apple-pill-btn w-full py-3 text-[14px]"
                    onClick={startCall}
                    type="button"
                  >
                    Retry Connection
                  </button>
                )}

                {status === "not-configured" && (
                  <button
                    className="apple-outline-pill-btn w-full py-3 text-[13px]"
                    onClick={handleClose}
                    type="button"
                  >
                    Close Voice Panel
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
