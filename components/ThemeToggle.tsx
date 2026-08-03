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
      className="fixed bottom-4 right-4 z-50 rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-900 shadow-sm transition hover:scale-105 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
      suppressHydrationWarning
    >
      {isDark ? "Light mode" : "Dark mode"}
    </button>
  );
}
