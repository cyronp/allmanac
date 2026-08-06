import { Clock3Icon, TargetIcon } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import type { GroupedActivityOccurrence } from "@/lib/dashboard-schedule";
import { cn } from "@/lib/utils";

interface TodayTodoItemProps {
  isCompleted: boolean;
  item: GroupedActivityOccurrence;
  onToggle: () => void;
}

export default function TodayTodoItem({
  isCompleted,
  item,
  onToggle,
}: TodayTodoItemProps) {
  const timeLabel = item.timeBlocks
    .map((timeBlock) => `${timeBlock.startTime} – ${timeBlock.endTime}`)
    .join(" · ");

  const isGoal = item.type === "goal";

  return (
    <article
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
          {isGoal ? (
            <TargetIcon className="size-3.5 shrink-0" aria-hidden="true" />
          ) : (
            <Clock3Icon className="size-3.5 shrink-0" aria-hidden="true" />
          )}
          <span className="truncate">{isGoal ? "Daily goal" : timeLabel}</span>
        </p>
      </div>

      <Checkbox
        aria-label={`Mark ${item.title} ${isCompleted ? "incomplete" : "complete"}`}
        checked={isCompleted}
        onCheckedChange={onToggle}
        className="p-4"
      />
    </article>
  );
}
