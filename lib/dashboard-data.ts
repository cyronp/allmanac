import dashboardMockDataJson from "@/data/dashboard.mock.json";

export interface PendencyData {
  id: string;
  title: string;
  startTime: string;
  endTime?: string;
  date?: string;
  url?: string;
}

export interface TimelineEventData {
  id: string;
  title: string;
  start: string;
  end: string;
  description: string;
}

export interface DashboardData {
  user: { name: string };
  todayPendencies: PendencyData[];
  upcomingPendencies: PendencyData[];
  timelineEvents: TimelineEventData[];
}

export const dashboardMockData: DashboardData = dashboardMockDataJson;
