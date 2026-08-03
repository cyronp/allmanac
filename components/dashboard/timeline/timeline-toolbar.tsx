import {
  addDays,
  differenceInCalendarDays,
  format,
  subDays,
} from "date-fns";
import { ChevronDownIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

interface TimelineToolbarProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

function getRelativeDateLabel(date: Date | undefined) {
  if (!date) return "Today";

  const difference = differenceInCalendarDays(date, new Date());

  if (difference === 0) return "Today";
  if (difference === -1) return "Yesterday";
  if (difference === 1) return "Tomorrow";
  if (difference < -1) return `${Math.abs(difference)} days before`;

  return `${difference} days after`;
}

export default function TimelineToolbar({
  date,
  onDateChange,
}: TimelineToolbarProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleSelectDate = (newDate: Date | undefined) => {
    onDateChange(newDate);
    setIsCalendarOpen(false);
  };

  const handlePreviousDay = () => {
    onDateChange(subDays(date ?? new Date(), 1));
  };

  const handleNextDay = () => {
    onDateChange(addDays(date ?? new Date(), 1));
  };

  return (
    <div className="flex flex-row items-center justify-between">
      <Text as="p" className="font-bold text-sm" suppressHydrationWarning>
        {format(date ?? new Date(), "MMMM d, yyyy")}
      </Text>

      <div className="flex flex-row gap-2">
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              data-empty={!date}
              className="text-muted-foreground"
              suppressHydrationWarning
            >
              Select day
              <ChevronDownIcon
                className={cn(
                  "transition-transform duration-300",
                  isCalendarOpen && "rotate-180",
                )}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleSelectDate}
              defaultMonth={date}
            />
          </PopoverContent>
        </Popover>

        <div className="inline-flex items-center justify-center">
          <Button size="icon" variant="ghost" onClick={handlePreviousDay}>
            <ChevronLeft />
          </Button>
          <Text
            as="span"
            className="text-sm font-bold min-w-25 text-center"
            suppressHydrationWarning
          >
            {getRelativeDateLabel(date)}
          </Text>
          <Button size="icon" variant="ghost" onClick={handleNextDay}>
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
