import { RECOMMENDED_HABITS } from "../habits.data";
import type { HabitDraft } from "../habits.types";
import { HabitRecommendationCard } from "./habit-recommendation-card";

interface RecommendedHabitsProps {
  onSelect: (habit: HabitDraft) => void;
}

export function RecommendedHabits({ onSelect }: RecommendedHabitsProps) {
  return (
    <section aria-labelledby="recommended-habits-heading">
      <div className="mb-4">
        <h2
          id="recommended-habits-heading"
          className="font-heading text-xl font-semibold tracking-tight"
        >
          Recommended for you
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Use a starter template and adjust it to fit your day.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {RECOMMENDED_HABITS.map((habit) => (
          <HabitRecommendationCard
            key={habit.name}
            habit={habit}
            onAdd={() => onSelect(habit)}
          />
        ))}
      </div>
    </section>
  );
}
