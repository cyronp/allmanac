import * as React from "react";
import { format } from "date-fns";
import { CalendarDaysIcon, Clock3Icon, XIcon } from "lucide-react";

import { AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { EmojiAvatar } from "@/components/ui/emoji-avatar";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import type {
  CalendarClassNames,
  CalendarDayContext,
  CalendarEvent,
} from "./schedule-calendar.types";
import { CalendarEventCard } from "./calendar-event-card";

const MAX_VISIBLE_GOALS = 3;

interface ScheduleCalendarDayProps {
  day: CalendarDayContext;
  classNames?: CalendarClassNames;
  isLastColumn: boolean;
  isLastRow: boolean;
  locale: string;
  maxEventsPerDay: number;
  showOutsideDays: boolean;
  onSelect: (date: Date, isCurrentMonth: boolean) => void;
  renderDayContent?: (day: CalendarDayContext) => React.ReactNode;
}

export function ScheduleCalendarDay({
  day,
  classNames,
  isLastColumn,
  isLastRow,
  locale,
  maxEventsPerDay,
  showOutsideDays,
  onSelect,
  renderDayContent,
}: ScheduleCalendarDayProps) {
  const [selectedEvent, setSelectedEvent] = React.useState<
    CalendarEvent | undefined
  >();
  const { date, events, isCurrentMonth, isDisabled, isSelected, isToday } = day;
  const visibleEvents = events.slice(
    0,
    Math.min(maxEventsPerDay, MAX_VISIBLE_GOALS),
  );
  const hiddenEventCount = events.length - visibleEvents.length;
  const hasEventAvatars =
    visibleEvents.some((event) => event.choosen_emoji) || hiddenEventCount > 0;

  const dateLabel = new Intl.DateTimeFormat(locale, {
    dateStyle: "full",
  }).format(date);

  const activityCountLabel =
    events.length === 0
      ? "No activities scheduled."
      : `${events.length} ${events.length === 1 ? "activity" : "activities"} scheduled.`;

  const handlePopoverOpenChange = (open: boolean) => {
    if (open !== isSelected) {
      onSelect(date, isCurrentMonth);
    }
  };

  const handleEventSelect = (event: CalendarEvent) => {
    setSelectedEvent(event);

    if (isSelected) {
      onSelect(date, isCurrentMonth);
    }
  };

  const activityTypeLabel =
    selectedEvent?.activityType === "goal"
      ? "Goal"
      : selectedEvent?.activityType === "commitment"
        ? "Commitment"
        : "Activity";

  const selectedTimeBlocks = selectedEvent?.timeBlocks?.length
    ? selectedEvent.timeBlocks
    : selectedEvent?.startTime || selectedEvent?.endTime || selectedEvent?.time
      ? [
          {
            id: `${selectedEvent.id}-time`,
            startTime: selectedEvent.startTime ?? selectedEvent.time ?? "",
            endTime: selectedEvent.endTime ?? "",
          },
        ]
      : [];

  return (
    <>
      <Popover open={isSelected} onOpenChange={handlePopoverOpenChange}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="gridcell"
            aria-label={`${dateLabel}. ${activityCountLabel}`}
            aria-current={isToday ? "date" : undefined}
            aria-selected={isSelected}
            disabled={isDisabled}
            className={cn(
              "flex min-h-28 w-full cursor-pointer select-none flex-col justify-between border-b border-r p-2 text-left outline-none transition-colors focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:cursor-not-allowed",
              isToday && "bg-muted/50",
              isLastColumn && "border-r-0",
              isLastRow && "border-b-0",
              !isCurrentMonth && "bg-muted/15",
              isSelected && "bg-primary/8",
              isDisabled && "opacity-35",
              classNames?.day,
            )}
          >
            <div className="flex w-full justify-end">
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-md text-sm font-medium",
                  isToday && "bg-primary text-primary-foreground",
                  isSelected &&
                    !isToday &&
                    "ring-2 ring-primary ring-offset-2 ring-offset-background",
                  !isCurrentMonth && "opacity-60",
                  !isCurrentMonth && !showOutsideDays && "invisible",
                  classNames?.dayButton,
                )}
              >
                {renderDayContent?.(day) ?? format(date, "d")}
              </span>
            </div>

            {(isCurrentMonth || showOutsideDays) && (
              <div className="mt-1 space-y-1">
                {hasEventAvatars && (
                  <AvatarGroup>
                    {visibleEvents.map(
                      (event) =>
                        event.choosen_emoji && (
                          <EmojiAvatar
                            className={!isCurrentMonth ? "grayscale" : ""}
                            key={event.id}
                            size="sm"
                            title={event.title}
                            choosen_emoji={event.choosen_emoji}
                            choosen_color={event.choosen_color}
                          />
                        ),
                    )}
                    {hiddenEventCount > 0 && (
                      <AvatarGroupCount>+{hiddenEventCount}</AvatarGroupCount>
                    )}
                  </AvatarGroup>
                )}
              </div>
            )}
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-80" sideOffset={8} align="start">
          <PopoverHeader>
            <PopoverTitle>{dateLabel}</PopoverTitle>
            <PopoverDescription>{activityCountLabel}</PopoverDescription>
          </PopoverHeader>
          <div className="grid gap-1.5 border-t pt-2">
            <p className="text-xs font-medium">Activities</p>
            {events.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No activities scheduled for this day.
              </p>
            ) : (
              <div className="grid gap-2">
                {events.map((event) => (
                  <CalendarEventCard
                    key={event.id}
                    event={event}
                    onClick={() => handleEventSelect(event)}
                  />
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      <Drawer
        direction="right"
        open={Boolean(selectedEvent)}
        onOpenChange={(open) => {
          if (!open) setSelectedEvent(undefined);
        }}
      >
        <DrawerContent className="overflow-y-auto">
          <DrawerClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute top-3 right-3 z-10"
              aria-label="Close activity details"
            >
              <XIcon />
            </Button>
          </DrawerClose>

          {selectedEvent && (
            <>
              <DrawerHeader className="border-b pr-12">
                <div className="mb-3 flex items-center gap-3">
                  {selectedEvent.choosen_emoji && (
                    <EmojiAvatar
                      size="lg"
                      title={selectedEvent.title}
                      choosen_emoji={selectedEvent.choosen_emoji}
                      choosen_color={selectedEvent.choosen_color}
                    />
                  )}
                  <div className="min-w-0">
                    <DrawerTitle className="mt-1 text-xl">
                      {selectedEvent.title}
                    </DrawerTitle>
                  </div>
                </div>
                <DrawerDescription>
                  Activity details and schedule.
                </DrawerDescription>
              </DrawerHeader>

              <div className="grid gap-6 p-4">
                <section className="grid gap-2">
                  <h3 className="text-sm font-semibold">Description</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {selectedEvent.description || "No description provided."}
                  </p>
                </section>

                <section className="grid gap-3">
                  <h3 className="text-sm font-semibold">Schedule</h3>
                  <div className="flex items-start gap-3 rounded-lg border p-3">
                    <CalendarDaysIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="font-medium">{dateLabel}</p>
                    </div>
                  </div>

                  {selectedTimeBlocks.map((timeBlock) => (
                    <div
                      key={timeBlock.id}
                      className="flex items-start gap-3 rounded-lg border p-3"
                    >
                      <Clock3Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Time</p>
                        <p className="font-medium">
                          {timeBlock.endTime
                            ? `${timeBlock.startTime}–${timeBlock.endTime}`
                            : timeBlock.startTime}
                        </p>
                      </div>
                    </div>
                  ))}
                </section>
              </div>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
