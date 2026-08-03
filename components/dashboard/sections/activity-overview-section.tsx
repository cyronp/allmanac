"use client";

import { useState } from "react";

import MonthlyActivityCalendar from "@/components/dashboard/activity-overview/monthly-activity-calendar";
import GoalConsistencyChart from "@/components/dashboard/activity-overview/goal-consistency-chart";
import TodayTodos from "@/components/dashboard/activity-overview/today-todos";
import type { CompletionOverrides } from "@/components/dashboard/activity-overview/activity-overview.types";
import { getCompletionOverrideKey } from "@/components/dashboard/activity-overview/activity-overview.utils";
import { useCurrentDay } from "@/components/dashboard/activity-overview/use-current-day";

interface ActivityOverviewSectionProps {
  initialDate: string;
}

export default function ActivityOverviewSection({
  initialDate,
}: ActivityOverviewSectionProps) {
  const [monthOffset, setMonthOffset] = useState(0);
  const [completionOverrides, setCompletionOverrides] =
    useState<CompletionOverrides>({});
  const todayKey = useCurrentDay(initialDate);

  const handleCompletionChange = (
    date: string,
    activityId: string,
    completed: boolean,
  ) => {
    setCompletionOverrides((current) => ({
      ...current,
      [getCompletionOverrideKey(date, activityId)]: completed,
    }));
  };

  return (
    <div className="grid w-full items-stretch gap-4 lg:grid-cols-[minmax(20rem,28rem)_minmax(0,1fr)] xl:grid-cols-[minmax(20rem,25rem)_minmax(18rem,1fr)_minmax(18rem,1fr)]">
      <MonthlyActivityCalendar
        todayKey={todayKey}
        monthOffset={monthOffset}
        completionOverrides={completionOverrides}
        onMonthOffsetChange={setMonthOffset}
      />
      <TodayTodos
        todayKey={todayKey}
        completionOverrides={completionOverrides}
        onCompletionChange={handleCompletionChange}
      />
      <div className="h-full lg:col-span-2 xl:col-span-1">
        <GoalConsistencyChart
          todayKey={todayKey}
          monthOffset={monthOffset}
          completionOverrides={completionOverrides}
        />
      </div>
    </div>
  );
}
