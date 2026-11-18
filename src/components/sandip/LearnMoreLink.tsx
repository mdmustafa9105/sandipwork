"use client";

import { cn } from "@/lib/utils";
import type { AnchorHTMLAttributes, ReactNode } from "react";

interface LearnMoreLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
}

/**
 * Apple-style editorial text link paired with transitions.dev's
 * spreading-chevron hover affordance (.t-learn).
 */
export default function LearnMoreLink({
  children,
  className,
  ...props
}: LearnMoreLinkProps) {
  return (
    <a className={cn("apple-text-link t-learn", className)} {...props}>
      <span>{children}</span>
      <span aria-hidden="true" className="t-learn-chevron mt-[1px]">
        <svg
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          viewBox="0 0 16 16"
        >
          <path className="t-learn-arm t-learn-arm-top" d="M6 4L10 8" />
          <path className="t-learn-arm t-learn-arm-bot" d="M10 8L6 12" />
        </svg>
      </span>
    </a>
  );
}

