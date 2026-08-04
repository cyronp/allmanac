import { SparklesIcon } from "lucide-react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { Habit } from "../habits.types";
import { HabitCard } from "./habit-card";

interface HabitsListProps {
  habits: Habit[];
  onEdit: (habit: Habit) => void;
}

export function HabitsList({ habits, onEdit }: HabitsListProps) {
  return (
    <section aria-labelledby="current-habits-heading">
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-xl font-semibold tracking-tight">
            <h2 id="current-habits-heading">Current habits</h2>
          </CardTitle>
          <CardDescription>
            {habits.length === 0
              ? "Start with a recommendation below."
              : "Your recurring plan at a glance."}
          </CardDescription>
          <CardAction>
            <span className="rounded-full border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {habits.length} {habits.length === 1 ? "habit" : "habits"}
            </span>
          </CardAction>
        </CardHeader>

        {habits.length > 0 ? (
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {habits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} onEdit={onEdit} />
            ))}
          </CardContent>
        ) : (
          <CardContent>
            <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 p-8 text-center">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                <SparklesIcon className="size-5" />
              </div>
              <h3 className="mt-4 font-heading font-semibold">A fresh start</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Create a habit from scratch or choose a ready-made routine below.
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </section>
  );
}
