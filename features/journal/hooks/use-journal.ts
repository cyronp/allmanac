"use client";

import { useCallback, useSyncExternalStore } from "react";

import {
  getJournalSnapshot,
  subscribeToJournal,
  updateJournal,
} from "../journal.store";
import type { JournalEntries, JournalUpdater } from "../journal.types";

export function useJournal(initialEntries: JournalEntries) {
  const getSnapshot = useCallback(
    () => getJournalSnapshot(initialEntries),
    [initialEntries],
  );
  const getServerSnapshot = useCallback(() => initialEntries, [initialEntries]);

  const entries = useSyncExternalStore(
    subscribeToJournal,
    getSnapshot,
    getServerSnapshot,
  );

  const updateEntries = useCallback(
    (update: JournalUpdater) => updateJournal(initialEntries, update),
    [initialEntries],
  );

  return { entries, updateEntries };
}

