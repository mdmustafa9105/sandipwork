"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { KeyboardEvent, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

export interface CoverflowCarouselItem {
  alt?: string;
  content?: ReactNode;
  id: string;
  image?: string;
}

export interface CoverflowCarouselProps {
  autoplay?: boolean;
  autoplayDelay?: number;
  cardClassName?: string;
  className?: string;
  depth?: number;
  index?: number;
  inverted?: boolean;
  items: CoverflowCarouselItem[];
  loop?: boolean;
  onIndexChange?: (index: number) => void;
  rotation?: number;
  scaleStep?: number;
  showIndicators?: boolean;
  spacing?: number;
  stageClassName?: string;
}

interface DragInfo {
  offset: { x: number; y: number };
  velocity: { x: number; y: number };
}

const DEFAULT_DEPTH = 140;
const DEFAULT_ROTATION = 22;
const DEFAULT_SPACING = 340;
const DEFAULT_SCALE_STEP = 0.12;
const DEFAULT_AUTOPLAY_DELAY = 5000;
const SWIPE_VELOCITY_THRESHOLD = 450;
const SWIPE_DISTANCE_THRESHOLD = 65;
const MAX_VISIBLE_OFFSET = 2;
const MIN_SCALE = 0.65;

const CoverflowCarousel = ({
  items,
  index: indexProp,
  onIndexChange,
  inverted = false,
  depth = DEFAULT_DEPTH,
  rotation = DEFAULT_ROTATION,
  spacing = DEFAULT_SPACING,
  scaleStep = DEFAULT_SCALE_STEP,
  loop = false,
  autoplay = false,
  autoplayDelay = DEFAULT_AUTOPLAY_DELAY,
  showIndicators = true,
  cardClassName,
  stageClassName,
  className,
}: CoverflowCarouselProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [internalIndex, setInternalIndex] = useState(0);
  const isControlled = indexProp !== undefined;
  const activeIndex = isControlled ? indexProp : internalIndex;
  const [isPaused, setIsPaused] = useState(false);
  const [responsiveSpacing, setResponsiveSpacing] = useState(spacing);
  const total = items.length;

  useEffect(() => {
    const updateSpacing = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setResponsiveSpacing(Math.min(spacing, Math.round(w * 0.84)));
      } else if (w < 1024) {
        setResponsiveSpacing(Math.min(spacing, 320));
      } else {
        setResponsiveSpacing(spacing);
      }
    };
    updateSpacing();
    window.addEventListener("resize", updateSpacing);
    return () => window.removeEventListener("resize", updateSpacing);
  }, [spacing]);

  const goTo = useCallback(
    (next: number) => {
      const clamped = loop
        ? ((next % total) + total) % total
        : Math.min(Math.max(next, 0), total - 1);

      if (!isControlled) {
        setInternalIndex(clamped);
      }
      onIndexChange?.(clamped);
    },
    [isControlled, loop, onIndexChange, total]
  );

  useEffect(() => {
    if (!autoplay || shouldReduceMotion || isPaused || total <= 1) {
      return;
    }

    const timer = setInterval(() => {
      goTo(activeIndex + 1);
    }, autoplayDelay);

    return () => clearInterval(timer);
  }, [
    autoplay,
    shouldReduceMotion,
    isPaused,
    activeIndex,
    autoplayDelay,
    goTo,
    total,
  ]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleVisibility = () => {
      setIsPaused(document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) setIsPaused(!entry.isIntersecting || document.hidden);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(activeIndex + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(activeIndex - 1);
    }
  };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: DragInfo
  ) => {
    const isSwipeLeft =
      info.offset.x < -SWIPE_DISTANCE_THRESHOLD ||
      info.velocity.x < -SWIPE_VELOCITY_THRESHOLD;
    const isSwipeRight =
      info.offset.x > SWIPE_DISTANCE_THRESHOLD ||
      info.velocity.x > SWIPE_VELOCITY_THRESHOLD;

    if (isSwipeLeft) {
      goTo(activeIndex + 1);
    } else if (isSwipeRight) {
      goTo(activeIndex - 1);
    }
  };

  // Compute circular shortest signed offset when loop=true so side cards always balance symmetrically
  const getOffset = (i: number) => {
    let diff = i - activeIndex;
    if (loop && total > 2) {
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;
    }
    return diff;
  };

  return (
    <div
      aria-label="Customer stories carousel"
      aria-roledescription="carousel"
      className={cn(
        "relative w-full max-w-full overflow-hidden select-none outline-none",
        className
      )}
      onBlur={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      ref={containerRef}
      role="region"
      style={{
        perspective: shouldReduceMotion ? undefined : 1400,
        touchAction: "pan-y",
      }}
      tabIndex={0}
    >
      <motion.div
        className={cn(
          "relative mx-auto flex h-[340px] sm:h-[360px] max-w-full items-center justify-center overflow-hidden",
          stageClassName
        )}
        drag={total > 1 && !shouldReduceMotion ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={handleDragEnd}
        style={{ transformStyle: "preserve-3d", touchAction: "pan-y" }}
      >
        {items.map((item, i) => {
          const offset = getOffset(i);
          const absOffset = Math.abs(offset);
          const isVisible = absOffset <= MAX_VISIBLE_OFFSET;
          const isActive = offset === 0;

          if (!isVisible) {
            return null;
          }

          const direction = inverted ? -1 : 1;
          const rotateY = shouldReduceMotion ? 0 : direction * -offset * rotation;
          const translateX = offset * responsiveSpacing;
          const translateZ = shouldReduceMotion ? 0 : -absOffset * depth;
          const scale = Math.max(1 - absOffset * scaleStep, MIN_SCALE);
          const opacity = isActive ? 1 : Math.max(0.32, 1 - absOffset * 0.42);

          return (
            <motion.div
              animate={
                shouldReduceMotion
                  ? { opacity: isActive ? 1 : 0, x: isActive ? 0 : translateX }
                  : {
                      opacity,
                      rotateY,
                      scale,
                      x: translateX,
                      z: translateZ,
                    }
              }
              aria-hidden={!isActive}
              className={cn(
                "absolute w-[calc(100vw-40px)] max-w-[480px] sm:w-[460px] md:w-[520px] h-[296px] sm:h-[308px] overflow-hidden rounded-[28px]",
                !isActive && "cursor-pointer",
                cardClassName
              )}
              key={item.id}
              onClick={() => {
                if (!isActive) goTo(i);
              }}
              style={{
                transformStyle: "preserve-3d",
                zIndex: total - absOffset,
              }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      duration: 0.48,
                      ease: [0.22, 1, 0.36, 1],
                    }
              }
            >
              {item.image ? (
                <img
                  alt={item.alt ?? ""}
                  className="h-full w-full object-cover"
                  draggable={false}
                  src={item.image}
                />
              ) : (
                <div className="flex h-full w-full items-stretch justify-center">
                  {item.content}
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Refined Apple-style navigation bar: Prev + Dots + Counter + Next */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          aria-label="Previous customer story"
          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[var(--dividers)] bg-[var(--surface)] text-[var(--ink)] transition-colors hover:border-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-35"
          disabled={!loop && activeIndex === 0}
          onClick={() => goTo(activeIndex - 1)}
          type="button"
        >
          <ChevronLeft className="size-4" />
        </button>

        {showIndicators && (
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--hairline)] bg-[var(--surface)] px-3.5 py-2">
            {items.map((item, idx) => {
              const selected = idx === activeIndex;
              return (
                <button
                  aria-current={selected ? "true" : undefined}
                  aria-label={`View story ${idx + 1} of ${total}`}
                  className={cn(
                    "h-2 cursor-pointer rounded-full transition-all duration-300",
                    selected
                      ? "w-7 bg-[var(--ink)]"
                      : "w-2 bg-[var(--dividers)] hover:bg-[var(--outlines)]"
                  )}
                  key={item.id}
                  onClick={() => goTo(idx)}
                  type="button"
                />
              );
            })}
            <span className="ml-1.5 border-l border-[var(--hairline)] pl-2.5 text-[12px] font-medium tabular-nums text-[var(--text-secondary)]">
              {activeIndex + 1} / {total}
            </span>
          </div>
        )}

        <button
          aria-label="Next customer story"
          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[var(--dividers)] bg-[var(--surface)] text-[var(--ink)] transition-colors hover:border-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-35"
          disabled={!loop && activeIndex === total - 1}
          onClick={() => goTo(activeIndex + 1)}
          type="button"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div aria-live="polite" className="sr-only">
        {`Slide ${activeIndex + 1} of ${total}`}
      </div>
    </div>
  );
};

export default CoverflowCarousel;
