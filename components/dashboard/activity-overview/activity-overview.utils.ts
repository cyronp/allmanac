import { endOfMonth, format, startOfMonth } from "date-fns";

import type { DashboardDatabase } from "@/app/types/dashboard-data";
import type {
  CompletionOverrides,
  DayGoal,
  DayProgress,
  GoalConsistencyDatum,
} from "@/components/dashboard/activity-overview/activity-overview.types";
import { getActivityOccurrences } from "@/lib/dashboard-schedule";

function parseCompletionOverrideKey(overrideKey: string) {
  const separatorIndex = overrideKey.indexOf(":");

  return {
    activityId: overrideKey.slice(separatorIndex + 1),
    dateKey: overrideKey.slice(0, separatorIndex),
  };
}

export function getCompletionOverrideKey(
  dateKey: string,
  activityId: string,
) {
  return `${dateKey}:${activityId}`;
}

export function buildMonthlyProgress(
  database: DashboardDatabase,
  days: Date[],
  monthStart: Date,
  monthEnd: Date,
  completionOverrides: CompletionOverrides,
) {
  const activitiesById = new Map(
    database.activities.map((activity) => [activity.id, activity]),
  );
  const scheduledByDate = new Map<string, Set<string>>();
  const completedByDate = new Map<string, Set<string>>();

  for (const occurrence of getActivityOccurrences(
    database,
    monthStart,
    monthEnd,
  )) {
    const scheduledActivities =
      scheduledByDate.get(occurrence.isoDate) ?? new Set<string>();
    scheduledActivities.add(occurrence.activityId);
    scheduledByDate.set(occurrence.isoDate, scheduledActivities);
  }

  for (const completion of database.activityCompletions) {
    const completedActivities =
      completedByDate.get(completion.completedOn) ?? new Set<string>();
    completedActivities.add(completion.activityId);
    completedByDate.set(completion.completedOn, completedActivities);
  }

  for (const [overrideKey, isCompleted] of Object.entries(
    completionOverrides,
  )) {
    const { activityId, dateKey } = parseCompletionOverrideKey(overrideKey);
    const completedActivities =
      completedByDate.get(dateKey) ?? new Set<string>();

    if (isCompleted) {
      completedActivities.add(activityId);
    } else {
      completedActivities.delete(activityId);
    }

    completedByDate.set(dateKey, completedActivities);
  }

  return new Map(
    days.map((day) => {
      const dateKey = format(day, "yyyy-MM-dd");
      const scheduledActivities =
        scheduledByDate.get(dateKey) ?? new Set<string>();
      const completedActivities =
        completedByDate.get(dateKey) ?? new Set<string>();
      const completed = Array.from(completedActivities).filter((activityId) =>
        scheduledActivities.has(activityId),
      ).length;
      const goals = Array.from(scheduledActivities).flatMap((activityId) => {
        const activity = activitiesById.get(activityId);

        if (!activity || activity.type !== "goal") return [];

        return [
          {
            color: activity.chosenColor,
            completed: completedActivities.has(activityId),
            emoji: activity.chosenEmoji,
            id: activity.id,
            title: activity.title,
          } satisfies DayGoal,
        ];
      });
      const total = scheduledActivities.size;

      return [
        dateKey,
        {
          completed,
          goals,
          percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
          total,
        } satisfies DayProgress,
      ];
    }),
  );
}

export function buildGoalConsistency(
  database: DashboardDatabase,
  visibleMonth: Date,
  completionOverrides: CompletionOverrides,
): GoalConsistencyDatum[] {
  const goalOccurrences = getActivityOccurrences(
    database,
    startOfMonth(visibleMonth),
    endOfMonth(visibleMonth),
    "goal",
  );

  return database.activities
    .filter((activity) => activity.isActive && activity.type === "goal")
    .map((goal) => {
      const scheduledDates = new Set(
        goalOccurrences
          .filter((occurrence) => occurrence.activityId === goal.id)
          .map((occurrence) => occurrence.isoDate),
      );
      const completedDates = new Set(
        database.activityCompletions
          .filter(
            (completion) =>
              completion.activityId === goal.id &&
              scheduledDates.has(completion.completedOn),
          )
          .map((completion) => completion.completedOn),
      );

      for (const [overrideKey, isCompleted] of Object.entries(
        completionOverrides,
      )) {
        const { activityId, dateKey } = parseCompletionOverrideKey(overrideKey);

        if (activityId !== goal.id || !scheduledDates.has(dateKey)) continue;

        if (isCompleted) {
          completedDates.add(dateKey);
        } else {
          completedDates.delete(dateKey);
        }
      }

      const total = scheduledDates.size;
      const completed = completedDates.size;

      return {
        completed,
        emoji: goal.chosenEmoji,
        fill: goal.chosenColor,
        id: goal.id,
        percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
        title: goal.title,
        total,
      } satisfies GoalConsistencyDatum;
    })
    .filter((goal) => goal.total > 0)
    .toSorted(
      (left, right) =>
        right.percentage - left.percentage ||
        right.completed - left.completed,
    );
}
