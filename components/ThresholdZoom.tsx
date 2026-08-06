"use client";

import { motion } from "framer-motion";
import { EASE_PUSH, THRESHOLD_DURATION } from "@/lib/motion";

/** A measured on-screen box, in viewport pixels. */
export type Rect = { top: number; left: number; width: number; height: number };

const NOWHERE: Rect = { top: 0, left: 0, width: 0, height: 0 };

/**
 * Walking through the entrance door.
 *
 * The one transition on the site that is staged rather than wiped. Four layers,
 * all timed off the same duration so they read as one move:
 *
 *   1. the doorway itself, growing from its measured rect to fill the viewport;
 *   2. warm light spilling out of it, blooming as we cross the threshold and
 *      dying as we pass through;
 *   3. a vignette that closes in at the edges, so the growth reads as depth
 *      rather than as a rectangle getting bigger;
 *   4. an arrival wash in the site's own wall colour, which the last third
 *      settles onto — the next route mounts on that same colour, so the
 *      navigation lands inside the move instead of cutting against it.
 *
 * Deliberately always mounted and `initial={false}`: it holds the state it is
 * given and only moves when `active` flips, so nothing animates on mount and
 * Strict Mode — which remounts every newly mounted component in development, and
 * so replays mount-time animations — has nothing to replay.
 */
export default function ThresholdZoom({
  from,
  active,
}: {
  /** The doorway. Measured at click time by the caller. */
  from: Rect | null;
  active: boolean;
}) {
  const rect = from ?? NOWHERE;

  return (
    <>
      {/* The doorway, opening up into the room beyond */}
      <motion.div
        className="pointer-events-none fixed z-50 overflow-hidden"
        style={{ background: "linear-gradient(180deg, #100e0a, #05040a)" }}
        initial={false}
        animate={active ? "through" : "hidden"}
        variants={{
          hidden: {
            ...rect,
            opacity: 0,
            borderRadius: 6,
            transition: { duration: 0 },
          },
          through: {
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            opacity: 1,
            borderRadius: 0,
            transition: {
              duration: THRESHOLD_DURATION,
              ease: EASE_PUSH,
              // Fades up over the first beat only; the rest of the move is the
              // push itself, at full opacity.
              opacity: { duration: THRESHOLD_DURATION * 0.18 },
            },
          },
        }}
      >
        {/* Light from inside the room, blooming as we reach the threshold */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 45%, rgba(230,196,110,0.55), rgba(212,175,55,0.14) 55%, transparent 75%)",
          }}
          initial={false}
          animate={
            active
              ? { opacity: [0, 0.7, 1, 0.35], scale: [0.55, 1.1, 2.2, 3.4] }
              : { opacity: 0, scale: 0.55 }
          }
          transition={
            active
              ? {
                  duration: THRESHOLD_DURATION,
                  times: [0, 0.35, 0.7, 1],
                  ease: "easeInOut",
                }
              : { duration: 0 }
          }
        />

        {/* Edges closing in — the depth cue that keeps this from reading flat */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 70% at 50% 50%, transparent 35%, rgba(0,0,0,0.75) 100%)",
          }}
          initial={false}
          animate={{ opacity: active ? [0, 0.5, 0.95] : 0 }}
          transition={
            active
              ? {
                  duration: THRESHOLD_DURATION,
                  times: [0, 0.5, 1],
                  ease: "easeIn",
                }
              : { duration: 0 }
          }
        />
      </motion.div>

      {/* Arrival: the last third settles onto the colour the museum mounts on */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-50 bg-wall"
        initial={false}
        animate={{ opacity: active ? [0, 0, 1] : 0 }}
        transition={
          active
            ? {
                duration: THRESHOLD_DURATION,
                times: [0, 0.68, 1],
                ease: "easeIn",
              }
            : { duration: 0 }
        }
      />
    </>
  );
}
