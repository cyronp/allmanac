"use client";

import { useState } from "react";

import ActivityMonthCalendar from "@/components/dashboard/activity-calendar-section/activity-month-calendar";
import GoalConsistencyChart from "@/components/dashboard/goal-consistency-section/goal-consistency-chart";
import TodaysDo from "@/components/dashboard/todays-do-section/todays-do";

interface DashboardActivityOverviewProps {
  initialDate: string;
}

export default function DashboardActivityOverview({
  initialDate,
}: DashboardActivityOverviewProps) {
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
      <ActivityMonthCalendar
        initialDate={initialDate}
        monthOffset={monthOffset}
        completionOverrides={completionOverrides}
        onMonthOffsetChange={setMonthOffset}
      />
      <TodaysDo
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
