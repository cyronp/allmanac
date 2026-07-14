import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface PendencyCardProps {
  title: string;
  startTime: string;
  endTime?: string;
  date?: string;
  url?: string;
}

export default function PendencyCard({
  title,
  startTime,
  endTime,
  date,
  url,
}: PendencyCardProps) {
  return (
    <div className="transition-all duration-200 flex flex-col bg-card rounded-xl p-4 relative z-0">
      <div className="flex flex-row justify-between">
        <Heading as="h3" className="text-lg font-semibold">
          {title}
        </Heading>
        {url ? (
          <Text asChild as="span" className="group flex flex-row items-center hover:underline decoration-2">
            <Link href={url || ""}>
              Go to
              <ArrowUpRight
                size={18}
                className="group-hover:-translate-y-1 group-hover:translate-x-1 duration-200 transition-all"
              />
            </Link>
          </Text>
        ) : (
          <></>
        )}
      </div>
      <div className="flex flex-row items-center text-muted-foreground gap-1">
        {date ? (
          <>
            <Text as="span" className="text-base">
              {date}
            </Text>
            <span className="mx-1 text-muted-foreground">•</span>
            <Text as="span" className="text-base">
              {startTime}
              {endTime ? ` - ${endTime}` : ""}
            </Text>
          </>
        ) : (
          <>
            <Text as="span" className="text-base">
              {startTime}
            </Text>
            {endTime && (
              <>
              -
                <Text as="span" className="text-base">
                  {endTime}
                </Text>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
