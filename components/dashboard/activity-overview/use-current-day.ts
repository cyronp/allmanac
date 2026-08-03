"use client";

import { useCallback, useSyncExternalStore } from "react";
import { format } from "date-fns";

const getCurrentDay = () => format(new Date(), "yyyy-MM-dd");

function subscribeToCurrentDay(onDayChange: () => void) {
  const intervalId = window.setInterval(onDayChange, 60_000);
  window.addEventListener("focus", onDayChange);

  return () => {
    window.clearInterval(intervalId);
    window.removeEventListener("focus", onDayChange);
  };
}

export function useCurrentDay(initialDate: string) {
  const getServerDay = useCallback(() => initialDate, [initialDate]);

  return useSyncExternalStore(
    subscribeToCurrentDay,
    getCurrentDay,
    getServerDay,
  );
}
