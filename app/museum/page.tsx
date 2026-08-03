"use client";

import { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import OrnateFrame from "@/components/OrnateFrame";
import CurtainPanels from "@/components/CurtainPanels";
import { rooms } from "@/lib/rooms";

type Rect = { top: number; left: number; width: number; height: number };
type ExitStage = "idle" | "closing" | "blackout";

export default function Museum() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [zoom, setZoom] = useState<{ slug: string; rect: Rect; gold: boolean } | null>(
    null,
  );
  const [exitStage, setExitStage] = useState<ExitStage>("idle");

  function handleFrameClick(
    slug: string,
    gold: boolean,
    e: React.MouseEvent<HTMLButtonElement>,
  ) {
    if (reduceMotion) {
      router.push(`/museum/${slug}`);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setZoom({
      slug,
      gold,
      rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
    });
  }

  function handleExit() {
    if (reduceMotion) {
      router.push("/exit");
      return;
    }
    setExitStage("closing");
  }

  return (
    <main className="relative flex flex-1 flex-col items-center gap-14 px-6 py-16">
      <h1 className="text-3xl">Main Hall</h1>

      <div className="flex w-full max-w-6xl flex-col gap-10 md:flex-row md:items-start">
        {rooms.map((room) => (
          <motion.button
            key={room.slug}
            type="button"
            onClick={(e) => handleFrameClick(room.slug, Boolean(room.featured), e)}
            whileHover={reduceMotion ? undefined : { scale: 1.04 }}
            transition={{ duration: 0.25 }}
            className="group flex-1 cursor-pointer text-left"
            style={{
              visibility: zoom?.slug === room.slug ? "hidden" : "visible",
            }}
          >
            <OrnateFrame
              tone={room.featured ? "gold" : "neutral"}
              name={room.name}
            />
          </motion.button>
        ))}
      </div>

      <button
        type="button"
        onClick={handleExit}
        className="fixed top-4 right-4 z-40 rounded border border-frame bg-panel px-4 py-2 text-sm text-ink"
      >
        Exit
      </button>

      <AnimatePresence>
        {zoom && (
          <motion.div
            key="zoom"
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
            transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
            onAnimationComplete={() => router.push(`/museum/${zoom.slug}`)}
          />
        )}
      </AnimatePresence>

      <div className="pointer-events-none fixed inset-0 z-40">
        <CurtainPanels
          open={exitStage === "idle"}
          onTransitionComplete={() => {
            if (exitStage === "closing") setExitStage("blackout");
          }}
        />
      </div>

      {exitStage === "blackout" && (
        <motion.div
          className="fixed inset-0 z-50 bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          onAnimationComplete={() => router.push("/exit")}
        />
      )}
    </main>
  );
}
