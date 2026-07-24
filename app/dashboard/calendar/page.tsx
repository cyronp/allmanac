import { UserCalendar } from "@/components/calendar/user-calendar";
import { Heading } from "@/components/ui/heading";

export default function CalendarPage() {
  return (
    <div className="relative z-0 min-w-0 w-full">
      <div className="relative z-10 flex min-w-0 w-full flex-col gap-6">
        <Heading as="h1" className="text-4xl tracking-tight">
          Your Calendar
        </Heading>

        <UserCalendar />
      </div>
    </div>
  );
}
