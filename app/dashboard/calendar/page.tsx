import { endOfYear, format, isValid, parseISO, startOfYear } from "date-fns";

import { dashboardMockDatabase } from "@/app/types/dashboard-data";
import { CalendarPageView } from "@/components/calendar/calendar-page-view";
import type { CalendarEvent } from "@/components/calendar/schedule-calendar";
import {
  getActivityOccurrences,
  groupActivityOccurrences,
} from "@/lib/dashboard-schedule";

interface CalendarPageProps {
  searchParams: Promise<{ date?: string | string[] }>;
}

export default async function CalendarPage({
  searchParams,
}: CalendarPageProps) {
  const dateParam = (await searchParams).date;
  const parsedDate =
    typeof dateParam === "string" ? parseISO(dateParam) : undefined;
  const selectedDate =
    parsedDate && isValid(parsedDate) ? parsedDate : undefined;
  const referenceDate = selectedDate ?? new Date();

  const calendarEvents: CalendarEvent[] = groupActivityOccurrences(
    getActivityOccurrences(
      dashboardMockDatabase,
      startOfYear(referenceDate),
      endOfYear(referenceDate),
    ),
  ).map((occurrence) => ({
    id: occurrence.id,
    title: occurrence.title,
    date: occurrence.isoDate,
    timeBlocks: occurrence.timeBlocks,
    choosen_emoji: occurrence.chosenEmoji,
    choosen_color: occurrence.chosenColor,
  }));

  return (
    <CalendarPageView
      events={calendarEvents}
      initialDate={selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined}
      maxEventsPerDay={dashboardMockDatabase.activities.length}
      today={format(new Date(), "yyyy-MM-dd")}
    />
  );
}
