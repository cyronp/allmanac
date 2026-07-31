import HabitsCard from "@/components/habits/habits-card";
import { Heading } from "@/components/ui/heading";

export default function Habits() {
  return (
    <div className="relative z-0 min-w-0 w-full">
      <div className="relative z-10 flex min-w-0 w-full flex-col gap-6">
        <Heading as="h1" className="text-4xl tracking-tight">
          Your Habits
        </Heading>
        <div className="flex flex-row border-2 border-muted p-4 rounded-xl gap-4">
          <HabitsCard/>
          <HabitsCard/>
          <HabitsCard/>
          <HabitsCard/>
        </div>
      </div>
    </div>
  );
}
