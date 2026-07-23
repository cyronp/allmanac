import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { XIcon } from "lucide-react";

interface GoalDetailsDialogProps {
  choosenColor: string;
  choosenEmoji: string;
  title: string;
  startingDate: string;
  endingDate: string;
  description: string;
  progressPercentage: number;
}

export default function GoalDetailsDialog({
  choosenColor,
  choosenEmoji,
  title,
  startingDate,
  endingDate,
  description,
  progressPercentage,
}: GoalDetailsDialogProps) {
  return (
    <DialogContent
      className="max-h-dvh gap-0 overflow-hidden p-0 sm:max-w-4xl"
      showCloseButton={false}
    >
      <DialogHeader className="relative gap-0 border-b">
        <div
          className="h-32 w-full flex justify-center items-center"
          style={{ backgroundColor: choosenColor }}
          aria-hidden="true"
        >
          <div
            className="flex size-20 shrink-0 items-center justify-center rounded-xl text-6xl"
            style={{ backgroundColor: choosenColor }}
            aria-hidden="true"
          >
            {choosenEmoji}
          </div>
        </div>
        <div className="flex items-start gap-4 px-6 py-5 pr-16">
          <div className="min-w-0 space-y-1">
            <DialogTitle className="text-xl leading-tight">{title}</DialogTitle>
            <DialogDescription>
              {startingDate} – {endingDate}
            </DialogDescription>
          </div>
        </div>
        <DialogClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-background/70 backdrop-blur-sm"
            aria-label="Close goal details"
          >
            <XIcon />
          </Button>
        </DialogClose>
      </DialogHeader>

      <div className="min-h-0 overflow-y-auto">
        <div className="flex flex-col gap-6 p-6">
          <main className="min-w-0 space-y-6">
            <GoalSection id="goal-overview-heading" title="Description">
              {description}
            </GoalSection>
            <Separator />
            <GoalSection id="goal-progress-heading" title="Progress">
              <div className="w-full h-12 bg-muted rounded-xl overflow-hidden">
                <div
                  className="h-full"
                  style={{
                    width: `${progressPercentage}%`,
                    backgroundColor: choosenColor,
                  }}
                />
              </div>
            </GoalSection>
            <Separator />
          </main>
        </div>
      </div>
    </DialogContent>
  );
}

function GoalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3" aria-labelledby={id}>
      <Heading id={id} as="h3" className="text-lg">
        {title}
      </Heading>
      <Text as="div" className="text-sm text-muted-foreground">
        {children}
      </Text>
    </section>
  );
}
