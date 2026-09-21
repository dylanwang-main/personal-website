import Link from "next/link";
import ExitGlow from "@/components/ExitGlow";
import { exitScreen } from "@/content/content";

/** No entry animation here: PageTransition owns route entry for every page. */
export default function Exit() {
  return (
    // bg-black is intentional: the exit is a void, not a themed surface.
    // Text tokens still respond to the theme system.
    <main className="relative flex flex-1 flex-col items-center justify-center gap-6 bg-black px-6 py-16 text-center text-ink">
      <ExitGlow />
      <h1 className="relative text-3xl">{exitScreen.heading}</h1>
      <p className="relative max-w-md text-muted">{exitScreen.body}</p>
      <Link
        href="/"
        className="relative rounded border border-gold px-6 py-3 text-sm text-gold transition hover:scale-105"
      >
        {exitScreen.returnLabel}
      </Link>
    </main>
  );
}
