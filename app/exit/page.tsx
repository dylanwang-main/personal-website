"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import ExitGlow from "@/components/ExitGlow";
import { exitScreen } from "@/content/content";

/**
 * The exit — the bookend. Content stages in sequence: glow breathes first,
 * then heading, body, and the return link arrive one by one. The pacing is
 * slow enough to read as a closing moment, not as a loading delay.
 */
export default function Exit() {
  const reduceMotion = useReducedMotion();

  const stagger = {
    initial: "hidden",
    animate: "visible",
    variants: {
      hidden: {},
      visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.25, delayChildren: reduceMotion ? 0 : 0.6 } },
    },
  } as const;

  const item = {
    variants: {
      hidden: { opacity: 0, y: reduceMotion ? 0 : 10 },
      visible: { opacity: 1, y: 0 },
    },
    transition: { duration: reduceMotion ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] as const },
  };

  return (
    <motion.main
      className="relative flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center text-ink"
      style={{ background: "var(--wall)" }}
      {...stagger}
    >
      <ExitGlow />
      <motion.h1 className="relative text-3xl" {...item}>
        {exitScreen.heading}
      </motion.h1>
      <motion.p className="relative max-w-md text-muted" {...item}>
        {exitScreen.body}
      </motion.p>
      <motion.div {...item}>
        <Link
          href="/"
          className="relative rounded border border-gold px-6 py-3 text-sm text-gold transition hover:scale-105"
        >
          {exitScreen.returnLabel}
        </Link>
      </motion.div>
    </motion.main>
  );
}
