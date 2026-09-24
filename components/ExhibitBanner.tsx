"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Canvas from "@/components/Canvas";
import Frame from "@/components/Frame";
import { frameLayoutId, pendingMorph } from "@/components/Morph";
import type { Exhibit } from "@/content/content";

/**
 * The room's framed artwork at the top of its page.
 *
 * When arriving from the hall (a morph is pending), the banner starts
 * oversized and slightly above its resting position, then slams down with
 * a spring — fast approach, hard stop, slight bounce. The impact is the
 * authored moment; the room content reveals after the bounce settles.
 *
 * On a direct load or header navigation, no slam — the banner is already
 * in place and PageTransition handles the route entry.
 */
export default function ExhibitBanner({
  exhibit,
  sizes,
}: {
  exhibit: Exhibit;
  sizes: string;
}) {
  const reduceMotion = useReducedMotion();
  const [arrived] = useState(() => pendingMorph() === exhibit.slug);
  const slam = arrived && !reduceMotion;

  return (
    <motion.div
      initial={
        slam
          ? { scale: 1.15, y: -24, opacity: 1 }
          : false
      }
      animate={{ scale: 1, y: 0, opacity: 1 }}
      transition={
        slam
          ? {
              type: "spring",
              stiffness: 350,
              damping: 32,
              mass: 0.5,
            }
          : { duration: 0 }
      }
    >
      <Frame
        tone={exhibit.featured ? "gold" : "neutral"}
        layoutId={slam ? undefined : frameLayoutId(exhibit.slug)}
      >
        <Canvas
          image={exhibit.cover}
          sizes={sizes}
          className="w-full"
          style={{ height: "clamp(200px, 40svh, 400px)" }}
        />
      </Frame>
    </motion.div>
  );
}
