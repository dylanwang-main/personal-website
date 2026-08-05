"use client";

import { useMemo, type RefObject } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  DOOR_BREATH,
  DOOR_CRACK,
  DOOR_SWING,
  EASE_SNAP,
  EASE_THUNK,
} from "@/lib/motion";

/**
 * How far through the interaction the door is. The parent owns this so one user
 * gesture drives one continuous motion: the hover crack is not a separate
 * animation that gets cancelled, it is the first part of the swing.
 */
export type DoorPhase = "idle" | "ajar" | "opening" | "entering";

/** Degrees. Negative swings the slab away from the viewer, hinged on the left. */
const AJAR = -14;
const OPEN = -80;

/**
 * Targets are memoised per state so the keyframe arrays keep their identity
 * across re-renders. A fresh array every render would look like a new target to
 * framer and restart the swing mid-flight — which is exactly the double-play this
 * component has to avoid.
 */
function useDoorMotion(state: "idle" | "ajar" | "opening") {
  return useMemo(() => {
    if (state === "opening") {
      return {
        // Picks up from the same angle `ajar` left it at, dips back a few
        // degrees (anticipation), then swings hard and stops dead.
        slab: { rotateY: [AJAR, -3, OPEN] },
        slabTransition: {
          duration: DOOR_SWING,
          times: [0, 0.14, 1],
          ease: EASE_THUNK,
        },
        // The slab hitting its stop knocks the architrave: the "thunk".
        architrave: { x: [0, -2.5, 1, 0] },
        architraveTransition: {
          duration: 0.18,
          delay: DOOR_SWING - 0.12,
          ease: "easeOut" as const,
        },
        spill: 1,
        edge: 1,
      };
    }

    const ajar = state === "ajar";
    return {
      slab: { rotateY: ajar ? AJAR : 0 },
      slabTransition: {
        duration: ajar ? DOOR_CRACK : 0.22,
        ease: EASE_SNAP,
      },
      architrave: { x: 0 },
      architraveTransition: { duration: 0.18 },
      spill: ajar ? 0.45 : 0,
      edge: ajar ? 0.5 : 0,
    };
  }, [state]);
}

/**
 * Entrance door. Purely presentational — the parent makes it interactive and
 * owns the phase, so the whole door is one control with nothing layered on top.
 *
 * Sized off viewport height so the entrance (photo, about copy, door) fits one
 * screen without scrolling; the 5:8 slab proportion holds at every size. The
 * door is the page's one action, so it shrinks less than the copy above it —
 * see the matching clamps in app/page.tsx.
 */
export default function DoorGraphic({
  phase,
  doorwayRef,
}: {
  phase: DoorPhase;
  /** The dark doorway itself. The parent measures it to start the zoom there. */
  doorwayRef?: RefObject<HTMLDivElement | null>;
}) {
  const reduceMotion = useReducedMotion();
  // `entering` holds the slab where `opening` left it while the zoom takes over.
  const state = phase === "entering" ? "opening" : phase;
  const m = useDoorMotion(state);
  const fade = {
    duration: state === "opening" ? DOOR_SWING * 0.6 : DOOR_CRACK,
  };

  // The cue that this is the way in. It breathes only at rest: once the visitor
  // is on the door, the door's own motion says everything the halo was saying,
  // and two things pulsing at once reads as the page glitching.
  const breathing = phase === "idle" && !reduceMotion;

  return (
    <motion.div
      className="relative"
      style={{ height: "clamp(180px, 34vh, 300px)", aspectRatio: "5 / 8" }}
      initial={false}
      animate={m.architrave}
      transition={m.architraveTransition}
    >
      {/* Halo, behind the architrave and spilling past it. Reduced motion keeps
          it at a steady low glow — still a cue, just not a moving one. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-6 -z-10"
        style={{
          background:
            "radial-gradient(50% 45% at 50% 55%, rgba(212,175,55,0.30), transparent 70%)",
        }}
        initial={false}
        animate={
          breathing
            ? { opacity: [0.35, 0.85, 0.35], scale: [0.97, 1.03, 0.97] }
            : { opacity: phase === "idle" ? 0.5 : 0, scale: 1 }
        }
        transition={
          breathing
            ? { duration: DOOR_BREATH, repeat: Infinity, ease: "easeInOut" }
            : { duration: DOOR_CRACK }
        }
      />
      {/* Architrave: the fixed surround the slab is recessed into */}
      <div className="absolute inset-0 rounded-t-lg border-2 border-frame bg-panel p-2 shadow-lg">
        {/* Doorway: what the slab was hiding, and where the zoom begins */}
        <div
          ref={doorwayRef}
          className="relative h-full w-full overflow-hidden rounded-t-md"
          style={{ background: "linear-gradient(180deg, #100e0a, #05040a)" }}
        >
          {/* Light spilling out of the gap, widening as the door opens */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 80% at 25% 45%, rgba(212,175,55,0.32), transparent 70%)",
            }}
            initial={false}
            animate={{ opacity: m.spill }}
            transition={fade}
          />
        </div>
      </div>

      {/* Slab, hinged on the left edge, swinging away from the viewer */}
      <div
        className="absolute inset-0 p-2"
        style={{ perspective: "900px", transformStyle: "preserve-3d" }}
      >
        <motion.div
          className="relative flex h-full w-full flex-col gap-2 rounded-t-md border border-frame bg-slab p-2"
          style={{
            transformOrigin: "left center",
            backfaceVisibility: "hidden",
            boxShadow: "inset 0 2px 10px rgba(0,0,0,0.25)",
          }}
          initial={false}
          animate={m.slab}
          transition={m.slabTransition}
        >
          {/* Recessed panel detailing */}
          <div
            className="flex-[3] rounded-t-sm border border-frame/70"
            style={{ boxShadow: "inset 0 1px 6px rgba(0,0,0,0.22)" }}
          />
          <div
            className="flex-[2] border border-frame/70"
            style={{ boxShadow: "inset 0 1px 6px rgba(0,0,0,0.22)" }}
          />

          {/* Handle plate and knob, on the swinging edge */}
          <div className="absolute top-1/2 right-2 -translate-y-1/2">
            <div className="flex h-7 w-2.5 items-center justify-center rounded-sm border border-frame bg-frame/25">
              <span className="h-2 w-2 rounded-full border border-frame bg-frame/70" />
            </div>
          </div>

          {/* The turning slab catches less light on its face */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-t-md"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.4), transparent 55%)",
            }}
            initial={false}
            animate={{ opacity: m.edge }}
            transition={fade}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
