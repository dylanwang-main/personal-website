"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { TAGLINE_FADE, TAGLINE_HOLD } from "@/lib/motion";

/**
 * The phrase cycling under the name.
 *
 * Every phrase stays mounted and stacked, and only opacity and offset animate.
 * Swapping the mounted phrase instead would remount a node on a timer forever,
 * and would need the container to hold its own height to avoid the line jumping
 * on each change — this way the tallest phrase sets the height once.
 *
 * The outgoing phrase leaves upward and the incoming one arrives from below, so
 * the cycle reads as one direction of travel rather than a crossfade in place.
 */
export default function KineticTagline({ phrases }: { phrases: string[] }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // One phrase has nothing to cycle to, and reduced motion holds on the first.
    if (reduceMotion || phrases.length < 2) return;

    const timer = setInterval(
      () => setIndex((i) => (i + 1) % phrases.length),
      (TAGLINE_HOLD + TAGLINE_FADE) * 1000,
    );
    return () => clearInterval(timer);
  }, [reduceMotion, phrases.length]);

  return (
    // Grid stacking: every phrase occupies the same cell, so the block is as
    // tall as the tallest phrase and never resizes mid-cycle.
    <span className="grid text-sm tracking-[0.18em] text-muted uppercase">
      {phrases.map((phrase, i) => {
        const current = i === index;

        return (
          <motion.span
            key={phrase}
            className="col-start-1 row-start-1 text-center"
            // Inactive phrases are hidden from assistive tech and from hit
            // testing; only the visible one is ever announced.
            aria-hidden={!current}
            initial={false}
            animate={{
              opacity: current ? 1 : 0,
              y: current ? 0 : i < index ? -6 : 6,
            }}
            transition={{ duration: TAGLINE_FADE, ease: "easeInOut" }}
          >
            {phrase}
          </motion.span>
        );
      })}
    </span>
  );
}
