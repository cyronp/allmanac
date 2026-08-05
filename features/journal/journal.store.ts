import { EMPTY_JOURNAL_ENTRY } from "./journal.data";
import {
  moodValues,
  type JournalDayEntry,
  type JournalEntries,
  type JournalUpdater,
} from "./journal.types";

const JOURNAL_STORAGE_KEY = "allmanac-monthly-journal-v1";

let journalSnapshot: JournalEntries | undefined;
let storeInitialized = false;
const listeners = new Set<() => void>();

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isJournalEntry(value: unknown): value is JournalDayEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<JournalDayEntry>;

  return (
    typeof entry.bedtime === "string" &&
    typeof entry.wakeTime === "string" &&
    (entry.mood === null ||
      (typeof entry.mood === "string" &&
        moodValues.includes(entry.mood as JournalDayEntry["mood"] & string))) &&
    isStringArray(entry.completedHabitIds) &&
    isStringArray(entry.completedGoalIds)
  );
}

function parseJournal(value: string | null): JournalEntries | null {
  if (!value) return null;

  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;

    const entries = Object.entries(parsed);
    if (
      !entries.every(
        ([dateKey, entry]) =>
          /^\d{4}-\d{2}-\d{2}$/.test(dateKey) && isJournalEntry(entry),
      )
    ) {
      return null;
    }

    return parsed as JournalEntries;
  } catch {
    return null;
  }
}

export function getJournalSnapshot(initialEntries: JournalEntries) {
  if (typeof window === "undefined") return initialEntries;
  if (storeInitialized) return journalSnapshot ?? initialEntries;

  storeInitialized = true;
  try {
    journalSnapshot =
      parseJournal(window.localStorage.getItem(JOURNAL_STORAGE_KEY)) ??
      initialEntries;
  } catch {
    journalSnapshot = initialEntries;
  }

  return journalSnapshot;
}

export function subscribeToJournal(listener: () => void) {
  listeners.add(listener);

  function syncFromAnotherTab(event: StorageEvent) {
    if (event.key !== JOURNAL_STORAGE_KEY) return;

    const storedJournal = parseJournal(event.newValue);
    if (!storedJournal) return;

    journalSnapshot = storedJournal;
    listeners.forEach((notify) => notify());
  }

  window.addEventListener("storage", syncFromAnotherTab);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", syncFromAnotherTab);
  };
}

export function updateJournal(
  initialEntries: JournalEntries,
  update: JournalUpdater,
) {
  journalSnapshot = update(getJournalSnapshot(initialEntries));

  try {
    window.localStorage.setItem(
      JOURNAL_STORAGE_KEY,
      JSON.stringify(journalSnapshot),
    );
  } catch {
    // The in-memory snapshot still supports the current session.
  }

  listeners.forEach((listener) => listener());
}

export function copyEntry(entry?: JournalDayEntry): JournalDayEntry {
  const source = entry ?? EMPTY_JOURNAL_ENTRY;
  return {
    ...source,
    completedHabitIds: [...source.completedHabitIds],
    completedGoalIds: [...source.completedGoalIds],
  };
}

