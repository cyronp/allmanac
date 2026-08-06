"use client";

import { useState } from "react";
import { addMonths, format, parseISO, startOfMonth } from "date-fns";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import {
  ScheduleCalendar,
  type CalendarEvent,
} from "@/components/calendar/schedule-calendar";
import { Button } from "@/components/ui/button";

interface CalendarPageViewProps {
  events: CalendarEvent[];
  initialDate?: string;
  maxEventsPerDay: number;
  today: string;
}

export function CalendarPageView({
  events,
  initialDate,
  maxEventsPerDay,
  today,
}: CalendarPageViewProps) {
  const initialSelectedDate = initialDate ? parseISO(initialDate) : undefined;
  const currentMonth = today.slice(0, 7);
  const [visibleMonth, setVisibleMonth] = useState(() =>
    startOfMonth(initialSelectedDate ?? parseISO(today)),
  );
  const monthKey = format(visibleMonth, "yyyy-MM");
  const monthLabel = format(visibleMonth, "MMMM yyyy");

  function returnToCurrentMonth() {
    setVisibleMonth(startOfMonth(parseISO(today)));
  }

  return (
    <div className="relative z-0 min-w-0 w-full">
      <div className="relative z-10 flex min-w-0 w-full flex-col gap-6">
        <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Your Calendar
          </h1>

          <div className="flex flex-wrap items-center gap-2">
            {monthKey !== currentMonth && (
              <Button
                type="button"
                variant="outline"
                onClick={returnToCurrentMonth}
              >
                Today
              </Button>
            )}
            <div className="flex items-center rounded-xl border bg-card p-1 shadow-xs">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() =>
                  setVisibleMonth((current) => addMonths(current, -1))
                }
                aria-label="Previous month"
              >
                <ArrowLeftIcon />
              </Button>
              <span className="min-w-32 px-2 text-center text-sm font-semibold">
                {monthLabel}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() =>
                  setVisibleMonth((current) => addMonths(current, 1))
                }
                aria-label="Next month"
              >
                <ArrowRightIcon />
              </Button>
            </div>
          </div>
        </header>

        <ScheduleCalendar
          events={events}
          month={visibleMonth}
          defaultSelected={initialSelectedDate}
          maxEventsPerDay={maxEventsPerDay}
          onMonthChange={setVisibleMonth}
        />
      </div>
    </div>
  );
}
