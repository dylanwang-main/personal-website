import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-12 px-6 py-16">
      <div className="grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex h-64 items-center justify-center border border-neutral-300 bg-neutral-100 text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400">
          Photo
        </div>
        <div className="flex flex-col justify-center gap-4">
          <h1 className="text-2xl font-semibold">About Me</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Placeholder paragraph about me. This space will eventually hold a
            short introduction, a bit of background, and whatever else feels
            worth sharing before stepping into the museum.
          </p>
        </div>
      </div>

      <Link
        href="/museum"
        className="border border-neutral-300 px-10 py-4 text-lg font-medium transition hover:scale-105 dark:border-neutral-700"
      >
        Enter
      </Link>
    </main>
  );
}
