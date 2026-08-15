import type { NextConfig } from "next";

/**
 * Nothing to configure. `experimental.viewTransition` was removed in Next 16.3, and
 * the app no longer uses React's <ViewTransition> at all — a painting is carried from
 * the hall into its exhibit page by a framer shared layout animation instead. See
 * components/Morph.tsx.
 *
 * That leaves the react/react-dom `experimental` pin in package.json with nothing
 * depending on it: it was there for the ViewTransition export, which is no longer
 * imported anywhere. Moving back to a stable React should now be possible, and both
 * packages have to move together when it happens.
 */
const nextConfig: NextConfig = {};

export default nextConfig;
