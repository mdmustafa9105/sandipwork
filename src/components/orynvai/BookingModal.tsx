"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, X, Calendar, ExternalLink, ShieldCheck } from "lucide-react";

export interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INBOUND_VOLUME_OPTIONS = [
  "Under 500 leads / month",
  "500 – 2,500 leads / month",
  "2,500 – 10,000 leads / month",
  "10,000+ enterprise volume",
];

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [volume, setVolume] = useState(INBOUND_VOLUME_OPTIONS[1]);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => inputRef.current?.focus(), 80);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;
    setSubmitted(true);
  };

  const resetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          aria-labelledby="booking-modal-title"
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
            onClick={resetAndClose}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          />

          {/* Modal Container */}
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative z-10 max-h-[calc(100svh-32px)] w-full max-w-[500px] overflow-y-auto rounded-[16px] border border-[var(--dividers)] bg-[var(--surface)] text-left text-[var(--ink)] shadow-2xl"
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
            {/* Top Precision Utility Strip */}
            <div className="flex items-center justify-between border-b border-[var(--dividers)] bg-[var(--alt-band)] px-6 py-3.5">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full bg-[var(--pill-blue)]"
                />
                <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.09em] text-[var(--text-secondary)]">
                  ORYNVAI // SALES CONSULTATION
                </span>
              </div>
              <button
                aria-label="Close modal"
                className="flex size-7 cursor-pointer items-center justify-center rounded-md border border-[var(--dividers)] bg-[var(--surface)] text-[var(--text-secondary)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
                onClick={resetAndClose}
                type="button"
              >
                <X className="size-3.5" />
              </button>
            </div>

            <div className="p-6 sm:p-7">
              <h2
                className="text-[22px] font-semibold tracking-[-0.025em] text-[var(--ink)] sm:text-[24px]"
                id="booking-modal-title"
              >
                {submitted ? "Consultation request dispatched." : "Book a sales call"}
              </h2>

              {bookingUrl && !submitted && (
                <div className="my-4 rounded-[10px] border border-[var(--hairline)] bg-[var(--surface-subtle)] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[13px] font-medium text-[var(--ink)]">
                      <Calendar className="size-4 text-[var(--link)]" />
                      <span>Direct Calendar Active</span>
                    </div>
                    <a
                      className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--link)] hover:underline"
                      href={bookingUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Open Cal.com / Calendly <ExternalLink className="size-3" />
                    </a>
                  </div>
                </div>
              )}

              {submitted ? (
                <div className="mt-5 space-y-5">
                  <div className="rounded-[12px] border border-[var(--dividers)] bg-[var(--surface-subtle)] p-5">
                    <div className="mb-3 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--success)]">
                      <Check className="size-4" />
                      <span>INQUIRY LOGGED</span>
                    </div>

                    <dl className="grid grid-cols-2 gap-3 text-[13px]">
                      <div>
                        <dt className="font-mono text-[10px] uppercase text-[var(--text-secondary)]">
                          Name
                        </dt>
                        <dd className="mt-0.5 font-medium text-[var(--ink)]">
                          {name}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[10px] uppercase text-[var(--text-secondary)]">
                          Company
                        </dt>
                        <dd className="mt-0.5 font-medium text-[var(--ink)]">
                          {company || "Direct Inquiry"}
                        </dd>
                      </div>
                      <div className="col-span-2 border-t border-[var(--hairline)] pt-2.5">
                        <dt className="font-mono text-[10px] uppercase text-[var(--text-secondary)]">
                          Work Email
                        </dt>
                        <dd className="mt-0.5 font-mono text-[12.5px] text-[var(--ink)]">
                          {email}
                        </dd>
                      </div>
                      <div className="col-span-2 border-t border-[var(--hairline)] pt-2.5">
                        <dt className="font-mono text-[10px] uppercase text-[var(--text-secondary)]">
                          Inbound Volume
                        </dt>
                        <dd className="mt-0.5 font-medium text-[var(--ink)]">
                          {volume}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-4 border-t border-[var(--hairline)] pt-3 text-[12px] leading-relaxed text-[var(--text-secondary)]">
                      <p>
                        Your consultation brief has been recorded. Our revenue operations team will review your inbound lead parameters and reply with customized ROI projections.
                      </p>
                      {!bookingUrl && (
                        <p className="mt-2 text-[11px] text-[var(--text-secondary)]">
                          Client Integration Note: To embed direct calendar self-booking, configure <code className="font-mono text-[var(--ink)]">NEXT_PUBLIC_BOOKING_URL</code>.
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    className="apple-pill-btn w-full py-3 text-[13px]"
                    onClick={resetAndClose}
                    type="button"
                  >
                    Return to ORYNVAI
                  </button>
                </div>
              ) : (
                <form className="mt-3 space-y-4" onSubmit={handleSubmit}>
                  <p className="text-[14px] leading-relaxed text-[var(--text-secondary)]">
                    Schedule a tailored consultation to review your inbound lead flow, unit economics, and CRM integration requirements.
                  </p>

                  <div className="space-y-3 pt-1">
                    <div>
                      <label
                        className="mb-1.5 block font-mono text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)]"
                        htmlFor="booking-name"
                      >
                        Full Name
                      </label>
                      <input
                        className="w-full rounded-[8px] border border-[var(--dividers)] bg-[var(--surface-subtle)] px-3.5 py-2.5 text-[14px] text-[var(--ink)] placeholder:text-[var(--outlines)] focus:border-[var(--pill-blue)] focus:outline-none"
                        id="booking-name"
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Sarah Jenkins"
                        ref={inputRef}
                        required
                        type="text"
                        value={name}
                      />
                    </div>

                    <div>
                      <label
                        className="mb-1.5 block font-mono text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)]"
                        htmlFor="booking-email"
                      >
                        Work Email
                      </label>
                      <input
                        className="w-full rounded-[8px] border border-[var(--dividers)] bg-[var(--surface-subtle)] px-3.5 py-2.5 text-[14px] text-[var(--ink)] placeholder:text-[var(--outlines)] focus:border-[var(--pill-blue)] focus:outline-none"
                        id="booking-email"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sarah@company.com"
                        required
                        type="email"
                        value={email}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label
                          className="mb-1.5 block font-mono text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)]"
                          htmlFor="booking-company"
                        >
                          Company Name
                        </label>
                        <input
                          className="w-full rounded-[8px] border border-[var(--dividers)] bg-[var(--surface-subtle)] px-3.5 py-2.5 text-[14px] text-[var(--ink)] placeholder:text-[var(--outlines)] focus:border-[var(--pill-blue)] focus:outline-none"
                          id="booking-company"
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Acme Technologies"
                          type="text"
                          value={company}
                        />
                      </div>

                      <div>
                        <label
                          className="mb-1.5 block font-mono text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)]"
                          htmlFor="booking-volume"
                        >
                          Monthly Inbound Volume
                        </label>
                        <select
                          className="w-full rounded-[8px] border border-[var(--dividers)] bg-[var(--surface-subtle)] px-3.5 py-2.5 text-[13.5px] text-[var(--ink)] focus:border-[var(--pill-blue)] focus:outline-none"
                          id="booking-volume"
                          onChange={(e) => setVolume(e.target.value)}
                          value={volume}
                        >
                          {INBOUND_VOLUME_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        className="mb-1.5 block font-mono text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)]"
                        htmlFor="booking-notes"
                      >
                        Specific Goals or Questions (Optional)
                      </label>
                      <textarea
                        className="w-full rounded-[8px] border border-[var(--dividers)] bg-[var(--surface-subtle)] px-3.5 py-2 text-[13.5px] text-[var(--ink)] placeholder:text-[var(--outlines)] focus:border-[var(--pill-blue)] focus:outline-none"
                        id="booking-notes"
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Looking to capture weekend web leads and sync with HubSpot Enterprise..."
                        rows={2}
                        value={notes}
                      />
                    </div>
                  </div>

                  {!bookingUrl && (
                    <div className="flex items-start gap-2 rounded-lg border border-[var(--hairline)] bg-[var(--surface-subtle)] p-3 text-[12px] text-[var(--text-secondary)]">
                      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[var(--link)]" />
                      <span>
                        Configuration Boundary: Inquiries are securely dispatched directly to the sales routing queue. Calendar direct-booking embeds activate via <code className="font-mono text-[var(--ink)]">NEXT_PUBLIC_BOOKING_URL</code>.
                      </span>
                    </div>
                  )}

                  <div className="border-t border-[var(--hairline)] pt-3">
                    <button
                      className="apple-pill-btn w-full py-3 text-[14px]"
                      type="submit"
                    >
                      Confirm Sales Call Request
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

