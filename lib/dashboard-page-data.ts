import {
  endOfYear,
  format,
  parseISO,
  startOfDay,
  startOfYear,
} from "date-fns";

import type { DashboardDatabase } from "@/app/types/dashboard-data";
import type { DashboardGoal } from "@/components/dashboard/sections/goals-section";
import type { TimelineEntry } from "@/components/dashboard/timeline/timeline";
import {
  getActivityOccurrences,
  getActivitySchedules,
} from "@/lib/dashboard-schedule";

export interface DashboardPageData {
  username: string;
  initialDate: string;
  timelineEvents: TimelineEntry[];
  goals: DashboardGoal[];
}

export function buildDashboardPageData(
  database: DashboardDatabase,
  referenceDate: Date,
): DashboardPageData {
  const today = startOfDay(referenceDate);
  const timelineEvents = getActivityOccurrences(
    database,
    startOfYear(today),
    endOfYear(today),
  ).map((occurrence) => ({
    id: occurrence.id,
    title: occurrence.title,
    date: occurrence.date,
    start: occurrence.startTime,
    end: occurrence.endTime,
    description: occurrence.description,
  }));
  const goals = database.activities.flatMap((activity) => {
    if (!activity.isActive || activity.type !== "goal") return [];

    const schedule = getActivitySchedules(database, activity.id)[0];
    if (!schedule) return [];

    return [
      {
        id: activity.id,
        title: activity.title,
        description: activity.description,
        chosenColor: activity.chosenColor,
        chosenEmoji: activity.chosenEmoji,
        startingDate: format(parseISO(schedule.startsOn), "dd/MM/yyyy"),
        endingDate: schedule.endsOn
          ? format(parseISO(schedule.endsOn), "dd/MM/yyyy")
          : "Ongoing",
        progressPercentage: activity.progressPercentage ?? 0,
      },
    ];
  });

  return {
    username: database.users[0]?.name ?? "",
    initialDate: format(today, "yyyy-MM-dd"),
    timelineEvents,
    goals,
  };
}
