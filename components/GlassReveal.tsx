"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

/**
 * A pane of display-case glass over its children that clears as they scroll
 * into view.
 *
 * Purely visual: the glass never takes pointer events and is hidden from
 * assistive tech, so the content underneath is always selectable, clickable and
 * read aloud. It is fully gone by the time the top of the content reaches the
 * middle of the viewport — the reveal is a moment on the way in, never a state
 * the visitor can get stuck reading through.
 *
 * As it clears, a narrow band of light crosses it diagonally, the way a glass
 * pane catches the room's light as it is lifted away.
 *
 * Reduced motion: no glass at all, not a static half-clear pane.
 */
const FEATHER = [
  "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
  "linear-gradient(to bottom, transparent, black 14%, black 86%, transparent)",
].join(", ");

export default function GlassReveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // 0 when the top of the content touches the bottom of the viewport, 1 when it
  // reaches 45% of the way down.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.45"],
  });

  const glass = useTransform(scrollYProgress, [0, 1], [0.6, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.85], [5, 0]);
  const backdropFilter = useTransform(blur, (b) => `blur(${b}px)`);
  // Positioned by `left` rather than a transform, so its travel is measured in
  // the pane's width rather than its own.
  const sheenLeft = useTransform(scrollYProgress, [0.1, 0.9], ["-40%", "105%"]);
  const sheenOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.35, 0.75, 0.9],
    [0, 1, 1, 0],
  );

  return (
    <div ref={ref} className={`relative ${className}`}>
      {children}

      {!reduceMotion && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{
            // Feathered on all four sides, so the pane has no edge of its own
            // to cut a line across the wall behind it.
            maskImage: FEATHER,
            WebkitMaskImage: FEATHER,
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
        >
          {/* The pane: wall-tinted and frosted, thinning out as it lifts. */}
          <motion.div
            className="absolute inset-0 bg-wall"
            style={{
              opacity: glass,
              backdropFilter,
              WebkitBackdropFilter: backdropFilter,
            }}
          />
          {/* The light catching it. A sibling of the pane rather than a child,
              so it is not dimmed along with it. */}
          <motion.div
            className="absolute inset-y-[-20%] w-[35%]"
            style={{
              left: sheenLeft,
              opacity: sheenOpacity,
              rotate: 18,
              background:
                "linear-gradient(90deg, transparent, color-mix(in srgb, var(--ink) 10%, transparent) 50%, transparent)",
            }}
          />
        </div>
      )}
    </div>
  );
}
