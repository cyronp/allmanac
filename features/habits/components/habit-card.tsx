import {
  CalendarDaysIcon,
  Clock3Icon,
  PencilIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { CATEGORY_STYLES } from "../habits.config";
import type { Habit } from "../habits.types";
import { formatHabitDays, formatHabitTime } from "../habits.utils";

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
}

export function HabitCard({ habit, onEdit }: HabitCardProps) {
  const category = CATEGORY_STYLES[habit.category];
  const Icon = category.icon;

  return (
    <article className="group flex min-h-52 flex-col rounded-xl border bg-card p-4 shadow-xs transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            category.iconClassName,
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="-mr-1 -mt-1 text-muted-foreground opacity-70 group-hover:opacity-100"
          onClick={() => onEdit(habit)}
          aria-label={`Edit ${habit.name}`}
        >
          <PencilIcon />
        </Button>
      </div>

      <div className="mt-4 min-w-0">
        <h3 className="truncate font-heading text-base font-semibold">
          {habit.name}
        </h3>
        <p className="mt-0.5 text-xs font-medium text-muted-foreground">
          {category.label}
        </p>
      </div>

      <div className="mt-auto space-y-2 pt-5 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <CalendarDaysIcon className="size-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{formatHabitDays(habit.days)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock3Icon className="size-4 shrink-0" aria-hidden="true" />
          <span>
            {formatHabitTime(habit.startTime)} – {formatHabitTime(habit.endTime)}
          </span>
        </div>
      </div>
    </article>
  );
}
