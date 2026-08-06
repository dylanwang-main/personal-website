"use client";

import { useEffect, useRef, useState, ViewTransition } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import Canvas from "@/components/Canvas";
import OrnateFrame from "@/components/OrnateFrame";
import CurtainPanels, { CURTAIN_DURATION } from "@/components/CurtainPanels";
import {
  armPushIn,
  canvasName,
  disarmPushIn,
  usePushIn,
} from "@/components/PushIn";
import { exhibits, hall } from "@/content/content";

export default function Museum() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const pushIn = usePushIn();
  const [exiting, setExiting] = useState(false);
  const navigated = useRef(false);

  // The hall is never where a push-in lands, so anything still armed when it
  // mounts belongs to a walk-in that did not complete — a visitor who went
  // straight back, say. Left armed, it would scale and blur whichever navigation
  // came next.
  useEffect(() => {
    disarmPushIn();
  }, []);

  function go(href: string) {
    if (navigated.current) return;
    navigated.current = true;
    router.push(href);
  }

  function busy() {
    return exiting || pushIn.slug !== null || navigated.current;
  }

  /**
   * Walk into a painting.
   *
   * Nothing is animated from here. Naming the clicked canvas is the whole of the
   * work — the browser morphs it into the exhibit's banner because the same name
   * appears on both pages, and globally scoped CSS pushes the rest of the hall
   * past the camera. See PushIn for the full shape of the move.
   */
  function enterExhibit(slug: string, e: React.MouseEvent<HTMLButtonElement>) {
    if (busy()) return;

    if (reduceMotion) {
      go(`/museum/${slug}`);
      return;
    }

    // The camera pushes from the centre of what was clicked, hover scale
    // included, in viewport pixels — which is the coordinate space the root
    // snapshot is captured in.
    const r = e.currentTarget.getBoundingClientRect();
    armPushIn({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    pushIn.begin(slug);
  }

  function leaveMuseum() {
    if (busy()) return;

    if (reduceMotion) {
      go("/exit");
      return;
    }
    setExiting(true);
  }

  // Navigating from an effect rather than from the click handler, and this is the
  // reason the interaction needs state at all: the clicked canvas has to be
  // wrapped in a committed <ViewTransition> before the navigation starts, because
  // that is the tree the outgoing side of the morph is captured from. Do both in
  // the handler and the capture finds a hall where nothing is named, leaving the
  // exhibit banner with nothing to morph from. An effect is enough — it runs
  // after the commit that added the wrapper — and it is deliberately not deferred
  // any further than that: a frame callback would never fire in a tab that is not
  // being painted, which would strand the visitor on the hall.
  useEffect(() => {
    if (!pushIn.slug) return;
    go(`/museum/${pushIn.slug}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pushIn.slug]);

  // The exit keeps its own timer: the curtains are an overlay, not a view
  // transition, so nothing else knows when they have finished closing.
  useEffect(() => {
    if (!exiting) return;
    const timer = setTimeout(() => go("/exit"), CURTAIN_DURATION * 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exiting]);

  return (
    <main className="relative flex flex-1 flex-col items-center gap-12 px-6 py-10">
      <h1 className="text-3xl">{hall.heading}</h1>

      <div className="flex w-full max-w-6xl flex-col gap-10 md:flex-row md:items-start">
        {exhibits.map((exhibit) => {
          // Only the canvas being walked into may be named — see PushIn.
          const walkingIn = pushIn.slug === exhibit.slug;

          const canvas = (
            <Canvas
              image={exhibit.cover}
              sizes="(min-width: 768px) 20vw, 220px"
              className="aspect-[2/3] w-full"
            />
          );

          return (
            <motion.button
              key={exhibit.slug}
              type="button"
              onClick={(e) => enterExhibit(exhibit.slug, e)}
              whileHover={reduceMotion ? undefined : { scale: 1.04 }}
              transition={{ duration: 0.25 }}
              className="group flex-1 cursor-pointer text-left"
            >
              <OrnateFrame
                tone={exhibit.featured ? "gold" : "neutral"}
                name={exhibit.name}
              >
                {walkingIn ? (
                  <ViewTransition
                    name={canvasName(exhibit.slug)}
                    share="canvas"
                    default="none"
                  >
                    {canvas}
                  </ViewTransition>
                ) : (
                  canvas
                )}
              </OrnateFrame>
            </motion.button>
          );
        })}
      </div>

      {/* Clear of the fixed header */}
      <button
        type="button"
        onClick={leaveMuseum}
        className="fixed top-[4.5rem] right-4 z-40 rounded border border-frame bg-panel px-4 py-2 text-sm text-ink"
      >
        {hall.exitLabel}
      </button>

      {/* Curtains sit parted off-screen until the visitor leaves. */}
      <div className="pointer-events-none fixed inset-0 z-50">
        <CurtainPanels open={!exiting} />
      </div>
    </main>
  );
}
