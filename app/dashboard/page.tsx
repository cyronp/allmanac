import { dashboardMockDatabase } from "@/app/types/dashboard-data";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import ActivityOverviewSection from "@/components/dashboard/sections/activity-overview-section";
import GoalsSection from "@/components/dashboard/sections/goals-section";
import TimelineSection from "@/components/dashboard/sections/timeline-section";
import { buildDashboardPageData } from "@/lib/dashboard-page-data";

const { username, initialDate, timelineEvents, goals } = buildDashboardPageData(
  dashboardMockDatabase,
  new Date(),
);

export default function DashboardPage() {
  return (
    <div className="relative z-0 min-w-0 w-full">
      <div className="relative z-10 flex flex-col w-full gap-4 min-w-0">
        <DashboardHeader username={username} />
        <ActivityOverviewSection initialDate={initialDate} />
        <TimelineSection events={timelineEvents} />
        <GoalsSection goals={goals} />
      </div>
    </div>
  );
}
