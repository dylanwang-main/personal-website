"use client";

import { useState } from "react";

/**
 * Theme toggle. Dark is the default world; light is the alternative.
 * The toggle adds/removes the `light` class on <html>.
 */
export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("light"),
  );

  function toggle() {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.classList.toggle("light", next);
    localStorage.setItem("theme", next ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light mode"
      data-cursor="switch"
      className="shrink-0 rounded-full border border-frame bg-panel/70 px-3 py-2.5 text-xs whitespace-nowrap text-ink transition hover:scale-105"
      suppressHydrationWarning
    >
      {isLight ? "Dark mode" : "Light mode"}
    </button>
  );
}
