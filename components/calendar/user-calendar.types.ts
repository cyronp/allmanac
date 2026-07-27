import type * as React from "react";
import type { Day } from "date-fns";

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date | string;
  time?: string;
  startTime?: string;
  endTime?: string;
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
