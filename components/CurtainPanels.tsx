"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const pleats =
  "repeating-linear-gradient(100deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 6px, transparent 6px, transparent 14px, rgba(255,255,255,0.05) 14px, rgba(255,255,255,0.05) 18px)";

/** Seconds. Callers sequence navigation off this, so it is the single source. */
export const CURTAIN_DURATION = 0.9;

function x(open: boolean, side: "left" | "right") {
  if (!open) return "0%";
  return side === "left" ? "-100%" : "100%";
}

/**
 * Purely visual. Sequencing lives with the caller, which drives navigation off
 * CURTAIN_DURATION — framer's onAnimationComplete does not fire reliably for
 * these mount-time animations, so it is deliberately not used here.
 */
export default function CurtainPanels({
  open,
  initialOpen,
}: {
  /** true = parted to the edges, false = met in the middle */
  open: boolean;
  /** Position on mount. Defaults to `open`, i.e. no entry animation. */
  initialOpen?: boolean;
}) {
  // Captured once at mount so the panels can animate in from a position
  // different to their target without a flash of the target state.
  const [mountedOpen] = useState(initialOpen ?? open);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute top-0 left-0 h-full w-1/2 border-r-2"
        style={{
          background: `${pleats}, linear-gradient(90deg, #17150f, #262019)`,
          borderColor: "var(--gold-deep)",
          boxShadow: "inset -12px 0 24px rgba(0,0,0,0.45)",
        }}
        initial={{ x: x(mountedOpen, "left") }}
        animate={{ x: x(open, "left") }}
        transition={{ duration: CURTAIN_DURATION, ease: [0.65, 0, 0.35, 1] }}
      />
      <motion.div
        className="absolute top-0 right-0 h-full w-1/2 border-l-2"
        style={{
          background: `${pleats}, linear-gradient(90deg, #262019, #17150f)`,
          borderColor: "var(--gold-deep)",
          boxShadow: "inset 12px 0 24px rgba(0,0,0,0.45)",
        }}
        initial={{ x: x(mountedOpen, "right") }}
        animate={{ x: x(open, "right") }}
        transition={{ duration: CURTAIN_DURATION, ease: [0.65, 0, 0.35, 1] }}
      />
    </div>
  );
}
