import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

interface GoalsCardProps {
  choosen_color: string;
  choosen_emoji: string;
  title: string;
  startingDate: string;
  endingDate: string;
}

export default function GoalsCard({
  title,
  choosen_color,
  choosen_emoji,
  startingDate,
  endingDate,
}: GoalsCardProps) {
  return (
    <article className="w-full overflow-hidden rounded-xl border border-border bg-card cursor-pointer">
      <div
        className="flex h-24 items-center justify-center text-4xl"
        style={{ backgroundColor: choosen_color }}
      >
        <span aria-hidden="true">{choosen_emoji}</span>
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
  );
}
