import { useMemo, useState } from "react";
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
import ActivityCalendarDay from "@/components/dashboard/activity-overview/activity-calendar-day";
import type { CompletionOverrides } from "@/components/dashboard/activity-overview/activity-overview.types";
import { buildMonthlyProgress } from "@/components/dashboard/activity-overview/activity-overview.utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

interface MonthlyActivityCalendarProps {
  todayKey: string;
  monthOffset: number;
  completionOverrides?: CompletionOverrides;
  onMonthOffsetChange: (offset: number) => void;
}

export default function MonthlyActivityCalendar({
  todayKey,
  monthOffset,
  completionOverrides = {},
  onMonthOffsetChange,
}: MonthlyActivityCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

  const progressByDate = useMemo(
    () =>
      buildMonthlyProgress(
        dashboardMockDatabase,
        days,
        monthStart,
        monthEnd,
        completionOverrides,
      ),
    [completionOverrides, days, monthEnd, monthStart],
  );

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
              percentage: 0,
              todos: [],
              total: 0,
            };

            return (
              <ActivityCalendarDay
                key={dateKey}
                day={day}
                isOpen={selectedDate === dateKey}
                isToday={dateKey === todayKey}
                onOpenChange={(open) =>
                  setSelectedDate(open ? dateKey : null)
                }
                progress={progress}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
