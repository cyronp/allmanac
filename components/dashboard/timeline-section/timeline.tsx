"use client";
import { Button } from "@/components/ui/button";
import { format, differenceInCalendarDays, addDays, subDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Text } from "@/components/ui/text";
import { ChevronDownIcon, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

const hours = Array.from({ length: 24 }, (_, i) => {
  const ampm = i >= 12 ? "PM" : "AM";
  const hour = i % 12 === 0 ? 12 : i % 12;
  return `${hour}${ampm}`;
});

export default function Timeline() {
  const [date, setDate] = useState<Date>();
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDate(new Date());
  }, []);

  React.useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const handlePrevDay = () => {
    const current = date || new Date();
    setDate(subDays(current, 1));
  };

  const handleNextDay = () => {
    const current = date || new Date();
    setDate(addDays(current, 1));
  };

  const handleSelectDate = (newDate: Date | undefined) => {
    setDate(newDate);
    setIsOpen(false);
  };

  const getRelativeDateLabel = (targetDate: Date | undefined): string => {
    if (!targetDate) return "Today";

    const today = new Date();
    const diff = differenceInCalendarDays(targetDate, today);

    if (diff === 0) {
      return "Today";
    } else if (diff === -1) {
      return "Yesterday";
    } else if (diff === 1) {
      return "Tomorrow";
    } else if (diff < -1) {
      return `${Math.abs(diff)} days before`;
    } else {
      return `${diff} days after`;
    }
  };

  return (
    <div className="flex flex-col gap-2 min-w-0 w-full">
      <div className="flex flex-row items-center justify-between">
        <Text as="p" className="font-bold text-sm" suppressHydrationWarning>
          {date
            ? format(date, "MMMM d, yyyy")
            : format(new Date(), "MMMM d, yyyy")}
        </Text>
        <div className="flex flex-row gap-2">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
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
                    isOpen && "rotate-180",
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
          {/* DateScroller */}
          <div className="inline-flex items-center justify-center">
            <Button size="icon" variant="ghost" onClick={handlePrevDay}>
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
      <div className="relative w-full min-w-0">
        <div
          ref={scrollRef}
          className="flex flex-row gap-10 overflow-x-auto w-full scrollbar-none mask-fade-x"
        >
          {hours.map((hourText) => (
            <Text
              key={hourText}
              as="span"
              className="shrink-0 text-muted-foreground select-none text-sm font-medium"
            >
              {hourText}
            </Text>
          ))}
        </div>
      </div>
    </div>
  );
}

