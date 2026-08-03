"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Exit() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-1 flex-col items-center justify-center gap-6 bg-black px-6 py-16 text-center text-[#ede9e1]"
    >
      <h1 className="text-3xl">Thanks for visiting</h1>
      <p className="max-w-md text-[#a39d92]">
        That concludes the walkthrough. Come back again whenever you like.
      </p>
      <Link
        href="/"
        className="rounded border border-gold px-6 py-3 text-sm text-gold transition hover:scale-105"
      >
        Return to Entrance
      </Link>
    </motion.main>
  );
}
