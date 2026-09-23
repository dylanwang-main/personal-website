"use client";

import Link from "next/link";
import { beginMorph } from "@/components/Morph";

/**
 * Back to the hall, and the return leg of the morph.
 *
 * The frame flies home on its own — the hall renders the same `layoutId` this
 * page does, so the pairing happens whichever direction the visitor is going.
 * All this adds is the flag marking the navigation as a morph, so PageTransition
 * stands down and does not fade the hall in over a frame that is still landing
 * on the wall. See Morph.
 *
 * Only ever back to the hall. The entrance is one-way: there is no route from a
 * room to the door, by design.
 */
export default function BackToHall({
  slug,
  className = "",
  style,
  children,
}: {
  /** The room being left, so the flag names the frame that is flying. */
  slug: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <Link
      href="/museum"
      onClick={() => beginMorph(slug)}
      data-cursor="return"
      className={className}
      style={style}
    >
      {children}
    </Link>
  );
}
