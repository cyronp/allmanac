"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { format, parseISO } from "date-fns";
import { CheckIcon, Clock3Icon } from "lucide-react";

import { dashboardMockDatabase } from "@/app/types/dashboard-data";
import {
  getActivityOccurrences,
  groupActivityOccurrences,
} from "@/lib/dashboard-schedule";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface TodaysDoProps {
  initialDate: string;
  completionOverrides: Record<string, boolean>;
  onCompletionChange: (
    date: string,
    activityId: string,
    completed: boolean,
  ) => void;
}

export default function TodaysDo({
  initialDate,
  completionOverrides,
  onCompletionChange,
}: TodaysDoProps) {
  const subscribeToCurrentDay = useCallback((onDayChange: () => void) => {
    const intervalId = window.setInterval(onDayChange, 60_000);
    window.addEventListener("focus", onDayChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", onDayChange);
    };
  }, []);
  const getCurrentDay = useCallback(() => format(new Date(), "yyyy-MM-dd"), []);
  const getServerDay = useCallback(() => initialDate, [initialDate]);
  const todayKey = useSyncExternalStore(
    subscribeToCurrentDay,
    getCurrentDay,
    getServerDay,
  );

  const today = useMemo(() => parseISO(todayKey), [todayKey]);
  const items = useMemo(
    () =>
      groupActivityOccurrences(
        getActivityOccurrences(dashboardMockDatabase, today, today),
      ),
    [today],
  );
  const completedActivityIds = useMemo(
    () =>
      new Set(
        dashboardMockDatabase.activityCompletions
          .filter((completion) => completion.completedOn === todayKey)
          .map((completion) => completion.activityId),
      ),
    [todayKey],
  );

  return (
    <section
      className="flex h-full min-h-80 min-w-0 flex-col rounded-xl border border-border/70 bg-accent/20 p-4 shadow-xs backdrop-blur-2xl"
      aria-labelledby="todays-do-heading"
    >
      <header className="mb-4">
        <h2
          id="todays-do-heading"
          className="text-lg font-semibold tracking-tight"
        >
          Today&apos;s Todos
        </h2>
        <p className="text-sm text-muted-foreground">
          {format(today, "EEEE, MMMM d")}
        </p>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-border/80 px-6 text-center text-sm text-muted-foreground">
          Nothing planned for today.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => {
            const overrideKey = `${todayKey}:${item.activityId}`;
            const isCompleted =
              completionOverrides[overrideKey] ??
              completedActivityIds.has(item.activityId);
            const timeLabel = item.timeBlocks
              .map(
                (timeBlock) => `${timeBlock.startTime} – ${timeBlock.endTime}`,
              )
              .join(" · ");

            return (
              <article
                key={item.id}
                className={cn(
                  "flex min-w-0 items-center gap-3 rounded-xl border border-border/70 bg-card p-3 transition-colors",
                  isCompleted && "bg-muted/45",
                )}
              >
                <div
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 text-xl shadow-xs"
                  style={{ backgroundColor: item.chosenColor }}
                  aria-hidden="true"
                >
                  {item.chosenEmoji}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <h3
                      className={cn(
                        "truncate text-sm font-semibold",
                        isCompleted && "line-through decoration-2",
                      )}
                    >
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock3Icon
                      className="size-3.5 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="truncate">{timeLabel}</span>
                  </p>
                </div>

                <Checkbox
                  aria-label={`Mark ${item.title} ${isCompleted ? "incomplete" : "complete"}`}
                  aria-pressed={isCompleted}
                  onClick={() =>
                    onCompletionChange(todayKey, item.activityId, !isCompleted)
                  }
                  className="p-4"
                />
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
