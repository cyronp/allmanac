import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import Timeline, { type TimelineEntry } from "@/components/dashboard/timeline/timeline";

interface TimelineSectionProps {
  events: TimelineEntry[];
}

export default function TimelineSection({ events }: TimelineSectionProps) {
  return (
    <div className="min-w-0 w-full gap-4 flex flex-col">
      <Heading as="h2" className="text-2xl">
        Timeline
      </Heading>
      <Card>
        <CardContent className="flex min-w-0 flex-col gap-2 overflow-y-auto scrollbar-none">
          <Timeline events={events} />
        </CardContent>
      </Card>
    </div>
  );
}
