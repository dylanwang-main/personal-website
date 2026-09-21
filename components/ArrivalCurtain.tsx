"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ARRIVAL_HOLD,
  ARRIVAL_LIFT,
  ARRIVAL_NAME,
  EASE_WIPE,
} from "@/lib/motion";
import { entrance } from "@/content/content";

/**
 * How far into the arrival the site is. Owned here rather than by the entrance
 * page: this has to render outside the route transition (see below), so it
 * cannot read a phase the page holds.
 */
type Arrival = "veiled" | "revealing" | "done";

/** Set once the veil has played, so it does not replay on the way back in. */
const ARRIVED_KEY = "arrived";

/**
 * The veil the site opens on: near-black, the name alone, then it lifts.
 *
 * Rendered from the root layout as a sibling of PageTransition, not from the
 * entrance page. PageTransition animates opacity and transform, which makes it a
 * stacking context and a containing block — a `position: fixed` overlay rendered
 * inside it resolves against that element instead of the viewport, so the veil
 * would sit below the fixed header and centre itself on the full page height
 * rather than on the screen.
 *
 * Plays once per session and never under reduced motion, so most loads render
 * nothing at all here.
 */
export default function ArrivalCurtain() {
  const reduceMotion = useReducedMotion();
  const [arrival, setArrival] = useState<Arrival>("veiled");

  // Both inputs are client-only — sessionStorage does not exist during the
  // server render, and the motion preference is a media query — so the veiled
  // markup is what gets sent and this corrects it. A layout effect rather than
  // an effect because it runs before paint: a skipped arrival must not flash the
  // veil first.
  useLayoutEffect(() => {
    if (reduceMotion || sessionStorage.getItem(ARRIVED_KEY)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setArrival("done");
    }
  }, [reduceMotion]);

  // Two beats, each advancing on the previous one's duration — the same shape as
  // the door's chain, and for the same reason: one owner, one timer at a time.
  useEffect(() => {
    if (arrival === "veiled") {
      const timer = setTimeout(
        () => setArrival((a) => (a === "veiled" ? "revealing" : a)),
        (ARRIVAL_NAME + ARRIVAL_HOLD) * 1000,
      );
      return () => clearTimeout(timer);
    }

    if (arrival === "revealing") {
      const timer = setTimeout(() => {
        setArrival((a) => (a === "revealing" ? "done" : a));
        sessionStorage.setItem(ARRIVED_KEY, "1");
      }, ARRIVAL_LIFT * 1000);
      return () => clearTimeout(timer);
    }
  }, [arrival]);

  if (arrival === "done") return null;

  const lifting = arrival === "revealing";

  return (
    <motion.div
      // Above the fixed header, which would otherwise sit on top of the veil.
      className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center"
      style={{ background: "var(--wall)" }}
      initial={{ opacity: 1 }}
      animate={{ opacity: lifting ? 0 : 1 }}
      transition={{ duration: ARRIVAL_LIFT, ease: EASE_WIPE }}
    >
      {/* Rises very slightly as it lifts, so the veil reads as being drawn off
          the scene rather than as the name simply dimming. */}
      <motion.span
        className="px-6 text-center font-display tracking-tight text-ink"
        style={{ fontSize: "clamp(2.25rem, 7vw, 5rem)" }}
        initial={{ opacity: 0, y: 10 }}
        animate={lifting ? { opacity: 0, y: -8 } : { opacity: 1, y: 0 }}
        transition={{
          duration: lifting ? ARRIVAL_LIFT * 0.7 : ARRIVAL_NAME,
          ease: "easeOut",
        }}
      >
        {entrance.name}
      </motion.span>
    </motion.div>
  );
}
