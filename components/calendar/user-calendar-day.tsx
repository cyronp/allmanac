import type * as React from "react";
import { format } from "date-fns";

import { AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { EmojiAvatar } from "@/components/ui/emoji-calendar";
import { cn } from "@/lib/utils";

import type {
  CalendarClassNames,
  CalendarDayContext,
} from "./user-calendar.types";
import { UserCalendarGoalCard } from "./user-calendar-goal-card";

const MAX_VISIBLE_GOALS = 3;

interface UserCalendarDayProps {
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

export function UserCalendarDay({
  day,
  classNames,
  isLastColumn,
  isLastRow,
  locale,
  maxEventsPerDay,
  showOutsideDays,
  onSelect,
  renderDayContent,
}: UserCalendarDayProps) {
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

  const handleDrawerOpenChange = (open: boolean) => {
    if (!open && isSelected) {
      onSelect(date, isCurrentMonth);
    }
  };

  return (
    <Drawer
      direction="right"
      open={isSelected}
      onOpenChange={handleDrawerOpenChange}
    >
      <div
        onClick={() => onSelect(date, isCurrentMonth)}
        role="gridcell"
        aria-selected={isSelected}
        className={cn(
          "select-none flex min-h-28 cursor-pointer flex-col justify-between border-b border-r p-2 transition-colors",
          isToday && "bg-muted/50",
          isLastColumn && "border-r-0",
          isLastRow && "border-b-0",
          !isCurrentMonth && "bg-muted/15",
          isSelected && "bg-primary/8",
          classNames?.day,
        )}
      >
        <div className="flex w-full justify-end">
          <span
            aria-label={dateLabel}
            aria-current={isToday ? "date" : undefined}
            className={cn(
              "flex size-8 items-center justify-center rounded-md text-sm font-medium text-white",
              isToday && "bg-primary text-primary-foreground",
              isSelected &&
                !isToday &&
                "ring-2 ring-primary ring-offset-2 ring-offset-background",
              !isCurrentMonth && "opacity-60",
              !isCurrentMonth && !showOutsideDays && "invisible",
              isDisabled && "opacity-35",
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
      </div>

      <DrawerContent onPointerDown={(event) => event.stopPropagation()}>
        <DrawerHeader>
          <DrawerTitle>{dateLabel}</DrawerTitle>
          <DrawerDescription>
            {events.length === 0
              ? "No goals scheduled for this day."
              : `${events.length} ${events.length === 1 ? "goal" : "goals"} scheduled.`}
          </DrawerDescription>
        </DrawerHeader>

        {events.length > 0 && (
          <div className="space-y-2 px-4 pb-4">
            {events.map((event) => (
              <UserCalendarGoalCard key={event.id} goal={event} />
            ))}
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
