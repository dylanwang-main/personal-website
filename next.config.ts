import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    /**
     * Enables React's <ViewTransition> integration on route navigation, which is
     * what carries a painting from the hall into its exhibit page as one object.
     *
     * React 19.2 stable does not export ViewTransition and this version of Next
     * does not alias `react` to its own vendored experimental build (see
     * next/dist/lib/needs-experimental-react.js — the flag is not in the list),
     * so the app depends on react/react-dom at `experimental` directly. Both must
     * move together, and dropping this flag without also pinning react back to a
     * stable release will leave the import resolving to nothing.
     */
    viewTransition: true,
  },
};

export default nextConfig;
