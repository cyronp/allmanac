import { useMemo } from "react";
import { addMonths, format, parseISO, startOfMonth } from "date-fns";

import type { DashboardDatabase } from "@/app/types/dashboard-data";
import type { CompletionOverrides } from "@/components/dashboard/activity-overview/activity-overview.types";
import { buildGoalConsistency } from "@/components/dashboard/activity-overview/activity-overview.utils";
import GoalConsistencyBars from "@/components/dashboard/activity-overview/goal-consistency-bars";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface GoalConsistencyChartProps {
  database: DashboardDatabase;
  todayKey: string;
  monthOffset: number;
  completionOverrides: CompletionOverrides;
}

export default function GoalConsistencyChart({
  database,
  todayKey,
  monthOffset,
  completionOverrides,
}: GoalConsistencyChartProps) {
  const visibleMonth = useMemo(
    () => addMonths(startOfMonth(parseISO(todayKey)), monthOffset),
    [monthOffset, todayKey],
  );
  const goalConsistency = useMemo(
    () =>
      buildGoalConsistency(
        database,
        visibleMonth,
        completionOverrides,
      ),
    [completionOverrides, database, visibleMonth],
  );

  return (
    <Card
      className="h-full min-h-80 min-w-0"
      aria-labelledby="goal-consistency-heading"
    >
      <CardHeader className="border-b gap-0">
        <CardTitle id="goal-consistency-heading">Goal consistency</CardTitle>
        <CardDescription className="font-semibold tracking-tight">
          {format(visibleMonth, "MMMM yyyy")}
        </CardDescription>
      </CardHeader>

      {goalConsistency.length === 0 ? (
        <CardContent className="flex flex-1 items-center justify-center text-center text-sm text-muted-foreground">
          No active goals scheduled this month.
        </CardContent>
      ) : (
        <CardContent className="min-w-0">
          <GoalConsistencyBars data={goalConsistency} />
        </CardContent>
      )}
    </Card>
  );
}
