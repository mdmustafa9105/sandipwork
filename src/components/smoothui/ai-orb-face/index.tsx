"use client";

import Orb from "@/components/smoothui/orb";
import { cn } from "@/lib/utils";
import {
  type MotionValue,
  motion,
  useAnimationControls,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  type AIAmplitude,
  type AIState,
  getAIStateMotion,
  useAmplitudeValue,
} from "../ai-core";

const VIEWBOX = 100;
const CENTER = VIEWBOX / 2;
const EYE_OFFSET = 14.5;
const EYE_Y = 41.5;
const EYE_WIDTH = 9.5;
const EYE_HEIGHT = 21.5;
const EYE_RADIUS = 4.75;
/** How far the optical lenses can travel from centre, in viewBox units. */
const GAZE_RANGE = 4.8;
/** Cursor distance, in px, at which the gaze reaches full deflection. */
const GAZE_FALLOFF = 240;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_IN = [0.4, 0, 1, 1] as const;
const SPIRAL = "M0 0C-0.6 -4 5 -5 6 -0.6C7 4.5 1 8 -4 6C-9 4.5 -9.5 -2 -6 -6";
const BLINK_MIN_MS = 3600;
const BLINK_EXTRA_MS = 2800;
const DOUBLE_BLINK_CHANCE = 0.22;
const SACCADE_MIN_MS = 750;
const SACCADE_EXTRA_MS = 700;
const SACCADE_TARGETS = [
  { x: -0.9, y: -0.9 },
  { x: 0.9, y: -0.8 },
  { x: -0.5, y: -0.35 },
  { x: 0.7, y: -0.75 },
] as const;

const ORB_SPHERE_FRACTION = 0.86;
const ENERGY_STEPS = 4;

const useEnergyBucket = (value: MotionValue<number>) => {
  const [bucket, setBucket] = useState(0);
  useEffect(() => {
    const read = (level: number) =>
      setBucket(Math.round(level * ENERGY_STEPS) / ENERGY_STEPS);
    read(value.get());
    return value.on("change", read);
  }, [value]);
  return bucket;
};

export interface EyeShape {
  dy?: number;
  h: number;
  rotate?: number;
  w: number;
}

export interface Expression {
  left: EyeShape;
  right: EyeShape;
}

const EYE = (h: number, w = 1, rotate = 0, dy = 0): EyeShape => ({
  dy,
  h,
  rotate,
  w,
});

const symmetric = (h: number, w = 1, rotate = 0, dy = 0): Expression => ({
  left: EYE(h, w, rotate, dy),
  right: EYE(h, w, -rotate, dy),
});

export const EXPRESSIONS = {
  alert: symmetric(1.16, 1.04, 0, -1),
  content: symmetric(0.18, 1.22, 0, 1.8),
  cross: symmetric(0.85, 1, 18),
  deadpan: symmetric(0.14, 1.32),
  doubtful: { left: EYE(1, 1), right: EYE(0.48, 1.08, -12) },
  focused: symmetric(0.62, 1.04),
  neutral: symmetric(1),
  surprised: symmetric(0.54, 0.62, 0, -2.5),
  wink: { left: EYE(1, 1), right: EYE(0.14, 1.18, 0, 1.8) },
} satisfies Record<string, Expression>;

export type ExpressionName = keyof typeof EXPRESSIONS;

const STATE_EXPRESSION: Record<string, ExpressionName> = {
  done: "content",
  error: "cross",
  idle: "neutral",
  listening: "alert",
  streaming: "focused",
  thinking: "doubtful",
};

export type AIOrbFaceProps = {
  "aria-label"?: string;
  amplitude?: AIAmplitude;
  className?: string;
  colors?: { body?: string; bodyEdge?: string; feature?: string };
  gaze?: boolean;
  interactive?: boolean;
  showRing?: boolean;
  size?: number | string;
  state?: AIState;
  expression?: ExpressionName | Expression;
};

const DEFAULT_COLORS = {
  body: "#0071e3",
  bodyEdge: "#eef5fc",
  feature: "#1d1d1f",
};

/**
 * SandipAI Optical Character — a precision-engineered intelligence signature.
 *
 * Built around an OkLab WebGL2 sphere with an optical glass rim, calibrated
 * telemetry bezel, and dual-layer gaze-tracking lenses with subtle depth
 * catchlights. Communicates calm focus rather than cartoon ornament.
 */
const AIOrbFace = ({
  "aria-label": ariaLabel,
  amplitude,
  className,
  colors,
  gaze = true,
  interactive = false,
  showRing = false,
  expression,
  size = 128,
  state = "idle",
}: AIOrbFaceProps) => {
  const uid = useId().replace(/:/g, "");
  const shouldReduceMotion = useReducedMotion();
  const amplitudeValue = useAmplitudeValue(amplitude);
  const stateMotion = getAIStateMotion(state);
  const finalColors = { ...DEFAULT_COLORS, ...colors };

  const svgRef = useRef<SVGSVGElement | null>(null);
  const energy = useEnergyBucket(amplitudeValue);
  const leftLid = useAnimationControls();
  const rightLid = useAnimationControls();
  const bodyControls = useAnimationControls();
  const [isHovered, setIsHovered] = useState(false);

  const gazeX = useSpring(0, { damping: 28, stiffness: 210 });
  const gazeY = useSpring(0, { damping: 28, stiffness: 210 });
  // Inner optical catchlight shifts slightly further to imply curved lens depth
  const catchlightX = useTransform(gazeX, (v) => v * 1.28);
  const catchlightY = useTransform(gazeY, (v) => v * 1.28);
  // Subtle ring parallax responds gently to pointer direction
  const ringShiftX = useTransform(gazeX, (v) => v * -0.45);
  const ringShiftY = useTransform(gazeY, (v) => v * -0.45);

  const resolvedSize = typeof size === "number" ? `${size}px` : size;

  const isHappy = state === "done";
  const isThinking = state === "thinking";
  const isListening = state === "listening";
  const isBroken = state === "error";
  const eyesOpen = !isBroken;

  const active: Expression = (() => {
    if (typeof expression === "object") {
      return expression;
    }
    if (expression) {
      return EXPRESSIONS[expression];
    }
    return EXPRESSIONS[STATE_EXPRESSION[state] ?? "neutral"];
  })();

  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const blink = useCallback(
    async (double = false) => {
      const closeT = { duration: 0.065, ease: EASE_IN };
      const openT = { duration: 0.16, ease: EASE_OUT };
      const runOnce = async (fastReopen: boolean) => {
        if (!mountedRef.current) return;
        await Promise.all([
          leftLid.start({ scaleY: 0.08 }, closeT),
          rightLid.start({ scaleY: 0.08 }, closeT),
        ]);
        if (!mountedRef.current) return;
        await Promise.all([
          leftLid.start({ scaleY: 1 }, fastReopen ? closeT : openT),
          rightLid.start({ scaleY: 1 }, fastReopen ? closeT : openT),
        ]);
      };
      await runOnce(double);
      if (double) {
        await runOnce(false);
      }
    },
    [leftLid, rightLid]
  );

  // Idle blinking cadence
  useEffect(() => {
    if (shouldReduceMotion || !eyesOpen) {
      return;
    }
    let timeout: ReturnType<typeof setTimeout>;
    let mounted = true;
    const schedule = () => {
      timeout = setTimeout(
        () => {
          if (mounted) {
            blink(Math.random() < DOUBLE_BLINK_CHANCE);
          }
          schedule();
        },
        BLINK_MIN_MS + Math.random() * BLINK_EXTRA_MS
      );
    };
    schedule();
    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, [blink, eyesOpen, shouldReduceMotion]);

  // Pointer gaze tracking (desktop fine pointers only)
  useEffect(() => {
    if (!gaze || shouldReduceMotion || isThinking || !eyesOpen) {
      return;
    }
    const isFinePointer =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isFinePointer) {
      gazeX.set(0);
      gazeY.set(0);
      return;
    }
    const handle = (event: PointerEvent) => {
      const svg = svgRef.current;
      if (!svg) {
        return;
      }
      const rect = svg.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);
      const reach = Math.min(1, distance / GAZE_FALLOFF) * GAZE_RANGE;
      const angle = Math.atan2(dy, dx);
      gazeX.set(Math.cos(angle) * reach);
      gazeY.set(Math.sin(angle) * reach);
    };
    window.addEventListener("pointermove", handle, { passive: true });
    return () => window.removeEventListener("pointermove", handle);
  }, [gaze, gazeX, gazeY, isThinking, eyesOpen, shouldReduceMotion]);

  // Thinking saccades
  useEffect(() => {
    if (!isThinking || shouldReduceMotion) {
      return;
    }
    let timeout: ReturnType<typeof setTimeout>;
    let mounted = true;
    let index = 0;
    const schedule = () => {
      timeout = setTimeout(
        () => {
          if (!mounted) {
            return;
          }
          const target = SACCADE_TARGETS[index % SACCADE_TARGETS.length];
          index += 1;
          gazeX.set(target.x * GAZE_RANGE);
          gazeY.set(target.y * GAZE_RANGE);
          schedule();
        },
        SACCADE_MIN_MS + Math.random() * SACCADE_EXTRA_MS
      );
    };
    schedule();
    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, [gazeX, gazeY, isThinking, shouldReduceMotion]);

  // Error wobble
  useEffect(() => {
    if (!isBroken) {
      return;
    }
    gazeX.set(0);
    gazeY.set(0);
    if (shouldReduceMotion) {
      return;
    }
    bodyControls.start(
      { rotate: [0, -10, 8, -6, 4, -2, 0], x: [0, -4, 3, -2, 1, 0] },
      { duration: 0.9, ease: [0.45, 0, 0.55, 1] }
    );
  }, [bodyControls, gazeX, gazeY, isBroken, shouldReduceMotion]);

  // Done confirmation micro-lift
  useEffect(() => {
    if (!isHappy || shouldReduceMotion) {
      return;
    }
    bodyControls.start(
      {
        scale: [1, 1.03, 0.985, 1],
        y: [0, -4, 1, 0],
      },
      { duration: 0.55, ease: EASE_OUT }
    );
  }, [bodyControls, isHappy, shouldReduceMotion]);

  // Listening voice amplitude
  useEffect(() => {
    if (shouldReduceMotion || !isListening) {
      return;
    }
    const unsubscribe = amplitudeValue.on("change", (level) => {
      bodyControls.set({ scale: 1 + level * 0.06, y: -level * 2 });
    });
    return unsubscribe;
  }, [amplitudeValue, bodyControls, isListening, shouldReduceMotion]);

  useEffect(() => {
    if (!(isListening || !mountedRef.current)) {
      bodyControls.set({ scale: 1, y: 0 });
    }
  }, [bodyControls, isListening]);

  const handleAcknowledge = () => {
    if (!interactive || shouldReduceMotion || !eyesOpen) return;
    blink(true);
    bodyControls.start(
      { scale: [1, 0.965, 1.015, 1] },
      { duration: 0.42, ease: EASE_OUT }
    );
  };

  const renderEye = (side: -1 | 1) => {
    const shape = side === -1 ? active.left : active.right;
    const controls = side === -1 ? leftLid : rightLid;

    const width = EYE_WIDTH * shape.w;
    const height = EYE_HEIGHT * shape.h;
    const x = CENTER + side * EYE_OFFSET - width / 2;
    const y = EYE_Y + (EYE_HEIGHT - height) / 2 + (shape.dy ?? 0);
    const cx = x + width / 2;
    const cy = y + height / 2;
    const showCatchlight = shape.h >= 0.4;

    return (
      <g key={side}>
        {/* Primary optical capsule */}
        <motion.rect
          animate={controls}
          fill={finalColors.feature}
          height={Math.max(height, 0.6)}
          initial={{ scaleY: 1 }}
          rx={Math.min(EYE_RADIUS * shape.w, Math.max(height, 0.6) / 2)}
          style={{
            rotate: shape.rotate ?? 0,
            transformOrigin: `${cx}px ${cy}px`,
            x: gazeX,
            y: gazeY,
          }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { bounce: 0.08, duration: 0.24, type: "spring" }
          }
          width={width}
          x={x}
          y={y}
        />
        {/* Optical lens specular catchlight with subtle parallax */}
        {showCatchlight && (
          <motion.circle
            animate={controls}
            cx={cx - width * 0.16}
            cy={cy - height * 0.22}
            fill="#ffffff"
            fillOpacity={0.82}
            initial={{ scaleY: 1 }}
            r={Math.min(1.65, width * 0.18)}
            style={{
              transformOrigin: `${cx}px ${cy}px`,
              x: catchlightX,
              y: catchlightY,
            }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { bounce: 0.08, duration: 0.24, type: "spring" }
            }
          />
        )}
      </g>
    );
  };

  const renderDizzyEye = (side: -1 | 1) => (
    <motion.path
      animate={shouldReduceMotion ? undefined : { rotate: 360 * side }}
      d={SPIRAL}
      fill="none"
      stroke={finalColors.feature}
      strokeLinecap="round"
      strokeWidth={3}
      style={{
        scale: 1.4,
        x: CENTER + side * EYE_OFFSET,
        y: EYE_Y + EYE_HEIGHT / 2,
      }}
      transition={{
        duration: 2.4,
        ease: "linear",
        repeat: Number.POSITIVE_INFINITY,
      }}
    />
  );

  // When showRing is true, keep sphere cleanly inset inside the precision bezel ring
  const sphereRatio = showRing ? 0.78 : 0.94;
  const bodySpan = (sphereRatio / ORB_SPHERE_FRACTION) * 100;
  const bodyInset = (100 - bodySpan) / 2;

  return (
    <div
      className={cn(
        "relative block select-none",
        interactive && "cursor-pointer",
        className
      )}
      onClick={handleAcknowledge}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        filter: `saturate(${stateMotion.saturation})`,
        height: resolvedSize,
        width: resolvedSize,
      }}
    >
      {/* Precision calibrated outer telemetry ring (Hero & Signature placements) */}
      {showRing && (
        <motion.svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full overflow-visible"
          style={
            shouldReduceMotion
              ? undefined
              : { x: ringShiftX, y: ringShiftY }
          }
          viewBox="0 0 100 100"
        >
          {/* Outer calibrated hairline circle */}
          <circle
            cx="50"
            cy="50"
            fill="none"
            r="48.5"
            stroke="var(--dividers)"
            strokeOpacity={isHovered ? 0.9 : 0.65}
            strokeWidth="0.45"
            style={{ transition: "stroke-opacity 240ms ease" }}
          />
          {/* Subtle inner housing ring */}
          <circle
            cx="50"
            cy="50"
            fill="none"
            r="43.5"
            stroke="var(--dividers)"
            strokeDasharray="1.4 2.4"
            strokeOpacity={0.5}
            strokeWidth="0.4"
          />
          {/* Active accent arc along top-right quadrant */}
          <motion.circle
            animate={{
              strokeOpacity: isHovered ? 0.85 : 0.45,
            }}
            cx="50"
            cy="50"
            fill="none"
            r="48.5"
            stroke="var(--pill-blue)"
            strokeDasharray="34 275"
            strokeDashoffset="-18"
            strokeLinecap="round"
            strokeWidth="0.95"
            transition={{ duration: 0.35, ease: EASE_OUT }}
          />
          {/* Four precision cardinal ticks */}
          <line x1="50" x2="50" y1="0.5" y2="3.2" stroke="var(--outlines)" strokeWidth="0.55" />
          <line x1="50" x2="50" y1="96.8" y2="99.5" stroke="var(--outlines)" strokeWidth="0.55" />
          <line x1="0.5" x2="3.2" y1="50" y2="50" stroke="var(--outlines)" strokeWidth="0.55" />
          <line x1="96.8" x2="99.5" y1="50" y2="50" stroke="var(--outlines)" strokeWidth="0.55" />
        </motion.svg>
      )}

      {/* Sphere Body + WebGL2 Marbled Glass Core */}
      <motion.div
        animate={bodyControls}
        className="absolute"
        style={{
          height: `${bodySpan}%`,
          left: `${bodyInset}%`,
          top: `${bodyInset}%`,
          width: `${bodySpan}%`,
        }}
      >
        {/* Painted understudy so the character stays crisp if WebGL is unavailable */}
        <div
          aria-hidden
          className="absolute rounded-full"
          style={{
            background: `radial-gradient(circle at 32% 26%, ${finalColors.bodyEdge} 0%, ${finalColors.body} 78%)`,
            inset: `${(1 - ORB_SPHERE_FRACTION) * 50}%`,
          }}
        />
        <Orb
          aberration={0.35}
          balance={0.54}
          blobScale={2.6}
          chroma={0.65}
          className="size-full"
          colors={[finalColors.body, finalColors.bodyEdge]}
          contrast={0.96}
          duration={9}
          flow={0.48 + energy * 0.32}
          glow={0}
          grain={0.35}
          inner={0.45}
          iridescence={0.14}
          lightX={-0.55}
          lightY={-0.95}
          refraction={0.28}
          rim={1.45}
          shading={0.08}
          size="100%"
          specular={0.34}
          turbulence={0.32 + energy * 0.28}
        />
      </motion.div>

      {/* Optical Glass Bezel, Fresnel Top-Edge Specular & Expressive Lenses */}
      <motion.svg
        animate={bodyControls}
        aria-hidden={ariaLabel ? undefined : true}
        aria-label={ariaLabel}
        className="absolute inset-0 block size-full overflow-visible"
        ref={svgRef}
        role={ariaLabel ? "img" : undefined}
        viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      >
        <title>{ariaLabel ?? "SandipAI autonomous sales agent"}</title>
        <defs>
          <linearGradient id={`bezel-${uid}`} x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#0071e3" stopOpacity="0.28" />
          </linearGradient>
          <linearGradient id={`sheen-${uid}`} x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.46" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Precision optical rim around sphere perimeter */}
        <circle
          cx={CENTER}
          cy={CENTER}
          fill="none"
          r={(sphereRatio * VIEWBOX) / 2}
          stroke={`url(#bezel-${uid})`}
          strokeWidth={showRing ? 0.9 : 1.1}
        />

        {/* Subtle upper curved specular reflection (hardware glass feel) */}
        <ellipse
          cx={CENTER - 6}
          cy={CENTER - sphereRatio * 26}
          fill={`url(#sheen-${uid})`}
          rx={sphereRatio * 22}
          ry={sphereRatio * 9}
          transform={`rotate(-14 ${CENTER - 6} ${CENTER - sphereRatio * 26})`}
        />

        {/* Eyes scaled harmoniously to the sphere */}
        <g
          transform={
            showRing
              ? `translate(${CENTER}, ${CENTER}) scale(0.84) translate(${-CENTER}, ${-CENTER})`
              : undefined
          }
        >
          {isBroken ? null : renderEye(-1)}
          {isBroken ? null : renderEye(1)}
          {isBroken && renderDizzyEye(-1)}
          {isBroken && renderDizzyEye(1)}
        </g>
      </motion.svg>
    </div>
  );
};

export default AIOrbFace;
