"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { pendingMorph } from "@/components/Morph";


/**
 * Everything on an exhibit page below the banner, held back until the frame has
 * finished flying into place.
 *
 * The morph is the arrival; the copy is what is read afterwards. Landing both at
 * once puts a page of text under a frame that is still moving, and the two
 * compete. The delay is the frame's own duration, so the reveal starts as the
 * frame settles rather than overlapping it.
 *
 * Only for a visitor who came from the hall. A direct load or a jump from the
 * header has no frame in flight, so there is nothing to wait for and the page
 * renders at once — PageTransition covers that case with its own fade.
 */
export default function MorphReveal({
  slug,
  className = "",
  children,
}: {
  /** The room this page is. Matched against the morph in flight, if any. */
  slug: string;
  className?: string;
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  // Latched at first render rather than read live. The flag is consumed once the
  // route has mounted — see PageTransition — which is well before this animation
  // has finished, and reading it live would cut the reveal short.
  const [arrived] = useState(() => pendingMorph() === slug);
  const animated = arrived && !reduceMotion;

  return (
    <motion.div
      className={className}
      // `false` renders straight at the animate values: visible immediately,
      // and identical markup on both sides of hydration.
      initial={animated ? { opacity: 0, y: 16 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: animated ? 0.4 : 0,
        delay: animated ? 0.45 : 0,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
