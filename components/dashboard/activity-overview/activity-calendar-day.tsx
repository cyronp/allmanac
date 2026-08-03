import { format } from "date-fns";

import type { DayProgress } from "@/components/dashboard/activity-overview/activity-overview.types";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ActivityCalendarDayProps {
  day: Date;
  isOpen: boolean;
  isToday: boolean;
  onOpenChange: (open: boolean) => void;
  progress: DayProgress;
}

export default function ActivityCalendarDay({
  day,
  isOpen,
  isToday,
  onOpenChange,
  progress,
}: ActivityCalendarDayProps) {
  const completionLabel =
    progress.total === 0
      ? "No activities scheduled."
      : `${progress.completed} of ${progress.total} activities completed.`;

  return (
    <div role="gridcell" className="flex justify-center">
      <Popover open={isOpen} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-current={isToday ? "date" : undefined}
            aria-label={`${format(day, "EEEE, MMMM d, yyyy")}. ${completionLabel}`}
            title={completionLabel}
            className={cn(
              "relative isolate flex size-10 items-center justify-center rounded-full text-sm font-medium outline-none transition-transform focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              isOpen && "ring-2 ring-foreground/50 ring-offset-1",
            )}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 40 40"
              className="absolute inset-0 size-full -rotate-90 overflow-visible"
            >
              <circle
                cx="20"
                cy="20"
                r="18"
                fill="none"
                strokeWidth="2"
                className="stroke-border"
              />
              {progress.total > 0 && (
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  fill="none"
                  pathLength="100"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={`${progress.percentage} 100`}
                  className="stroke-primary transition-[stroke-dasharray] duration-300"
                />
              )}
            </svg>
            <span
              className={cn(
                "relative z-10 flex size-8 items-center justify-center rounded-full tabular-nums text-muted-foreground",
                isToday && "bg-primary font-bold text-muted",
              )}
            >
              {format(day, "d")}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72" sideOffset={8} align="start">
          <PopoverHeader>
            <PopoverTitle>{format(day, "EEEE, MMMM d, yyyy")}</PopoverTitle>
            <PopoverDescription>{completionLabel}</PopoverDescription>
          </PopoverHeader>
          <div className="grid gap-1.5 border-t pt-2">
            <p className="text-xs font-medium">Goals</p>
            {progress.goals.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No goals scheduled.
              </p>
            ) : (
              <ul className="grid gap-2">
                {progress.goals.map((goal) => (
                  <li
                    key={goal.id}
                    className="flex min-w-0 items-center gap-3 rounded-xl border border-border/70 bg-card p-2"
                  >
                    <div
                      className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-lg shadow-xs"
                      style={{ backgroundColor: goal.color }}
                      aria-hidden="true"
                    >
                      {goal.emoji}
                    </div>
                    <div className="min-w-0">
                      <p
                        className={cn(
                          "truncate font-medium",
                          goal.completed && "line-through decoration-2",
                        )}
                      >
                        {goal.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {goal.completed
                          ? "Completed"
                          : isToday
                            ? "Not done yet"
                            : "Not done"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
