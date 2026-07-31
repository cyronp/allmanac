import dashboardMockDatabaseJson from "@/data/dashboard.mock.json";

export type ActivityType = "commitment" | "goal";
export type RecurrenceFrequency = "once" | "daily" | "weekly";

export interface DashboardUser {
  id: string;
  name: string;
  description: string;
  timezone: string;
}

export interface ActivityData {
  id: string;
  userId: string;
  type: ActivityType;
  title: string;
  description: string;
  chosenColor: string;
  chosenEmoji: string;
  progressPercentage?: number;
  isActive: boolean;
}

export interface RecurrenceRule {
  frequency: RecurrenceFrequency;
  interval: number;
  /** Sunday is 0 and Saturday is 6, matching JavaScript's Date#getDay. */
  daysOfWeek: number[];
}

export interface ScheduleData {
  id: string;
  activityId: string;
  timezone: string;
  startsOn: string;
  endsOn: string | null;
  recurrence: RecurrenceRule;
  excludedDates: string[];
  timeBlocks: ScheduleTimeBlockData[];
}

export interface ScheduleTimeBlockData {
  id: string;
  startTime: string;
  endTime: string;
  position: number;
}

export interface ActivityCompletionData {
  id: string;
  activityId: string;
  completedOn: string;
}

export interface DashboardDatabase {
  schemaVersion: number;
  users: DashboardUser[];
  activities: ActivityData[];
  schedules: ScheduleData[];
  activityCompletions: ActivityCompletionData[];
}

export const dashboardMockDatabase =
  dashboardMockDatabaseJson as DashboardDatabase;
