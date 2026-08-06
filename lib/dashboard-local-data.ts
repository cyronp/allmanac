import type { DashboardDatabase } from "@/app/types/dashboard-data";
import type { Goal } from "@/features/goals/goals.types";
import type { Habit, HabitCategory } from "@/features/habits/habits.types";
import type { JournalEntries } from "@/features/journal/journal.types";

const HABIT_APPEARANCE: Record<HabitCategory, { color: string; emoji: string }> = {
  work: { color: "#3B82F6", emoji: "💼" },
  sleep: { color: "#8B5CF6", emoji: "🌙" },
  school: { color: "#F59E0B", emoji: "🎓" },
  fitness: { color: "#F43F5E", emoji: "🏋️" },
  reading: { color: "#10B981", emoji: "📖" },
  others: { color: "#84CC16", emoji: "✨" },
};

function getGoalProgress(goal: Goal, entries: JournalEntries, today: string) {
  const trackedDates = Object.keys(entries).filter(
    (date) => date <= today && date >= goal.startsOn && (!goal.endsOn || date <= goal.endsOn),
  );
  if (trackedDates.length === 0) return 0;

  const completed = trackedDates.filter((date) =>
    entries[date]?.completedGoalIds.includes(goal.id),
  ).length;
  return Math.round((completed / trackedDates.length) * 100);
}

/** Adapts the feature stores to the scheduling model used by the dashboard. */
export function buildLocalDashboardDatabase(
  habits: Habit[],
  goals: Goal[],
  entries: JournalEntries,
  today: string,
): DashboardDatabase {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const habitActivities = habits.map((habit) => ({
    id: habit.id,
    userId: "local-user",
    type: "commitment" as const,
    title: habit.name,
    description: "Habit",
    chosenColor: HABIT_APPEARANCE[habit.category].color,
    chosenEmoji: HABIT_APPEARANCE[habit.category].emoji,
    isActive: true,
  }));
  const goalActivities = goals.map((goal) => ({
    id: goal.id,
    userId: "local-user",
    type: "goal" as const,
    title: goal.title,
    description: goal.description,
    chosenColor: goal.color,
    chosenEmoji: goal.emoji,
    progressPercentage: getGoalProgress(goal, entries, today),
    isActive: true,
  }));
  const habitSchedules = habits.map((habit) => ({
    id: `habit-schedule-${habit.id}`,
    activityId: habit.id,
    timezone,
    startsOn: "2020-01-01",
    endsOn: null,
    recurrence: {
      frequency: "weekly" as const,
      interval: 1,
      // Habit days are Monday-first; schedules use Date#getDay (Sunday-first).
      daysOfWeek: habit.days.map((day) => (day + 1) % 7),
    },
    excludedDates: [],
    timeBlocks: [{
      id: `habit-time-${habit.id}`,
      startTime: habit.startTime,
      endTime: habit.endTime,
      position: 1,
    }],
  }));
  const goalSchedules = goals.map((goal) => ({
    id: `goal-schedule-${goal.id}`,
    activityId: goal.id,
    timezone,
    startsOn: goal.startsOn,
    endsOn: goal.endsOn,
    recurrence: { frequency: "daily" as const, interval: 1, daysOfWeek: [] },
    excludedDates: [],
    // Goals are daily tracked items without a user-defined timeline time.
    timeBlocks: [{
      id: `goal-tracking-${goal.id}`,
      startTime: "00:00",
      endTime: "00:00",
      position: 1,
    }],
  }));
  const activityCompletions = Object.entries(entries).flatMap(
    ([completedOn, entry]) => [
      ...entry.completedHabitIds.map((activityId) => ({
        id: `${completedOn}-habit-${activityId}`,
        activityId,
        completedOn,
      })),
      ...entry.completedGoalIds.map((activityId) => ({
        id: `${completedOn}-goal-${activityId}`,
        activityId,
        completedOn,
      })),
    ],
  );

  return {
    schemaVersion: 2,
    users: [{
      id: "local-user",
      name: "Cyronp",
      description: "Dashboard owner.",
      timezone,
    }],
    activities: [...habitActivities, ...goalActivities],
    schedules: [...habitSchedules, ...goalSchedules],
    activityCompletions,
  };
}
