"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ExhibitReveal({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <motion.main
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="flex flex-1 flex-col items-center gap-8 px-6 py-16 text-center"
    >
      <h1 className="text-3xl">{name}</h1>
      <p className="max-w-xl text-muted">{description}</p>
      <Link
        href="/museum"
        className="rounded border border-frame px-6 py-3 transition hover:scale-105"
      >
        Back to Museum
      </Link>
    </motion.main>
  );
}
