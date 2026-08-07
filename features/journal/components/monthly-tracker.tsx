"use client";

import type { CSSProperties } from "react";
import { CheckIcon, MoonStarIcon, SmileIcon, TargetIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CATEGORY_STYLES } from "@/features/habits/habits.config";
import type { Habit } from "@/features/habits/habits.types";
import type { Goal } from "@/features/goals/goals.types";
import { cn } from "@/lib/utils";

import type { CompletionKind, JournalEntries } from "../journal.types";
import {
  formatSleepDuration,
  getMoodOption,
  getSleepHours,
  isGoalActive,
  isHabitScheduled,
  type JournalCalendarDay,
} from "../journal.utils";
import { MoodIcon } from "./mood-icon";

interface MonthlyTrackerProps {
  monthLabel: string;
  days: JournalCalendarDay[];
  entries: JournalEntries;
  habits: Habit[];
  goals: Goal[];
  today: string;
  onOpenDay: (dateKey: string) => void;
  onToggleCompletion: (
    dateKey: string,
    kind: CompletionKind,
    itemId: string,
  ) => void;
}

function getDayTone(day: JournalCalendarDay, today: string) {
  const weekend = day.date.getDay() === 0 || day.date.getDay() === 6;
  return cn(
    weekend && "bg-muted/25",
    day.dateKey === today && "bg-primary/10",
    day.dateKey > today && "opacity-40",
  );
}

function TrackerLabel({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="sticky left-0 z-10 flex h-13 min-w-0 items-center gap-2.5 border-r bg-card/95 px-3 backdrop-blur-sm">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground [&_svg]:size-4">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold">{label}</span>
      </span>
    </div>
  );
}

function SummaryCell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-13 items-center justify-center border-l bg-card/70 px-1 text-center font-mono text-xs font-semibold tabular-nums">
      {children}
    </div>
  );
}

export function MonthlyTracker({
  monthLabel,
  days,
  entries,
  habits,
  goals,
  today,
  onOpenDay,
  onToggleCompletion,
}: MonthlyTrackerProps) {
  const gridStyle: CSSProperties = {
    gridTemplateColumns: `var(--journal-label-width) repeat(${days.length}, minmax(38px, 1fr)) 64px`,
    minWidth: `calc(var(--journal-label-width) + ${64 + days.length * 38}px)`,
  };
  const trackerHeight =
    166 + 52 * Math.max(habits.length, 1) + 52 * Math.max(goals.length, 1);

  return (
    <Card className="relative gap-0 overflow-hidden py-0">

      <ScrollArea
        type="always"
        scrollbarOrientation="horizontal"
        className="relative"
        style={{ height: trackerHeight }}
      >
        <div
          role="grid"
          aria-label={`${monthLabel} habit and wellbeing tracker`}
          className="[--journal-label-width:140px] sm:[--journal-label-width:180px]"
        >
          <div
            role="row"
            className="grid border-b bg-card/65 backdrop-blur-sm"
            style={gridStyle}
          >
            <div className="sticky left-0 z-10 flex h-14 items-center border-r bg-card/95 px-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Days
            </div>
            {days.map((day) => (
              <button
                key={day.dateKey}
                type="button"
                disabled={day.dateKey > today}
                onClick={() => onOpenDay(day.dateKey)}
                aria-label={`Edit ${day.dateKey}`}
                aria-current={day.dateKey === today ? "date" : undefined}
                className={cn(
                  "flex h-14 cursor-pointer flex-col items-center justify-center border-r text-xs text-muted-foreground outline-none hover:bg-primary/10 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:cursor-not-allowed",
                  getDayTone(day, today),
                )}
              >
                <span className="uppercase">
                  {day.date.toLocaleDateString("en", { weekday: "narrow" })}
                </span>
                <span
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full font-mono text-sm font-semibold tabular-nums text-foreground",
                    day.dateKey === today &&
                      "bg-primary text-primary-foreground shadow-sm",
                  )}
                >
                  {day.dayNumber}
                </span>
              </button>
            ))}
            <div className="flex h-12 items-center justify-center border-l bg-card/80 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              Average
            </div>
          </div>

          <div role="row" className="grid border-b" style={gridStyle}>
            <TrackerLabel
              icon={<MoonStarIcon className="size-3.5" />}
              label="Sleep time"
            />
            {days.map((day) => {
              const hours = getSleepHours(entries[day.dateKey]);
              return (
                <button
                  key={day.dateKey}
                  type="button"
                  disabled={day.dateKey > today}
                  onClick={() => onOpenDay(day.dateKey)}
                  aria-label={`${day.dateKey}: ${formatSleepDuration(hours)} of sleep`}
                  className={cn(
                    "flex h-13 cursor-pointer items-center justify-center border-r font-mono text-xs font-semibold tabular-nums outline-none hover:bg-indigo-400/10 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:cursor-not-allowed",
                    getDayTone(day, today),
                    hours !== null && "text-indigo-500 dark:text-indigo-300",
                  )}
                >
                  {hours === null ? "·" : formatSleepDuration(hours)}
                </button>
              );
            })}
            <SummaryCell>
              {formatSleepDuration(
                average(
                  days.flatMap((day) => {
                    if (day.dateKey > today) return [];
                    const hours = getSleepHours(entries[day.dateKey]);
                    return hours === null ? [] : [hours];
                  }),
                ),
              )}
            </SummaryCell>
          </div>

          <div role="row" className="grid border-b" style={gridStyle}>
            <TrackerLabel
              icon={<SmileIcon className="size-3.5" />}
              label="Your Mood"
            />
            {days.map((day) => {
              const mood = getMoodOption(entries[day.dateKey]?.mood);
              return (
                <button
                  key={day.dateKey}
                  type="button"
                  disabled={day.dateKey > today}
                  onClick={() => onOpenDay(day.dateKey)}
                  aria-label={`${day.dateKey}: ${mood?.label ?? "No mood logged"}`}
                  className={cn(
                    "flex h-13 cursor-pointer items-center justify-center border-r text-xl outline-none hover:bg-primary/10 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:cursor-not-allowed",
                    getDayTone(day, today),
                  )}
                >
                  {mood ? (
                    <MoodIcon mood={mood.value} className="size-8" />
                  ) : (
                    <span className="font-mono text-[10px] text-muted-foreground">
                      ·
                    </span>
                  )}
                </button>
              );
            })}
            <SummaryCell>
              {
                days.filter(
                  (day) => day.dateKey <= today && entries[day.dateKey]?.mood,
                ).length
              }
              /{days.filter((day) => day.dateKey <= today).length}
            </SummaryCell>
          </div>

          {habits.length > 0 ? (
            habits.map((habit) => {
              const category = CATEGORY_STYLES[habit.category];
              const CategoryIcon = category.icon;
              return (
                <CompletionRow
                  key={habit.id}
                  label={habit.name}
                  icon={<CategoryIcon className="size-3.5" />}
                  kind="habit"
                  itemId={habit.id}
                  days={days}
                  today={today}
                  entries={entries}
                  gridStyle={gridStyle}
                  isScheduled={(day) => isHabitScheduled(habit, day.date)}
                  onToggle={onToggleCompletion}
                />
              );
            })
          ) : (
            <EmptyRow label="No habits yet" gridStyle={gridStyle} />
          )}

          {goals.length > 0 ? (
            goals.map((goal) => (
              <CompletionRow
                key={goal.id}
                label={goal.title}
                icon={
                  <span className="text-sm leading-none" aria-hidden="true">
                    {goal.emoji || <TargetIcon className="size-3.5" />}
                  </span>
                }
                kind="goal"
                itemId={goal.id}
                days={days}
                today={today}
                entries={entries}
                gridStyle={gridStyle}
                isScheduled={(day) => isGoalActive(goal, day.dateKey)}
                onToggle={onToggleCompletion}
              />
            ))
          ) : (
            <EmptyRow
              label="No active goals this month"
              gridStyle={gridStyle}
            />
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}

function CompletionRow({
  label,
  icon,
  kind,
  itemId,
  days,
  today,
  entries,
  gridStyle,
  isScheduled,
  onToggle,
}: {
  label: string;
  icon: React.ReactNode;
  kind: CompletionKind;
  itemId: string;
  days: JournalCalendarDay[];
  today: string;
  entries: JournalEntries;
  gridStyle: CSSProperties;
  isScheduled: (day: JournalCalendarDay) => boolean;
  onToggle: MonthlyTrackerProps["onToggleCompletion"];
}) {
  const elapsedScheduledDays = days.filter(
    (day) => day.dateKey <= today && isScheduled(day),
  );
  const completionField =
    kind === "habit" ? "completedHabitIds" : "completedGoalIds";
  const completedCount = elapsedScheduledDays.filter((day) =>
    entries[day.dateKey]?.[completionField].includes(itemId),
  ).length;
  const percentage =
    elapsedScheduledDays.length > 0
      ? Math.round((completedCount / elapsedScheduledDays.length) * 100)
      : 0;

  return (
    <div role="row" className="grid border-b last:border-b-0" style={gridStyle}>
      <TrackerLabel icon={icon} label={label} />
      {days.map((day) => {
        const scheduled = isScheduled(day);
        const completed = Boolean(
          entries[day.dateKey]?.[completionField].includes(itemId),
        );
        const future = day.dateKey > today;

        return (
          <div
            key={day.dateKey}
            role="gridcell"
            className={cn(
              "flex h-13 items-center justify-center border-r",
              getDayTone(day, today),
            )}
          >
            {scheduled ? (
              <button
                type="button"
                disabled={future}
                aria-pressed={completed}
                aria-label={`${completed ? "Unmark" : "Mark"} ${label} on ${day.dateKey}`}
                onClick={() => onToggle(day.dateKey, kind, itemId)}
                className={cn(
                  "flex size-6 cursor-pointer items-center justify-center rounded-md border outline-none transition-all hover:scale-110 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed",
                  completed
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-foreground/25 bg-background/80 hover:border-primary/70 hover:bg-primary/10",
                )}
              >
                {completed && (
                  <CheckIcon className="size-4" aria-hidden="true" />
                )}
              </button>
            ) : (
              <span
                className="h-px w-3 rotate-[-35deg] bg-muted-foreground/25"
                aria-label="Not scheduled"
              />
            )}
          </div>
        );
      })}
      <SummaryCell>{percentage}%</SummaryCell>
    </div>
  );
}

function EmptyRow({
  label,
  gridStyle,
}: {
  label: string;
  gridStyle: CSSProperties;
}) {
  return (
    <div className="grid border-b" style={gridStyle}>
      <div
        className="flex h-13 items-center px-3 text-sm text-muted-foreground"
        style={{ gridColumn: "1 / -1" }}
      >
        {label}
      </div>
    </div>
  );
}

function average(values: number[]) {
  if (values.length === 0) return null;
  return (
    Math.round(
      (values.reduce((sum, value) => sum + value, 0) / values.length) * 10,
    ) / 10
  );
}
