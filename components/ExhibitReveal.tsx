import Link from "next/link";
import { exhibitPage } from "@/content/content";

/**
 * Route entry is animated once, centrally, by PageTransition. This page adds no
 * entry animation of its own — a second one stacked on top read as the
 * transition playing twice.
 */
export default function ExhibitReveal({
  name,
  body,
}: {
  name: string;
  body: string;
}) {
  return (
    <main className="flex flex-1 flex-col items-center gap-8 px-6 py-16 text-center">
      <h1 className="text-3xl">{name}</h1>
      <p className="max-w-xl text-muted">{body}</p>
      <Link
        href="/museum"
        className="rounded border border-frame px-6 py-3 transition hover:scale-105"
      >
        {exhibitPage.backLabel}
      </Link>
    </main>
  );
}
