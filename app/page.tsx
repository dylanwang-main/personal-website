"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Canvas from "@/components/Canvas";
import Doorway from "@/components/Doorway";
import Frame from "@/components/Frame";
import GlassReveal from "@/components/GlassReveal";
import KineticTagline from "@/components/KineticTagline";
import Placard from "@/components/Placard";
import { NAME_SIZE } from "@/lib/motion";
import { useCursorParallax } from "@/lib/useCursorParallax";
import { entrance, exhibits } from "@/content/content";

/**
 * Ink dissolve duration — the white text of the name warps into organic
 * tendrils via SVG displacement, disperses outward, and fades to nothing.
 * The letterforms themselves are the ink.
 */
const INK_DURATION = 0.65;

/**
 * The entrance. The title sequence fills most of the viewport with the name and
 * the door; below it, the visitor's own portrait hangs as the first work in the
 * museum, with the bio as its wall text and the rooms beyond it.
 *
 * Nothing here is gated. The portrait sits behind display-case glass that clears
 * as it scrolls into view (GlassReveal), and every room is one click away, but
 * the door and its ink dissolve stay the main way in.
 */
export default function Home() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const navigated = useRef(false);
  const [entering, setEntering] = useState(false);

  const { nx, ny } = useCursorParallax();
  const heroX = useTransform(nx, (v) => v * 4);
  const heroY = useTransform(ny, (v) => v * 3);

  function go() {
    if (navigated.current) return;
    navigated.current = true;
    router.push("/museum");
  }

  function enterMuseum() {
    if (entering || navigated.current) return;

    if (reduceMotion) {
      go();
      return;
    }

    try {
      if (sessionStorage.getItem("ink-played")) {
        go();
        return;
      }
    } catch {
      /* SSR or restricted storage */
    }

    setEntering(true);
  }

  useEffect(() => {
    if (!entering) return;
    // Navigate slightly after the ink has fully covered — hold the black.
    const timer = setTimeout(go, (INK_DURATION + 0.15) * 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entering]);

  /* Mark the dissolve as played, so it runs once per session. */
  useEffect(() => {
    if (!entering) return;
    try {
      sessionStorage.setItem("ink-played", "1");
    } catch {
      /* noop */
    }
  }, [entering]);

  /**
   * Animate the SVG displacement filter via rAF — direct DOM mutation avoids
   * React re-renders on every frame. The displacement scale ramps from 0 to
   * peak, warping the text into organic tendrils before it fades.
   */
  const displaceRef = useRef<SVGFEDisplacementMapElement>(null);

  const runDissolve = useCallback(() => {
    const el = displaceRef.current;
    if (!el) return;
    const start = performance.now();
    const dur = INK_DURATION * 1000;
    let raf: number;
    function frame(now: number) {
      const t = Math.min((now - start) / dur, 1);
      // Cubic ease-in: text quivers, then accelerates into dissolution
      const eased = t * t * t;
      el!.setAttribute("scale", String(eased * 90));
      if (t < 1) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!entering) return;
    return runDissolve();
  }, [entering, runDissolve]);

  return (
    <main className="relative flex flex-1 flex-col overflow-hidden">
      {/* SVG filter definition — referenced by the h1 via CSS filter.
          feTurbulence generates fractal noise; feDisplacementMap uses it to
          push the text's pixels along the noise contours. At low scale the
          text quivers; at high scale the letterforms stretch into wispy,
          organic tendrils that look like ink dispersing on water. */}
      <svg className="absolute h-0 w-0" aria-hidden>
        <defs>
          <filter
            id="ink-dissolve"
            x="-100%"
            y="-100%"
            width="400%"
            height="400%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.018"
              numOctaves="4"
              seed="5"
            />
            <feDisplacementMap
              ref={displaceRef}
              in="SourceGraphic"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Ambient: subtle warm light pools on dark, drifting. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        animate={entering ? { opacity: 0 } : { opacity: 1 }}
        transition={entering ? { duration: 0.6, ease: "easeIn" } : { duration: 0 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 40% at 50% 40%, color-mix(in srgb, var(--gold) 6%, transparent), transparent 70%)",
          }}
        />
      </motion.div>

      <div className="relative z-10 flex flex-1 flex-col">
        {/* Title sequence. Most of the viewport: the name and the door, with
            the top edge of the portrait's wall just showing beneath. */}
        <section
          className="relative flex min-h-[85svh] flex-col items-center justify-center px-6 pb-16"
          style={{ gap: "clamp(32px, 6vh, 64px)" }}
        >
          {/* Name: on enter, the SVG displacement filter warps the letterforms
              into organic tendrils while the text scales up slightly and fades.
              The name IS the ink. */}
          <motion.div
            className="flex flex-col items-center"
            style={{ x: heroX, y: heroY, gap: "clamp(12px, 2vh, 20px)" }}
          >
            <motion.h1
              className="text-center font-display leading-[0.9] tracking-tight text-balance"
              style={{
                fontSize: NAME_SIZE,
                filter: entering ? "url(#ink-dissolve)" : "none",
                willChange: entering ? "filter, transform, opacity" : "auto",
              }}
              animate={
                entering
                  ? { scale: 1.6, opacity: 0 }
                  : { scale: 1, opacity: 1 }
              }
              transition={
                entering
                  ? {
                      scale: { duration: INK_DURATION, ease: [0.3, 0, 0.2, 1] },
                      opacity: {
                        duration: INK_DURATION * 0.35,
                        delay: INK_DURATION * 0.55,
                        ease: "easeIn",
                      },
                    }
                  : { duration: 0.2 }
              }
            >
              {entrance.name}
            </motion.h1>

            {/* Tagline drops away fast — it's not part of the ink moment. */}
            {entrance.taglines.length > 0 && (
              <motion.div
                animate={entering ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
                transition={entering ? { duration: 0.25, ease: "easeIn" } : { duration: 0.2 }}
              >
                <KineticTagline phrases={entrance.taglines} />
              </motion.div>
            )}
          </motion.div>

          <Doorway
            label={entrance.doorText}
            accessibleLabel={entrance.doorLabel}
            onEnter={enterMuseum}
            leaving={entering}
          />

          {/* Scroll cue, pinned to the foot of the title sequence so it marks
              the fold rather than floating under the door. A slow bob, held
              still under reduced motion. */}
          {!entering && (
            <motion.svg
              aria-hidden
              viewBox="0 0 16 24"
              className="absolute bottom-6 left-1/2 h-6 w-4 -translate-x-1/2 text-muted"
              fill="none"
              stroke="currentColor"
              strokeWidth={1}
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={reduceMotion ? undefined : { y: [0, 5, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <path d="M8 2v19M3 16l5 5 5-5" />
            </motion.svg>
          )}
        </section>

        {/* The first work: the portrait, hung in the same frame as the hall's
            paintings, with its object label and wall text beside it. On enter
            it fades quietly — the ink overlay is what covers it. */}
        <motion.div
          animate={entering ? { opacity: 0 } : { opacity: 1 }}
          transition={entering ? { duration: 0.4, ease: "easeIn" } : { duration: 0 }}
        >
          <GlassReveal className="mx-auto w-full max-w-5xl px-6 pt-8 pb-28">
            <section
              aria-labelledby="about-heading"
              className="grid grid-cols-1 items-center gap-12 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] md:gap-16"
            >
              <div className="mx-auto w-full max-w-[20rem] md:max-w-none">
                <Frame tone="neutral">
                  <Canvas
                    image={{ src: entrance.image, label: entrance.imagePlaceholder }}
                    sizes="(min-width: 768px) 22rem, 20rem"
                    className="aspect-[4/5] w-full"
                  />
                </Frame>
              </div>

              <div className="flex flex-col gap-10">
                {/* Object label: the card beside the work. */}
                <div className="flex flex-col gap-5">
                  <h2
                    id="about-heading"
                    className="text-3xl leading-tight text-balance md:text-4xl"
                  >
                    {entrance.heading}
                  </h2>
                  {entrance.placards.length > 0 && (
                    <dl className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-x-8 gap-y-5">
                      {entrance.placards.map((placard) => (
                        <Placard
                          key={placard.label}
                          definition
                          label={placard.label}
                          value={placard.value}
                        />
                      ))}
                    </dl>
                  )}
                </div>

                {/* Wall text */}
                <div className="flex max-w-[65ch] flex-col gap-4 leading-relaxed text-muted">
                  {entrance.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                <p className="max-w-[65ch] text-sm leading-relaxed text-muted">
                  <span className="mr-2 text-[0.72rem] tracking-[0.12em] text-ink uppercase">
                    {entrance.currentlyLabel}
                  </span>
                  {entrance.currently}
                </p>
              </div>
            </section>
          </GlassReveal>

          {/* The rooms beyond: each teaser is a way straight in. */}
          <section
            aria-labelledby="rooms-heading"
            className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 pb-28"
          >
            <div className="flex flex-col gap-2">
              <h2
                id="rooms-heading"
                className="text-[0.72rem] tracking-[0.12em] text-muted uppercase"
                // Inline because the global h2 rule sets the display face
                // outside Tailwind's layers, where a utility cannot beat it.
                style={{ fontFamily: "var(--font-body-face)" }}
              >
                {entrance.roomsLabel}
              </h2>
              <p className="text-sm text-muted">{entrance.roomsNote}</p>
            </div>

            <ul className="grid grid-cols-[repeat(auto-fit,minmax(9.5rem,1fr))] gap-x-8 gap-y-6">
              {exhibits.map((exhibit) => (
                <li key={exhibit.slug} className="flex">
                  <Link
                    href={`/museum/${exhibit.slug}`}
                    data-cursor="view"
                    className="group flex-1"
                  >
                    <Placard label={exhibit.name} value={exhibit.teaser} linked />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </motion.div>
      </div>

      {/* After the name has dissolved, hold darkness for the navigate. */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-50 bg-wall"
        initial={false}
        animate={{ opacity: entering ? 1 : 0 }}
        transition={
          entering
            ? { duration: 0.4, delay: INK_DURATION * 0.7, ease: "easeIn" }
            : { duration: 0 }
        }
      />
    </main>
  );
}
