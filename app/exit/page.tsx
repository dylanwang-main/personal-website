"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import ExitGlow from "@/components/ExitGlow";
import Canvas from "@/components/Canvas";
import { exitScreen, entrance, footer } from "@/content/content";

export default function Exit() {
  const reduceMotion = useReducedMotion();

  const stagger = {
    initial: "hidden",
    animate: "visible",
    variants: {
      hidden: {},
      visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.1, delayChildren: reduceMotion ? 0 : 0.2 } },
    },
  } as const;

  const item = {
    variants: {
      hidden: { opacity: 0, y: reduceMotion ? 0 : 10 },
      visible: { opacity: 1, y: 0 },
    },
    transition: { duration: reduceMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] as const },
  };

  return (
    <motion.main
      className="relative flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center text-ink"
      style={{ background: "var(--wall)" }}
      {...stagger}
    >
      <ExitGlow />

      {/* Portrait */}
      <motion.div className="relative" {...item}>
        <Canvas
          image={{ src: entrance.image, label: entrance.imagePlaceholder }}
          sizes="7rem"
          className="h-28 w-28 rounded-full border border-frame object-cover"
        />
      </motion.div>

      <motion.h1 className="relative text-3xl" {...item}>
        {exitScreen.heading}
      </motion.h1>
      <motion.p className="relative max-w-md text-muted" {...item}>
        {exitScreen.body}
      </motion.p>

      {/* Social links */}
      <motion.ul
        className="relative flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted"
        {...item}
      >
        {footer.links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          </li>
        ))}
      </motion.ul>

      {/* Contact */}
      <motion.div {...item}>
        <a
          href={footer.contact.href}
          data-cursor="say hello"
          className="text-sm text-muted transition-colors hover:text-ink"
        >
          {footer.contact.label}
        </a>
      </motion.div>

      <motion.div {...item}>
        <Link
          href="/"
          data-cursor="return"
          className="relative rounded border border-frame px-6 py-3 text-sm text-muted transition-[border-color,color] hover:border-ink hover:text-ink"
        >
          {exitScreen.returnLabel}
        </Link>
      </motion.div>
    </motion.main>
  );
}
