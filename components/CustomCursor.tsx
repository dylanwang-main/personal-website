"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

/**
 * Minimal gold dot cursor with contextual text labels and click feedback.
 *
 * The dot follows the pointer via motion values (no React re-renders per
 * frame). When the pointer enters an element with a `data-cursor` attribute,
 * the label text fades in beside the dot — the museum tells you what clicking
 * will do.
 *
 * Click feedback: the dot squeezes on press and a ripple ring pulses outward
 * on release. Two-phase — press is acknowledged, release is confirmed.
 *
 * Hidden on coarse pointers (touch) and when reduced motion is preferred.
 */
export default function CustomCursor() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacity = useMotionValue(0);
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [ripple, setRipple] = useState(0);
  const labelRef = useRef("");

  const spring = { stiffness: 8000, damping: 200, mass: 0.01 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setVisible(true);

    function onMove(e: PointerEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      opacity.set(1);
    }

    function onOver(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest("[data-cursor]");
      const text = target?.getAttribute("data-cursor") || "";
      if (text !== labelRef.current) {
        labelRef.current = text;
        setLabel(text);
      }
    }

    function onDown() {
      setPressed(true);
    }

    function onUp() {
      setPressed(false);
      setRipple((r) => r + 1);
    }

    function onLeave() {
      opacity.set(0);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [x, y, opacity]);

  if (!visible) return null;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9999]"
      style={{ x: sx, y: sy, opacity }}
    >
      {/* The dot — squeezes on press, springs back on release */}
      <motion.div
        className="absolute rounded-full bg-gold"
        style={{
          width: 9,
          height: 9,
          top: -4.5,
          left: -4.5,
          boxShadow: "0 0 6px rgba(196,164,74,0.4)",
        }}
        animate={pressed ? { scale: 0.55 } : { scale: 1 }}
        transition={
          pressed
            ? { duration: 0.08, ease: "easeIn" }
            : { type: "spring", stiffness: 800, damping: 15, mass: 0.2 }
        }
      />

      {/* Ripple ring — pulses outward on release then vanishes */}
      <AnimatePresence>
        {ripple > 0 && (
          <motion.div
            key={ripple}
            className="absolute rounded-full border border-gold/60"
            style={{
              width: 9,
              height: 9,
              top: -4.5,
              left: -4.5,
            }}
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Contextual label */}
      <motion.span
        className="absolute left-5 top-[-0.45rem] whitespace-nowrap font-display text-[0.65rem] tracking-[0.14em] text-gold uppercase"
        initial={false}
        animate={{
          opacity: label ? 1 : 0,
          x: label ? 0 : -4,
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        key={label}
      >
        {label}
      </motion.span>
    </motion.div>
  );
}
