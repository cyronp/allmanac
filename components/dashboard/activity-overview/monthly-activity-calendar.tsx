"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  parseISO,
  startOfMonth,
} from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { dashboardMockDatabase } from "@/app/types/dashboard-data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getActivityOccurrences } from "@/lib/dashboard-schedule";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

interface MonthlyActivityCalendarProps {
  initialDate: string;
  monthOffset: number;
  completionOverrides?: Record<string, boolean>;
  onMonthOffsetChange: (offset: number) => void;
}

interface DayProgress {
  completed: number;
  goals: DayGoal[];
  percentage: number;
  total: number;
}

interface DayGoal {
  color: string;
  completed: boolean;
  emoji: string;
  id: string;
  title: string;
}

export default function MonthlyActivityCalendar({
  initialDate,
  monthOffset,
  completionOverrides = {},
  onMonthOffsetChange,
}: MonthlyActivityCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const subscribeToCurrentDay = useCallback((onDayChange: () => void) => {
    const intervalId = window.setInterval(onDayChange, 60_000);
    window.addEventListener("focus", onDayChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", onDayChange);
    };
  }, []);
  const getCurrentDay = useCallback(() => format(new Date(), "yyyy-MM-dd"), []);
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
  const { days, monthEnd, monthStart } = useMemo(() => {
    const start = startOfMonth(visibleMonth);
    const end = endOfMonth(visibleMonth);

    return {
      days: eachDayOfInterval({ start, end }),
      monthEnd: end,
      monthStart: start,
    };
  }, [visibleMonth]);

  const progressByDate = useMemo(() => {
    const activitiesById = new Map(
      dashboardMockDatabase.activities.map((activity) => [
        activity.id,
        activity,
      ]),
    );
    const scheduledByDate = new Map<string, Set<string>>();
    const completedByDate = new Map<string, Set<string>>();

    for (const occurrence of getActivityOccurrences(
      dashboardMockDatabase,
      monthStart,
      monthEnd,
    )) {
      const scheduledActivities =
        scheduledByDate.get(occurrence.isoDate) ?? new Set<string>();
      scheduledActivities.add(occurrence.activityId);
      scheduledByDate.set(occurrence.isoDate, scheduledActivities);
    }

    for (const completion of dashboardMockDatabase.activityCompletions) {
      const completedActivities =
        completedByDate.get(completion.completedOn) ?? new Set<string>();
      completedActivities.add(completion.activityId);
      completedByDate.set(completion.completedOn, completedActivities);
    }

    for (const [overrideKey, isCompleted] of Object.entries(
      completionOverrides,
    )) {
      const separatorIndex = overrideKey.indexOf(":");
      const dateKey = overrideKey.slice(0, separatorIndex);
      const activityId = overrideKey.slice(separatorIndex + 1);
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
  }, [completionOverrides, days, monthEnd, monthStart]);

  const monthLabel = format(visibleMonth, "MMMM, yyyy");

  return (
    <Card
      className="h-full min-h-80 w-full min-w-0 max-w-md"
      aria-labelledby="activity-calendar-month"
    >
      <CardHeader className="flex flex-row items-center justify-between border-b">
        <div>
          <CardTitle>Month activity</CardTitle>
          <CardDescription
            id="activity-calendar-month"
            className="font-semibold tracking-tight"
            aria-live="polite"
            aria-atomic="true"
          >
            {monthLabel}
          </CardDescription>
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Previous month"
            onClick={() => onMonthOffsetChange(monthOffset - 1)}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Next month"
            onClick={() => onMonthOffsetChange(monthOffset + 1)}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </CardHeader>

      <CardContent role="grid" aria-label={monthLabel}>
        <div role="row" className="mb-2 grid grid-cols-7">
          {WEEKDAYS.map((weekday) => (
            <div
              key={weekday}
              role="columnheader"
              className="text-center text-[0.625rem] font-semibold tracking-[0.12em] text-muted-foreground"
            >
              {weekday}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-1" role="rowgroup">
          {Array.from({ length: monthStart.getDay() }, (_, index) => (
            <span key={`empty-${index}`} aria-hidden="true" />
          ))}

          {days.map((day) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const progress = progressByDate.get(dateKey) ?? {
              completed: 0,
              goals: [],
              percentage: 0,
              total: 0,
            };
            const isToday = dateKey === todayKey;
            const isSelected = selectedDate === dateKey;
            const completionLabel =
              progress.total === 0
                ? "No activities scheduled."
                : `${progress.completed} of ${progress.total} activities completed.`;

            return (
              <div
                key={dateKey}
                role="gridcell"
                className="flex justify-center"
              >
                <Popover
                  open={isSelected}
                  onOpenChange={(open) =>
                    setSelectedDate(open ? dateKey : null)
                  }
                >
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      aria-current={isToday ? "date" : undefined}
                      aria-label={`${format(day, "EEEE, MMMM d, yyyy")}. ${completionLabel}`}
                      title={completionLabel}
                      className={cn(
                        "relative isolate flex size-10 items-center justify-center rounded-full text-sm font-medium outline-none transition-transform focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        isSelected && "ring-2 ring-foreground/50 ring-offset-1",
                      )}
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 40 40"
                        className="absolute inset-0 size-full -rotate-90 overflow-visible"
                      >
                        <circle
                          cx="20"
                          cy="20"
                          r="18"
                          fill="none"
                          strokeWidth="2"
                          className="stroke-border"
                        />
                        {progress.total > 0 && (
                          <circle
                            cx="20"
                            cy="20"
                            r="18"
                            fill="none"
                            pathLength="100"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeDasharray={`${progress.percentage} 100`}
                            className="stroke-primary transition-[stroke-dasharray] duration-300"
                          />
                        )}
                      </svg>
                      <span
                        className={cn(
                          "relative z-10 flex size-8 items-center justify-center rounded-full tabular-nums text-muted-foreground",
                          isToday && "bg-primary font-bold text-muted",
                        )}
                      >
                        {format(day, "d")}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72" sideOffset={8} align="start">
                    <PopoverHeader>
                      <PopoverTitle>
                        {format(day, "EEEE, MMMM d, yyyy")}
                      </PopoverTitle>
                      <PopoverDescription>{completionLabel}</PopoverDescription>
                    </PopoverHeader>
                    <div className="grid gap-1.5 border-t pt-2">
                      <p className="text-xs font-medium">Goals</p>
                      {progress.goals.length === 0 ? (
                        <p className="text-xs text-muted-foreground">
                          No goals scheduled.
                        </p>
                      ) : (
                        <ul className="grid gap-2">
                          {progress.goals.map((goal) => (
                            <li
                              key={goal.id}
                              className="flex min-w-0 items-center gap-3 rounded-xl border border-border/70 bg-card p-2"
                            >
                              <div
                                className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-lg shadow-xs"
                                style={{ backgroundColor: goal.color }}
                                aria-hidden="true"
                              >
                                {goal.emoji}
                              </div>
                              <div className="min-w-0">
                                <p className={`truncate font-medium ${goal.completed ? "line-through decoration-2": ""}`}>
                                  {goal.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {goal.completed
                                    ? "Completed"
                                    : isToday
                                      ? "Not done yet"
                                      : "Not done"}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
