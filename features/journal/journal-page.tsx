"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  parseISO,
  startOfMonth,
} from "date-fns";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  MoonStarIcon,
  NotebookPenIcon,
  SmileIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGoals } from "@/features/goals/hooks/use-goals";
import { useHabits } from "@/features/habits/hooks/use-habits";

import { DayEntryDialog } from "./components/day-entry-dialog";
import { JournalCharts } from "./components/journal-charts";
import { MonthlyTracker } from "./components/monthly-tracker";
import {
  createInitialJournalEntries,
  EMPTY_JOURNAL_ENTRY,
  MOOD_OPTIONS,
} from "./journal.data";
import { useJournal } from "./hooks/use-journal";
import { copyEntry } from "./journal.store";
import type { CompletionKind, JournalDayEntry } from "./journal.types";
import {
  buildConsistencyData,
  buildJournalStats,
  buildWellbeingData,
  type JournalCalendarDay,
} from "./journal.utils";

interface JournalPageProps {
  initialMonth: string;
  today: string;
}

export function JournalPage({ initialMonth, today }: JournalPageProps) {
  const { habits } = useHabits();
  const { goals } = useGoals();
  const initialEntries = useMemo(
    () => createInitialJournalEntries(initialMonth, today, habits, goals),
    [goals, habits, initialMonth, today],
  );
  const { entries, updateEntries } = useJournal(initialEntries);
  const [visibleMonth, setVisibleMonth] = useState(() =>
    startOfMonth(parseISO(`${initialMonth}-01`)),
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const monthKey = format(visibleMonth, "yyyy-MM");
  const monthLabel = format(visibleMonth, "MMMM yyyy");
  const days = useMemo<JournalCalendarDay[]>(
    () =>
      eachDayOfInterval({
        start: startOfMonth(visibleMonth),
        end: endOfMonth(visibleMonth),
      }).map((date) => ({
        date,
        dateKey: format(date, "yyyy-MM-dd"),
        dayNumber: Number(format(date, "d")),
      })),
    [visibleMonth],
  );
  const monthStartKey = `${monthKey}-01`;
  const monthEndKey = format(endOfMonth(visibleMonth), "yyyy-MM-dd");
  const visibleGoals = useMemo(
    () =>
      goals.filter(
        (goal) =>
          goal.startsOn <= monthEndKey &&
          (!goal.endsOn || goal.endsOn >= monthStartKey),
      ),
    [goals, monthEndKey, monthStartKey],
  );

  const consistencyData = useMemo(
    () => buildConsistencyData(days, entries, habits, visibleGoals, today),
    [days, entries, habits, today, visibleGoals],
  );
  const wellbeingData = useMemo(
    () => buildWellbeingData(days, entries, today),
    [days, entries, today],
  );
  const stats = useMemo(
    () => buildJournalStats(days, entries, habits, visibleGoals, today),
    [days, entries, habits, today, visibleGoals],
  );
  const averageMood =
    stats.averageMood === null
      ? undefined
      : MOOD_OPTIONS[
          Math.max(0, Math.min(4, Math.round(stats.averageMood) - 1))
        ];

  function saveDayEntry(dateKey: string, entry: JournalDayEntry) {
    updateEntries((current) => ({
      ...current,
      [dateKey]: copyEntry(entry),
    }));
    setSelectedDate(null);
    toast.success("Daily entry saved.");
  }

  function clearDayLog(dateKey: string) {
    updateEntries((current) => {
      const currentEntry = copyEntry(current[dateKey]);
      return {
        ...current,
        [dateKey]: {
          ...currentEntry,
          bedtime: "",
          wakeTime: "",
          mood: null,
        },
      };
    });
    setSelectedDate(null);
    toast.success("Sleep and mood cleared.");
  }

  function toggleCompletion(
    dateKey: string,
    kind: CompletionKind,
    itemId: string,
  ) {
    if (dateKey > today) return;

    updateEntries((current) => {
      const entry = copyEntry(current[dateKey]);
      const field = kind === "habit" ? "completedHabitIds" : "completedGoalIds";
      const values = entry[field];
      const nextValues = values.includes(itemId)
        ? values.filter((id) => id !== itemId)
        : [...values, itemId];

      return {
        ...current,
        [dateKey]: { ...entry, [field]: nextValues },
      };
    });
  }

  function returnToCurrentMonth() {
    setVisibleMonth(startOfMonth(parseISO(`${initialMonth}-01`)));
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-2xl">
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Bullet journal
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {monthKey !== initialMonth && (
            <Button
              type="button"
              variant="outline"
              onClick={returnToCurrentMonth}
            >
              Today
            </Button>
          )}
          <div className="flex items-center rounded-xl border bg-card p-1 shadow-xs">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() =>
                setVisibleMonth((current) => addMonths(current, -1))
              }
              aria-label="Previous month"
            >
              <ArrowLeftIcon />
            </Button>
            <span className="min-w-32 px-2 text-center text-sm font-semibold">
              {monthLabel}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() =>
                setVisibleMonth((current) => addMonths(current, 1))
              }
              aria-label="Next month"
            >
              <ArrowRightIcon />
            </Button>
          </div>
        </div>
      </header>

      <MonthlyTracker
        monthLabel={monthLabel}
        days={days}
        entries={entries}
        habits={habits}
        goals={visibleGoals}
        today={today}
        onOpenDay={setSelectedDate}
        onToggleCompletion={toggleCompletion}
      />

      <JournalCharts
        monthLabel={monthLabel}
        consistency={consistencyData}
        wellbeing={wellbeingData}
      />

      {selectedDate && (
        <DayEntryDialog
          key={selectedDate}
          dateKey={selectedDate}
          entry={entries[selectedDate] ?? EMPTY_JOURNAL_ENTRY}
          open
          onOpenChange={(open) => {
            if (!open) setSelectedDate(null);
          }}
          onSave={saveDayEntry}
          onClear={clearDayLog}
        />
      )}
    </div>
  );
}

function MetricCard({
  icon,
  iconClassName,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  iconClassName: string;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <Card size="sm" className="gap-0 py-0">
      <CardContent className="flex items-center gap-3 py-3">
        <span
          className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground">
            {label}
          </p>
          <p className="truncate font-heading text-lg font-bold tracking-tight">
            {value}
          </p>
          <p className="truncate text-[10px] text-muted-foreground">{detail}</p>
        </div>
      </CardContent>
    </Card>
  );
}
