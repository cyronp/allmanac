import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import GoalDetailsDialog from "@/components/dashboard/goals/goal-details-dialog";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

export interface GoalCardProps {
  chosenColor: string;
  chosenEmoji: string;
  title: string;
  startingDate: string;
  endingDate: string;
  description: string;
  progressPercentage: number;
}

export default function GoalCard({
  title,
  chosenColor,
  chosenEmoji,
  startingDate,
  endingDate,
  description,
  progressPercentage,
}: GoalCardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <article className="w-full overflow-hidden rounded-xl border border-border bg-card cursor-pointer">
          <div
            className="flex h-24 items-center justify-center text-4xl"
            style={{ backgroundColor: chosenColor }}
          >
            <span aria-hidden="true">{chosenEmoji}</span>
          </div>
          <div className="p-4">
            <Heading as="h3" className="text-base leading-snug">
              {title}
            </Heading>
            <Text className="text-muted-foreground text-sm">
              {startingDate} - {endingDate}
            </Text>
          </div>
        </article>
      </DialogTrigger>
      <GoalDetailsDialog
        choosenColor={chosenColor}
        choosenEmoji={chosenEmoji}
        title={title}
        startingDate={startingDate}
        endingDate={endingDate}
        description={description}
        progressPercentage={progressPercentage}
      />
    </Dialog>
  );
}
