import {
  endOfYear,
  format,
  parseISO,
  startOfDay,
  startOfYear,
} from "date-fns";

import { dashboardMockDatabase } from "@/app/types/dashboard-data";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import ActivityOverviewSection from "@/components/dashboard/sections/activity-overview-section";
import GoalsSection from "@/components/dashboard/sections/goals-section";
import TimelineSection from "@/components/dashboard/sections/timeline-section";
import {
  getActivityOccurrences,
  getActivitySchedules,
} from "@/lib/dashboard-schedule";

interface AppPageProps {
  username: string;
}

const today = startOfDay(new Date());
const timelineEvents = getActivityOccurrences(
  dashboardMockDatabase,
  startOfYear(today),
  endOfYear(today),
).map((occurrence) => ({
  id: occurrence.id,
  title: occurrence.title,
  date: occurrence.date,
  start: occurrence.startTime,
  end: occurrence.endTime,
  description: occurrence.description,
}));

const goals = dashboardMockDatabase.activities.flatMap((activity) => {
  if (!activity.isActive || activity.type !== "goal") return [];

  const schedule = getActivitySchedules(dashboardMockDatabase, activity.id)[0];
  if (!schedule) return [];

  return [
    {
      ...activity,
      startingDate: format(parseISO(schedule.startsOn), "dd/MM/yyyy"),
      endingDate: schedule.endsOn
        ? format(parseISO(schedule.endsOn), "dd/MM/yyyy")
        : "Ongoing",
    },
  ];
});

export default function AppPage({ username }: AppPageProps) {
  username = dashboardMockDatabase.users[0]?.name ?? username;

  return (
    <div className="relative z-0 min-w-0 w-full">
      <div className="relative z-10 flex flex-col w-full gap-4 min-w-0">
        <DashboardHeader username={username} />
        <ActivityOverviewSection initialDate={format(today, "yyyy-MM-dd")} />
        <TimelineSection events={timelineEvents} />
        <GoalsSection
          goals={goals.map((goal) => ({
            id: goal.id,
            title: goal.title,
            description: goal.description,
            chosenColor: goal.chosenColor,
            chosenEmoji: goal.chosenEmoji,
            startingDate: goal.startingDate,
            endingDate: goal.endingDate,
            progressPercentage: goal.progressPercentage ?? 0,
          }))}
        />
      </div>
    </div>
  );
}
