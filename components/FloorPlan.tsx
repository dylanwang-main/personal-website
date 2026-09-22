"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { beginMorph } from "@/components/Morph";
import { exhibits, nav } from "@/content/content";

/**
 * Museum floor plan overlay. A spatial map of the museum — entrance, hall, and
 * the five exhibit rooms — rendered as a modal the visitor can open from the
 * header. "You are here" marks the current location.
 *
 * The map reads top to bottom in the order a visitor walks: entrance at the top,
 * hall in the centre, rooms branching out, exit at the bottom. This mirrors the
 * one-way path the architecture enforces.
 */
export default function FloorPlan({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus the close button when the overlay opens.
  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Focus trap: loop Tab within the dialog while open.
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const focusable = dialog!.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    dialog.addEventListener("keydown", onKeyDown);
    return () => dialog.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Hide main content from assistive tech while modal is open.
  useEffect(() => {
    if (!open) return;
    const main = document.querySelector("main");
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");
    const targets = [main, header, footer].filter(Boolean) as HTMLElement[];
    targets.forEach((el) => el.setAttribute("aria-hidden", "true"));
    return () => {
      targets.forEach((el) => el.removeAttribute("aria-hidden"));
    };
  }, [open]);

  function isHere(path: string) {
    return pathname === path;
  }

  function roomPath(slug: string) {
    return `/museum/${slug}`;
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden
          />

          {/* Floor plan panel */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={nav.floorPlanLabel}
            className="fixed inset-x-4 top-20 z-50 mx-auto max-w-md rounded-lg border border-frame/40 bg-wall/90 p-6 shadow-2xl backdrop-blur-xl sm:inset-x-auto sm:right-6 sm:left-auto sm:w-80"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.2, 0.9, 0.3, 1] }}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-sm tracking-[0.14em] uppercase">
                {nav.floorPlanLabel}
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label={nav.floorPlanClose}
                className="rounded px-2 py-1 text-xs text-muted transition hover:text-ink"
              >
                {nav.floorPlanClose}
              </button>
            </div>

            {/* The map: a vertical sequence mirroring the museum path.
                Each element staggers in top-to-bottom, tracing the visitor's
                path through the building. */}
            <motion.nav
              aria-label={nav.label}
              className="flex flex-col gap-1"
              initial="closed"
              animate="open"
              variants={{
                closed: {},
                open: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
              }}
            >
              {/* Entrance */}
              <FloorPlanLink
                href="/"
                label={nav.entranceLabel}
                here={isHere("/")}
                onClick={onClose}
              />

              {/* Connecting line */}
              <motion.div
                className="mx-auto h-4 w-px bg-frame/40"
                aria-hidden
                variants={{ closed: { scaleY: 0 }, open: { scaleY: 1 } }}
                transition={{ duration: 0.2 }}
              />

              {/* Hall */}
              <FloorPlanLink
                href="/museum"
                label={nav.hallLabel}
                here={isHere("/museum")}
                onClick={onClose}
              />

              {/* Rooms branch from the hall */}
              <div className="relative ml-4 flex flex-col gap-1 border-l border-frame/40 pl-4">
                {exhibits.map((exhibit) => {
                  const path = roomPath(exhibit.slug);
                  return (
                    <FloorPlanLink
                      key={exhibit.slug}
                      href={path}
                      label={exhibit.name}
                      here={isHere(path)}
                      featured={exhibit.featured}
                      onClick={() => {
                        if (pathname === "/museum") beginMorph(exhibit.slug);
                        onClose();
                      }}
                    />
                  );
                })}
              </div>

              {/* Connecting line */}
              <motion.div
                className="mx-auto h-4 w-px bg-frame/40"
                aria-hidden
                variants={{ closed: { scaleY: 0 }, open: { scaleY: 1 } }}
                transition={{ duration: 0.2 }}
              />

              {/* Exit */}
              <FloorPlanLink
                href="/exit"
                label="Exit"
                here={isHere("/exit")}
                onClick={onClose}
              />
            </motion.nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function FloorPlanLink({
  href,
  label,
  here,
  featured,
  onClick,
}: {
  href: string;
  label: string;
  here: boolean;
  featured?: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      variants={{
        closed: { opacity: 0, x: -6 },
        open: { opacity: 1, x: 0 },
      }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
    <Link
      href={href}
      onClick={(e) => {
        if (here) e.preventDefault();
        onClick();
      }}
      aria-current={here ? "page" : undefined}
      className={`group flex items-center gap-3 rounded px-3 py-2 text-sm transition ${
        here
          ? "bg-wall font-medium text-ink"
          : "text-muted hover:bg-wall/60 hover:text-ink"
      }`}
    >
      {/* Location dot — pulses gently when it marks the current room */}
      <span
        className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
          here
            ? "bg-gold animate-[dot-breathe_2.4s_ease-in-out_infinite]"
            : featured
              ? "bg-gold/40"
              : "bg-frame/50"
        }`}
        aria-hidden
      />
      <span>{label}</span>
      {here && (
        <span className="ml-auto text-xs text-gold">{nav.youAreHere}</span>
      )}
    </Link>
    </motion.div>
  );
}
