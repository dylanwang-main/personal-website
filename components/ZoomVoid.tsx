"use client";

import { motion } from "framer-motion";
import { EASE_WIPE, ZOOM_DURATION } from "@/lib/motion";

export type Rect = { top: number; left: number; width: number; height: number };

const NOWHERE: Rect = { top: 0, left: 0, width: 0, height: 0 };

/**
 * A rectangle that grows from somewhere on screen to fill the viewport — the
 * quick, plain zoom into a painting. The entrance door gets its own, longer
 * staged version (ThresholdZoom); this one is clicked over and over, so it stays
 * short and unadorned.
 *
 * Callers must give the rect a committed frame before flipping `active` — see
 * the `arming` phase in the hall.
 *
 * Deliberately always mounted and `initial={false}`: it holds whatever position
 * its state describes and only moves when `active` flips. Mounting it
 * conditionally would make it animate on mount, and React Strict Mode remounts
 * every newly mounted component in development, which replays mount-time
 * animations. Nothing here animates on mount, so there is nothing to replay.
 */
export default function ZoomVoid({
  from,
  active,
  background,
}: {
  /** Where the zoom starts. Measured at interaction time by the caller. */
  from: Rect | null;
  active: boolean;
  background: string;
}) {
  const rect = from ?? NOWHERE;

  return (
    <motion.div
      className="pointer-events-none fixed z-50"
      style={{ background }}
      initial={false}
      animate={active ? "full" : "hidden"}
      variants={{
        // Snaps, never animates: it is invisible in this state, and animating it
        // would leave the rect mid-flight when `active` turns on.
        hidden: {
          ...rect,
          opacity: 0,
          borderRadius: 4,
          transition: { duration: 0 },
        },
        full: {
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: 1,
          borderRadius: 0,
          transition: {
            duration: ZOOM_DURATION,
            ease: EASE_WIPE,
            // Covers the frame it grew out of almost immediately, so the hidden
            // painting underneath never shows as a gap in the wall.
            opacity: { duration: 0.1 },
          },
        },
      }}
    />
  );
}
