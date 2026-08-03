import { differenceInCalendarDays, isSameDay, parse } from "date-fns";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Text } from "@/components/ui/text";

import TimelineEvent, {
  HOUR_WIDTH,
  type TimelineEventProps,
} from "./timeline-event";

const HOURS = Array.from({ length: 24 }, (_, hourIndex) => {
  const period = hourIndex >= 12 ? "PM" : "AM";
  const hour = hourIndex % 12 === 0 ? 12 : hourIndex % 12;

  return `${hour}${period}`;
});
const HOUR_MARKERS = Array.from({ length: 25 }, (_, hour) => hour);
const HALF_HOUR_MARKERS = Array.from({ length: 24 }, (_, hour) => hour + 0.5);
const TRACK_WIDTH = 24 * HOUR_WIDTH;

export interface TimelineEntry extends TimelineEventProps {
  id: string;
  date: string;
}

interface TimelineTrackProps {
  children?: ReactNode;
  date: Date | undefined;
  events?: TimelineEntry[];
}

function getTimePosition(date: Date) {
  return (date.getHours() + date.getMinutes() / 60) * HOUR_WIDTH;
}

export default function TimelineTrack({
  children,
  date,
  events,
}: TimelineTrackProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleWheel = (event: WheelEvent) => {
      if (!event.shiftKey) return;

      event.preventDefault();
      container.scrollLeft += event.deltaY || event.deltaX;
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !date) return;

    const isSelectedToday = differenceInCalendarDays(date, new Date()) === 0;
    if (!isSelectedToday) return;

    container.scrollLeft = Math.max(
      0,
      getTimePosition(new Date()) - container.clientWidth / 2,
    );
  }, [date]);

  const isToday = date
    ? differenceInCalendarDays(date, new Date()) === 0
    : false;
  const visibleEvents = events?.filter((event) =>
    isSameDay(parse(event.date, "dd/MM/yyyy", new Date()), date ?? new Date()),
  );

  return (
    <div className="relative w-full min-w-0">
      <ScrollArea
        viewportRef={scrollRef}
        scrollbarOrientation="horizontal"
        type="always"
        className="h-24 w-full"
      >
        <div style={{ width: `${TRACK_WIDTH}px` }}>
          <div className="sticky top-0 z-20 flex h-7 flex-row select-none">
            {HOURS.map((hourText) => (
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
              {HOUR_MARKERS.map((hour) => (
                <div
                  key={`h-${hour}`}
                  className="absolute top-0 bottom-0 w-px bg-border/25"
                  style={{ left: `${hour * HOUR_WIDTH}px` }}
                />
              ))}
              {HALF_HOUR_MARKERS.map((hour) => (
                <div
                  key={`hh-${hour}`}
                  className="absolute top-0 bottom-0 w-px bg-border/10"
                  style={{ left: `${hour * HOUR_WIDTH}px` }}
                />
              ))}
            </div>

            {isToday && (
              <div
                className="pointer-events-none absolute top-0 bottom-0 z-10"
                style={{ left: `${getTimePosition(currentTime)}px` }}
                suppressHydrationWarning
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-primary" />
                <div className="w-0.5 h-full bg-primary mx-auto" />
              </div>
            )}

            {visibleEvents
              ? visibleEvents.map((event) => (
                  <TimelineEvent
                    key={event.id}
                    start={event.start}
                    end={event.end}
                    title={event.title}
                    description={event.description}
                    className={event.className}
                  >
                    {event.children}
                  </TimelineEvent>
                ))
              : children}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
