import type * as React from "react";
import { isSameDay, isSameMonth } from "date-fns";

import { cn } from "@/lib/utils";

import { ScheduleCalendarDay } from "./schedule-calendar-day";
import type {
  CalendarClassNames,
  CalendarDayContext,
  CalendarEvent,
} from "./schedule-calendar.types";
import { getDateKey } from "./schedule-calendar.utils";

interface ScheduleCalendarGridProps {
  calendarDays: Date[];
  classNames?: CalendarClassNames;
  eventsByDate: Map<string, CalendarEvent[]>;
  locale: string;
  maxEventsPerDay: number;
  selectedDate?: Date;
  showOutsideDays: boolean;
  today: Date;
  visibleMonth: Date;
  weekdayLabels: string[];
  isDateDisabled?: (date: Date) => boolean;
  onDaySelect: (date: Date, isCurrentMonth: boolean) => void;
  renderDayContent?: (day: CalendarDayContext) => React.ReactNode;
}

export function ScheduleCalendarGrid({
  calendarDays,
  classNames,
  eventsByDate,
  locale,
  maxEventsPerDay,
  selectedDate,
  showOutsideDays,
  today,
  visibleMonth,
  weekdayLabels,
  isDateDisabled,
  onDaySelect,
  renderDayContent,
}: ScheduleCalendarGridProps) {
  const monthLabel = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(visibleMonth);

  return (
    <div className="overflow-x-auto rounded-xl border bg-background">
      <div
        role="grid"
        aria-label={monthLabel}
        className={cn("min-w-175", classNames?.grid)}
      >
        <div role="row" className="grid grid-cols-7 border-b bg-muted/35">
          {weekdayLabels.map((weekday, index) => (
            <div
              role="columnheader"
              key={`${weekday}-${index}`}
              className={cn(
                "px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                classNames?.weekday,
              )}
            >
              {weekday}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {calendarDays.map((date, index) => {
            const day: CalendarDayContext = {
              date,
              isCurrentMonth: isSameMonth(date, visibleMonth),
              isDisabled: isDateDisabled?.(date) ?? false,
              isSelected: selectedDate
                ? isSameDay(date, selectedDate)
                : false,
              isToday: isSameDay(date, today),
              events: eventsByDate.get(getDateKey(date)) ?? [],
            };

            return (
              <ScheduleCalendarDay
                key={date.toISOString()}
                day={day}
                classNames={classNames}
                isLastColumn={index % 7 === 6}
                isLastRow={index >= calendarDays.length - 7}
                locale={locale}
                maxEventsPerDay={maxEventsPerDay}
                showOutsideDays={showOutsideDays}
                onSelect={onDaySelect}
                renderDayContent={renderDayContent}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
