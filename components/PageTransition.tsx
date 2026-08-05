"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * The single owner of route-level motion. Pages must not add their own mount
 * animation on top — two entry animations per navigation read as the transition
 * playing twice.
 *
 * Entry only, and deliberately no AnimatePresence. An exit animation here would
 * have to hold the outgoing route on screen, and AnimatePresence does that by
 * withholding the incoming child: React mounts the new page, AnimatePresence
 * discards it to play the exit, then builds it again from scratch when the exit
 * finishes. Every navigation mounted its destination twice — two page-loads
 * worth of mount work, and the new page's own motion started over on the second
 * mount. `mode="popLayout"` mounts both copies at once instead; neither mode
 * mounts once.
 *
 * Nothing is lost by dropping the exit. Every route change is already covered by
 * a purpose-built overlay that owns the "leaving" beat — ThresholdZoom on the
 * way in, ZoomVoid into an exhibit, CurtainPanels on the way out — so the fade
 * was a second, redundant transition layered under them.
 */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className="flex flex-1 flex-col">{children}</div>;
  }

  return (
    <motion.div
      key={pathname}
      className="flex flex-1 flex-col"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
