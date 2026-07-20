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
import TimelineCard, { HOUR_WIDTH, type TimelineBlockProps } from "./timeline-card";

const hours = Array.from({ length: 24 }, (_, i) => {
  const ampm = i >= 12 ? "PM" : "AM";
  const hour = i % 12 === 0 ? 12 : i % 12;
  return `${hour}${ampm}`;
});

interface TimelineProps {
  children?: React.ReactNode;
  events?: Array<TimelineBlockProps & { id: string }>;
}

export default function Timeline({ children, events }: TimelineProps) {
  const [date, setDate] = useState<Date>();
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = React.useRef(false);
  const dragState = React.useRef({ startX: 0, scrollLeft: 0 });
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    setDate(new Date());
  }, []);

  React.useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.shiftKey) {
        e.preventDefault();
        container.scrollLeft += e.deltaY || e.deltaX;
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const container = scrollRef.current;
    if (!container || !date) return;
    const isSelectedToday = differenceInCalendarDays(date, new Date()) === 0;
    if (isSelectedToday) {
      const now = new Date();
      const pos = (now.getHours() + now.getMinutes() / 60) * HOUR_WIDTH;
      container.scrollLeft = Math.max(0, pos - container.clientWidth / 2);
    }
  }, [date]);

  const isToday = date
    ? differenceInCalendarDays(date, new Date()) === 0
    : false;
  const currentTimePos =
    (currentTime.getHours() + currentTime.getMinutes() / 60) * HOUR_WIDTH;
  const trackWidth = 24 * HOUR_WIDTH;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;

    isDraggingRef.current = true;
    setIsDragging(true);
    dragState.current = {
      startX: e.clientX,
      scrollLeft: e.currentTarget.scrollLeft,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    e.preventDefault();
    e.currentTarget.scrollLeft =
      dragState.current.scrollLeft - (e.clientX - dragState.current.startX);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

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
          className={cn(
            "max-h-60 w-full overflow-auto scrollbar-none",
            isDragging ? "cursor-grabbing" : "cursor-grab",
          )}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div style={{ width: `${trackWidth}px` }}>
            <div className="sticky top-0 z-20 flex h-7 flex-row select-none">
              {hours.map((hourText) => (
                <div
                  key={hourText}
                  className="shrink-0 px-1"
                  style={{ width: `${HOUR_WIDTH}px` }}
                >
                  <Text
                    as="span"
                    className="text-muted-foreground select-none text-xs font-medium"
                  >
                    {hourText}
                  </Text>
                </div>
              ))}
            </div>

            <div className="relative min-h-12 border-x border-b border-border/15 bg-muted/20 select-none">
              <div className="absolute inset-0 pointer-events-none z-0">
                {Array.from({ length: 25 }, (_, i) => (
                  <div
                    key={`h-${i}`}
                    className="absolute top-0 bottom-0 w-px bg-border/25"
                    style={{ left: `${i * HOUR_WIDTH}px` }}
                  />
                ))}
                {Array.from({ length: 24 }, (_, i) => (
                  <div
                    key={`hh-${i}`}
                    className="absolute top-0 bottom-0 w-px bg-border/10"
                    style={{ left: `${(i + 0.5) * HOUR_WIDTH}px` }}
                  />
                ))}

              </div>

              {isToday && (
                <div
                  className="pointer-events-none absolute top-0 bottom-0 z-10"
                  style={{ left: `${currentTimePos}px` }}
                  suppressHydrationWarning
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-primary" />
                  <div className="w-0.5 h-full bg-primary mx-auto" />
                </div>
              )}

              {events
                ? events.map(({ id, ...event }) => (
                    <TimelineCard key={id} {...event} />
                  ))
                : children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
