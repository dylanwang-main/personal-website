"use client";

import { motion } from "framer-motion";

/**
 * The way in, drawn as a door casing rather than a button: two posts, a lintel
 * that runs a little past them the way an architrave does, and a sill line on
 * the floor. The bottom stays open — it is a doorway, not a box.
 *
 * The casing lines are ink at 55%, which clears 3:1 against the wall in both
 * themes (WCAG 1.4.11). The label is full ink: this is the primary action, so
 * nothing in the hero, the header included, should outrank it.
 */
export default function Doorway({
  label,
  accessibleLabel,
  onEnter,
  leaving,
}: {
  /** Visible word inside the door. */
  label: string;
  /** Accessible name. Must contain `label`, so voice control matches it. */
  accessibleLabel: string;
  onEnter: () => void;
  /** True once the ink dissolve has started; the door steps back out of it. */
  leaving: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onEnter}
      disabled={leaving}
      aria-label={accessibleLabel}
      data-cursor="enter"
      className="group relative px-12 pt-9 pb-5 font-display text-base tracking-[0.18em] text-ink uppercase"
      animate={leaving ? { opacity: 0, y: 8 } : { opacity: 1, y: 0 }}
      transition={leaving ? { duration: 0.2, ease: "easeIn" } : { duration: 0.2 }}
    >
      {/* Lintel: overhangs the posts, with a second, fainter line under it for
          the step in the moulding. */}
      <span
        aria-hidden
        className="absolute -inset-x-2 top-0 h-px bg-ink/55 transition-colors duration-300 group-hover:bg-ink"
      />
      <span
        aria-hidden
        className="absolute inset-x-0 top-[5px] h-px bg-ink/25 transition-colors duration-300 group-hover:bg-ink/55"
      />

      {/* Posts */}
      <span
        aria-hidden
        className="absolute top-0 bottom-0 left-0 w-px bg-ink/55 transition-colors duration-300 group-hover:bg-ink"
      />
      <span
        aria-hidden
        className="absolute top-0 right-0 bottom-0 w-px bg-ink/55 transition-colors duration-300 group-hover:bg-ink"
      />

      {/* Sill: the floor line the door stands on, fading out at both ends. */}
      <span
        aria-hidden
        className="absolute -inset-x-8 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, color-mix(in srgb, var(--ink) 40%, transparent) 25%, color-mix(in srgb, var(--ink) 40%, transparent) 75%, transparent)",
        }}
      />

      {/* Light from inside the room: a faint wash that rises on hover, so the
          door reads as opening onto somewhere lit. */}
      <span
        aria-hidden
        className="absolute inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(to top, color-mix(in srgb, var(--ink) 9%, transparent), transparent 85%)",
        }}
      />

      <span className="relative">{label}</span>
    </motion.button>
  );
}
