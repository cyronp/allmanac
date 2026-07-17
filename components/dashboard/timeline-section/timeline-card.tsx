import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export const HOUR_WIDTH = 120;

export interface TimelineBlockProps {
  start: string;
  end: string;
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export function timeToHours(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h + m / 60;
}

export default function TimelineCard({
  start,
  end,
  title,
  children,
  className,
}: TimelineBlockProps) {
  const startPos = timeToHours(start) * HOUR_WIDTH;
  const width = (timeToHours(end) - timeToHours(start)) * HOUR_WIDTH;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={cn(
            "absolute top-0.5 bottom-0.5 rounded-md border-2 border-border",
            "transition-all duration-200 overflow-hidden group select-none",
            "bg-card hover:bg-card/90",
            className,
          )}
          style={{
            left: `${startPos}px`,
            width: `${width}px`,
          }}
        >
          <div className="px-4 h-full flex flex-col justify-center gap-0 min-w-0">
            <Text
              as="span"
              className="text-sm font-semibold truncate leading-tight text-white"
            >
              {title}
            </Text>
            {children}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Separator/>
        <FieldGroup>
          <Field>
            <Label htmlFor="start-time">Start Time</Label>
            <Input
              type="time"
              id="start-time"
              step="1"
              defaultValue={start}
              className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </Field>
        </FieldGroup>
      </DialogContent>
    </Dialog>
  );
}
