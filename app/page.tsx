"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import AmbientField from "@/components/AmbientField";
import Canvas from "@/components/Canvas";
import DoorGraphic, { type DoorPhase } from "@/components/DoorGraphic";
import KineticTagline from "@/components/KineticTagline";
import Placard from "@/components/Placard";
import ThresholdZoom, { type Rect } from "@/components/ThresholdZoom";
import { useCursorParallax } from "@/lib/useCursorParallax";
import { DOOR_SWING, EASE_PUSH, THRESHOLD_DURATION } from "@/lib/motion";
import { entrance, exhibits } from "@/content/content";

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
        <section className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-10 px-6 pt-4 pb-20 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
          {/* Hung, not inset: a portrait at the scale of the copy beside it,
              rather than a thumbnail the text has to be read around. Capped on
              mobile, where a full-width 4:5 would fill most of the screen. */}
          <Canvas
            image={{ src: entrance.image, label: entrance.imagePlaceholder }}
            sizes="(min-width: 768px) 20rem, 18rem"
            className="aspect-[4/5] w-full max-w-[18rem] justify-self-center border border-frame md:max-w-none md:justify-self-stretch"
          />

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

        {/* The five rooms, seen from outside the door.
            Not links, and not markup that could become links by accident: the
            door is the only way into the museum, and a shortcut here would make
            it decorative. So this is the same placard the bio above uses — same
            hairline, same small caps, same weight — which keeps it a label on the
            way past rather than a second call to action competing with the door.
            Copy comes from each exhibit's own `teaser`, so the strip cannot list
            a room the museum does not have. */}
        <section className="mx-auto flex w-full max-w-5xl flex-col gap-7 px-6 pb-24">
          <div className="flex flex-col gap-1">
            <h2 className="text-xs tracking-[0.16em] text-muted uppercase">
              {entrance.roomsLabel}
            </h2>
            <p className="text-sm text-muted">{entrance.roomsNote}</p>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-5">
            {exhibits.map((exhibit) => (
              <Placard
                key={exhibit.slug}
                label={exhibit.name}
                value={exhibit.teaser}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Stepping through the doorway. Always mounted — see ThresholdZoom. */}
      <ThresholdZoom from={doorway} active={phase === "entering"} />
    </main>
  );
}
