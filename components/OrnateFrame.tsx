"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_MORPH, MORPH_DURATION } from "@/lib/motion";

const corners = [
  "top-1 left-1",
  "top-1 right-1",
  "bottom-1 left-1",
  "bottom-1 right-1",
];

/**
 * How heavy the moulding is cut. The anatomy is identical either way — a slot is
 * the same frame seen small, not a simpler one — so a gallery slot and the wall
 * above it read as the same object family.
 */
const scales = {
  /** Hall wall and exhibit banner: full moulding, studs, deep cast shadow. */
  wall: { moulding: "p-3", channel: "p-1.5", studs: true },
  /** Gallery slot: same four layers, proportionally thinner, no studs. */
  slot: { moulding: "p-2", channel: "p-1", studs: false },
} as const;

/**
 * A framed canvas: four layers of moulding and whatever the caller hangs inside.
 *
 * The depth is built rather than drawn, because a single border reads as a box
 * around a picture and a frame reads as an object in front of a wall. Outside in:
 *
 *   edge      a hairline and a cast shadow, so the frame sits off the wall;
 *   moulding  a 135° gradient with a lit top-left lip and a shaded bottom-right
 *             one — one light source, shared by every frame on the site;
 *   channel   an inset ring, darker than the moulding and shadowed inwards. The
 *             carved step, and the layer doing most of the work;
 *   fillet    the bright hairline right at the picture edge, the slip a real
 *             frame uses to lift the canvas off the moulding.
 *
 * Two tones. Neutral is the museum's standard; gold is the featured room's, and
 * differs only in what fills those layers — same anatomy, warmer metal, brighter
 * fillet and studs.
 *
 * The same component hangs on the hall wall and sits at the top of an exhibit
 * page, and those two are one object seen from two distances: `layoutId` pairs
 * them and framer flies the whole frame between them. Everything visual is
 * therefore defined once, here, since anything that differed between the two
 * ends would have to resolve mid-flight and would read as a flicker. That
 * includes the tone — the featured room's frame is gold on the wall and gold in
 * the banner.
 *
 * `layoutId` is optional, and gallery slots leave it off: they use the frame
 * without joining the transition, which is what keeps one frame component
 * serving both. When it is set, every descendant that must not be stretched by
 * the flight carries `layout` of its own, because framer resizes a layout
 * element by scaling it and plain children inherit that scale. The studs are
 * nested for a related reason: layout animation and CSS `rotate` cannot both own
 * an element's transform, so the outer span animates its position and an inner
 * span holds the 45° turn.
 */
export default function OrnateFrame({
  tone,
  scale = "wall",
  layoutId,
  name,
  className = "",
  children,
}: {
  tone: "gold" | "neutral";
  /** How heavy the moulding is cut. Defaults to the wall. */
  scale?: keyof typeof scales;
  /** Pairs this frame with its counterpart on the other page. See Morph. */
  layoutId?: string;
  /** Wall label under the frame. Omitted in the banner — the page has a heading. */
  name?: string;
  /** Shape only: how wide the frame is allowed to be where it hangs. */
  className?: string;
  /** The canvas. Expected to fill the width it is given and set its own height. */
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const isGold = tone === "gold";
  const cut = scales[scale];

  // Only a frame that is flying needs its layers held to their own boxes. Off
  // the transition, this is a plain nest of divs and framer does no measuring.
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
        className={`relative w-full p-px transition-shadow duration-300 ${className}`}
        style={{
          boxShadow: isGold
            ? "0 0 0 1px var(--gold-deep), 0 16px 30px -12px rgba(0,0,0,0.8), 0 0 40px -10px rgba(196,164,74,0.15)"
            : "0 0 0 1px var(--frame), 0 14px 26px -12px rgba(0,0,0,0.7)",
        }}
      >
        {/* Moulding: base metal under a sheen that falls away from the light. */}
        <motion.div
          layout={layout}
          transition={transition}
          className={`relative w-full ${cut.moulding}`}
          style={{
            // Both tones darken away from the light rather than running to a
            // theme colour. --ink flips between near-black and cream, so a
            // moulding mixed towards it was a dark frame in one theme and a
            // pale one in the other; mixing towards black instead keeps one
            // material — pewter, and gilt — under both.
            backgroundImage: isGold
              ? "linear-gradient(135deg, rgba(255,255,255,0.35), rgba(255,255,255,0) 26%), linear-gradient(135deg, var(--gold), var(--gold-deep))"
              : "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0) 24%), linear-gradient(135deg, #3a3835, #222019)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.5)",
          }}
        >
          {cut.studs &&
            corners.map((position) => (
              <motion.span
                key={position}
                layout={layout}
                transition={transition}
                aria-hidden
                className={`absolute z-10 h-2 w-2 ${position}`}
              >
                <span
                  className="block h-full w-full rotate-45"
                  style={{
                    background: isGold ? "#e8d5a0" : "rgba(255,255,255,0.25)",
                    boxShadow: "0 1px 1px rgba(0,0,0,0.45)",
                  }}
                />
              </motion.span>
            ))}

          {/* Channel: the carved step. Darker than the moulding and shadowed
              inwards, so the picture sits at the bottom of a recess. */}
          <motion.div
            layout={layout}
            transition={transition}
            className={`relative w-full ${cut.channel}`}
            style={{
              // Fixed dark rather than a token: a recess is a shadow, and a
              // shadow does not get lighter because the room did.
              background: isGold ? "var(--gold-deep)" : "rgba(10,10,11,0.95)",
              boxShadow:
                "inset 0 2px 6px rgba(0,0,0,0.55), inset 0 -1px 0 rgba(255,255,255,0.12)",
            }}
          >
            {/* Fillet: the bright slip at the picture edge. */}
            <motion.div
              layout={layout}
              transition={transition}
              className="relative w-full p-px"
              style={{
                background: isGold ? "#c4a44a" : "rgba(255,255,255,0.18)",
              }}
            >
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {name && <span className="text-center font-medium text-ink">{name}</span>}
    </div>
  );
}
