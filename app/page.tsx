"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import CurtainPanels, { CURTAIN_DURATION } from "@/components/CurtainPanels";
import DoorGraphic from "@/components/DoorGraphic";
import { entrance } from "@/content/content";

export default function Home() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [revealing, setRevealing] = useState(false);
  // One click, one transition, one navigation — even if React re-renders or
  // re-invokes effects (Strict Mode) in between.
  const navigated = useRef(false);

  function go(href: string) {
    if (navigated.current) return;
    navigated.current = true;
    router.push(href);
  }

  function enterMuseum() {
    if (revealing || navigated.current) return;
    if (reduceMotion) {
      go("/museum");
      return;
    }
    setRevealing(true);
  }

  // Navigation is sequenced off the curtain duration rather than an animation
  // callback, so it happens exactly once per reveal.
  useEffect(() => {
    if (!revealing) return;
    const timer = setTimeout(() => go("/museum"), CURTAIN_DURATION * 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealing]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-14 px-6 py-16">
      <div className="grid w-full max-w-5xl grid-cols-1 gap-10 md:grid-cols-2">
        <div className="flex h-64 items-center justify-center border border-frame bg-panel text-muted md:h-80">
          {entrance.imagePlaceholder}
        </div>
        <div className="flex flex-col justify-center gap-4">
          <h1 className="text-3xl">{entrance.heading}</h1>
          <p className="text-muted">{entrance.body}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={enterMuseum}
        disabled={revealing}
        aria-label={entrance.doorLabel}
        className="group rounded-t-lg"
      >
        <DoorGraphic />
      </button>

      {revealing && (
        <div className="fixed inset-0 z-50">
          <CurtainPanels initialOpen={false} open />
        </div>
      )}
    </main>
  );
}
