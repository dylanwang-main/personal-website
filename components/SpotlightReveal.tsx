"use client";

import { createContext, useContext, useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

/**
 * How the portrait's wall is revealed as it scrolls into view. One moment, two
 * materials, picked by theme:
 *
 * - Dark (the default vault): the wall starts in shadow and a gallery lamp comes
 *   up on the portrait. The shadow lifts off the whole section; the light itself
 *   is <Spotlight />, placed by the caller where the lamp hangs.
 * - Light: a pane of frosted display-case glass that clears, catching a band of
 *   light as it goes. Glass only reads against a light wall, so it lives here.
 *
 * Progress runs from the section's top entering the viewport to its centre
 * reaching just above the middle of the screen, so the reveal happens while the
 * visitor is looking at the portrait, not before it arrives.
 *
 * Every layer is server-rendered and hidden with CSS, never mounted or unmounted
 * from JS: the theme is a class on <html> and reduced motion is a media query,
 * so the markup is identical on server and client. Under reduced motion there is
 * no shadow and no glass, and the lamp is simply on.
 *
 * All layers are aria-hidden and take no pointer events, so the content under
 * them is always selectable, clickable and read aloud.
 */

const Progress = createContext<MotionValue<number> | null>(null);

const FEATHER = [
  "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
  "linear-gradient(to bottom, transparent, black 14%, black 86%, transparent)",
].join(", ");

const feathered = {
  maskImage: FEATHER,
  WebkitMaskImage: FEATHER,
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
} as const;

export default function SpotlightReveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "center 0.55"],
  });

  // Dark: shadow over the wall.
  const shadow = useTransform(scrollYProgress, [0, 1], [0.55, 0]);

  // Light: the glass pane, its frost, and the light catching it.
  const glass = useTransform(scrollYProgress, [0, 1], [0.6, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.85], [5, 0]);
  const backdropFilter = useTransform(blur, (b) => `blur(${b}px)`);
  const edge = useTransform(scrollYProgress, [0, 0.8, 1], [0.7, 0.4, 0]);
  // Positioned by `left` rather than a transform, so its travel is measured in
  // the pane's width rather than its own.
  const sheenLeft = useTransform(scrollYProgress, [0.1, 0.9], ["-30%", "100%"]);
  const sheenOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.3, 0.75, 0.9],
    [0, 1, 1, 0],
  );

  return (
    <Progress.Provider value={scrollYProgress}>
      <div ref={ref} className={`relative ${className}`}>
        {children}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden"
        >
          {/* Dark: the shadow the lamp lifts. */}
          <motion.div
            className="absolute inset-0 bg-wall light:hidden"
            style={{ opacity: shadow, ...feathered }}
          />

          {/* Light: the glass. */}
          <div className="absolute inset-0 hidden light:block" style={feathered}>
            <motion.div
              className="absolute inset-0 bg-wall"
              style={{
                opacity: glass,
                backdropFilter,
                WebkitBackdropFilter: backdropFilter,
              }}
            />
            {/* The pane's top edge, so it reads as a surface, not a fog. */}
            <motion.div
              className="absolute inset-x-[10%] top-[14%] h-px bg-white"
              style={{ opacity: edge }}
            />
            <motion.div
              className="absolute inset-y-[-20%] w-[18%]"
              style={{
                left: sheenLeft,
                opacity: sheenOpacity,
                rotate: 18,
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.55) 50%, transparent)",
              }}
            />
          </div>
        </div>
      </div>
    </Progress.Provider>
  );
}

/**
 * The gallery lamp over the portrait, for dark mode. Place it inside a
 * `relative isolate` wrapper around the framed work, before the frame: it pools
 * warm light on the wall above and behind the frame, and lays a highlight along
 * the frame's top edge.
 *
 * Hidden in light mode, and fully on under reduced motion.
 */
export function Spotlight() {
  const fallback = useMotionValue(1);
  const progress = useContext(Progress) ?? fallback;
  const lamp = useTransform(progress, [0.15, 1], [0, 1]);

  return (
    <>
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-x-[50%] -top-[60%] -z-10 h-[180%] light:hidden motion-reduce:opacity-100!"
        style={{
          opacity: lamp,
          // The pool fades to nothing well inside its own box, so no edge of
          // the box ever shows as a line across the wall.
          background:
            "radial-gradient(ellipse 38% 34% at 50% 40%, color-mix(in srgb, var(--gold) 13%, transparent), color-mix(in srgb, var(--gold) 5%, transparent) 50%, transparent 100%)",
        }}
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-x-[10%] top-0 z-10 h-px light:hidden motion-reduce:opacity-100!"
        style={{
          opacity: lamp,
          background:
            "linear-gradient(90deg, transparent, color-mix(in srgb, var(--ink) 55%, transparent), transparent)",
        }}
      />
    </>
  );
}
