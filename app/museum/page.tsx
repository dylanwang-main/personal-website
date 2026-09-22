"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Canvas from "@/components/Canvas";
import OrnateFrame from "@/components/OrnateFrame";
import CurtainPanels, { CURTAIN_DURATION } from "@/components/CurtainPanels";
import { beginMorph, frameLayoutId } from "@/components/Morph";
import { exhibits, hall } from "@/content/content";

/**
 * Cursor-reactive 3D tilt + depth push. The painting tilts toward the pointer
 * and lifts off the wall, as if being picked up to look at. Springs make the
 * motion feel physical — the frame has weight.
 *
 * Disabled under reduced motion and on coarse pointers (touch has no hover
 * position to track, so the tilt would only fire on tap and read as a glitch).
 */
function PaintingTilt({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const z = useMotionValue(0);

  const spring = { stiffness: 260, damping: 25 };
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), spring);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), spring);
  const springZ = useSpring(z, spring);

  function onMove(e: React.MouseEvent) {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
    z.set(24);
  }

  function onLeave() {
    mx.set(0);
    my.set(0);
    z.set(0);
  }

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX,
        rotateY,
        z: springZ,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </motion.div>
  );
}

/** Stagger delay per painting in the hall unveil. */
const PAINTING_STAGGER = 0.1;
/** How long each painting takes to emerge from the wall. */
const PAINTING_UNVEIL = 0.75;

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
          title. Clips from centre outward like text being etched into stone. */}
      <motion.div
        className="flex flex-col items-center gap-3 pt-4 pb-16 text-center"
        initial={reduceMotion ? false : { opacity: 0, clipPath: "inset(0 50% 0 50%)" }}
        animate={{ opacity: 1, clipPath: "inset(0 0% 0 0%)" }}
        transition={{
          duration: reduceMotion ? 0 : 0.7,
          ease: [0.16, 1, 0.3, 1],
        }}
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

      {/* Paintings hung on the wall. Perspective on the container gives the
          children real 3D depth — each painting emerges from inside the wall
          toward the viewer with stagger, like objects being pushed forward
          through a surface. */}
      <div
        className="flex w-full max-w-6xl flex-col items-center gap-12 md:flex-row md:items-start md:gap-6 lg:gap-8"
        style={{ perspective: "800px" }}
      >
        {exhibits.map((exhibit, i) => (
          <motion.div
            key={exhibit.slug}
            className={`group relative ${exhibit.featured ? "md:flex-[1.15]" : "flex-1"}`}
            initial={
              reduceMotion
                ? false
                : { opacity: 0, z: -120, rotateX: 6 }
            }
            animate={{ opacity: 1, z: 0, rotateX: 0 }}
            transition={{
              duration: reduceMotion ? 0 : PAINTING_UNVEIL,
              delay: reduceMotion ? 0 : 0.15 + i * PAINTING_STAGGER,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Ambient wall light — only appears on hover, as if the museum
                notices you looking and aims a spotlight. Gold for featured. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-8 -z-10 rounded-full opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 motion-reduce:transition-none"
              style={{
                background: exhibit.featured
                  ? "radial-gradient(50% 50% at 50% 40%, rgba(196,164,74,0.1), transparent 70%)"
                  : "radial-gradient(50% 50% at 50% 40%, rgba(255,255,255,0.045), transparent 70%)",
              }}
            />
            <PaintingTilt>
            <Link
              href={`/museum/${exhibit.slug}`}
              onClick={(e) => enterExhibit(exhibit.slug, e)}
              className="group block cursor-pointer text-left"
            >
              <OrnateFrame
                tone={exhibit.featured ? "gold" : "neutral"}
                layoutId={frameLayoutId(exhibit.slug)}
                name={exhibit.name}
                className={`max-w-[220px] md:max-w-none ${
                  i % 2 !== 0 ? "md:mt-8" : ""
                }`}
              >
                <div className="relative transition-[filter] duration-300 ease-out group-hover:brightness-[1.15] motion-reduce:transition-none">
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
            </PaintingTilt>
          </motion.div>
        ))}
      </div>

      {/* Exit: centered below the paintings with generous breathing room. */}
      <div className="pt-16 pb-4">
        <button
          type="button"
          onClick={leaveMuseum}
          aria-label="Exit the museum"
          className="rounded border border-gold/50 px-6 py-3 text-sm text-gold transition-[border-color,box-shadow,transform] duration-200 hover:border-gold hover:shadow-[0_0_16px_-4px_rgba(196,164,74,0.25)] hover:scale-105"
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
