import { INITIAL_HABITS } from "./habits.data";
import type { Habit, HabitUpdater } from "./habits.types";
import { isHabit } from "./habits.utils";

const HABITS_STORAGE_KEY = "allmanac-habits";

let habitsSnapshot = INITIAL_HABITS;
let storeInitialized = false;
const listeners = new Set<() => void>();

function parseHabits(value: string | null): Habit[] | null {
  if (!value) return null;

  try {
    const parsedValue: unknown = JSON.parse(value);
    return Array.isArray(parsedValue) && parsedValue.every(isHabit)
      ? parsedValue
      : null;
  } catch {
    return null;
  }
}

export function getHabitsSnapshot() {
  if (typeof window === "undefined" || storeInitialized) {
    return habitsSnapshot;
  }

  storeInitialized = true;
  try {
    habitsSnapshot =
      parseHabits(window.localStorage.getItem(HABITS_STORAGE_KEY)) ??
      habitsSnapshot;
  } catch {
    // Use the in-memory snapshot when browser storage is unavailable.
  }

  return habitsSnapshot;
}

export function getServerHabitsSnapshot() {
  return INITIAL_HABITS;
}

export function subscribeToHabits(listener: () => void) {
  listeners.add(listener);

  function syncFromAnotherTab(event: StorageEvent) {
    if (event.key !== HABITS_STORAGE_KEY) return;

    const storedHabits = parseHabits(event.newValue);
    if (!storedHabits) return;

    habitsSnapshot = storedHabits;
    listeners.forEach((notify) => notify());
  }

  window.addEventListener("storage", syncFromAnotherTab);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", syncFromAnotherTab);
  };
}

export function updateHabits(update: HabitUpdater) {
  habitsSnapshot = update(getHabitsSnapshot());

  try {
    window.localStorage.setItem(
      HABITS_STORAGE_KEY,
      JSON.stringify(habitsSnapshot),
    );
  } catch {
    // The in-memory store still works when browser storage is unavailable.
  }

  listeners.forEach((listener) => listener());
}
