"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import CurtainPanels from "@/components/CurtainPanels";

type Phase = "closed" | "opening" | "expanding";

export default function Home() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("closed");

  function handleEnter() {
    if (reduceMotion) {
      router.push("/museum");
      return;
    }
    setPhase("opening");
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-14 px-6 py-16">
      <div className="grid w-full max-w-5xl grid-cols-1 gap-10 md:grid-cols-2">
        <div className="flex h-64 items-center justify-center border border-frame bg-panel text-muted md:h-80">
          Photo
        </div>
        <div className="flex flex-col justify-center gap-4">
          <h1 className="text-3xl">About Me</h1>
          <p className="text-muted">
            Placeholder paragraph about me. This space will eventually hold a
            short introduction, a bit of background, and whatever else feels
            worth sharing before stepping into the museum.
          </p>
        </div>
      </div>

      <motion.div
        layout
        onLayoutAnimationComplete={() => {
          if (phase === "expanding") router.push("/museum");
        }}
        className={
          phase === "expanding"
            ? "fixed inset-0 z-50"
            : "relative h-56 w-72 overflow-hidden rounded-t-3xl border-2 border-gold-deep"
        }
        style={{ background: "#17150f" }}
      >
        {phase !== "expanding" && (
          <>
            <CurtainPanels
              open={phase === "opening"}
              onTransitionComplete={() => {
                if (phase === "opening") setPhase("expanding");
              }}
            />
            <button
              type="button"
              onClick={handleEnter}
              disabled={phase !== "closed"}
              className="absolute inset-0 z-10 flex items-center justify-center"
            >
              <span className="rounded border border-gold px-8 py-3 text-sm font-medium tracking-wide text-gold">
                Enter
              </span>
            </button>
          </>
        )}
      </motion.div>
    </main>
  );
}
