import { ArrowRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { CATEGORY_STYLES } from "../habits.config";
import type { HabitDraft } from "../habits.types";

interface HabitRecommendationCardProps {
  habit: HabitDraft;
  onAdd: () => void;
}

export function HabitRecommendationCard({
  habit,
  onAdd,
}: HabitRecommendationCardProps) {
  const category = CATEGORY_STYLES[habit.category];
  const Icon = category.icon;

  return (
    <button
      type="button"
      onClick={onAdd}
      className="group flex min-h-32 cursor-pointer flex-col items-start rounded-xl border bg-card p-4 text-left shadow-xs transition-all hover:border-primary/60 hover:shadow-sm focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="flex w-full items-start justify-between gap-3">
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-lg",
            category.iconClassName,
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <ArrowRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>
      <span className="mt-4 font-heading text-sm font-semibold">
        {habit.name}
      </span>
      <span className="mt-0.5 text-xs text-muted-foreground">
        {category.label} template
      </span>
    </button>
  );
}
