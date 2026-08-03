"use client";

import { useState, type FormEvent } from "react";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { HabitDialog } from "./components/habit-dialog";
import { HabitsList } from "./components/habits-list";
import { RecommendedHabits } from "./components/recommended-habits";
import { EMPTY_HABIT } from "./habits.data";
import { useHabits } from "./hooks/use-habits";
import type { Habit, HabitDraft } from "./habits.types";
import { copyHabitDraft } from "./habits.utils";

export function HabitsPage() {
  const { habits, updateHabits } = useHabits();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<HabitDraft>(() =>
    copyHabitDraft(EMPTY_HABIT),
  );

  function openCreate(template: HabitDraft = EMPTY_HABIT) {
    setEditingId(null);
    setDraft(copyHabitDraft(template));
    setDialogOpen(true);
  }

  function openEdit(habit: Habit) {
    setEditingId(habit.id);
    setDraft(copyHabitDraft(habit));
    setDialogOpen(true);
  }

  function toggleDay(day: number) {
    setDraft((current) => ({
      ...current,
      days: current.days.includes(day)
        ? current.days.filter((item) => item !== day)
        : [...current.days, day].sort(),
    }));
  }

  function saveHabit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.name.trim() || draft.days.length === 0) return;

    if (editingId) {
      updateHabits((current) =>
        current.map((habit) =>
          habit.id === editingId
            ? {
                ...habit,
                ...copyHabitDraft(draft),
                name: draft.name.trim(),
              }
            : habit,
        ),
      );
    } else {
      updateHabits((current) => [
        ...current,
        {
          ...copyHabitDraft(draft),
          id: `${Date.now()}-${draft.name.toLowerCase().replaceAll(" ", "-")}`,
          name: draft.name.trim(),
        },
      ]);
    }

    setDialogOpen(false);
  }

  function deleteHabit() {
    if (!editingId) return;

    updateHabits((current) =>
      current.filter((habit) => habit.id !== editingId),
    );
    setDialogOpen(false);
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-9 pb-6">
      <header className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Your habits
        </h1>
        <Button size="lg" onClick={() => openCreate()}>
          <PlusIcon data-icon="inline-start" />
          Create habit
        </Button>
      </header>

      <HabitsList habits={habits} onEdit={openEdit} />
      <RecommendedHabits onSelect={openCreate} />

      <HabitDialog
        open={dialogOpen}
        editing={Boolean(editingId)}
        draft={draft}
        onOpenChange={setDialogOpen}
        onDraftChange={setDraft}
        onToggleDay={toggleDay}
        onDelete={deleteHabit}
        onSubmit={saveHabit}
      />
    </div>
  );
}
