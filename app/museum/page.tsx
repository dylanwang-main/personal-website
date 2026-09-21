"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Canvas from "@/components/Canvas";
import OrnateFrame from "@/components/OrnateFrame";
import CurtainPanels, { CURTAIN_DURATION } from "@/components/CurtainPanels";
import { beginMorph, frameLayoutId } from "@/components/Morph";
import { exhibits, hall } from "@/content/content";

/** Stagger delay per painting in the hall unveil. */
const PAINTING_STAGGER = 0.1;
/** How long each painting takes to unveil. */
const PAINTING_UNVEIL = 0.6;

export default function Museum() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
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
    <main className="relative flex flex-1 flex-col items-center px-6 py-10">
      {/* Hall heading: wider tracking and a tapered rule make this read as
          architectural lettering — a sign painted on the wall, not a page
          title. Distinct from exhibit headings (text-3xl, tight tracking). */}
      <motion.div
        className="flex flex-col items-center gap-3 pt-4 pb-16 text-center"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.5 }}
      >
        <h1
          className="text-3xl tracking-[0.08em] uppercase md:text-4xl"
          style={{ letterSpacing: "0.08em" }}
        >
          {hall.heading}
        </h1>
        <span
          aria-hidden
          className="h-px w-12"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--frame), transparent)",
          }}
        />
        <p className="text-sm text-muted">{hall.subtitle}</p>
      </motion.div>

      {/* Paintings hung on the wall. On desktop the featured room is slightly
          larger — the gold frame earns more wall space. Staggered vertical
          position (via padding-top on alternating paintings) breaks the flat
          grid and reads as deliberately hung rather than auto-laid-out. */}
      {/* Paintings unveiled. Each painting clips from bottom to top with a
          stagger, as if curtains are being drawn — museum-specific arrival,
          not a generic fade. Reduced motion skips the clip and shows instantly. */}
      <div className="flex w-full max-w-6xl flex-col items-center gap-12 md:flex-row md:items-start md:gap-6 lg:gap-8">
        {exhibits.map((exhibit, i) => (
          <motion.div
            key={exhibit.slug}
            className={`relative ${exhibit.featured ? "md:flex-[1.15]" : "flex-1"}`}
            initial={reduceMotion ? false : { clipPath: "inset(100% 0 0 0)", opacity: 0 }}
            animate={{ clipPath: "inset(0% 0 0 0)", opacity: 1 }}
            transition={{
              duration: reduceMotion ? 0 : PAINTING_UNVEIL,
              delay: reduceMotion ? 0 : 0.15 + i * PAINTING_STAGGER,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* Directional spotlight — a cone of light falling from above
                each painting. Gold-tinted for the featured frame. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-16 left-1/2 -z-10 h-48 w-[120%] -translate-x-1/2"
              style={{
                background: exhibit.featured
                  ? "radial-gradient(50% 70% at 50% 0%, rgba(196,164,74,0.12), transparent 70%)"
                  : "radial-gradient(50% 70% at 50% 0%, rgba(255,255,255,0.05), transparent 70%)",
              }}
            />
            <Link
              href={`/museum/${exhibit.slug}`}
              onClick={(e) => enterExhibit(exhibit.slug, e)}
              className="group block cursor-pointer text-left transition-transform duration-200 hover:scale-[1.04] motion-reduce:transition-none motion-reduce:hover:scale-100"
            >
              <OrnateFrame
                tone={exhibit.featured ? "gold" : "neutral"}
                layoutId={frameLayoutId(exhibit.slug)}
                name={exhibit.name}
                className={`max-w-[220px] md:max-w-none ${
                  i % 2 !== 0 ? "md:mt-8" : ""
                }`}
              >
                <div className="relative">
                  <Canvas
                    image={exhibit.cover}
                    sizes="(min-width: 768px) 20vw, 220px"
                    className="aspect-[2/3] w-full"
                  />
                  {/* Touch affordance: a subtle "Enter" label at the bottom of
                      each painting. Visible at rest on mobile (no hover), fades
                      in on hover on desktop. Tells first-time visitors these
                      frames are doors without breaking the gallery aesthetic. */}
                  <span
                    className="absolute inset-x-0 bottom-0 flex items-end justify-center pb-3 font-display text-[0.6rem] tracking-[0.2em] text-ink/0 uppercase opacity-60 transition-colors duration-300 group-hover:text-ink/70 max-md:text-ink/50"
                    aria-hidden
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.5), transparent)",
                      paddingTop: "2rem",
                    }}
                  >
                    Enter
                  </span>
                </div>
              </OrnateFrame>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Exit: centered below the paintings with generous breathing room. */}
      <div className="pt-16 pb-4">
        <button
          type="button"
          onClick={leaveMuseum}
          aria-label="Exit the museum"
          className="rounded border border-gold px-6 py-3 text-sm text-ink transition hover:scale-105"
        >
          {hall.exitLabel}
        </button>
      </div>

      {/* Curtains sit parted off-screen until the visitor leaves. */}
      <div className="pointer-events-none fixed inset-0 z-50">
        <CurtainPanels open={!exiting} />
      </div>
    </main>
  );
}
