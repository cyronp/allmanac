import { INITIAL_GOALS } from "./goals.data";
import type { Goal, GoalUpdater } from "./goals.types";
import { isGoal } from "./goals.utils";

const GOALS_STORAGE_KEY = "allmanac-goals";

let goalsSnapshot = INITIAL_GOALS;
let storeInitialized = false;
const listeners = new Set<() => void>();

function parseGoals(value: string | null): Goal[] | null {
  if (!value) return null;

  try {
    const parsedValue: unknown = JSON.parse(value);
    return Array.isArray(parsedValue) && parsedValue.every(isGoal)
      ? parsedValue
      : null;
  } catch {
    return null;
  }
}

export function getGoalsSnapshot() {
  if (typeof window === "undefined" || storeInitialized) return goalsSnapshot;

  storeInitialized = true;

  try {
    goalsSnapshot =
      parseGoals(window.localStorage.getItem(GOALS_STORAGE_KEY)) ??
      goalsSnapshot;
  } catch {
    // Keep the in-memory snapshot when browser storage is unavailable.
  }

  return goalsSnapshot;
}

export function getServerGoalsSnapshot() {
  return INITIAL_GOALS;
}

export function subscribeToGoals(listener: () => void) {
  listeners.add(listener);

  function syncFromAnotherTab(event: StorageEvent) {
    if (event.key !== GOALS_STORAGE_KEY) return;

    const storedGoals = parseGoals(event.newValue);
    if (!storedGoals) return;

    goalsSnapshot = storedGoals;
    listeners.forEach((notify) => notify());
  }

  window.addEventListener("storage", syncFromAnotherTab);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", syncFromAnotherTab);
  };
}

export function updateGoals(update: GoalUpdater) {
  goalsSnapshot = update(getGoalsSnapshot());

  try {
    window.localStorage.setItem(
      GOALS_STORAGE_KEY,
      JSON.stringify(goalsSnapshot),
    );
  } catch {
    // The in-memory store still works when browser storage is unavailable.
  }

  listeners.forEach((listener) => listener());
}
