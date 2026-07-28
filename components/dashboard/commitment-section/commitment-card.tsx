import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { format, parse } from "date-fns";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface CommitmentCardProps {
  title: string;
  date: string;
  timeBlocks: Array<{
    id: string;
    startTime: string;
    endTime: string;
  }>;
}

export default function CommitmentCard({
  title,
  date,
  timeBlocks,
}: CommitmentCardProps) {
  const calendarDate = parse(date, "dd/MM/yyyy", new Date());
  const calendarHref = `/dashboard/calendar?date=${format(calendarDate, "yyyy-MM-dd")}`;

  return (
    <div className="transition-all duration-200 flex flex-col bg-card rounded-xl p-4 relative z-0">
      <div className="flex flex-row justify-between">
        <Heading as="h3" className="text-lg font-semibold">
          {title}
        </Heading>
        <Text
          asChild
          as="span"
          className="group flex flex-row items-center hover:underline decoration-2"
        >
          <Link href={calendarHref}>
            Go to
            <ArrowUpRight
              size={18}
              className="group-hover:-translate-y-1 group-hover:translate-x-1 duration-200 transition-all"
            />
          </Link>
        </Text>
      </div>
      <div className="flex flex-wrap items-center text-muted-foreground gap-1">
        <Text as="span" className="text-base">
          {date}
        </Text>
        <span className="mx-1 text-muted-foreground">•</span>
        {timeBlocks.map((timeBlock, index) => (
          <Text as="span" className="text-base" key={timeBlock.id}>
            {index > 0 && <span className="mr-1">•</span>}
            {timeBlock.startTime} - {timeBlock.endTime}
          </Text>
        ))}
      </div>
    </div>
  );
}
