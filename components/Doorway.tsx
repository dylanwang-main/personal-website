"use client";

import { motion } from "framer-motion";
import { EntrancePaifang, plaqueStyle } from "@/components/Paifang";

/**
 * The way in: a paifang, the ceremonial gateway, with the word on its name
 * plaque. The rooms further down have small gates of the same architecture;
 * this one outranks them by its second roof, its plaque and its size, not by
 * ornament.
 *
 * The label is full ink: this is the primary action, so nothing in the hero,
 * the header included, should outrank it. No `data-cursor` label — the gate
 * already says what it does, and a second "Enter" from the cursor sat on top of
 * the first.
 */
export default function Doorway({
  label,
  accessibleLabel,
  onEnter,
  leaving,
}: {
  /** Visible word on the plaque. */
  label: string;
  /** Accessible name. Must contain `label`, so voice control matches it. */
  accessibleLabel: string;
  onEnter: () => void;
  /** True once the ink dissolve has started; the gate steps back out of it. */
  leaving: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onEnter}
      disabled={leaving}
      aria-label={accessibleLabel}
      className="group relative aspect-[200/166] focus-visible:outline-none"
      style={{ width: "clamp(11rem, 14vw, 12.5rem)" }}
      animate={leaving ? { opacity: 0, y: 8 } : { opacity: 1, y: 0 }}
      transition={leaving ? { duration: 0.2, ease: "easeIn" } : { duration: 0.2 }}
    >
      <EntrancePaifang />
      <span
        className="absolute flex items-center justify-center font-display text-sm tracking-[0.16em] text-ink uppercase"
        style={plaqueStyle}
      >
        {label}
      </span>
    </motion.button>
  );
}
