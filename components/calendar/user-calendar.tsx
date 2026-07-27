"use client";

import * as React from "react";
import { isSameDay, startOfMonth } from "date-fns";

import { cn } from "@/lib/utils";

import { UserCalendarGrid } from "./user-calendar-grid";
import { UserCalendarToolbar } from "./user-calendar-toolbar";
import type { CalendarProps } from "./user-calendar.types";
import {
  getCalendarDays,
  getWeekdayLabels,
  groupEventsByDate,
} from "./user-calendar.utils";

export type {
  CalendarClassNames,
  CalendarDayContext,
  CalendarEvent,
  CalendarProps,
} from "./user-calendar.types";

export function UserCalendar({
  className,
  classNames,
  events = [],
  month,
  defaultMonth,
  onMonthChange,
  selected,
  defaultSelected,
  onSelect,
  isDateDisabled,
  renderDayContent,
  locale = "en-US",
  weekStartsOn = 0,
  fixedWeeks = true,
  showOutsideDays = true,
  navigateOnOutsideDayClick = true,
  maxEventsPerDay = 3,
}: CalendarProps) {
  const calendarRef = React.useRef<HTMLElement>(null);
  const today = React.useMemo(() => new Date(), []);
  const [internalMonth, setInternalMonth] = React.useState(() =>
    startOfMonth(defaultMonth ?? defaultSelected ?? today),
  );
  const [internalSelected, setInternalSelected] = React.useState<
    Date | undefined
  >(defaultSelected);

  const visibleMonth = startOfMonth(month ?? internalMonth);
  const selectedDate = selected ?? internalSelected;

  React.useEffect(() => {
    if (!selectedDate) return;

    const clearSelectionOnOutsideClick = (event: PointerEvent) => {
      if (calendarRef.current?.contains(event.target as Node)) return;

      if (selected === undefined) {
        setInternalSelected(undefined);
      }

      onSelect?.(undefined);
    };

    document.addEventListener("pointerdown", clearSelectionOnOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", clearSelectionOnOutsideClick);
    };
  }, [onSelect, selected, selectedDate]);

  const calendarDays = React.useMemo(
    () => getCalendarDays(visibleMonth, fixedWeeks, weekStartsOn),
    [fixedWeeks, visibleMonth, weekStartsOn],
  );
  const weekdayLabels = React.useMemo(
    () => getWeekdayLabels(locale, weekStartsOn),
    [locale, weekStartsOn],
  );
  const eventsByDate = React.useMemo(
    () => groupEventsByDate(events),
    [events],
  );

  const setVisibleMonth = (nextMonth: Date) => {
    const normalizedMonth = startOfMonth(nextMonth);

    if (month === undefined) {
      setInternalMonth(normalizedMonth);
    }

    onMonthChange?.(normalizedMonth);
  };

  const selectDay = (date: Date, isCurrentMonth: boolean) => {
    if (isDateDisabled?.(date)) return;

    const nextSelectedDate =
      selectedDate && isSameDay(date, selectedDate) ? undefined : date;

    if (selected === undefined) {
      setInternalSelected(nextSelectedDate);
    }

    if (nextSelectedDate && !isCurrentMonth && navigateOnOutsideDayClick) {
      setVisibleMonth(date);
    }

    onSelect?.(nextSelectedDate);
  };

  return (
    <section
      ref={calendarRef}
      aria-label="Calendar"
      className={cn("w-full min-w-0", classNames?.root, className)}
    >
      <UserCalendarToolbar
        className={classNames?.toolbar}
        locale={locale}
        today={today}
        visibleMonth={visibleMonth}
        onMonthChange={setVisibleMonth}
      />
      <UserCalendarGrid
        calendarDays={calendarDays}
        classNames={classNames}
        eventsByDate={eventsByDate}
        locale={locale}
        maxEventsPerDay={maxEventsPerDay}
        selectedDate={selectedDate}
        showOutsideDays={showOutsideDays}
        today={today}
        visibleMonth={visibleMonth}
        weekdayLabels={weekdayLabels}
        isDateDisabled={isDateDisabled}
        onDaySelect={selectDay}
        renderDayContent={renderDayContent}
      />
    </section>
  );
}
