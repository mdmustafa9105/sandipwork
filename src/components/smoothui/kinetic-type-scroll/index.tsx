"use client";

import { cn } from "@/lib/utils";
import {
  type MotionValue,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import type { RefObject } from "react";
import { useRef } from "react";

export type KineticTypeScrollAlign = "start" | "center" | "end";
export type KineticTypeVariant = "editorial" | "wave";

type UseScrollOptions = Parameters<typeof useScroll>[0];
export type ScrollOffsetTuple = NonNullable<UseScrollOptions>["offset"];

export interface KineticTypeScrollProps {
  align?: KineticTypeScrollAlign;
  className?: string;
  container?: RefObject<HTMLElement | null>;
  dimRange?: [number, number];
  liftRange?: [number, number];
  offset?: ScrollOffsetTuple;
  scaleRange?: [number, number];
  stagger?: number;
  trackingRange?: [number, number];
  variant?: KineticTypeVariant;
  weightRange?: [number, number];
  words: string[];
}

interface EditorialWordProps {
  dimRange: [number, number];
  index: number;
  progress: MotionValue<number>;
  shouldReduceMotion: boolean;
  total: number;
  word: string;
}

const ALIGN_ROW_CLASS: Record<KineticTypeScrollAlign, string> = {
  center: "justify-center",
  end: "justify-end",
  start: "justify-start",
};

const DEFAULT_EDITORIAL_DIM: [number, number] = [0.22, 1];
const DEFAULT_OFFSET = ["start 0.85", "end 0.42"] as ScrollOffsetTuple;

const EDITORIAL_SPRING = {
  damping: 32,
  mass: 0.4,
  stiffness: 260,
};

/**
 * Editorial word illumination: each word transitions cleanly from muted ink
 * to crisp primary ink in reading order as the reader scrolls through the band.
 * Zero vertical bounce or layout shift — typography carries the authority.
 */
const EditorialWord = ({
  word,
  dimRange,
  index,
  progress,
  shouldReduceMotion,
  total,
}: EditorialWordProps) => {
  const step = 0.82 / Math.max(1, total);
  const start = index * step;
  const end = Math.min(1, start + Math.max(step * 2.2, 0.14));

  const rawOpacity = useTransform(progress, [start, end], dimRange, {
    clamp: true,
  });
  const rawY = useTransform(progress, [start, end], [4, 0], {
    clamp: true,
  });

  const opacity = useSpring(rawOpacity, EDITORIAL_SPRING);
  const y = useSpring(rawY, EDITORIAL_SPRING);

  if (shouldReduceMotion) {
    return (
      <span aria-hidden="true" className="inline-block">
        {word}
      </span>
    );
  }

  return (
    <motion.span
      aria-hidden="true"
      className="inline-block will-change-[opacity,transform]"
      style={{ opacity, y }}
    >
      {word}
    </motion.span>
  );
};

export default function KineticTypeScroll({
  words,
  align = "center",
  className,
  container,
  dimRange = DEFAULT_EDITORIAL_DIM,
  offset = DEFAULT_OFFSET,
}: KineticTypeScrollProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = Boolean(useReducedMotion());

  const { scrollYProgress } = useScroll({
    container,
    offset,
    target: wrapperRef,
  });

  return (
    <div
      className={cn(
        "flex flex-wrap gap-x-[0.28em] gap-y-[0.14em] max-w-full",
        ALIGN_ROW_CLASS[align],
        className
      )}
      ref={wrapperRef}
    >
      <span className="sr-only">{words.join(" ")}</span>
      {words.map((word, index) => (
        <EditorialWord
          dimRange={dimRange}
          index={index}
          key={`${word}-${index}`}
          progress={scrollYProgress}
          shouldReduceMotion={shouldReduceMotion}
          total={words.length}
          word={word}
        />
      ))}
    </div>
  );
}
