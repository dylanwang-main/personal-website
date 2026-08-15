"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_MORPH, MORPH_DURATION } from "@/lib/motion";
import type { ExhibitImage } from "@/content/content";

/**
 * Woven linen, at the scale a primed canvas actually shows it: two crossed sets
 * of hairlines over a soft top-lit vignette. Low enough in contrast to read as
 * texture rather than as a pattern, and cheap enough to sit in every empty slot
 * on the page at once.
 *
 * The thread is mixed from --ink, so it darkens the weave in the light theme and
 * lightens it in the dark one. A fixed black thread vanished entirely on a dark
 * canvas, which left the empty slots flat in exactly the theme where they have
 * the least else to look at.
 */
const thread = "color-mix(in srgb, var(--ink) 7%, transparent)";
const weave = [
  "radial-gradient(120% 90% at 50% 0%, rgba(255,255,255,0.07), transparent 62%)",
  `repeating-linear-gradient(0deg, ${thread} 0 1px, transparent 1px 3px)`,
  `repeating-linear-gradient(90deg, ${thread} 0 1px, transparent 1px 3px)`,
].join(", ");

/**
 * A stretched canvas: the artwork, or the canvas waiting for it.
 *
 * An empty slot is a deliberate state, not a missing file — a primed canvas
 * hung in its frame with the label of what belongs there, the way a gallery
 * hangs a card while a loan is in transit. It is also the state every slot on
 * the site is in until the photographs land in content.ts, so it is built to be
 * looked at rather than to be tolerated.
 *
 * The same component fills a frame on the hall wall and the banner at the top of
 * an exhibit page, because those two are the same object seen from two distances
 * — the morph flies one into the other, so anything that differed between them
 * would show up as a flicker mid-flight. Callers set the shape; everything
 * inside it is fixed here.
 *
 * `layout` on the canvas and on the label it holds, for the same reason it is on
 * the frame: the flight resizes these boxes by scaling them, and a plain child
 * inherits the scale. Correcting the canvas alone is not enough — a label that
 * is only scaled arrives as a smear rather than as text.
 */
export default function Canvas({
  image,
  sizes,
  className = "",
  style,
}: {
  image: ExhibitImage;
  /** Passed straight to next/image. Required — the uses run at very different widths. */
  sizes: string;
  /** Shape only: width and aspect ratio or height. */
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduceMotion = useReducedMotion();

  const transition = {
    duration: reduceMotion ? 0 : MORPH_DURATION,
    ease: EASE_MORPH,
  };

  return (
    <motion.div
      layout
      transition={transition}
      className={`relative flex items-center justify-center overflow-hidden bg-panel ${className}`}
      style={{
        backgroundImage: image.src ? undefined : weave,
        boxShadow: "inset 0 2px 12px rgba(0,0,0,0.3)",
        ...style,
      }}
    >
      {image.src ? (
        <motion.div layout transition={transition} className="absolute inset-0">
          <Image
            src={image.src}
            alt={image.label}
            fill
            sizes={sizes}
            className="object-cover"
          />
        </motion.div>
      ) : (
        /* The label of the picture that belongs here, set as a title rather than
           as an error: display italic between two hairlines, centred on the
           weave. The same words appear on the placard under the frame in the
           galleries, in small caps — the card names the work, this is the work's
           own space still empty. */
        <motion.div
          layout
          transition={transition}
          className="flex max-w-[85%] flex-col items-center gap-2 px-4 text-center"
        >
          <span
            aria-hidden
            className="h-px w-8"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--frame), transparent)",
            }}
          />
          <span className="font-display text-sm text-muted italic">
            {image.label}
          </span>
          <span
            aria-hidden
            className="h-px w-8"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--frame), transparent)",
            }}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
