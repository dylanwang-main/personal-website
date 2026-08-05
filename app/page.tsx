"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import DoorGraphic, { type DoorPhase } from "@/components/DoorGraphic";
import ThresholdZoom from "@/components/ThresholdZoom";
import { type Rect } from "@/components/ZoomVoid";
import { DOOR_SWING, EASE_PUSH, THRESHOLD_DURATION } from "@/lib/motion";
import { entrance } from "@/content/content";

export default function Home() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const doorwayRef = useRef<HTMLDivElement>(null);
  // Single source of truth for the whole interaction. Every animation reads it,
  // so nothing can be triggered independently or triggered twice: the guards are
  // phase checks, not separate flags that could disagree.
  const [phase, setPhase] = useState<DoorPhase>("idle");
  const [doorway, setDoorway] = useState<Rect | null>(null);
  const navigated = useRef(false);

  const busy = phase === "opening" || phase === "entering";

  function go(href: string) {
    if (navigated.current) return;
    navigated.current = true;
    router.push(href);
  }

  /** Hover/focus cracks the door — only from rest, never mid-swing. */
  function crack() {
    setPhase((p) => (p === "idle" ? "ajar" : p));
  }

  function uncrack() {
    setPhase((p) => (p === "ajar" ? "idle" : p));
  }

  function enterMuseum() {
    if (busy || navigated.current) return;

    if (reduceMotion) {
      go("/museum");
      return;
    }

    const el = doorwayRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      setDoorway({ top: r.top, left: r.left, width: r.width, height: r.height });
    }
    setPhase((p) => (p === "idle" || p === "ajar" ? "opening" : p));
  }

  // Phases advance on their own duration rather than on an animation callback,
  // and each advance only fires from the one phase that precedes it. Strict Mode
  // re-invoking this effect clears the pending timer before setting a new one, so
  // the chain still runs exactly once per click.
  useEffect(() => {
    if (phase === "opening") {
      const timer = setTimeout(
        () => setPhase((p) => (p === "opening" ? "entering" : p)),
        DOOR_SWING * 1000,
      );
      return () => clearTimeout(timer);
    }

    if (phase === "entering") {
      const timer = setTimeout(() => go("/museum"), THRESHOLD_DURATION * 1000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Parallax while stepping through: everything on the entrance drifts toward
  // the viewer, the door harder than the copy behind it, so the threshold reads
  // as the camera moving rather than as a rectangle growing.
  const push = phase === "entering";
  const pushTransition = { duration: THRESHOLD_DURATION, ease: EASE_PUSH };

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-8">
      <motion.div
        className="grid w-full max-w-5xl grid-cols-1 items-center gap-8 md:grid-cols-2"
        initial={false}
        animate={push ? { scale: 1.08, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={push ? pushTransition : { duration: 0.2 }}
      >
        <div
          className="flex items-center justify-center border border-frame bg-panel text-muted"
          style={{ height: "clamp(180px, 30vh, 260px)" }}
        >
          {entrance.imagePlaceholder}
        </div>
        <div className="flex flex-col justify-center gap-3">
          <h1 className="text-3xl">{entrance.heading}</h1>
          <p className="text-muted">{entrance.body}</p>
        </div>
      </motion.div>

      <motion.button
        type="button"
        onClick={enterMuseum}
        onMouseEnter={crack}
        onMouseLeave={uncrack}
        onFocus={crack}
        onBlur={uncrack}
        disabled={busy}
        aria-label={entrance.doorLabel}
        className="rounded-t-lg"
        initial={false}
        animate={push ? { scale: 1.3 } : { scale: 1 }}
        transition={push ? pushTransition : { duration: 0.2 }}
      >
        <DoorGraphic phase={phase} doorwayRef={doorwayRef} />
      </motion.button>

      {/* Stepping through the doorway. Always mounted — see ThresholdZoom. */}
      <ThresholdZoom from={doorway} active={phase === "entering"} />
    </main>
  );
}
