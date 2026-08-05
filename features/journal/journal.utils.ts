import { format } from "date-fns";

import type { Goal } from "@/features/goals/goals.types";
import type { Habit } from "@/features/habits/habits.types";

import { MOOD_OPTIONS } from "./journal.data";
import type { JournalDayEntry, JournalEntries, Mood } from "./journal.types";

export interface JournalCalendarDay {
  date: Date;
  dateKey: string;
  dayNumber: number;
}

export interface ConsistencyDataPoint {
  day: number;
  label: string;
  habits: number | null;
  goals: number | null;
}

export interface WellbeingDataPoint {
  day: number;
  label: string;
  sleep: number | null;
  mood: number | null;
  moodLabel: string | null;
}

function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }
  return hours * 60 + minutes;
}

export function getSleepHours(entry?: Pick<JournalDayEntry, "bedtime" | "wakeTime">) {
  if (!entry?.bedtime || !entry.wakeTime) return null;
  const bedtime = timeToMinutes(entry.bedtime);
  const wakeTime = timeToMinutes(entry.wakeTime);
  if (bedtime === null || wakeTime === null) return null;

  let duration = wakeTime - bedtime;
  if (duration <= 0) duration += 24 * 60;
  return duration / 60;
}

export function formatSleepDuration(hours: number | null) {
  if (hours === null) return "—";
  const totalMinutes = Math.round(hours * 60);
  const wholeHours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${wholeHours}:${String(minutes).padStart(2, "0")}`;
}

export function getMoodOption(mood: Mood | null | undefined) {
  return MOOD_OPTIONS.find((option) => option.value === mood);
}

export function getHabitDayIndex(date: Date) {
  return (date.getDay() + 6) % 7;
}

export function isHabitScheduled(habit: Habit, date: Date) {
  return habit.days.includes(getHabitDayIndex(date));
}

export function isGoalActive(goal: Goal, dateKey: string) {
  return goal.startsOn <= dateKey && (!goal.endsOn || goal.endsOn >= dateKey);
}

export function buildConsistencyData(
  days: JournalCalendarDay[],
  entries: JournalEntries,
  habits: Habit[],
  goals: Goal[],
  today: string,
): ConsistencyDataPoint[] {
  return days
    .filter((day) => day.dateKey <= today)
    .map((day) => {
      const entry = entries[day.dateKey];
      const scheduledHabits = habits.filter((habit) =>
        isHabitScheduled(habit, day.date),
      );
      const activeGoals = goals.filter((goal) => isGoalActive(goal, day.dateKey));
      const completedHabits = scheduledHabits.filter((habit) =>
        entry?.completedHabitIds.includes(habit.id),
      ).length;
      const completedGoals = activeGoals.filter((goal) =>
        entry?.completedGoalIds.includes(goal.id),
      ).length;

      return {
        day: day.dayNumber,
        label: format(day.date, "MMM d"),
        habits:
          scheduledHabits.length > 0
            ? Math.round((completedHabits / scheduledHabits.length) * 100)
            : null,
        goals:
          activeGoals.length > 0
            ? Math.round((completedGoals / activeGoals.length) * 100)
            : null,
      };
    });
}

export function buildWellbeingData(
  days: JournalCalendarDay[],
  entries: JournalEntries,
  today: string,
): WellbeingDataPoint[] {
  return days.flatMap((day) => {
    if (day.dateKey > today) return [];
    const entry = entries[day.dateKey];
    if (!entry) return [];
    const mood = getMoodOption(entry.mood);
    const sleep = getSleepHours(entry);
    if (sleep === null && !mood) return [];

    return [
      {
        day: day.dayNumber,
        label: format(day.date, "MMM d"),
        sleep: sleep === null ? null : Math.round(sleep * 100) / 100,
        mood: mood?.score ?? null,
        moodLabel: mood?.label ?? null,
      },
    ];
  });
}

export function buildJournalStats(
  days: JournalCalendarDay[],
  entries: JournalEntries,
  habits: Habit[],
  goals: Goal[],
  today: string,
) {
  const elapsedDays = days.filter((day) => day.dateKey <= today);
  const sleepValues = elapsedDays.flatMap((day) => {
    const sleep = getSleepHours(entries[day.dateKey]);
    return sleep === null ? [] : [sleep];
  });
  const moodValues = elapsedDays.flatMap((day) => {
    const mood = getMoodOption(entries[day.dateKey]?.mood);
    return mood ? [mood.score] : [];
  });

  let completed = 0;
  let expected = 0;
  for (const day of elapsedDays) {
    const entry = entries[day.dateKey];
    const scheduledHabits = habits.filter((habit) =>
      isHabitScheduled(habit, day.date),
    );
    const activeGoals = goals.filter((goal) => isGoalActive(goal, day.dateKey));
    expected += scheduledHabits.length + activeGoals.length;
    completed += scheduledHabits.filter((habit) =>
      entry?.completedHabitIds.includes(habit.id),
    ).length;
    completed += activeGoals.filter((goal) =>
      entry?.completedGoalIds.includes(goal.id),
    ).length;
  }

  return {
    averageSleep:
      sleepValues.length > 0
        ? Math.round(
            (sleepValues.reduce((sum, value) => sum + value, 0) /
              sleepValues.length) *
              10,
          ) / 10
        : null,
    averageMood:
      moodValues.length > 0
        ? moodValues.reduce((sum, value) => sum + value, 0) / moodValues.length
        : null,
    checkIns: elapsedDays.filter((day) => {
      const entry = entries[day.dateKey];
      return Boolean(entry?.mood || getSleepHours(entry) !== null);
    }).length,
    elapsedDayCount: elapsedDays.length,
    consistency: expected > 0 ? Math.round((completed / expected) * 100) : 0,
  };
}
