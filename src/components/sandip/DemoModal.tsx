"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, X } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";

export interface DemoModalProps {
  initialPlan?: string;
  isOpen: boolean;
  onClose: () => void;
}

const PLAN_OPTIONS = [
  "Growth ($1,490/mo)",
  "Scale ($3,490/mo)",
  "Enterprise (Custom)",
];

function DemoModalContent({
  initialPlan,
  onClose,
}: {
  initialPlan: string;
  onClose: () => void;
}) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [plan, setPlan] = useState(initialPlan);
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
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
  }, [onClose]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <div
      aria-labelledby="demo-modal-title"
      aria-modal="true"
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      role="dialog"
    >
      <motion.div
        animate={{ opacity: 1 }}
        aria-hidden="true"
        className="fixed inset-0 bg-black/40 backdrop-blur-[4px]"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        onClick={onClose}
        transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
      />

      <motion.div
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 w-full max-w-[460px] rounded-[28px] border border-[var(--dividers)] bg-[var(--surface)] p-7 text-left text-[var(--ink)]"
        exit={
          shouldReduceMotion
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.97, y: 6 }
        }
        initial={
          shouldReduceMotion
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.96, y: 10 }
        }
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }
        }
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[var(--link)]">
              SandipAI Live Walkthrough
            </p>
            <h2
              className="mt-1 text-[24px] font-semibold tracking-[-0.02em] text-[var(--ink)]"
              id="demo-modal-title"
            >
              {submitted ? "Demo request ready." : "Book your live demo."}
            </h2>
          </div>
          <button
            aria-label="Close modal"
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[var(--hairline)] bg-[var(--alt-band)] text-[var(--text-secondary)] transition-colors hover:border-[var(--outlines)] hover:text-[var(--ink)]"
            onClick={onClose}
            type="button"
          >
            <X className="size-4" />
          </button>
        </div>

        {submitted ? (
          <div className="space-y-5">
            <div className="rounded-[20px] border border-[var(--hairline)] bg-[var(--alt-band)] p-5">
              <div className="mb-3 inline-flex size-9 items-center justify-center rounded-full bg-[var(--success-soft)] text-[var(--success)]">
                <Check className="size-5" />
              </div>
              <p className="text-[15px] leading-relaxed text-[var(--ink)]">
                Thanks{name ? `, ${name}` : ""}. We&apos;ve prepared your{" "}
                <span className="font-semibold">{plan}</span> walkthrough
                summary for <span className="font-medium">{email}</span>.
              </p>
              <p className="mt-2 text-[13px] text-[var(--text-secondary)]">
                Interactive preview mode — no external email was sent.
              </p>
            </div>
            <button
              className="apple-pill-btn w-full py-2.5 text-[13px]"
              onClick={onClose}
              type="button"
            >
              Return to SandipAI
            </button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <p className="text-[14px] leading-relaxed text-[var(--text-secondary)]">
              See SandipAI qualify inbound visitors, resolve technical
              objections, and sync directly with your CRM.
            </p>

            <div className="space-y-3">
              <div>
                <label
                  className="mb-1.5 block text-[12px] font-medium text-[var(--text-secondary)]"
                  htmlFor="demo-name"
                >
                  Full name
                </label>
                <input
                  className="w-full rounded-[14px] border border-[var(--dividers)] bg-[var(--surface-subtle)] px-3.5 py-2.5 text-[14px] text-[var(--ink)] placeholder:text-[var(--outlines)] focus:border-[var(--pill-blue)] focus:outline-none"
                  id="demo-name"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  ref={inputRef}
                  required
                  type="text"
                  value={name}
                />
              </div>

              <div>
                <label
                  className="mb-1.5 block text-[12px] font-medium text-[var(--text-secondary)]"
                  htmlFor="demo-email"
                >
                  Work email
                </label>
                <input
                  className="w-full rounded-[14px] border border-[var(--dividers)] bg-[var(--surface-subtle)] px-3.5 py-2.5 text-[14px] text-[var(--ink)] placeholder:text-[var(--outlines)] focus:border-[var(--pill-blue)] focus:outline-none"
                  id="demo-email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  required
                  type="email"
                  value={email}
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label
                    className="mb-1.5 block text-[12px] font-medium text-[var(--text-secondary)]"
                    htmlFor="demo-company"
                  >
                    Company
                  </label>
                  <input
                    className="w-full rounded-[14px] border border-[var(--dividers)] bg-[var(--surface-subtle)] px-3.5 py-2.5 text-[14px] text-[var(--ink)] placeholder:text-[var(--outlines)] focus:border-[var(--pill-blue)] focus:outline-none"
                    id="demo-company"
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Acme Corp"
                    type="text"
                    value={company}
                  />
                </div>
                <div>
                  <label
                    className="mb-1.5 block text-[12px] font-medium text-[var(--text-secondary)]"
                    htmlFor="demo-plan"
                  >
                    Plan interest
                  </label>
                  <select
                    className="w-full rounded-[14px] border border-[var(--dividers)] bg-[var(--surface-subtle)] px-3.5 py-2.5 text-[14px] text-[var(--ink)] focus:border-[var(--pill-blue)] focus:outline-none"
                    id="demo-plan"
                    onChange={(e) => setPlan(e.target.value)}
                    value={plan}
                  >
                    {PLAN_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                className="apple-pill-btn w-full py-3 text-[13px]"
                type="submit"
              >
                Schedule live walkthrough
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}

export default function DemoModal({
  initialPlan = "Scale ($3,490/mo)",
  isOpen,
  onClose,
}: DemoModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <DemoModalContent
          initialPlan={initialPlan}
          key={initialPlan}
          onClose={onClose}
        />
      )}
    </AnimatePresence>
  );
}
