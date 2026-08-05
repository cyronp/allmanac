export const moodValues = [
  "stressed",
  "bad",
  "meh",
  "good",
  "happy",
] as const;

export type Mood = (typeof moodValues)[number];

export interface JournalDayEntry {
  bedtime: string;
  wakeTime: string;
  mood: Mood | null;
  completedHabitIds: string[];
  completedGoalIds: string[];
}

export type JournalEntries = Record<string, JournalDayEntry>;
export type JournalUpdater = (current: JournalEntries) => JournalEntries;
export type CompletionKind = "habit" | "goal";

