import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import PendencyCard from "@/components/dashboard/pendency-section/pendency-card";
import PendencyContainer from "@/components/dashboard/pendency-section/pendency-container";
import TimelineContainer from "@/components/dashboard/timeline-section/timeline-container";
import Timeline from "@/components/dashboard/timeline-section/timeline";
import { dashboardMockData } from "@/app/types/dashboard-data";
import GoalsContainer from "@/components/dashboard/goals-section/goals-container";
import GoalsCard from "@/components/dashboard/goals-section/goals-card";

interface AppPageProps {
  username: string;
}

export default function AppPage({ username }: AppPageProps) {
  username = dashboardMockData.user.name;

  return (
    <div className="relative w-full h-full z-0 overflow-y-auto pr-1 min-w-0">
      {/* Content wrapper - guaranteed to sit on top of background glows */}
      <div className="relative z-10 flex flex-col w-full gap-4 pb-4 min-w-0">
        {/* Heading */}
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
        {/* Today/Upcoming pendencies grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Left Column: Today's Pendencies */}
          <PendencyContainer
            title="Today's pendencies"
            href="dashboard/calendar"
          >
            {dashboardMockData.todayPendencies.map(({ id, ...pendency }) => (
              <PendencyCard key={id} {...pendency} />
            ))}
          </PendencyContainer>

          {/* Right Column: Upcoming Pendencies */}
          <PendencyContainer
            title="Upcoming pendencies"
            href="dashboard/calendar"
          >
            {dashboardMockData.upcomingPendencies.map(({ id, ...pendency }) => (
              <PendencyCard key={id} {...pendency} />
            ))}
          </PendencyContainer>
        </div>
        <TimelineContainer>
          <Timeline events={dashboardMockData.timelineEvents} />
        </TimelineContainer>

        <GoalsContainer>
          {dashboardMockData.goals.map(({id, ...goals}) => (
            <GoalsCard key={id} {...goals}/>
          ))}
        </GoalsContainer>

      </div>
    </div>
  );
}
