"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { usePushIn } from "@/components/PushIn";

/**
 * False until the first render of a page load has been committed.
 *
 * The entry animation must not apply to that first render. `initial` is rendered
 * server-side, so animating in from `opacity: 0` would ship HTML that is
 * invisible until framer runs — and the visitor has not navigated anywhere yet,
 * so there is nothing to animate in from. Module scope rather than state because
 * flipping it must not itself cause a render: it is read on the next navigation,
 * which re-renders anyway.
 */
let navigable = false;

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
 * something that owns the "leaving" beat — ThresholdZoom on the way in, the
 * push-in view transition into an exhibit, CurtainPanels on the way out — so the
 * fade was a second, redundant transition layered under them.
 *
 * It also stands down for the one route change that is not covered by an
 * overlay: walking into a painting, which is a view transition. That one already
 * owns both sides of the cut, and the fade here would fight it twice over — the
 * incoming page is captured for the transition on the frame it mounts, so an
 * `initial` of `opacity: 0` would be baked into the snapshot the visitor watches
 * arrive, and the fade would then replay on the live DOM afterwards.
 *
 * One tree, always. Returning a plain div for reduced motion instead would mean
 * the server — which cannot read a media query — rendered the animated branch
 * and the client rendered the other. React does not patch up style attributes
 * across a mismatch like that, so the wrapper stayed at the server's
 * `opacity: 0` and the whole site rendered blank for exactly the visitors who
 * asked for less motion. The preference changes the timing here, never the
 * markup.
 */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const pushIn = usePushIn();

  useEffect(() => {
    navigable = true;
  }, []);

  const animated = navigable && !reduceMotion && pushIn.slug === null;

  return (
    <motion.div
      key={pathname}
      className="flex flex-1 flex-col"
      // `false` renders straight at the animate values — visible, no transition
      // to sit through, and identical markup on both sides of hydration.
      initial={animated ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: animated ? 0.35 : 0, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
