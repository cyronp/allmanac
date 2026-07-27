import { eachDayOfInterval, format, parse } from "date-fns";

import {
  UserCalendar,
  type CalendarEvent,
} from "@/components/calendar/user-calendar";
import { Heading } from "@/components/ui/heading";
import { dashboardMockData } from "@/app/types/dashboard-data";

const goalEvents: CalendarEvent[] = dashboardMockData.goals.flatMap((goal) => {
  const startingDate = parse(goal.startingDate, "dd/MM/yyyy", new Date());
  const endingDate = parse(goal.endingDate, "dd/MM/yyyy", new Date());

  return eachDayOfInterval({ start: startingDate, end: endingDate }).map(
    (date) => ({
      id: `${goal.id}-${format(date, "yyyy-MM-dd")}`,
      title: goal.title,
      date: format(date, "yyyy-MM-dd"),
      startTime: goal.startTime,
      endTime: goal.endTime,
      choosen_emoji: goal.choosen_emoji,
      choosen_color: goal.choosen_color,
    }),
  );
});

export default function CalendarPage() {
  return (
    <div className="relative z-0 min-w-0 w-full">
      <div className="relative z-10 flex min-w-0 w-full flex-col gap-6">
        <Heading as="h1" className="text-4xl tracking-tight">
          Your Calendar
        </Heading>

        <UserCalendar
          events={goalEvents}
          maxEventsPerDay={dashboardMockData.goals.length}
        />
      </div>
    </div>
  );
}
