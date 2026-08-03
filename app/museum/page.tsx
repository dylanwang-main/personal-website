"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import OrnateFrame from "@/components/OrnateFrame";
import CurtainPanels, { CURTAIN_DURATION } from "@/components/CurtainPanels";
import { exhibits, hall } from "@/content/content";

type Rect = { top: number; left: number; width: number; height: number };
type Zoom = { slug: string; rect: Rect; gold: boolean };

const ZOOM_DURATION = 0.55;

export default function Museum() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [zoom, setZoom] = useState<Zoom | null>(null);
  const [exiting, setExiting] = useState(false);
  // One interaction, one transition, one navigation.
  const navigated = useRef(false);

  function go(href: string) {
    if (navigated.current) return;
    navigated.current = true;
    router.push(href);
  }

  function busy() {
    return zoom !== null || exiting || navigated.current;
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
    const rect = e.currentTarget.getBoundingClientRect();
    setZoom({
      slug,
      gold,
      rect: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      },
    });
  }

  function leaveMuseum() {
    if (busy()) return;

    if (reduceMotion) {
      go("/exit");
      return;
    }
    setExiting(true);
  }

  // Both transitions are sequenced off their own duration, so navigation
  // happens exactly once regardless of re-renders or Strict Mode.
  useEffect(() => {
    if (!zoom) return;
    const timer = setTimeout(
      () => go(`/museum/${zoom.slug}`),
      ZOOM_DURATION * 1000,
    );
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom]);

  useEffect(() => {
    if (!exiting) return;
    const timer = setTimeout(() => go("/exit"), CURTAIN_DURATION * 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exiting]);

  return (
    <main className="relative flex flex-1 flex-col items-center gap-14 px-6 py-16">
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
              visibility: zoom?.slug === exhibit.slug ? "hidden" : "visible",
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

      <button
        type="button"
        onClick={leaveMuseum}
        className="fixed top-4 right-4 z-40 rounded border border-frame bg-panel px-4 py-2 text-sm text-ink"
      >
        {hall.exitLabel}
      </button>

      {/* Stepping into the painting */}
      {zoom && (
        <motion.div
          className="fixed z-50"
          style={{
            background: zoom.gold
              ? "linear-gradient(135deg, var(--gold), var(--gold-deep))"
              : "linear-gradient(135deg, var(--frame), var(--ink))",
          }}
          initial={{
            top: zoom.rect.top,
            left: zoom.rect.left,
            width: zoom.rect.width,
            height: zoom.rect.height,
            opacity: 0.6,
            borderRadius: 4,
          }}
          animate={{
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            opacity: 1,
            borderRadius: 0,
          }}
          transition={{ duration: ZOOM_DURATION, ease: [0.65, 0, 0.35, 1] }}
        />
      )}

      {/* Curtains mount only while leaving, so arriving in the hall never
          replays the entrance reveal. */}
      {exiting && (
        <div className="pointer-events-none fixed inset-0 z-50">
          <CurtainPanels initialOpen open={false} />
        </div>
      )}
    </main>
  );
}
