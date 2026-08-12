import type { CSSProperties } from "react";

import { EmojiAvatar } from "@/components/ui/emoji-avatar";

import type { CalendarEvent } from "./schedule-calendar.types";

interface CalendarEventCardProps {
  event: CalendarEvent;
  onClick: () => void;
}

function getEventTime(event: CalendarEvent) {
  if (event.timeBlocks?.length) {
    return event.timeBlocks
      .map(({ startTime, endTime }) => `${startTime}–${endTime}`)
      .join(" • ");
  }

  if (event.startTime && event.endTime) {
    return `${event.startTime}–${event.endTime}`;
  }

  return event.startTime ?? event.endTime ?? event.time;
}

export function CalendarEventCard({ event, onClick }: CalendarEventCardProps) {
  const eventTime = getEventTime(event);
  const eventStyle = {
    "--event-color": event.choosen_color,
  } as CSSProperties;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full cursor-pointer items-center gap-3 rounded-lg border bg-transparent p-3 text-left outline-none transition-colors hover:bg-(--event-color)/20 focus-visible:ring-2 focus-visible:ring-ring"
      style={eventStyle}
    >
      {event.choosen_emoji && (
        <EmojiAvatar
          size="sm"
          title={event.title}
          choosen_emoji={event.choosen_emoji}
          choosen_color={event.choosen_color}
        />
      )}
      <div className="min-w-0">
        <h3 className="truncate font-medium">{event.title}</h3>
        {eventTime && (
          <p className="text-xs text-muted-foreground">{eventTime}</p>
        )}
      </div>
    </button>
  );
}
