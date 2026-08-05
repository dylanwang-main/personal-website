"use client";

import { useEffect, useRef } from "react";

let renders = 0;
let mounts = 0;

/** TEMPORARY diagnostic. Counts renders/mounts per page load. Delete after. */
export default function Probe({ where }: { where: string }) {
  renders += 1;
  const r = useRef(renders);
  console.log(`[probe] render #${renders} ${where}`);

  useEffect(() => {
    mounts += 1;
    console.log(`[probe] mount #${mounts} ${where} (render ${r.current})`);
    return () => console.log(`[probe] unmount ${where}`);
  }, [where]);

  return null;
}
