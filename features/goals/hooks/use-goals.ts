"use client";

import { useSyncExternalStore } from "react";

import {
  getGoalsSnapshot,
  getServerGoalsSnapshot,
  subscribeToGoals,
  updateGoals,
} from "../goals.store";

export function useGoals() {
  const goals = useSyncExternalStore(
    subscribeToGoals,
    getGoalsSnapshot,
    getServerGoalsSnapshot,
  );

  return { goals, updateGoals };
}
