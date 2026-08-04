import {
  differenceInCalendarDays,
  format,
  isValid,
  parseISO,
} from "date-fns";

import type { Goal, GoalDraft } from "./goals.types";

export function copyGoalDraft(goal: GoalDraft): GoalDraft {
  return {
    title: goal.title,
    description: goal.description,
    emoji: goal.emoji,
    color: goal.color,
    startsOn: goal.startsOn,
    endsOn: goal.endsOn,
  };
}

export function getGoalProgress(goal: Goal, today: string) {
  if (!goal.endsOn) return null;

  const start = parseISO(goal.startsOn);
  const end = parseISO(goal.endsOn);
  const current = parseISO(today);
  const totalDays = differenceInCalendarDays(end, start);
  const elapsedDays = differenceInCalendarDays(current, start);

  if (totalDays <= 0) return current >= end ? 100 : 0;

  return Math.min(100, Math.max(0, Math.round((elapsedDays / totalDays) * 100)));
}

export function getGoalState(goal: Goal, today: string) {
  if (today < goal.startsOn) return "planned" as const;
  if (getGoalProgress(goal, today) === 100) return "completed" as const;
  return "active" as const;
}

export function formatGoalDate(value: string) {
  const date = parseISO(value);
  return isValid(date) ? format(date, "MMM d, yyyy") : value;
}

export function formatGoalRange(goal: Pick<Goal, "startsOn" | "endsOn">) {
  const start = formatGoalDate(goal.startsOn);
  return goal.endsOn
    ? `${start} – ${formatGoalDate(goal.endsOn)}`
    : `${start} – No deadline`;
}

export function getDaysRemaining(goal: Goal, today: string) {
  const progress = getGoalProgress(goal, today);
  if (!goal.endsOn || progress === null || progress >= 100) return null;
  return differenceInCalendarDays(parseISO(goal.endsOn), parseISO(today));
}

export function isGoal(value: unknown): value is Goal {
  if (!value || typeof value !== "object") return false;
  const goal = value as Partial<Goal>;

  return (
    typeof goal.id === "string" &&
    typeof goal.title === "string" &&
    typeof goal.description === "string" &&
    typeof goal.emoji === "string" &&
    typeof goal.color === "string" &&
    typeof goal.startsOn === "string" &&
    (goal.endsOn === null || typeof goal.endsOn === "string")
  );
}
