import { useMemo } from "react";
import { format, parseISO } from "date-fns";

import { dashboardMockDatabase } from "@/app/types/dashboard-data";
import type { CompletionOverrides } from "@/components/dashboard/activity-overview/activity-overview.types";
import { getCompletionOverrideKey } from "@/components/dashboard/activity-overview/activity-overview.utils";
import TodayTodoItem from "@/components/dashboard/activity-overview/today-todo-item";
import {
  getActivityOccurrences,
  groupActivityOccurrences,
} from "@/lib/dashboard-schedule";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TodayTodosProps {
  todayKey: string;
  completionOverrides: CompletionOverrides;
  onCompletionChange: (
    date: string,
    activityId: string,
    completed: boolean,
  ) => void;
}

export default function TodayTodos({
  todayKey,
  completionOverrides,
  onCompletionChange,
}: TodayTodosProps) {
  const today = useMemo(() => parseISO(todayKey), [todayKey]);
  const items = useMemo(
    () =>
      groupActivityOccurrences(
        getActivityOccurrences(dashboardMockDatabase, today, today),
      ),
    [today],
  );
  const completedActivityIds = useMemo(
    () =>
      new Set(
        dashboardMockDatabase.activityCompletions
          .filter((completion) => completion.completedOn === todayKey)
          .map((completion) => completion.activityId),
      ),
    [todayKey],
  );

  return (
    <Card
      className="h-full min-h-80 min-w-0"
      aria-labelledby="today-todos-heading"
    >
      <CardHeader className="border-b gap-0">
        <CardTitle
          id="today-todos-heading"
        >
          Today&apos;s Todos
        </CardTitle>
        <CardDescription className="font-semibold tracking-tight">
          {format(today, "EEEE, MMMM d")}
        </CardDescription>
      </CardHeader>

      {items.length === 0 ? (
        <CardContent className="flex flex-1 items-center justify-center text-center text-sm text-muted-foreground">
          Nothing planned for today.
        </CardContent>
      ) : (
        <CardContent className="flex flex-col gap-2">
          {items.map((item) => {
            const overrideKey = getCompletionOverrideKey(
              todayKey,
              item.activityId,
            );
            const isCompleted =
              completionOverrides[overrideKey] ??
              completedActivityIds.has(item.activityId);

            return (
              <TodayTodoItem
                key={item.id}
                isCompleted={isCompleted}
                item={item}
                onToggle={() =>
                  onCompletionChange(todayKey, item.activityId, !isCompleted)
                }
              />
            );
          })}
        </CardContent>
      )}
    </Card>
  );
}
