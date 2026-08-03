export const habitCategories = [
  "work",
  "sleep",
  "school",
  "fitness",
  "reading",
  "others",
] as const;

export type HabitCategory = (typeof habitCategories)[number];

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  days: number[];
  startTime: string;
  endTime: string;
}

export type HabitDraft = Omit<Habit, "id">;

export type HabitUpdater = (current: Habit[]) => Habit[];
