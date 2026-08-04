import { CalendarDaysIcon, Clock3Icon, PencilIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card
      role="article"
      className="group gap-0 transition-shadow hover:ring-foreground/20"
    >
      <CardHeader>
        <div className="flex flex-row gap-2">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl",
              category.iconClassName,
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-1">
            <CardTitle className="truncate font-semibold">
              <h3 className="truncate">{habit.name}</h3>
            </CardTitle>
            <CardDescription className="text-xs font-medium">
              {category.label}
            </CardDescription>
          </div>
        </div>
        <CardAction>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground opacity-70 group-hover:opacity-100"
            onClick={() => onEdit(habit)}
            aria-label={`Edit ${habit.name}`}
          >
            <PencilIcon />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex min-w-0 flex-col">
        <div className="mt-auto space-y-2 pt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{formatHabitDays(habit.days)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock3Icon className="size-4 shrink-0" aria-hidden="true" />
            <span>
              {formatHabitTime(habit.startTime)} –{" "}
              {formatHabitTime(habit.endTime)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
