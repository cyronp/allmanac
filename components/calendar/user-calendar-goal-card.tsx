import type { CSSProperties } from "react";

import { EmojiAvatar } from "@/components/ui/emoji-calendar";

import type { CalendarEvent } from "./user-calendar.types";

interface UserCalendarGoalCardProps {
  goal: CalendarEvent;
}

function getGoalTime(goal: CalendarEvent) {
  if (goal.startTime && goal.endTime) {
    return `${goal.startTime}–${goal.endTime}`;
  }

  return goal.startTime ?? goal.endTime ?? goal.time;
}

export function UserCalendarGoalCard({ goal }: UserCalendarGoalCardProps) {
  const goalTime = getGoalTime(goal);
  const goalStyle = {
    "--goal-color": goal.choosen_color,
  } as CSSProperties;

  return (
    <article
      className="flex cursor-pointer items-center gap-3 rounded-lg border bg-transparent p-3 transition-colors hover:bg-(--goal-color)/20"
      style={goalStyle}
    >
      {goal.choosen_emoji && (
        <EmojiAvatar
          size="sm"
          title={goal.title}
          choosen_emoji={goal.choosen_emoji}
          choosen_color={goal.choosen_color}
        />
      )}
      <div className="min-w-0">
        <h3 className="truncate font-medium">{goal.title}</h3>
        {goalTime && (
          <p className="text-xs text-muted-foreground">{goalTime}</p>
        )}
      </div>
    </article>
  );
}
