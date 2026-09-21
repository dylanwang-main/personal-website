"use client";

import { useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark"),
  );

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="shrink-0 rounded-full border border-frame bg-panel/70 px-3 py-2.5 text-xs whitespace-nowrap text-ink transition hover:scale-105"
      suppressHydrationWarning
    >
      {isDark ? "Light mode" : "Dark mode"}
    </button>
  );
}
