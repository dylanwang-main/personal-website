"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Whether decorative, self-starting motion should run: false until after mount,
 * and false forever if the visitor prefers reduced motion.
 *
 * The mount gate is the important half. The motion preference is a media query,
 * so the server cannot read it and always renders as though motion were allowed
 * — baking the animation's own values into the HTML. React does not patch up
 * style attributes across a hydration mismatch, so a client that then wanted the
 * static version was stuck with whatever the server had committed: gradients
 * frozen mid-drift, a halo at the wrong opacity. Rendering the static version on
 * both sides of hydration and only then starting motion means the two never
 * disagree.
 *
 * For motion that responds to a gesture rather than starting on its own, read
 * `useReducedMotion` directly — a click handler runs long after hydration.
 */
export function useMotionEnabled() {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return mounted && !reduceMotion;
}
