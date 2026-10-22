"use client";

import * as React from "react";

// One shared clock, rounded to the minute, ticking for as long as something is subscribed.
const MINUTE = 60_000;
const listeners = new Set<() => void>();
let now = 0;
let timer: ReturnType<typeof setInterval> | undefined;

const read = () => Math.floor(Date.now() / MINUTE) * MINUTE;

function subscribe(listener: () => void) {
  listeners.add(listener);
  // React re-reads the snapshot right after subscribing, so a fresh value here is picked up
  if (!timer) now = read();
  timer ??= setInterval(() => {
    const next = read();
    if (next === now) return;
    now = next;
    listeners.forEach((l) => l());
  }, MINUTE / 4);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

function getSnapshot() {
  // nothing subscribed means nothing keeps `now` fresh, so read the clock again
  if (listeners.size === 0 || now === 0) now = read();
  return now;
}

const getServerSnapshot = () => null;

/**
 * The current time, or null on the server and during hydration. Rendering "today",
 * overdue states and relative times only on the client keeps prerendered HTML
 * (Next.js cacheComponents) free of a clock reading and avoids hydration mismatches.
 */
function useNow(): Date | null {
  const t = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return React.useMemo(() => (t === null ? null : new Date(t)), [t]);
}

export { useNow };
