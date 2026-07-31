"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  addMonths,
  endOfMonth,
  format,
  parseISO,
  startOfMonth,
} from "date-fns";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import { dashboardMockDatabase } from "@/app/types/dashboard-data";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { getActivityOccurrences } from "@/lib/dashboard-schedule";

const chartConfig = {
  percentage: {
    label: "Consistency",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

interface GoalConsistencyChartProps {
  initialDate: string;
  monthOffset: number;
  completionOverrides: Record<string, boolean>;
}

export default function GoalConsistencyChart({
  initialDate,
  monthOffset,
  completionOverrides,
}: GoalConsistencyChartProps) {
  const subscribeToCurrentDay = useCallback((onDayChange: () => void) => {
    const intervalId = window.setInterval(onDayChange, 60_000);
    window.addEventListener("focus", onDayChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", onDayChange);
    };
  }, []);
  const getCurrentDay = useCallback(
    () => format(new Date(), "yyyy-MM-dd"),
    [],
  );
  const getServerDay = useCallback(() => initialDate, [initialDate]);
  const todayKey = useSyncExternalStore(
    subscribeToCurrentDay,
    getCurrentDay,
    getServerDay,
  );

  const visibleMonth = useMemo(
    () => addMonths(startOfMonth(parseISO(todayKey)), monthOffset),
    [monthOffset, todayKey],
  );
  const goalConsistency = useMemo(() => {
    const monthStart = startOfMonth(visibleMonth);
    const monthEnd = endOfMonth(visibleMonth);
    const goalOccurrences = getActivityOccurrences(
      dashboardMockDatabase,
      monthStart,
      monthEnd,
      "goal",
    );

    return dashboardMockDatabase.activities
      .filter((activity) => activity.isActive && activity.type === "goal")
      .map((goal) => {
        const scheduledDates = new Set(
          goalOccurrences
            .filter((occurrence) => occurrence.activityId === goal.id)
            .map((occurrence) => occurrence.isoDate),
        );
        const completedDates = new Set(
          dashboardMockDatabase.activityCompletions
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
          const separatorIndex = overrideKey.indexOf(":");
          const dateKey = overrideKey.slice(0, separatorIndex);
          const activityId = overrideKey.slice(separatorIndex + 1);

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
          id: goal.id,
          title: goal.title,
          emoji: goal.chosenEmoji,
          fill: goal.chosenColor,
          completed,
          total,
          percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
        };
      })
      .filter((goal) => goal.total > 0)
      .toSorted(
        (left, right) =>
          right.percentage - left.percentage ||
          right.completed - left.completed,
      );
  }, [completionOverrides, visibleMonth]);

  return (
    <section
      className="flex h-full min-h-80 min-w-0 flex-col rounded-xl border border-border/70 bg-accent/20 p-4 shadow-xs backdrop-blur-2xl"
      aria-labelledby="goal-consistency-heading"
    >
      <header className="mb-4">
        <h2
          id="goal-consistency-heading"
          className="text-lg font-semibold tracking-tight"
        >
          Goal consistency
        </h2>
        <p className="text-sm text-muted-foreground">
          {format(visibleMonth, "MMMM yyyy")}
        </p>
      </header>

      {goalConsistency.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-border/80 px-6 text-center text-sm text-muted-foreground">
          No active goals scheduled this month.
        </div>
      ) : (
        <div className="min-w-0">
          <div
            className="mb-2 grid items-end gap-2"
            style={{
              gridTemplateColumns: `repeat(${goalConsistency.length}, minmax(0, 1fr))`,
            }}
          >
            {goalConsistency.map((goal) => (
              <div key={goal.id} className="min-w-0 text-center">
                <h3 className="truncate text-xs font-semibold" title={goal.title}>
                  {goal.title}
                </h3>
                <p className="text-xs font-medium tabular-nums text-muted-foreground">
                  {goal.percentage}%
                </p>
              </div>
            ))}
          </div>

          <ChartContainer
            config={chartConfig}
            initialDimension={{ width: 320, height: 210 }}
            className="h-52.5 min-h-52.5 w-full aspect-auto"
          >
            <BarChart
              accessibilityLayer
              data={goalConsistency}
              margin={{ top: 4, right: 4, bottom: 4, left: 4 }}
            >
              <XAxis dataKey="title" type="category" hide />
              <YAxis type="number" domain={[0, 100]} hide />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    hideIndicator
                    formatter={(value, _name, item) => (
                      <div className="grid min-w-36 gap-1">
                        <span className="font-medium">
                          {String(item.payload.title)}
                        </span>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-muted-foreground">
                            Consistency
                          </span>
                          <span className="font-mono font-medium tabular-nums">
                            {Number(value)}%
                          </span>
                        </div>
                      </div>
                    )}
                  />
                }
              />
              <Bar
                dataKey="percentage"
                radius={[8, 8, 4, 4]}
                maxBarSize={58}
                background={{ fill: "var(--muted)", radius: 8 }}
              >
                <LabelList
                  dataKey="emoji"
                  position="insideTop"
                  offset={12}
                  className="text-base"
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      )}
    </section>
  );
}
