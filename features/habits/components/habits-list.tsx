import { SparklesIcon } from "lucide-react";

import type { Habit } from "../habits.types";
import { HabitCard } from "./habit-card";

interface HabitsListProps {
  habits: Habit[];
  onEdit: (habit: Habit) => void;
}

export function HabitsList({ habits, onEdit }: HabitsListProps) {
  return (
    <section aria-labelledby="current-habits-heading">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2
            id="current-habits-heading"
            className="font-heading text-xl font-semibold tracking-tight"
          >
            Current habits
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {habits.length === 0
              ? "Start with a recommendation below."
              : "Your recurring plan at a glance."}
          </p>
        </div>
        <span className="rounded-full border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground">
          {habits.length} {habits.length === 1 ? "habit" : "habits"}
        </span>
      </div>

      {habits.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} onEdit={onEdit} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 p-8 text-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary">
            <SparklesIcon className="size-5" />
          </div>
          <h3 className="mt-4 font-heading font-semibold">A fresh start</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Create a habit from scratch or choose a ready-made routine below.
          </p>
        </div>
      )}
    </section>
  );
}
