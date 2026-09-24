"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_MORPH, MORPH_DURATION } from "@/lib/motion";

const scales = {
  wall: { padding: "p-2.5" },
  slot: { padding: "p-1.5" },
} as const;

export default function Frame({
  tone,
  scale = "wall",
  layoutId,
  name,
  className = "",
  children,
}: {
  tone: "gold" | "neutral";
  scale?: keyof typeof scales;
  layoutId?: string;
  name?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const isGold = tone === "gold";
  const cut = scales[scale];

  const flying = layoutId !== undefined;
  const layout = flying || undefined;
  const transition = {
    duration: reduceMotion ? 0 : MORPH_DURATION,
    ease: EASE_MORPH,
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <motion.div
        layoutId={layoutId}
        layout={layout}
        transition={transition}
        data-morph={layoutId}
        className={`relative w-full ${className}`}
        style={{
          boxShadow: isGold
            ? "0 12px 24px -8px rgba(0,0,0,0.6), 0 0 0 1px var(--gold-deep)"
            : "0 10px 20px -8px rgba(0,0,0,0.5), 0 0 0 1px var(--frame)",
        }}
      >
        {/* Frame — solid warm tone, no gradient */}
        <motion.div
          layout={layout}
          transition={transition}
          className={`relative w-full ${cut.padding}`}
          style={{
            background: isGold
              ? "var(--gold-deep)"
              : "var(--frame)",
          }}
        >
          {/* Fillet — thin bright line at the picture edge */}
          <motion.div
            layout={layout}
            transition={transition}
            className="relative w-full p-px"
            style={{
              background: isGold
                ? "var(--gold)"
                : "rgba(255,255,255,0.12)",
            }}
          >
            {children}
          </motion.div>
        </motion.div>
      </motion.div>

      {name && <span className="text-center font-medium text-ink">{name}</span>}
    </div>
  );
}
