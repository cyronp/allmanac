import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  parseISO,
  startOfMonth,
  startOfWeek,
  type Day,
} from "date-fns";

import type { CalendarEvent } from "./schedule-calendar.types";

export function getDateKey(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function getCalendarDays(
  visibleMonth: Date,
  fixedWeeks: boolean,
  weekStartsOn: Day,
) {
  const firstDay = startOfWeek(startOfMonth(visibleMonth), { weekStartsOn });
  const lastDay = fixedWeeks
    ? addDays(firstDay, 41)
    : endOfWeek(endOfMonth(visibleMonth), { weekStartsOn });

  return eachDayOfInterval({ start: firstDay, end: lastDay });
}

export function getWeekdayLabels(locale: string, weekStartsOn: Day) {
  const firstWeekday = startOfWeek(new Date(2024, 0, 7), { weekStartsOn });
  const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });

  return Array.from({ length: 7 }, (_, index) =>
    formatter.format(addDays(firstWeekday, index)),
  );
}

export function groupEventsByDate(events: CalendarEvent[]) {
  const groupedEvents = new Map<string, CalendarEvent[]>();

  for (const event of events) {
    const eventDate =
      typeof event.date === "string" ? parseISO(event.date) : event.date;
    const key = getDateKey(eventDate);

    groupedEvents.set(key, [...(groupedEvents.get(key) ?? []), event]);
  }

  return groupedEvents;
}
