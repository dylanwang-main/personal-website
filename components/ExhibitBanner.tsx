"use client";

import Canvas from "@/components/Canvas";
import OrnateFrame from "@/components/OrnateFrame";
import { frameLayoutId } from "@/components/Morph";
import type { Exhibit } from "@/content/content";

/**
 * The room's framed artwork at the top of its page: the far side of the morph.
 *
 * It is the same <OrnateFrame> that hangs in the hall, under the same
 * `layoutId`, so framer treats the two as one element and flies the whole thing
 * — moulding, studs, canvas — from the wall into this slot. The tone comes from
 * the exhibit's own `featured` flag, which is the same flag that made the frame
 * gold in the hall, so the featured room keeps its gold the whole way across
 * instead of swapping to plain moulding on landing.
 *
 * The id is applied unconditionally, on every render, including a direct load
 * with no hall behind it. An unpaired id is inert — framer animates a layout id
 * only when it finds two of them in one commit — and applying it conditionally
 * is what would break the morph, since the condition would have to be known
 * before the page it is being read on has mounted.
 *
 * Nothing here is timed. The heading and body below are held back by
 * MorphReveal, so the room reads as landing first and being read second.
 */
export default function ExhibitBanner({
  exhibit,
  sizes,
}: {
  exhibit: Exhibit;
  /** Passed to next/image. The two exhibit layouts run at different widths. */
  sizes: string;
}) {
  return (
    <OrnateFrame
      tone={exhibit.featured ? "gold" : "neutral"}
      layoutId={frameLayoutId(exhibit.slug)}
    >
      <Canvas
        image={exhibit.cover}
        sizes={sizes}
        className="w-full"
        style={{ height: "clamp(200px, 40svh, 400px)" }}
      />
    </OrnateFrame>
  );
}
