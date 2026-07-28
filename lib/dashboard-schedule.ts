import {
  differenceInCalendarDays,
  differenceInCalendarWeeks,
  eachDayOfInterval,
  format,
  isAfter,
  isBefore,
  parseISO,
} from "date-fns";

import type {
  ActivityData,
  ActivityType,
  DashboardDatabase,
  ScheduleData,
  ScheduleTimeBlockData,
} from "@/app/types/dashboard-data";

export interface ActivityOccurrence {
  id: string;
  activityId: string;
  scheduleId: string;
  timeBlockId: string;
  type: ActivityType;
  title: string;
  description: string;
  date: string;
  isoDate: string;
  startTime: string;
  endTime: string;
  chosenColor: string;
  chosenEmoji: string;
}

export interface GroupedActivityOccurrence {
  id: string;
  activityId: string;
  type: ActivityType;
  title: string;
  description: string;
  date: string;
  isoDate: string;
  chosenColor: string;
  chosenEmoji: string;
  timeBlocks: Array<{
    id: string;
    startTime: string;
    endTime: string;
  }>;
}

function laterDate(left: Date, right: Date) {
  return isAfter(left, right) ? left : right;
}

function earlierDate(left: Date, right: Date) {
  return isBefore(left, right) ? left : right;
}

function occursOnDate(date: Date, schedule: ScheduleData) {
  const scheduleStart = parseISO(schedule.startsOn);
  const interval = Math.max(1, schedule.recurrence.interval);
  const dateKey = format(date, "yyyy-MM-dd");

  if (schedule.excludedDates.includes(dateKey)) return false;

  switch (schedule.recurrence.frequency) {
    case "once":
      return differenceInCalendarDays(date, scheduleStart) === 0;
    case "daily":
      return differenceInCalendarDays(date, scheduleStart) % interval === 0;
    case "weekly": {
      const weeksSinceStart = differenceInCalendarWeeks(date, scheduleStart, {
        weekStartsOn: 1,
      });

      return (
        weeksSinceStart % interval === 0 &&
        schedule.recurrence.daysOfWeek.includes(date.getDay())
      );
    }
  }
}

function createOccurrence(
  activity: ActivityData,
  schedule: ScheduleData,
  timeBlock: ScheduleTimeBlockData,
  date: Date,
): ActivityOccurrence {
  const isoDate = format(date, "yyyy-MM-dd");

  return {
    id: `${activity.id}-${schedule.id}-${timeBlock.id}-${isoDate}`,
    activityId: activity.id,
    scheduleId: schedule.id,
    timeBlockId: timeBlock.id,
    type: activity.type,
    title: activity.title,
    description: activity.description,
    date: format(date, "dd/MM/yyyy"),
    isoDate,
    startTime: timeBlock.startTime,
    endTime: timeBlock.endTime,
    chosenColor: activity.chosenColor,
    chosenEmoji: activity.chosenEmoji,
  };
}

export function getActivityOccurrences(
  database: DashboardDatabase,
  rangeStart: Date,
  rangeEnd: Date,
  activityType?: ActivityType,
) {
  const activitiesById = new Map(
    database.activities
      .filter(
        (activity) =>
          activity.isActive &&
          (!activityType || activity.type === activityType),
      )
      .map((activity) => [activity.id, activity]),
  );
  return database.schedules
    .flatMap((schedule) => {
      const activity = activitiesById.get(schedule.activityId);
      if (!activity) return [];

      const scheduleStart = parseISO(schedule.startsOn);
      const scheduleEnd = schedule.endsOn
        ? parseISO(schedule.endsOn)
        : rangeEnd;
      const occurrenceStart = laterDate(rangeStart, scheduleStart);
      const occurrenceEnd = earlierDate(rangeEnd, scheduleEnd);

      if (isAfter(occurrenceStart, occurrenceEnd)) return [];

      return eachDayOfInterval({
        start: occurrenceStart,
        end: occurrenceEnd,
      })
        .filter((date) => occursOnDate(date, schedule))
        .flatMap((date) =>
          schedule.timeBlocks
            .toSorted((left, right) => left.position - right.position)
            .map((timeBlock) =>
              createOccurrence(activity, schedule, timeBlock, date),
            ),
        );
    })
    .sort(
      (left, right) =>
        left.isoDate.localeCompare(right.isoDate) ||
        left.startTime.localeCompare(right.startTime),
    );
}

export function groupActivityOccurrences(
  occurrences: ActivityOccurrence[],
): GroupedActivityOccurrence[] {
  const grouped = new Map<string, GroupedActivityOccurrence>();

  for (const occurrence of occurrences) {
    const key = `${occurrence.activityId}-${occurrence.isoDate}`;
    const existing = grouped.get(key);
    const timeBlock = {
      id: occurrence.timeBlockId,
      startTime: occurrence.startTime,
      endTime: occurrence.endTime,
    };

    if (existing) {
      existing.timeBlocks.push(timeBlock);
      continue;
    }

    grouped.set(key, {
      id: key,
      activityId: occurrence.activityId,
      type: occurrence.type,
      title: occurrence.title,
      description: occurrence.description,
      date: occurrence.date,
      isoDate: occurrence.isoDate,
      chosenColor: occurrence.chosenColor,
      chosenEmoji: occurrence.chosenEmoji,
      timeBlocks: [timeBlock],
    });
  }

  return Array.from(grouped.values()).map((occurrence) => ({
    ...occurrence,
    timeBlocks: occurrence.timeBlocks.toSorted((left, right) =>
      left.startTime.localeCompare(right.startTime),
    ),
  }));
}

export function getActivitySchedules(
  database: DashboardDatabase,
  activityId: string,
) {
  return database.schedules.filter(
    (schedule) => schedule.activityId === activityId,
  );
}
