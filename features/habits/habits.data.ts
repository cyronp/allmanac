import type { Habit, HabitDraft } from "./habits.types";

export const INITIAL_HABITS: Habit[] = [
  {
    id: "deep-work",
    name: "Deep work",
    category: "work",
    days: [0, 1, 2, 3, 4],
    startTime: "09:00",
    endTime: "12:00",
  },
  {
    id: "morning-stretch",
    name: "Morning stretch",
    category: "fitness",
    days: [0, 1, 2, 3, 4, 5, 6],
    startTime: "07:30",
    endTime: "07:45",
  },
  {
    id: "read-before-bed",
    name: "Read before bed",
    category: "reading",
    days: [0, 1, 2, 3, 4, 5, 6],
    startTime: "21:00",
    endTime: "21:30",
  },
];

export const RECOMMENDED_HABITS: HabitDraft[] = [
  {
    name: "Work",
    category: "work",
    days: [0, 1, 2, 3, 4],
    startTime: "09:00",
    endTime: "12:00",
  },
  {
    name: "Sleep routine",
    category: "sleep",
    days: [0, 1, 2, 3, 4, 5, 6],
    startTime: "23:00",
    endTime: "07:00",
  },
  {
    name: "Study time",
    category: "school",
    days: [0, 1, 2, 3, 4],
    startTime: "16:00",
    endTime: "18:00",
  },
  {
    name: "Exercise",
    category: "fitness",
    days: [0, 2, 4],
    startTime: "18:30",
    endTime: "19:30",
  },
  {
    name: "Daily reading",
    category: "reading",
    days: [0, 1, 2, 3, 4, 5, 6],
    startTime: "21:00",
    endTime: "21:30",
  },
];

export const EMPTY_HABIT: HabitDraft = {
  name: "",
  category: "others",
  days: [0, 1, 2, 3, 4, 5, 6],
  startTime: "08:00",
  endTime: "08:30",
};
