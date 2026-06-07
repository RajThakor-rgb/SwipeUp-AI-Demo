"use client";

import { useEffect, useState } from "react";

/** A live clock that ticks every second — used by the lock screen and menu bar. */
export function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}
