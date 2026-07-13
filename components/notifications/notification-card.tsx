import { AlarmClockIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Text } from "../ui/text";

export default function NotificationCard() {
  return (
    <div className="group relative flex items-start gap-3 rounded-lg border border-border bg-card p-3 shadow-xs transition-colors hover:bg-accent/40">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
        <AlarmClockIcon className="size-4" />
      </div>

      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <Text as="p" className="text-sm font-semibold leading-tight text-foreground truncate">
            Sign new contract
          </Text>
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary mt-1.5" title="Unread" />
        </div>
        
        <Text as="p" variant="muted" className="text-xs leading-normal line-clamp-2 break-words">
          Review and sign the contract john smith assistant manager
        </Text>
        
        <div className="flex items-center gap-3 pt-1">
          <Text as="span" variant="muted" className="text-[10px] font-medium uppercase tracking-wider">
            Today • 13m ago
          </Text>
          <Button 
            variant="link" 
            size="xs" 
            className="h-auto p-0 text-[11px] text-primary hover:text-primary/80 font-semibold no-underline hover:underline transition-all"
          >
            Mark as read
          </Button>
        </div>
      </div>
    </div>
  );
}
