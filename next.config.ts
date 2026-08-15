import type { NextConfig } from "next";

/**
 * View transitions need no config flag as of Next 16.3 — `experimental.viewTransition`
 * was removed, and the App Router enables React's <ViewTransition> integration by
 * default. It is what carries a painting from the hall into its exhibit page as one
 * object.
 *
 * This version of Next still does not alias `react` to its own vendored build, so the
 * app depends on react/react-dom at `experimental` directly for the ViewTransition
 * export. Both must move together, and pinning react back to a stable release will
 * leave the import resolving to nothing.
 */
const nextConfig: NextConfig = {};

export default nextConfig;
