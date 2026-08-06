"use client";

import { useMemo } from "react";

import DashboardHeader from "@/components/dashboard/dashboard-header";
import ActivityOverviewSection from "@/components/dashboard/sections/activity-overview-section";
import GoalsSection from "@/components/dashboard/sections/goals-section";
import TimelineSection from "@/components/dashboard/sections/timeline-section";
import { useGoals } from "@/features/goals/hooks/use-goals";
import { useHabits } from "@/features/habits/hooks/use-habits";
import { createInitialJournalEntries } from "@/features/journal/journal.data";
import { useJournal } from "@/features/journal/hooks/use-journal";
import { copyEntry } from "@/features/journal/journal.store";
import { buildLocalDashboardDatabase } from "@/lib/dashboard-local-data";
import { buildDashboardPageData } from "@/lib/dashboard-page-data";

export default function DashboardLocal({ today }: { today: string }) {
  const { habits } = useHabits();
  const { goals } = useGoals();
  const initialEntries = useMemo(
    () => createInitialJournalEntries(today.slice(0, 7), today, habits, goals),
    [goals, habits, today],
  );
  const { entries, updateEntries } = useJournal(initialEntries);
  const database = useMemo(
    () => buildLocalDashboardDatabase(habits, goals, entries, today),
    [entries, goals, habits, today],
  );
  const pageData = useMemo(
    () => buildDashboardPageData(database, new Date(`${today}T12:00:00`)),
    [database, today],
  );

  function updateCompletion(date: string, activityId: string, completed: boolean) {
    const isGoal = goals.some((goal) => goal.id === activityId);

    updateEntries((current) => {
      const entry = copyEntry(current[date]);
      const field = isGoal ? "completedGoalIds" : "completedHabitIds";
      const currentIds = entry[field];
      const nextIds = completed
        ? Array.from(new Set([...currentIds, activityId]))
        : currentIds.filter((id) => id !== activityId);

      return { ...current, [date]: { ...entry, [field]: nextIds } };
    });
  }

  return (
    <div className="relative z-0 min-w-0 w-full">
      <div className="relative z-10 flex flex-col w-full gap-4 min-w-0">
        <DashboardHeader username={pageData.username} />
        <ActivityOverviewSection
          database={database}
          initialDate={pageData.initialDate}
          onCompletionChange={updateCompletion}
        />
        <TimelineSection events={pageData.timelineEvents} />
        <GoalsSection goals={pageData.goals} />
      </div>
    </div>
  );
}
