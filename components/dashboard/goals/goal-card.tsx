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
        <article className="group/goal flex min-w-0 cursor-pointer overflow-hidden rounded-xl border border-border bg-card text-left transition-colors hover:bg-muted/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <div
            className="flex w-20 shrink-0 items-center justify-center text-3xl sm:w-24"
            style={{ backgroundColor: chosenColor }}
          >
            <span aria-hidden="true">{chosenEmoji}</span>
          </div>
          <div className="min-w-0 flex-1 p-4">
            <Heading as="h3" className="truncate text-base leading-snug">
              {title}
            </Heading>
            <Text className="mt-0.5 truncate text-xs text-muted-foreground">
              {startingDate} - {endingDate}
            </Text>
            <div className="mt-3 flex items-center gap-2">
              <div
                className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-label={`${title} progress`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progressPercentage}
              >
                <div
                  className="h-full rounded-full transition-[width]"
                  style={{
                    backgroundColor: chosenColor,
                    width: `${Math.min(100, Math.max(0, progressPercentage))}%`,
                  }}
                />
              </div>
              <Text className="shrink-0 text-xs font-semibold text-muted-foreground">
                {progressPercentage}%
              </Text>
            </div>
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
