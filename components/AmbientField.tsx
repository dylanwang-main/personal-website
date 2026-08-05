"use client";

import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { AMBIENT_DRIFT } from "@/lib/motion";

/**
 * The entrance's atmosphere layer: two wide, low-contrast pools of warm light
 * that drift against each other, plus a vignette that scales imperceptibly.
 *
 * Everything here is behind the content and non-interactive. The contrast is
 * kept low enough that it never competes with the name in front of it — this is
 * meant to be noticed only if the visitor stops and looks for it.
 *
 * Absolutely positioned rather than fixed, and so it needs a positioned parent
 * to fill. Fixed would be resolved against PageTransition's animated transform
 * rather than against the viewport; absolute also keeps the atmosphere scoped to
 * the entrance instead of bleeding onto every route.
 *
 * Reduced motion keeps the gradients and drops all movement: the atmosphere is
 * in the light itself, so a still version is the same picture, just held.
 */
export default function AmbientField({
  /** Pointer position, -1..1. The field drifts against the door, less than it. */
  nx,
  ny,
}: {
  nx: MotionValue<number>;
  ny: MotionValue<number>;
}) {
  const reduceMotion = useReducedMotion();

  // Small travel, and opposite in sign to the door's, so the two separate in
  // depth rather than sliding together.
  const x = useTransform(nx, (v) => v * -5);
  const y = useTransform(ny, (v) => v * -5);

  const drift = {
    duration: AMBIENT_DRIFT,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: "easeInOut" as const,
  };

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <motion.div className="absolute inset-0" style={{ x, y }}>
        {/* Oversized so the drift never pulls an edge into view. */}
        <motion.div
          className="absolute -inset-[15%]"
          style={{
            background:
              "radial-gradient(45% 40% at 30% 35%, rgba(212,175,55,0.10), transparent 70%)",
          }}
          initial={false}
          animate={
            reduceMotion ? undefined : { x: ["-3%", "4%"], y: ["2%", "-3%"] }
          }
          transition={drift}
        />
        <motion.div
          className="absolute -inset-[15%]"
          style={{
            background:
              "radial-gradient(50% 45% at 70% 65%, rgba(140,150,190,0.08), transparent 70%)",
          }}
          initial={false}
          animate={
            reduceMotion ? undefined : { x: ["3%", "-4%"], y: ["-2%", "3%"] }
          }
          transition={{ ...drift, duration: AMBIENT_DRIFT * 1.3 }}
        />
      </motion.div>

      {/* Vignette. The slow scale is what keeps the frame from reading as a
          static image; at this duration it is never seen moving. */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 45%, transparent 40%, rgba(0,0,0,0.28))",
        }}
        initial={false}
        animate={reduceMotion ? undefined : { scale: [1, 1.06] }}
        transition={{ ...drift, duration: AMBIENT_DRIFT * 1.6 }}
      />
    </div>
  );
}
