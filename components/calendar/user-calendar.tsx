"use client";

import * as React from "react";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
  type Day,
} from "date-fns";
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EmojiAvatar } from "../ui/emoji-calendar";
import { AvatarGroup, AvatarGroupCount } from "../ui/avatar";

const MAX_VISIBLE_GOALS = 3;

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date | string;
  time?: string;
  color?: string;
  choosen_emoji?: string;
  choosen_color?: string;
}

export interface CalendarDayContext {
  date: Date;
  isCurrentMonth: boolean;
  isDisabled: boolean;
  isSelected: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

export interface CalendarClassNames {
  root?: string;
  toolbar?: string;
  grid?: string;
  weekday?: string;
  day?: string;
  dayButton?: string;
  event?: string;
}

export interface CalendarProps {
  className?: string;
  classNames?: CalendarClassNames;
  events?: CalendarEvent[];
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  selected?: Date;
  defaultSelected?: Date;
  onSelect?: (date: Date | undefined) => void;
  onEventClick?: (event: CalendarEvent) => void;
  isDateDisabled?: (date: Date) => boolean;
  renderDayContent?: (day: CalendarDayContext) => React.ReactNode;
  renderEvent?: (event: CalendarEvent) => React.ReactNode;
  locale?: string;
  weekStartsOn?: Day;
  fixedWeeks?: boolean;
  showOutsideDays?: boolean;
  navigateOnOutsideDayClick?: boolean;
  maxEventsPerDay?: number;
}

const dateKey = (date: Date) => format(date, "yyyy-MM-dd");

function getEventDate(date: Date | string) {
  return typeof date === "string" ? parseISO(date) : date;
}

export function UserCalendar({
  className,
  classNames,
  events = [],
  month,
  defaultMonth,
  onMonthChange,
  selected,
  defaultSelected,
  onSelect,
  onEventClick,
  isDateDisabled,
  renderDayContent,
  renderEvent,
  locale = "en-US",
  weekStartsOn = 0,
  fixedWeeks = true,
  showOutsideDays = true,
  navigateOnOutsideDayClick = true,
  maxEventsPerDay = 3,
}: CalendarProps) {
  const calendarRef = React.useRef<HTMLElement>(null);
  const today = React.useMemo(() => new Date(), []);
  const [internalMonth, setInternalMonth] = React.useState(() =>
    startOfMonth(defaultMonth ?? defaultSelected ?? today),
  );
  const [internalSelected, setInternalSelected] = React.useState<
    Date | undefined
  >(defaultSelected);

  const visibleMonth = startOfMonth(month ?? internalMonth);
  const selectedDate = selected ?? internalSelected;

  React.useEffect(() => {
    if (!selectedDate) return;

    const clearSelectionOnOutsideClick = (event: PointerEvent) => {
      if (calendarRef.current?.contains(event.target as Node)) return;

      if (selected === undefined) {
        setInternalSelected(undefined);
      }

      onSelect?.(undefined);
    };

    document.addEventListener("pointerdown", clearSelectionOnOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", clearSelectionOnOutsideClick);
    };
  }, [onSelect, selected, selectedDate]);

  const calendarDays = React.useMemo(() => {
    const firstDay = startOfWeek(startOfMonth(visibleMonth), { weekStartsOn });
    const lastDay = fixedWeeks
      ? addDays(firstDay, 41)
      : endOfWeek(endOfMonth(visibleMonth), { weekStartsOn });

    return eachDayOfInterval({ start: firstDay, end: lastDay });
  }, [fixedWeeks, visibleMonth, weekStartsOn]);

  const weekdayLabels = React.useMemo(() => {
    const firstWeekday = startOfWeek(new Date(2024, 0, 7), { weekStartsOn });

    return Array.from({ length: 7 }, (_, index) =>
      new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
        addDays(firstWeekday, index),
      ),
    );
  }, [locale, weekStartsOn]);

  const eventsByDate = React.useMemo(() => {
    const grouped = new Map<string, CalendarEvent[]>();

    for (const event of events) {
      const key = dateKey(getEventDate(event.date));
      grouped.set(key, [...(grouped.get(key) ?? []), event]);
    }

    return grouped;
  }, [events]);

  const setVisibleMonth = (nextMonth: Date) => {
    const normalizedMonth = startOfMonth(nextMonth);

    if (month === undefined) {
      setInternalMonth(normalizedMonth);
    }

    onMonthChange?.(normalizedMonth);
  };

  const selectDay = (date: Date, isCurrentMonth: boolean) => {
    if (isDateDisabled?.(date)) return;

    const nextSelectedDate =
      selectedDate && isSameDay(date, selectedDate) ? undefined : date;

    if (selected === undefined) {
      setInternalSelected(nextSelectedDate);
    }

    if (nextSelectedDate && !isCurrentMonth && navigateOnOutsideDayClick) {
      setVisibleMonth(date);
    }

    onSelect?.(nextSelectedDate);
  };

  return (
    <section
      ref={calendarRef}
      aria-label="Calendar"
      className={cn("w-full min-w-0", classNames?.root, className)}
    >
      <div
        className={cn(
          "mb-4 flex flex-wrap items-center gap-2",
          classNames?.toolbar,
        )}
      >
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            onClick={() => setVisibleMonth(today)}
          >
            <CalendarDaysIcon data-icon="inline-start" />
            Today
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="Previous month"
            onClick={() => setVisibleMonth(subMonths(visibleMonth, 1))}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="Next month"
            onClick={() => setVisibleMonth(addMonths(visibleMonth, 1))}
          >
            <ChevronRightIcon />
          </Button>
          <div>
            <p
              className="text-lg font-semibold capitalize"
              aria-live="polite"
              aria-atomic="true"
            >
              {new Intl.DateTimeFormat(locale, {
                month: "long",
                year: "numeric",
              }).format(visibleMonth)}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-background">
        <div
          role="grid"
          aria-label={new Intl.DateTimeFormat(locale, {
            month: "long",
            year: "numeric",
          }).format(visibleMonth)}
          className={cn("min-w-175", classNames?.grid)}
        >
          <div role="row" className="grid grid-cols-7 border-b bg-muted/35">
            {weekdayLabels.map((weekday, index) => (
              <div
                role="columnheader"
                key={`${weekday}-${index}`}
                className={cn(
                  "px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                  classNames?.weekday,
                )}
              >
                {weekday}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map((date, index) => {
              const isCurrentMonth = isSameMonth(date, visibleMonth);
              const isDisabled = isDateDisabled?.(date) ?? false;
              const isSelected = selectedDate
                ? isSameDay(date, selectedDate)
                : false;
              const isToday = isSameDay(date, today);
              const dayEvents = eventsByDate.get(dateKey(date)) ?? [];
              const visibleEvents = dayEvents.slice(
                0,
                Math.min(maxEventsPerDay, MAX_VISIBLE_GOALS),
              );
              const hiddenEventCount = dayEvents.length - visibleEvents.length;
              const dayContext: CalendarDayContext = {
                date,
                isCurrentMonth,
                isDisabled,
                isSelected,
                isToday,
                events: dayEvents,
              };

              return (
                <div
                  onClick={() => selectDay(date, isCurrentMonth)}
                  role="gridcell"
                  aria-selected={isSelected}
                  key={date.toISOString()}
                  className={cn(
                    "cursor-pointer min-h-28 border-b border-r p-2 transition-colors flex flex-col justify-between",
                    isToday && "bg-muted/50",
                    index % 7 === 6 && "border-r-0",
                    index >= calendarDays.length - 7 && "border-b-0",
                    !isCurrentMonth && "bg-muted/15",
                    isSelected && "bg-primary/8",
                    classNames?.day,
                  )}
                >
                  <div className="flex w-full justify-end">
                    <span
                      aria-label={new Intl.DateTimeFormat(locale, {
                        dateStyle: "full",
                      }).format(date)}
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
                      {renderDayContent?.(dayContext) ?? format(date, "d")}
                    </span>
                  </div>
                  {(isCurrentMonth || showOutsideDays) && (
                    <div className="mt-1 space-y-1">
                      {(visibleEvents.some((event) => event.choosen_emoji) ||
                        hiddenEventCount > 0) && (
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
                            <AvatarGroupCount>
                              +{hiddenEventCount}
                            </AvatarGroupCount>
                          )}
                        </AvatarGroup>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
