"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Canvas from "@/components/Canvas";
import Frame from "@/components/Frame";
import { beginMorph, frameLayoutId } from "@/components/Morph";
import { exhibits, hall } from "@/content/content";

/** Total exit duration: recession + ink dissolve. */
const EXIT_DURATION = 0.65;

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
const PAINTING_UNVEIL = 0.4;

/** Zoom-in duration when clicking a painting. */
const ZOOM_IN = 0.35;
/** Hold at full-screen before navigating. */
const ZOOM_HOLD = 0.1;

export default function Museum() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [exiting, setExiting] = useState(false);
  const [zooming, setZooming] = useState<string | null>(null);
  const navigated = useRef(false);

  function busy() {
    return exiting || zooming !== null || navigated.current;
  }

  /**
   * Walk into a painting. The click starts a zoom-in sequence: the painting
   * scales to fill the viewport, holds, then navigates. The room page handles
   * the slam-down on arrival.
   */
  function enterExhibit(slug: string, e: React.MouseEvent) {
    e.preventDefault();
    if (busy()) return;

    if (reduceMotion) {
      navigated.current = true;
      beginMorph(slug);
      router.push(`/museum/${slug}`);
      return;
    }

    try {
      if (sessionStorage.getItem("zoom-played")) {
        navigated.current = true;
        beginMorph(slug);
        router.push(`/museum/${slug}`);
        return;
      }
    } catch {
      /* SSR or restricted storage */
    }

    setZooming(slug);
  }

  // Navigate after the zoom-in + hold completes.
  useEffect(() => {
    if (!zooming) return;
    try {
      sessionStorage.setItem("zoom-played", "1");
    } catch {
      /* SSR or restricted storage */
    }
    const timer = setTimeout(() => {
      navigated.current = true;
      beginMorph(zooming);
      router.push(`/museum/${zooming}`);
    }, (ZOOM_IN + ZOOM_HOLD) * 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zooming]);

  function leaveMuseum() {
    if (busy()) return;

    try {
      if (sessionStorage.getItem("exit-played")) {
        navigated.current = true;
        router.push("/exit");
        return;
      }
    } catch {
      /* SSR or restricted storage */
    }

    setExiting(true);
  }

  /**
   * Animate the SVG displacement filter on the page content via rAF.
   * Starts after the recession has had a beat to begin, then ramps the
   * displacement to dissolve whatever remains into organic noise.
   */
  const exitDisplaceRef = useRef<SVGFEDisplacementMapElement>(null);

  const runExitDissolve = useCallback(() => {
    const el = exitDisplaceRef.current;
    if (!el) return;
    const delay = EXIT_DURATION * 0.25 * 1000; // start after recession begins
    const dur = EXIT_DURATION * 0.65 * 1000;
    let raf: number;
    const timeout = setTimeout(() => {
      const start = performance.now();
      function frame(now: number) {
        const t = Math.min((now - start) / dur, 1);
        const eased = t * t;
        el!.setAttribute("scale", String(eased * 70));
        if (t < 1) raf = requestAnimationFrame(frame);
      }
      raf = requestAnimationFrame(frame);
    }, delay);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf!);
    };
  }, []);

  useEffect(() => {
    if (!exiting) return;
    try {
      sessionStorage.setItem("exit-played", "1");
    } catch {
      /* SSR or restricted storage */
    }
    const cleanup = runExitDissolve();
    const timer = setTimeout(() => {
      navigated.current = true;
      router.push("/exit");
    }, (EXIT_DURATION + 0.1) * 1000);
    return () => {
      cleanup?.();
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exiting, runExitDissolve]);

  return (
    <main className="relative flex flex-1 flex-col items-center px-6 py-10">
      {/* SVG filter for exit ink dissolve — applied to the content wrapper */}
      <svg className="absolute h-0 w-0" aria-hidden>
        <defs>
          <filter
            id="exit-dissolve"
            x="-80%"
            y="-80%"
            width="260%"
            height="260%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.014 0.02"
              numOctaves="4"
              seed="11"
            />
            <feDisplacementMap
              ref={exitDisplaceRef}
              in="SourceGraphic"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Content wrapper: on exit, recedes into the wall (depth + scale)
          then the ink dissolve filter warps what remains. */}
      <motion.div
        className="flex w-full flex-1 flex-col items-center"
        style={{
          perspective: "600px",
          filter: exiting ? "url(#exit-dissolve)" : "none",
          willChange: exiting || zooming ? "transform, filter, opacity" : "auto",
        }}
        animate={
          exiting
            ? { scale: 0.88, opacity: 0, rotateX: 4 }
            : zooming
              ? { opacity: 0, scale: 0.95 }
              : { scale: 1, opacity: 1, rotateX: 0 }
        }
        transition={
          exiting
            ? {
                scale: { duration: EXIT_DURATION * 0.7, ease: [0.4, 0, 1, 1] },
                rotateX: { duration: EXIT_DURATION * 0.7, ease: [0.4, 0, 1, 1] },
                opacity: {
                  duration: EXIT_DURATION * 0.35,
                  delay: EXIT_DURATION * 0.55,
                  ease: "easeIn",
                },
              }
            : zooming
              ? { duration: ZOOM_IN * 0.6, ease: "easeIn" }
              : { duration: 0 }
        }
      >
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
                  ? "radial-gradient(50% 50% at 50% 40%, color-mix(in srgb, var(--gold) 10%, transparent), transparent 70%)"
                  : "radial-gradient(50% 50% at 50% 40%, color-mix(in srgb, var(--ink) 4%, transparent), transparent 70%)",
              }}
            />
            <PaintingTilt>
            <Link
              href={`/museum/${exhibit.slug}`}
              onClick={(e) => enterExhibit(exhibit.slug, e)}
              data-cursor="enter"
              className="group block cursor-pointer text-left"
            >
              <Frame
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
                        "linear-gradient(to top, color-mix(in srgb, var(--wall) 70%, transparent), transparent)",
                      paddingTop: "2rem",
                    }}
                  >
                    Enter
                  </span>
                </div>
              </Frame>
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
          data-cursor="exit"
          className="rounded border border-frame px-6 py-3 text-sm text-muted transition-[border-color,color] duration-200 hover:border-ink hover:text-ink"
        >
          {hall.exitLabel}
        </button>
      </div>
      </motion.div>

      {/* Darkness — catches the tail end after recession + dissolve */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-50 bg-wall"
        initial={false}
        animate={{ opacity: exiting ? 1 : 0 }}
        transition={
          exiting
            ? { duration: EXIT_DURATION * 0.3, delay: EXIT_DURATION * 0.65, ease: "easeIn" }
            : { duration: 0 }
        }
      />

      {/* Painting zoom-in overlay. Portalled to <body> so it escapes
          PageTransition's transform containing block — fixed positioning
          inside a transformed ancestor resolves against that ancestor,
          not the viewport. */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {zooming && (() => {
              const exhibit = exhibits.find((e) => e.slug === zooming);
              if (!exhibit) return null;
              return (
                <motion.div
                  key="zoom-overlay"
                  className="fixed inset-0 z-[9998] flex items-center justify-center"
                  initial={{ backgroundColor: "rgba(10,10,11,0)" }}
                  animate={{ backgroundColor: "rgba(10,10,11,1)" }}
                  transition={{ duration: ZOOM_IN * 0.8, ease: "easeIn" }}
                >
                  <motion.div
                    initial={{ scale: 0.25, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      scale: { duration: ZOOM_IN, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.2 },
                    }}
                    className="relative w-[85vw] max-w-4xl"
                  >
                    <Frame tone={exhibit.featured ? "gold" : "neutral"}>
                      <Canvas
                        image={exhibit.cover}
                        sizes="85vw"
                        className="aspect-[2/3] w-full md:aspect-[3/2]"
                      />
                    </Frame>
                  </motion.div>
                </motion.div>
              );
            })()}
          </AnimatePresence>,
          document.body,
        )}
    </main>
  );
}
