"use client";

import { useEffect } from "react";
import { useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/**
 * Pointer position as two springs in the range -1..1, centre of the viewport
 * being 0. Consumers multiply by however many pixels of travel they want, so a
 * single listener drives every parallax layer and the layers stay in step.
 *
 * Returns zeros and attaches nothing when the visitor prefers reduced motion or
 * is on a coarse pointer — on touch there is no hover position to read, and a
 * layer that only moves on tap reads as a glitch rather than as depth.
 */
export function useCursorParallax() {
  const reduceMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Loose spring: the layers should lag the cursor noticeably. Tracking it
  // exactly would read as the page being dragged around.
  const spring = { stiffness: 60, damping: 20, mass: 0.6 };
  const nx = useSpring(x, spring);
  const ny = useSpring(y, spring);

  useEffect(() => {
    if (reduceMotion) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    function onMove(event: PointerEvent) {
      x.set((event.clientX / window.innerWidth) * 2 - 1);
      y.set((event.clientY / window.innerHeight) * 2 - 1);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduceMotion, x, y]);

  return { nx, ny };
}
