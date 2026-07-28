import { endOfYear, isValid, parseISO, startOfYear } from "date-fns";

import { dashboardMockDatabase } from "@/app/types/dashboard-data";
import {
  UserCalendar,
  type CalendarEvent,
} from "@/components/calendar/user-calendar";
import { Heading } from "@/components/ui/heading";
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
    <div className="relative z-0 min-w-0 w-full">
      <div className="relative z-10 flex min-w-0 w-full flex-col gap-6">
        <Heading as="h1" className="text-4xl tracking-tight">
          Your Calendar
        </Heading>

        <UserCalendar
          events={calendarEvents}
          defaultMonth={selectedDate}
          defaultSelected={selectedDate}
          maxEventsPerDay={dashboardMockDatabase.activities.length}
        />
      </div>
    </div>
  );
}
