"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Canvas from "@/components/Canvas";
import OrnateFrame from "@/components/OrnateFrame";
import CurtainPanels, { CURTAIN_DURATION } from "@/components/CurtainPanels";
import { beginMorph, frameLayoutId } from "@/components/Morph";
import { exhibits, hall } from "@/content/content";

export default function Museum() {
  const router = useRouter();
  const [exiting, setExiting] = useState(false);
  const navigated = useRef(false);

  function busy() {
    return exiting || navigated.current;
  }

  /**
   * Walk into a painting.
   *
   * Nothing is animated from here, and nothing is armed. Both pages render the
   * room's frame under the same `layoutId` unconditionally, so the morph is
   * already set up before the click — the only thing the click contributes is
   * the flag saying this navigation is a morph. See Morph.
   *
   * A plain <Link>, so the whole frame is the target: the moulding, the canvas,
   * and the wall label under it are one thing to click, the destination shows in
   * the status bar, and the route is prefetched. That prefetch is load-bearing
   * rather than an optimisation — framer can only pair the two frames if the
   * exhibit mounts in the same commit the hall unmounts in, and a route that has
   * to be fetched first mounts a beat later, with nothing left to fly from.
   */
  function enterExhibit(slug: string, e: React.MouseEvent) {
    if (busy()) {
      e.preventDefault();
      return;
    }

    navigated.current = true;
    beginMorph(slug);
  }

  function leaveMuseum() {
    if (busy()) return;
    setExiting(true);
  }

  // The exit keeps its own timer: the curtains are an overlay, not something
  // framer is driving, so nothing else knows when they have finished closing.
  useEffect(() => {
    if (!exiting) return;
    const timer = setTimeout(() => {
      navigated.current = true;
      router.push("/exit");
    }, CURTAIN_DURATION * 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exiting]);

  return (
    <main className="relative flex flex-1 flex-col items-center gap-12 px-6 py-10">
      <h1 className="text-3xl">{hall.heading}</h1>

      <div className="flex w-full max-w-6xl flex-col gap-10 md:flex-row md:items-start">
        {exhibits.map((exhibit) => (
          <Link
            key={exhibit.slug}
            href={`/museum/${exhibit.slug}`}
            onClick={(e) => enterExhibit(exhibit.slug, e)}
            // Hover lift in CSS rather than framer: a `whileHover` scale and a
            // layout animation would both be writing this element's transform.
            className="group flex-1 cursor-pointer text-left transition-transform duration-200 hover:scale-[1.04] motion-reduce:transition-none motion-reduce:hover:scale-100"
          >
            <OrnateFrame
              tone={exhibit.featured ? "gold" : "neutral"}
              layoutId={frameLayoutId(exhibit.slug)}
              name={exhibit.name}
              // Width capped on mobile: full-width at 2:3 would be a canvas
              // taller than the screen. Desktop splits the row five ways, so no
              // cap there.
              className="max-w-[220px] md:max-w-none"
            >
              <Canvas
                image={exhibit.cover}
                sizes="(min-width: 768px) 20vw, 220px"
                className="aspect-[2/3] w-full"
              />
            </OrnateFrame>
          </Link>
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

      {/* Curtains sit parted off-screen until the visitor leaves. */}
      <div className="pointer-events-none fixed inset-0 z-50">
        <CurtainPanels open={!exiting} />
      </div>
    </main>
  );
}
