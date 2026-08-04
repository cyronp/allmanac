"use client";

import { useState, type FormEvent } from "react";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { GoalCard } from "./components/goal-card";
import { GoalDialog } from "./components/goal-dialog";
import { createEmptyGoal } from "./goals.data";
import type { Goal, GoalDraft, GoalFilter } from "./goals.types";
import {
  copyGoalDraft,
  formatGoalDate,
  getDaysRemaining,
  getGoalState,
} from "./goals.utils";
import { useGoals } from "./hooks/use-goals";

interface GoalsPageProps {
  today: string;
}

const filters: Array<{ value: GoalFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

export function GoalsPage({ today }: GoalsPageProps) {
  const { goals, updateGoals } = useGoals();
  const [filter, setFilter] = useState<GoalFilter>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<GoalDraft>(() => createEmptyGoal(today));

  const activeGoals = goals.filter(
    (goal) => getGoalState(goal, today) !== "completed",
  );
  const completedGoals = goals.filter(
    (goal) => getGoalState(goal, today) === "completed",
  );
  const nextDeadline = [...activeGoals]
    .filter((goal) => {
      const daysRemaining = getDaysRemaining(goal, today);
      return daysRemaining !== null && daysRemaining >= 0;
    })
    .sort((first, second) =>
      (first.endsOn ?? "").localeCompare(second.endsOn ?? ""),
    )[0];

  const filteredGoals = goals.filter((goal) => {
    if (filter === "completed") return getGoalState(goal, today) === "completed";
    if (filter === "active") return getGoalState(goal, today) !== "completed";
    return true;
  });

  function openCreate() {
    setEditingId(null);
    setDraft(createEmptyGoal(today));
    setDialogOpen(true);
  }

  function openEdit(goal: Goal) {
    setEditingId(goal.id);
    setDraft(copyGoalDraft(goal));
    setDialogOpen(true);
  }

  function saveGoal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.title.trim() || !draft.startsOn) return;
    if (draft.endsOn && draft.endsOn < draft.startsOn) return;

    const isEditing = editingId !== null;

    try {
      if (editingId) {
        updateGoals((current) =>
          current.map((goal) =>
            goal.id === editingId
              ? { ...goal, ...copyGoalDraft(draft), title: draft.title.trim() }
              : goal,
          ),
        );
      } else {
        updateGoals((current) => [
          ...current,
          {
            ...copyGoalDraft(draft),
            id: `${Date.now()}-${draft.title.toLowerCase().replaceAll(" ", "-")}`,
            title: draft.title.trim(),
          },
        ]);
      }

      setDialogOpen(false);
      toast.success(isEditing ? "Goal updated." : "Goal created.");
    } catch {
      toast.error(
        isEditing
          ? "Something went wrong while updating the goal."
          : "Something went wrong while creating the goal.",
      );
    }
  }

  function deleteGoal() {
    if (!editingId) return;

    updateGoals((current) => current.filter((goal) => goal.id !== editingId));
    setDialogOpen(false);
    toast.success("Goal deleted.");
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 pb-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Your goals
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create goals and keep their status up to date.
          </p>
        </div>
        <Button size="lg" onClick={openCreate}>
          <PlusIcon data-icon="inline-start" />
          Create goal
        </Button>
      </header>

      <GoalsOverview
        activeCount={activeGoals.length}
        completedCount={completedGoals.length}
        nextDeadline={nextDeadline}
      />

      <section aria-labelledby="goals-list-heading">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2
            id="goals-list-heading"
            className="font-heading text-xl font-semibold tracking-tight"
          >
            Goals
          </h2>
          <div className="flex items-center gap-1" role="group" aria-label="Filter goals">
            {filters.map((item) => {
              const selected = filter === item.value;
              const count =
                item.value === "all"
                  ? goals.length
                  : item.value === "active"
                    ? activeGoals.length
                    : completedGoals.length;

              return (
                <Button
                  key={item.value}
                  type="button"
                  variant={selected ? "secondary" : "ghost"}
                  size="sm"
                  aria-pressed={selected}
                  onClick={() => setFilter(item.value)}
                >
                  {item.label}
                  <span className="tabular-nums text-muted-foreground">{count}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {filteredGoals.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                today={today}
                onSelect={openEdit}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex min-h-48 flex-col items-center justify-center text-center">
              <h3 className="font-heading font-semibold">No goals found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {filter === "completed"
                  ? "Completed goals will appear here."
                  : "Create a goal to get started."}
              </p>
              {filter !== "completed" && (
                <Button className="mt-4" onClick={openCreate}>
                  <PlusIcon data-icon="inline-start" />
                  Create goal
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </section>

      <GoalDialog
        open={dialogOpen}
        editing={Boolean(editingId)}
        draft={draft}
        onOpenChange={setDialogOpen}
        onDraftChange={setDraft}
        onDelete={deleteGoal}
        onSubmit={saveGoal}
      />
    </div>
  );
}

function GoalsOverview({
  activeCount,
  completedCount,
  nextDeadline,
}: {
  activeCount: number;
  completedCount: number;
  nextDeadline?: Goal;
}) {
  const deadlineLabel = nextDeadline?.endsOn
    ? formatGoalDate(nextDeadline.endsOn)
    : "None";

  return (
    <Card className="gap-0 py-0">
      <CardContent className="p-0">
        <dl className="grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <OverviewItem label="Active" value={String(activeCount)} />
          <OverviewItem label="Completed" value={String(completedCount)} />
          <OverviewItem label="Next deadline" value={deadlineLabel} />
        </dl>
      </CardContent>
    </Card>
  );
}

function OverviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 truncate font-heading text-lg font-semibold">{value}</dd>
    </div>
  );
}
