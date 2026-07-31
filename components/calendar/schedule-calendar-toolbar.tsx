import { addMonths, subMonths } from "date-fns";
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScheduleCalendarToolbarProps {
  className?: string;
  locale: string;
  today: Date;
  visibleMonth: Date;
  onMonthChange: (month: Date) => void;
}

export function ScheduleCalendarToolbar({
  className,
  locale,
  today,
  visibleMonth,
  onMonthChange,
}: ScheduleCalendarToolbarProps) {
  const monthLabel = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(visibleMonth);

  return (
    <div className={cn("mb-4 flex flex-wrap items-center gap-2", className)}>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => onMonthChange(today)}
        >
          <CalendarDaysIcon data-icon="inline-start" />
          Today
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label="Previous month"
          onClick={() => onMonthChange(subMonths(visibleMonth, 1))}
        >
          <ChevronLeftIcon />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label="Next month"
          onClick={() => onMonthChange(addMonths(visibleMonth, 1))}
        >
          <ChevronRightIcon />
        </Button>
        <div>
          <p
            className="text-lg font-semibold capitalize"
            aria-live="polite"
            aria-atomic="true"
          >
            {monthLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
