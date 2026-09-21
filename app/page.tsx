"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import Canvas from "@/components/Canvas";
import KineticTagline from "@/components/KineticTagline";
import Placard from "@/components/Placard";
import { useCursorParallax } from "@/lib/useCursorParallax";
import { EASE_PUSH } from "@/lib/motion";
import { entrance, exhibits } from "@/content/content";

/** Cinematic iris duration — the push into the museum. */
const IRIS_DURATION = 1.4;

/**
 * The entrance. A cinematic title sequence: the name appears in darkness,
 * taglines cycle, and the visitor enters through a fade-to-light iris that
 * pushes into the hall. No door, no slab — the threshold is a camera move,
 * not a physical object.
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

    setEntering(true);
  }

  useEffect(() => {
    if (!entering) return;
    const timer = setTimeout(go, IRIS_DURATION * 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entering]);

  const pushTransition = { duration: IRIS_DURATION, ease: EASE_PUSH };

  return (
    <main className="relative flex flex-1 flex-col overflow-hidden">
      {/* Ambient: subtle warm light pools on dark, drifting */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 40% at 50% 40%, rgba(196,164,74,0.06), transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-1 flex-col">
        {/* Title sequence. Full viewport. The name is the only thing. */}
        <section
          className="flex min-h-[calc(100svh-8rem)] flex-col items-center justify-center px-6"
          style={{ gap: "clamp(24px, 5vh, 56px)" }}
        >
          <motion.div
            className="flex flex-col items-center"
            style={{ x: heroX, y: heroY, gap: "clamp(12px, 2vh, 20px)" }}
            animate={
              entering
                ? { scale: 1.06, opacity: 0 }
                : { scale: 1, opacity: 1 }
            }
            transition={entering ? pushTransition : { duration: 0.2 }}
          >
            <h1
              className="text-center font-display leading-[0.9] tracking-tight"
              style={{ fontSize: "clamp(2.8rem, 10vw, 7.5rem)" }}
            >
              {entrance.name}
            </h1>

            <KineticTagline phrases={entrance.taglines} />
          </motion.div>

          {/* Enter — the only action. Minimal, gold-accented. */}
          <motion.button
            type="button"
            onClick={enterMuseum}
            disabled={entering}
            aria-label={entrance.doorLabel}
            className="rounded border border-gold/50 px-8 py-3 font-display text-sm tracking-[0.14em] text-gold uppercase transition hover:border-gold hover:shadow-[0_0_20px_-4px_rgba(196,164,74,0.3)]"
            animate={
              entering ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }
            }
            transition={
              entering ? { duration: 0.3, ease: "easeIn" } : { duration: 0.2 }
            }
          >
            Enter
          </motion.button>
        </section>

        {/* Bio — the placard wall below the title sequence */}
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

      {/* Cinematic iris — fills the viewport with the museum's wall colour */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-50 bg-wall"
        initial={false}
        animate={{ opacity: entering ? [0, 0, 1] : 0 }}
        transition={
          entering
            ? { duration: IRIS_DURATION, times: [0, 0.5, 1], ease: "easeIn" }
            : { duration: 0 }
        }
      />
    </main>
  );
}
