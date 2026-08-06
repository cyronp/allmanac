"use client";

import { useState } from "react";

import type { DashboardDatabase } from "@/app/types/dashboard-data";
import MonthlyActivityCalendar from "@/components/dashboard/activity-overview/monthly-activity-calendar";
import GoalConsistencyChart from "@/components/dashboard/activity-overview/goal-consistency-chart";
import TodayTodos from "@/components/dashboard/activity-overview/today-todos";
import { useCurrentDay } from "@/components/dashboard/activity-overview/use-current-day";

interface ActivityOverviewSectionProps {
  database: DashboardDatabase;
  initialDate: string;
  onCompletionChange: (
    date: string,
    activityId: string,
    completed: boolean,
  ) => void;
}

export default function ActivityOverviewSection({
  database,
  initialDate,
  onCompletionChange,
}: ActivityOverviewSectionProps) {
  const [monthOffset, setMonthOffset] = useState(0);
  const todayKey = useCurrentDay(initialDate);

  return (
    <div className="grid w-full items-stretch gap-4 lg:grid-cols-[minmax(20rem,28rem)_minmax(0,1fr)] xl:grid-cols-[minmax(20rem,25rem)_minmax(18rem,1fr)_minmax(18rem,1fr)]">
      <MonthlyActivityCalendar
        database={database}
        todayKey={todayKey}
        monthOffset={monthOffset}
        onMonthOffsetChange={setMonthOffset}
      />
      <TodayTodos
        database={database}
        todayKey={todayKey}
        completionOverrides={{}}
        onCompletionChange={onCompletionChange}
      />
      <div className="h-full lg:col-span-2 xl:col-span-1">
        <GoalConsistencyChart
          database={database}
          todayKey={todayKey}
          monthOffset={monthOffset}
          completionOverrides={{}}
        />
      </div>
    </div>
  );
}
