import { habitCategories, type Habit, type HabitDraft } from "./habits.types";

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function copyHabitDraft(habit: HabitDraft): HabitDraft {
  return { ...habit, days: [...habit.days] };
}

export function formatHabitDays(days: number[]) {
  if (days.length === 7) return "Every day";
  if (days.join(",") === "0,1,2,3,4") return "Weekdays";
  if (days.join(",") === "5,6") return "Weekends";
  return days.map((day) => dayNames[day]).join(", ");
}

export function formatHabitTime(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  const date = new Date(2000, 0, 1, hour, minute);

  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function isHabit(value: unknown): value is Habit {
  if (!value || typeof value !== "object") return false;
  const habit = value as Partial<Habit>;

  return (
    typeof habit.id === "string" &&
    typeof habit.name === "string" &&
    typeof habit.category === "string" &&
    habitCategories.includes(habit.category as Habit["category"]) &&
    Array.isArray(habit.days) &&
    habit.days.every((day) => Number.isInteger(day) && day >= 0 && day <= 6) &&
    typeof habit.startTime === "string" &&
    typeof habit.endTime === "string"
  );
}
