import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface NotificationCardProps {
  title?: string;
  description?: string;
  time?: string;
  isUnread?: boolean;
  icon?: LucideIcon;
  onMarkAsRead?: () => void;
  isAnimatingOut?: boolean;
}

export default function NotificationCard({
  title = "",
  description = "",
  time = "",
  isUnread = true,
  icon: Icon,
  onMarkAsRead,
  isAnimatingOut = false,
}: NotificationCardProps) {
  return (
    <div
      className={cn(
        "group relative flex items-start gap-3 rounded-lg bg-card p-3 shadow-xs transition-all duration-300 ease-in-out hover:bg-accent/40 origin-top",
        isAnimatingOut
          ? "max-h-0 opacity-0 p-0 scale-95 pointer-events-none -translate-y-2 border-none"
          : "max-h-48 opacity-100 scale-100",
      )}
    >
      {Icon && (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="size-4" aria-hidden="true" />
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <Text
            as="p"
            className="text-sm font-semibold leading-tight text-foreground truncate"
          >
            {title}
          </Text>
        </div>

        <Text
          as="p"
          className="text-xs leading-normal line-clamp-2 break-words text-muted-foreground"
        >
          {description}
        </Text>

        <div className="flex items-center gap-2 pt-1">
          {isUnread && (
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
              title="Unread"
            />
          )}
          <Text
            as="span"
            className="text-xs font-medium tracking-wider text-muted-foreground"
          >
            {time}
          </Text>
          {isUnread && (
            <Button
              variant="link"
              size="xs"
              onClick={(e) => {
                e.stopPropagation();
                if (onMarkAsRead) onMarkAsRead();
              }}
              className="h-auto p-0 text-xs text-primary hover:text-primary/80 font-semibold no-underline hover:underline transition-all"
            >
              Mark as read
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
