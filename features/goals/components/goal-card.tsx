import {
  CalendarDaysIcon,
  CheckCircle2Icon,
  Clock3Icon,
  PencilLineIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { Goal } from "../goals.types";
import {
  formatGoalRange,
  getDaysRemaining,
  getGoalProgress,
  getGoalState,
} from "../goals.utils";

interface GoalCardProps {
  goal: Goal;
  today: string;
  onSelect: (goal: Goal) => void;
}

const stateLabels = {
  planned: "Not started",
  completed: "Completed",
};

export function GoalCard({ goal, today, onSelect }: GoalCardProps) {
  const state = getGoalState(goal, today);
  const progress = getGoalProgress(goal, today);
  const daysRemaining = getDaysRemaining(goal, today);
  const stateLabel =
    state === "active"
      ? progress === null
        ? "Ongoing"
        : `${progress}% of the goal reached`
      : stateLabels[state];

  return (
    <Card role="article" className="gap-0 py-0 transition-colors hover:ring-foreground/20">
      <div
        className="flex h-20 items-center justify-between border-b px-4"
        style={{ backgroundColor: goal.color }}
      >
        <span className="flex size-10 items-center justify-center overflow-hidden rounded-lg bg-card px-1 text-xl ring-1 ring-foreground/10">
          <span className="truncate">{goal.emoji || "◌"}</span>
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-md bg-card px-2 py-1 text-xs font-medium text-card-foreground ring-1 ring-foreground/10">
          {state === "completed" && (
            <CheckCircle2Icon className="size-3" aria-hidden="true" />
          )}
          {stateLabel}
        </span>
      </div>

      <CardHeader className="py-4">
        <CardTitle>
          <h3 className="truncate">{goal.title}</h3>
        </CardTitle>
        <CardDescription className="line-clamp-2 min-h-10 leading-5">
          {goal.description || "No description."}
        </CardDescription>
        <CardAction>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onSelect(goal)}
            aria-label={`Edit ${goal.title}`}
          >
            <PencilLineIcon />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 border-t py-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <CalendarDaysIcon className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{formatGoalRange(goal)}</span>
        </span>
        {daysRemaining !== null && (
          <span
            className={cn(
              "flex items-center gap-2",
              daysRemaining < 0 && "text-destructive",
            )}
          >
            <Clock3Icon className="size-3.5 shrink-0" aria-hidden="true" />
            {daysRemaining < 0
              ? `${Math.abs(daysRemaining)} days overdue`
              : daysRemaining === 0
                ? "Due today"
                : `${daysRemaining} days left`}
          </span>
        )}
      </CardContent>
    </Card>
  );
}
