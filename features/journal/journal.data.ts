import { format, getDaysInMonth, parseISO } from "date-fns";

import type { Goal } from "@/features/goals/goals.types";
import type { Habit } from "@/features/habits/habits.types";

import type { JournalDayEntry, JournalEntries, Mood } from "./journal.types";

export const EMPTY_JOURNAL_ENTRY: JournalDayEntry = {
  bedtime: "",
  wakeTime: "",
  mood: null,
  completedHabitIds: [],
  completedGoalIds: [],
};

export const MOOD_OPTIONS: Array<{
  value: Mood;
  label: string;
  score: number;
  color: string;
  className: string;
}> = [
  {
    value: "stressed",
    label: "Stressed",
    score: 1,
    color: "#fb7185",
    className:
      "border-rose-400/30 bg-rose-400/10 text-rose-600 dark:text-rose-300",
  },
  {
    value: "bad",
    label: "Bad",
    score: 2,
    color: "#fb923c",
    className:
      "border-orange-400/30 bg-orange-400/10 text-orange-600 dark:text-orange-300",
  },
  {
    value: "meh",
    label: "Meh",
    score: 3,
    color: "#facc15",
    className:
      "border-yellow-400/30 bg-yellow-400/10 text-yellow-700 dark:text-yellow-300",
  },
  {
    value: "good",
    label: "Happy",
    score: 4,
    color: "#84cc16",
    className:
      "border-lime-400/30 bg-lime-400/10 text-lime-700 dark:text-lime-300",
  },
  {
    value: "happy",
    label: "Very happy",
    score: 5,
    color: "#22c55e",
    className:
      "border-emerald-400/30 bg-emerald-400/10 text-emerald-700 dark:text-emerald-300",
  },
];

const sleepPattern = [7.7, 6.4, 8.2, 7.3, 5.9, 8.5, 7.9, 6.8, 7.1, 8.1];
const bedtimePattern = [23 * 60 + 10, 23 * 60 + 45, 22 * 60 + 55, 23 * 60 + 20, 0, 22 * 60 + 40];

function toClock(minutes: number) {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  const hour = Math.floor(normalized / 60);
  const minute = normalized % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function getHabitDayIndex(date: Date) {
  return (date.getDay() + 6) % 7;
}

function moodFromSleep(hours: number, day: number): Mood {
  if (hours < 6.2) return "stressed";
  if (hours < 6.8) return "bad";
  if (hours < 7.3) return day % 4 === 0 ? "good" : "meh";
  if (hours < 8) return "good";
  return "happy";
}

/**
 * Gives a new journal enough starter history to explain the visualization.
 * Once the user changes anything, the local store becomes the source of truth.
 */
export function createInitialJournalEntries(
  monthKey: string,
  today: string,
  habits: Habit[],
  goals: Goal[],
): JournalEntries {
  const monthStart = parseISO(`${monthKey}-01`);
  const lastTrackedDay =
    today.startsWith(monthKey) ? Number(today.slice(-2)) : getDaysInMonth(monthStart);
  const entries: JournalEntries = {};

  for (let day = 1; day <= lastTrackedDay; day += 1) {
    const date = new Date(
      monthStart.getFullYear(),
      monthStart.getMonth(),
      day,
      12,
    );
    const dateKey = format(date, "yyyy-MM-dd");
    const hours = sleepPattern[(day - 1) % sleepPattern.length];
    const bedtime = bedtimePattern[(day - 1) % bedtimePattern.length];
    const wakeTime = bedtime + Math.round(hours * 60);
    const habitDay = getHabitDayIndex(date);

    entries[dateKey] = {
      bedtime: toClock(bedtime),
      wakeTime: toClock(wakeTime),
      mood: moodFromSleep(hours, day),
      completedHabitIds: habits
        .filter(
          (habit, index) =>
            habit.days.includes(habitDay) && (day + index * 2) % 6 !== 0,
        )
        .map((habit) => habit.id),
      completedGoalIds: goals
        .filter(
          (goal, index) =>
            goal.startsOn <= dateKey &&
            (!goal.endsOn || goal.endsOn >= dateKey) &&
            (day + index) % 4 !== 0,
        )
        .map((goal) => goal.id),
    };
  }

  return entries;
}

