import {
  addDays,
  endOfYear,
  format,
  parseISO,
  startOfDay,
  startOfYear,
} from "date-fns";

import { dashboardMockDatabase } from "@/app/types/dashboard-data";
import GoalsCard from "@/components/dashboard/goals-section/goals-card";
import GoalsContainer from "@/components/dashboard/goals-section/goals-container";
import CommitmentCard from "@/components/dashboard/commitment-section/commitment-card";
import CommitmentContainer from "@/components/dashboard/commitment-section/commitment-container";
import Timeline from "@/components/dashboard/timeline-section/timeline";
import TimelineContainer from "@/components/dashboard/timeline-section/timeline-container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import {
  getActivityOccurrences,
  getActivitySchedules,
  groupActivityOccurrences,
} from "@/lib/dashboard-schedule";

interface AppPageProps {
  username: string;
}

const today = startOfDay(new Date());
const todayCommitments = groupActivityOccurrences(
  getActivityOccurrences(
    dashboardMockDatabase,
    today,
    today,
    "commitment",
  ),
);
const upcomingCommitments = groupActivityOccurrences(
  getActivityOccurrences(
    dashboardMockDatabase,
    addDays(today, 1),
    addDays(today, 7),
    "commitment",
  ),
);
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

  const schedule = getActivitySchedules(
    dashboardMockDatabase,
    activity.id,
  )[0];
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
        <div className="flex flex-col">
          <Heading as="h1" className="text-4xl tracking-tight">
            Good to see you {username}!
          </Heading>
          <Text
            as="span"
            className="text-lg text-muted-foreground tracking-tighter"
          >
            {"Let's"} have a better life cycle together!
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <CommitmentContainer
            title="Today's commitments"
            href="dashboard/calendar"
          >
            {todayCommitments.map((commitment) => (
              <CommitmentCard
                key={commitment.id}
                title={commitment.title}
                date={commitment.date}
                timeBlocks={commitment.timeBlocks}
              />
            ))}
          </CommitmentContainer>

          <CommitmentContainer
            title="Upcoming commitments"
            href="dashboard/calendar"
          >
            {upcomingCommitments.map((commitment) => (
              <CommitmentCard
                key={commitment.id}
                title={commitment.title}
                date={commitment.date}
                timeBlocks={commitment.timeBlocks}
              />
            ))}
          </CommitmentContainer>
        </div>

        <TimelineContainer>
          <Timeline events={timelineEvents} />
        </TimelineContainer>

        <GoalsContainer>
          {goals.map((goal) => (
            <GoalsCard
              key={goal.id}
              title={goal.title}
              description={goal.description}
              choosen_color={goal.chosenColor}
              choosen_emoji={goal.chosenEmoji}
              startingDate={goal.startingDate}
              endingDate={goal.endingDate}
              progressPercentage={goal.progressPercentage ?? 0}
            />
          ))}
        </GoalsContainer>
      </div>
    </div>
  );
}
