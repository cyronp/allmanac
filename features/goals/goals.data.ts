import { addMonths, format } from "date-fns";

import { dashboardMockDatabase } from "@/app/types/dashboard-data";

import type { Goal, GoalDraft } from "./goals.types";

const DEFAULT_GOAL_ICON = "🎯";
const DEFAULT_GOAL_COLOR = "#84CC16";

export const INITIAL_GOALS: Goal[] = dashboardMockDatabase.activities.flatMap(
  (activity) => {
    if (activity.type !== "goal" || !activity.isActive) return [];

    const schedule = dashboardMockDatabase.schedules.find(
      (item) => item.activityId === activity.id,
    );

    if (!schedule) return [];

    return [
      {
        id: activity.id,
        title: activity.title,
        description: activity.description,
        emoji: activity.chosenEmoji,
        color: activity.chosenColor,
        startsOn: schedule.startsOn,
        endsOn: schedule.endsOn,
      },
    ];
  },
);

export function createEmptyGoal(today: string): GoalDraft {
  const startsOn = new Date(`${today}T12:00:00`);

  return {
    title: "",
    description: "",
    emoji: DEFAULT_GOAL_ICON,
    color: DEFAULT_GOAL_COLOR,
    startsOn: today,
    endsOn: format(addMonths(startsOn, 3), "yyyy-MM-dd"),
  };
}
