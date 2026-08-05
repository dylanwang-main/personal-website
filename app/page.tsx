"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import AmbientField from "@/components/AmbientField";
import DoorGraphic, { type DoorPhase } from "@/components/DoorGraphic";
import KineticTagline from "@/components/KineticTagline";
import Placard from "@/components/Placard";
import ThresholdZoom from "@/components/ThresholdZoom";
import { type Rect } from "@/components/ZoomVoid";
import { useCursorParallax } from "@/lib/useCursorParallax";
import { DOOR_SWING, EASE_PUSH, THRESHOLD_DURATION } from "@/lib/motion";
import { entrance } from "@/content/content";

/**
 * The entrance. The arrival veil that plays over this on a first visit is not
 * here — it is a full-viewport overlay and has to live outside the route
 * transition, so the root layout renders it. See ArrivalCurtain.
 */
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

  const { nx, ny } = useCursorParallax();
  // The door travels furthest of anything on the page, and against the ambient
  // field behind it — the gap between the two is what reads as depth.
  const doorX = useTransform(nx, (v) => v * 10);
  const doorY = useTransform(ny, (v) => v * 8);
  const heroX = useTransform(nx, (v) => v * 4);
  const heroY = useTransform(ny, (v) => v * 3);

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
      setDoorway({
        top: r.top,
        left: r.left,
        width: r.width,
        height: r.height,
      });
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
    // `relative` is what AmbientField fills; `overflow-hidden` keeps its
    // oversized, drifting layers from adding page scroll.
    <main className="relative flex flex-1 flex-col overflow-hidden">
      <AmbientField nx={nx} ny={ny} />

      <div className="relative z-10 flex flex-1 flex-col">
        {/* Hero. Sized to the screen less the header and footer so the name gets
            a full view to itself and the door still clears the fold; the support
            content below is reached by scrolling, deliberately. */}
        <section
          className="flex min-h-[calc(100svh-8rem)] flex-col items-center justify-center px-6"
          style={{ gap: "clamp(20px, 4vh, 44px)" }}
        >
          <motion.div
            className="flex flex-col items-center"
            style={{ x: heroX, y: heroY, gap: "clamp(12px, 2vh, 20px)" }}
            animate={
              push ? { scale: 1.08, opacity: 0 } : { scale: 1, opacity: 1 }
            }
            transition={push ? pushTransition : { duration: 0.2 }}
          >
            {/* The largest thing on the site, by a wide margin. */}
            <h1
              className="text-center font-display leading-[0.95] tracking-tight"
              style={{ fontSize: "clamp(2.5rem, 9vw, 6.5rem)" }}
            >
              {entrance.name}
            </h1>

            <KineticTagline phrases={entrance.taglines} />
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
            style={{ x: doorX, y: doorY }}
            animate={push ? { scale: 1.3 } : { scale: 1 }}
            transition={push ? pushTransition : { duration: 0.2 }}
          >
            <DoorGraphic phase={phase} doorwayRef={doorwayRef} />
          </motion.button>
        </section>

        {/* Support: the bio the entrance used to lead with, now reading as the
            placard wall beside the door rather than as the headline. */}
        <section className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-10 px-6 pt-4 pb-20 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
          <div
            className="flex items-center justify-center border border-frame bg-panel text-muted"
            style={{ height: "clamp(140px, 20vh, 200px)" }}
          >
            {entrance.imagePlaceholder}
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h2 className="text-xl">{entrance.heading}</h2>
              <p className="text-muted">{entrance.body}</p>
            </div>

            <p className="text-sm text-muted">
              <span
                className="tracking-[0.16em] uppercase"
                style={{ color: "var(--gold-deep)" }}
              >
                {entrance.currentlyLabel}
              </span>{" "}
              — {entrance.currently}
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {entrance.placards.map((placard) => (
                <Placard
                  key={placard.label}
                  label={placard.label}
                  value={placard.value}
                />
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Stepping through the doorway. Always mounted — see ThresholdZoom. */}
      <ThresholdZoom from={doorway} active={phase === "entering"} />
    </main>
  );
}
