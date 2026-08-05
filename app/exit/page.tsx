import Link from "next/link";
import { exitScreen } from "@/content/content";

/** No entry animation here: PageTransition owns route entry for every page. */
export default function Exit() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-black px-6 py-16 text-center text-[#ede9e1]">
      <h1 className="text-3xl">{exitScreen.heading}</h1>
      <p className="max-w-md text-[#a39d92]">{exitScreen.body}</p>
      <Link
        href="/"
        className="rounded border border-gold px-6 py-3 text-sm text-gold transition hover:scale-105"
      >
        {exitScreen.returnLabel}
      </Link>
    </main>
  );
}
