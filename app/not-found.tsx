import Link from "next/link";

/**
 * Custom 404 page in the museum's visual language. A visitor who arrives at a
 * nonexistent route sees a black void (matching the exit screen) with a way
 * back to the entrance, not the framework's default unstyled page.
 */
export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center text-ink" style={{ background: "var(--wall)" }}>
      <h1 className="text-3xl">Nothing here</h1>
      <p className="max-w-md text-muted">
        Wrong turn. Head back and try again.
      </p>
      <Link
        href="/"
        className="rounded border border-gold px-6 py-3 text-sm text-gold transition hover:scale-105"
      >
        Return to Entrance
      </Link>
    </main>
  );
}
