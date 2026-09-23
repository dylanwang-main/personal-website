"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import Canvas from "@/components/Canvas";
import KineticTagline from "@/components/KineticTagline";
import Placard from "@/components/Placard";
import { useCursorParallax } from "@/lib/useCursorParallax";
import { entrance, exhibits } from "@/content/content";

/**
 * Ink dissolve duration — the white text of the name warps into organic
 * tendrils via SVG displacement, disperses outward, and fades to nothing.
 * The letterforms themselves are the ink.
 */
const INK_DURATION = 0.65;

/**
 * The entrance. A lobby with a gate: the title sequence fills the viewport and
 * the Enter button is the only action. Below it, the bio and room teasers are
 * visible but scroll is locked until the visitor clicks Enter. This makes
 * Enter mandatory — the lobby content is a through-the-glass preview, not a
 * bypass. Once the iris fires, the visitor is pushed into the hall.
 */
export default function Home() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const navigated = useRef(false);
  const [entering, setEntering] = useState(false);
  const [entered, setEntered] = useState(false);

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

  /* Check if visitor already entered this session (back from museum). */
  useEffect(() => {
    try {
      if (sessionStorage.getItem("museum-entered")) setEntered(true);
    } catch {
      /* SSR or restricted storage — stay gated */
    }
  }, []);

  /* Record entry so returning visitors see the lobby unlocked. */
  useEffect(() => {
    if (!entering) return;
    try {
      sessionStorage.setItem("museum-entered", "1");
      sessionStorage.setItem("ink-played", "1");
    } catch {
      /* noop */
    }
    setEntered(true);
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
              "radial-gradient(50% 40% at 50% 40%, rgba(176,152,114,0.06), transparent 70%)",
          }}
        />
      </motion.div>

      <div className="relative z-10 flex flex-1 flex-col">
        {/* Title sequence. Full viewport. The name is the only thing. */}
        <section
          className="flex min-h-[calc(100svh-8rem)] flex-col items-center justify-center px-6"
          style={{ gap: "clamp(24px, 5vh, 56px)" }}
        >
          {/* Name: on enter, the SVG displacement filter warps the letterforms
              into organic tendrils while the text scales up slightly and fades.
              The tendrils are visible for about a second before dissolving —
              the name IS the ink. */}
          <motion.div
            className="flex flex-col items-center"
            style={{ x: heroX, y: heroY, gap: "clamp(12px, 2vh, 20px)" }}
          >
            <motion.h1
              className="text-center font-display leading-[0.9] tracking-tight"
              style={{
                fontSize: "clamp(2.8rem, 10vw, 7.5rem)",
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
            <motion.div
              animate={entering ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
              transition={entering ? { duration: 0.25, ease: "easeIn" } : { duration: 0.2 }}
            >
              <KineticTagline phrases={entrance.taglines} />
            </motion.div>
          </motion.div>

          {/* Enter — the only action. Minimal, gold-accented. A breathing
              box-shadow glow beckons on idle; hover sharpens the glow. */}
          <motion.button
            type="button"
            onClick={enterMuseum}
            disabled={entering}
            aria-label={entrance.doorLabel}
            data-cursor="enter"
            className="rounded border border-gold/50 px-8 py-3 font-display text-sm tracking-[0.14em] text-gold uppercase animate-[enter-glow_2.4s_ease-in-out_infinite] transition-[border-color] hover:border-gold hover:animate-none hover:shadow-[0_0_24px_-4px_rgba(176,152,114,0.35)]"
            animate={
              entering ? { opacity: 0, y: 8 } : { opacity: 1, y: 0 }
            }
            transition={
              entering ? { duration: 0.2, ease: "easeIn" } : { duration: 0.2 }
            }
          >
            Enter
          </motion.button>

          {/* Scroll hint — only when lobby is still gated. A slow vertical
              bob rather than a pulse: the arrow is beckoning, not blinking. */}
          {!entered && !entering && (
            <motion.p
              className="mt-4 text-xs text-muted/40"
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: [0, 6, 0], opacity: [0.4, 0.7, 0.4] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              ↓
            </motion.p>
          )}
        </section>

        {/* Bio — the placard wall below the title sequence.
            Gated: content is visible but non-interactive until Enter has been
            clicked at least once this session. A frosted veil and pointer-events
            lock communicate "this is behind the glass." The veil lifts with a
            CSS transition so the unlock reads as the glass being removed rather
            than a boolean flip.

            On enter, fades quietly — the ink overlay is what covers it. */}
        <motion.div
          className="relative"
          animate={entering ? { opacity: 0 } : { opacity: 1 }}
          transition={entering ? { duration: 0.4, ease: "easeIn" } : { duration: 0 }}
        >
          <div
            className={`pointer-events-auto absolute inset-0 z-20 transition-opacity duration-700 ease-out ${
              entered ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
            aria-hidden
            style={{
              background:
                "linear-gradient(to bottom, var(--wall), transparent 40%)",
              maskImage:
                "linear-gradient(to bottom, black 30%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 30%, transparent)",
            }}
          />
          <div
            className={`transition-opacity duration-700 ease-out ${
              entered
                ? "opacity-100"
                : "pointer-events-none select-none opacity-40"
            }`}
          >
            <section className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-10 px-6 pt-4 pb-24 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:gap-14">
              <Canvas
                image={{ src: entrance.image, label: entrance.imagePlaceholder }}
                sizes="(min-width: 768px) 20rem, 18rem"
                className="aspect-[4/5] w-full max-w-[18rem] justify-self-center border border-frame md:max-w-none md:justify-self-stretch"
              />

              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl md:text-3xl">{entrance.heading}</h2>
                  <p className="leading-relaxed text-muted">{entrance.body}</p>
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

            {/* Room teasers */}
            <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 pb-28">
              <div className="flex flex-col gap-2">
                <h2 className="text-xs tracking-[0.16em] text-muted uppercase">
                  {entrance.roomsLabel}
                </h2>
                <p className="text-sm text-muted">{entrance.roomsNote}</p>
              </div>

              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-5">
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
