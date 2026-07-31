import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import GoalCard, { type GoalCardProps } from "@/components/dashboard/goals/goal-card";

export interface DashboardGoal extends GoalCardProps {
  id: string;
}

interface GoalsSectionProps {
  goals: DashboardGoal[];
}

export default function GoalsSection({ goals }: GoalsSectionProps) {
  return (
    <div className="min-w-0 w-full gap-4 flex flex-col">
      <Heading as="h2" className="text-2xl">
        Your Goals
      </Heading>
      <Card>
        <CardContent className="flex flex-col gap-2 lg:flex-row">
          {goals.map(({ id, ...goal }) => (
            <GoalCard key={id} {...goal} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
