"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * A single breathing gold glow behind the exit screen content — the bookend
 * to the door's halo at the entrance. Pulses once and settles to a quiet
 * hold, so the closing moment has ceremony without becoming a loop.
 */
export default function ExitGlow() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "radial-gradient(50% 40% at 50% 45%, rgba(212,175,55,0.12), transparent 70%)",
      }}
      initial={reduceMotion ? { opacity: 0.3 } : { opacity: 0, scale: 0.9 }}
      animate={
        reduceMotion
          ? { opacity: 0.3 }
          : { opacity: [0, 0.5, 0.3], scale: [0.9, 1.05, 1] }
      }
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 1.2, times: [0, 0.4, 1], ease: "easeOut" }
      }
    />
  );
}
