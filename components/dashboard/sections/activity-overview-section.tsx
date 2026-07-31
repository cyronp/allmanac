"use client";

import { useState } from "react";

import MonthlyActivityCalendar from "@/components/dashboard/activity-overview/monthly-activity-calendar";
import GoalConsistencyChart from "@/components/dashboard/activity-overview/goal-consistency-chart";
import TodayTodos from "@/components/dashboard/activity-overview/today-todos";

interface ActivityOverviewSectionProps {
  initialDate: string;
}

export default function ActivityOverviewSection({
  initialDate,
}: ActivityOverviewSectionProps) {
  const [monthOffset, setMonthOffset] = useState(0);
  const [completionOverrides, setCompletionOverrides] = useState<
    Record<string, boolean>
  >({});

  const handleCompletionChange = (
    date: string,
    activityId: string,
    completed: boolean,
  ) => {
    setCompletionOverrides((current) => ({
      ...current,
      [`${date}:${activityId}`]: completed,
    }));
  };

  return (
    <div className="grid w-full items-stretch gap-4 lg:grid-cols-[minmax(20rem,28rem)_minmax(0,1fr)] xl:grid-cols-[minmax(20rem,25rem)_minmax(18rem,1fr)_minmax(18rem,1fr)]">
      <MonthlyActivityCalendar
        initialDate={initialDate}
        monthOffset={monthOffset}
        completionOverrides={completionOverrides}
        onMonthOffsetChange={setMonthOffset}
      />
      <TodayTodos
        initialDate={initialDate}
        completionOverrides={completionOverrides}
        onCompletionChange={handleCompletionChange}
      />
      <div className="h-full lg:col-span-2 xl:col-span-1">
        <GoalConsistencyChart
          initialDate={initialDate}
          monthOffset={monthOffset}
          completionOverrides={completionOverrides}
        />
      </div>
    </div>
  );
}
