"use client";

import { motion } from "framer-motion";

const pleats =
  "repeating-linear-gradient(100deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 6px, transparent 6px, transparent 14px, rgba(255,255,255,0.05) 14px, rgba(255,255,255,0.05) 18px)";

export default function CurtainPanels({
  open,
  onTransitionComplete,
}: {
  open: boolean;
  onTransitionComplete?: () => void;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute top-0 left-0 h-full w-1/2 border-r-2"
        style={{
          background: `${pleats}, linear-gradient(90deg, #17150f, #262019)`,
          borderColor: "var(--gold-deep)",
          boxShadow: "inset -12px 0 24px rgba(0,0,0,0.45)",
        }}
        initial={false}
        animate={{ x: open ? "-100%" : "0%" }}
        transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
        onAnimationComplete={onTransitionComplete}
      />
      <motion.div
        className="absolute top-0 right-0 h-full w-1/2 border-l-2"
        style={{
          background: `${pleats}, linear-gradient(90deg, #262019, #17150f)`,
          borderColor: "var(--gold-deep)",
          boxShadow: "inset 12px 0 24px rgba(0,0,0,0.45)",
        }}
        initial={false}
        animate={{ x: open ? "100%" : "0%" }}
        transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
      />
    </div>
  );
}
