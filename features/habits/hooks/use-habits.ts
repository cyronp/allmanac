"use client";

import { useSyncExternalStore } from "react";

import {
  getHabitsSnapshot,
  getServerHabitsSnapshot,
  subscribeToHabits,
  updateHabits,
} from "../habits.store";

export function useHabits() {
  const habits = useSyncExternalStore(
    subscribeToHabits,
    getHabitsSnapshot,
    getServerHabitsSnapshot,
  );

  return { habits, updateHabits };
}
