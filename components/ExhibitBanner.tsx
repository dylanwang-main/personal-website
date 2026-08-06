"use client";

import { useEffect, useState, ViewTransition } from "react";
import Canvas from "@/components/Canvas";
import { canvasName, disarmPushIn, usePushIn } from "@/components/PushIn";
import { PUSH_DURATION, PUSH_SETTLE } from "@/lib/motion";
import type { Exhibit } from "@/content/content";

/**
 * The room's artwork at the top of its page: the far side of the push-in.
 *
 * It carries the same `view-transition-name` as the canvas that was clicked in
 * the hall, which is the whole of the morph — the browser interpolates one box
 * into the other. Nothing here animates on its own; the surrounding heading and
 * body are part of the root snapshot and arrive on a delay, so the move reads as
 * landing first and reading second.
 *
 * No frame around it, deliberately. The moulding belongs to the wall the visitor
 * just walked through, and it is left behind with the rest of the hall.
 */
export default function ExhibitBanner({
  exhibit,
  sizes,
}: {
  exhibit: Exhibit;
  /** Passed to next/image. The two exhibit layouts run at different widths. */
  sizes: string;
}) {
  const pushIn = usePushIn();

  /**
   * Latched at first render rather than read live. The name may only be present
   * for the navigation that is actually a push-in — a direct load or a header
   * link has no canvas on the other side to morph from — but it also must not
   * disappear while the transition is still running, which is what would happen
   * if this tracked the context after it is torn down below.
   */
  const [arrived] = useState(() => pushIn.slug === exhibit.slug);

  useEffect(() => {
    if (!arrived) return;

    // Released as soon as this page is mounted, not when the animation ends. Its
    // only reader is PageTransition, which has already stood down for this render,
    // and holding it any longer is actively dangerous: a visitor who goes back to
    // the hall mid-push would arrive with a slug still set, and the hall walks
    // into whatever slug it is handed.
    pushIn.end();

    // The attribute has to outlive that, because it is what scopes the CSS to
    // this one navigation, and the transition offers no completion callback to
    // hang it off — hence the same two constants the CSS is written in.
    //
    // Deliberately not cleared on unmount. Its whole job is to tidy up a document
    // attribute, and it has to finish whether or not this component is still
    // around — a visitor who leaves inside the first 680ms would otherwise leave
    // the push armed for whatever they navigate to next. That also makes it safe
    // under Strict Mode, which runs this effect twice in development: two timers
    // that both remove the same attribute are indistinguishable from one.
    setTimeout(disarmPushIn, (PUSH_DURATION + PUSH_SETTLE) * 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrived]);

  const canvas = (
    <Canvas
      image={exhibit.cover}
      sizes={sizes}
      className="w-full"
      style={{ height: "clamp(200px, 40svh, 400px)" }}
    />
  );

  if (!arrived) return canvas;

  return (
    <ViewTransition name={canvasName(exhibit.slug)} share="canvas" default="none">
      {canvas}
    </ViewTransition>
  );
}
