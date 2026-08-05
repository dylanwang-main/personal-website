"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import OrnateFrame from "@/components/OrnateFrame";
import CurtainPanels, { CURTAIN_DURATION } from "@/components/CurtainPanels";
import ZoomVoid, { type Rect } from "@/components/ZoomVoid";
import { ZOOM_DURATION } from "@/lib/motion";
import { exhibits, hall } from "@/content/content";

type Zoom = { slug: string; rect: Rect; gold: boolean };
/**
 * `arming` is one frame long and exists so the zoom starts at the painting that
 * was clicked. ZoomVoid is positioned from state, so the frame's rect and
 * `active` cannot be flipped in the same commit — the browser would never hold
 * the rect, and the growth would run from the overlay's default position in the
 * top-left corner instead of from the frame.
 */
type Phase = "idle" | "arming" | "zooming" | "exiting";

export default function Museum() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  // One phase drives every animation on this page, so no two can run at once and
  // none can be re-triggered while one is in flight.
  const [phase, setPhase] = useState<Phase>("idle");
  const [zoom, setZoom] = useState<Zoom | null>(null);
  const navigated = useRef(false);

  function go(href: string) {
    if (navigated.current) return;
    navigated.current = true;
    router.push(href);
  }

  function busy() {
    return phase !== "idle" || navigated.current;
  }

  function openExhibit(
    slug: string,
    gold: boolean,
    e: React.MouseEvent<HTMLButtonElement>,
  ) {
    if (busy()) return;

    if (reduceMotion) {
      go(`/museum/${slug}`);
      return;
    }

    // The frame as it sits on screen right now, hover scale included — the zoom
    // has to start from exactly what the visitor clicked.
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({
      slug,
      gold,
      rect: { top: r.top, left: r.left, width: r.width, height: r.height },
    });
    setPhase("arming");
  }

  function leaveMuseum() {
    if (busy()) return;

    if (reduceMotion) {
      go("/exit");
      return;
    }
    setPhase("exiting");
  }

  // Both transitions navigate on their own duration, from the one phase that
  // owns them. Strict Mode re-invoking this effect clears the pending timer
  // before setting a new one, so each still fires exactly once.
  useEffect(() => {
    // Hand the overlay one frame parked on the clicked frame's rect, then let
    // it grow from there.
    if (phase === "arming") {
      const frame = requestAnimationFrame(() =>
        setPhase((p) => (p === "arming" ? "zooming" : p)),
      );
      return () => cancelAnimationFrame(frame);
    }

    if (phase === "zooming" && zoom) {
      const timer = setTimeout(
        () => go(`/museum/${zoom.slug}`),
        ZOOM_DURATION * 1000,
      );
      return () => clearTimeout(timer);
    }

    if (phase === "exiting") {
      const timer = setTimeout(() => go("/exit"), CURTAIN_DURATION * 1000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, zoom]);

  return (
    <main className="relative flex flex-1 flex-col items-center gap-12 px-6 py-10">
      <h1 className="text-3xl">{hall.heading}</h1>

      <div className="flex w-full max-w-6xl flex-col gap-10 md:flex-row md:items-start">
        {exhibits.map((exhibit) => (
          <motion.button
            key={exhibit.slug}
            type="button"
            onClick={(e) =>
              openExhibit(exhibit.slug, Boolean(exhibit.featured), e)
            }
            whileHover={reduceMotion ? undefined : { scale: 1.04 }}
            transition={{ duration: 0.25 }}
            className="group flex-1 cursor-pointer text-left"
            style={{
              visibility:
                phase === "zooming" && zoom?.slug === exhibit.slug
                  ? "hidden"
                  : "visible",
            }}
          >
            <OrnateFrame
              tone={exhibit.featured ? "gold" : "neutral"}
              name={exhibit.name}
              placeholder={hall.imagePlaceholder}
            />
          </motion.button>
        ))}
      </div>

      {/* Clear of the fixed header */}
      <button
        type="button"
        onClick={leaveMuseum}
        className="fixed top-[4.5rem] right-4 z-40 rounded border border-frame bg-panel px-4 py-2 text-sm text-ink"
      >
        {hall.exitLabel}
      </button>

      {/* Stepping into the painting. Always mounted — see ZoomVoid. */}
      <ZoomVoid
        from={zoom?.rect ?? null}
        active={phase === "zooming"}
        background={
          zoom?.gold
            ? "linear-gradient(135deg, var(--gold), var(--gold-deep))"
            : "linear-gradient(135deg, var(--frame), var(--ink))"
        }
      />

      {/* Curtains sit parted off-screen until the visitor leaves. */}
      <div className="pointer-events-none fixed inset-0 z-50">
        <CurtainPanels open={phase !== "exiting"} />
      </div>
    </main>
  );
}
